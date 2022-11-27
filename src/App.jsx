import { useEffect, useState } from 'react'
import { getChampions, getItems } from './api/datadragon'
import { Button, Card, CardMedia, ThemeProvider, CssBaseline, Grid, Typography, Box, Zoom, TextField } from '@mui/material'
import { appTheme } from "./themes/theme";
import ChampionList from './ChampionList';

const minChamps = 12
const maxChamps = 40
const minLegendaries = 4
const maxLegendaries = 8

const randomize = (list) => {
  return [...list].sort(() => 0.5 - Math.random())
}

const convertChampionDataToArray = (championObject) => {
  return Object.entries(championObject)
    .map(([key, val]) => ({ ...val }));
}

const selectRandomChamps = (championList, numberOfChamps) => {
  const shuffled = randomize(championList).slice(numberOfChamps * 2);
  return {
    redTeam: shuffled.slice(0, numberOfChamps),
    blueTeam: shuffled.slice(numberOfChamps, numberOfChamps * 2)
  }
}

const selectMythicItems = (items) => {
  return items.filter(item => {
    return item.description.includes("Mythic Passive") && !item.description.includes("ornn")
  })
}

const selectBoots = (items) => {
  return items.filter(item => {
    return item.categories.includes("Boots") && item.to.length === 0
  })
}

const selectLegendaryItems = (items) => {
  return items.filter(item => {
    return !item.categories.includes("Boots")
      && !item.description.includes("Mythic Passive")
      && item.to.length === 0 && item.from.length > 0
      && !item.categories.includes("Consumable")
      && !item.description.includes("ornn")
  })
}

function App() {
  const [items, setItems] = useState([])
  const [champions, setChampions] = useState([])
  const [redChampions, setRedChampions] = useState([])
  const [blueChampions, setBlueChampions] = useState([])
  const [sixItems, setSixItems] = useState([])
  const [champsToGenerate, setChampsToGenerate] = useState(15)
  const [legendaryItemsToGenerate, setLegendaryItemsToGenerate] = useState(4)

  const regenerateChampions = () => {
    if (champions && champions.data) {
      const champs = selectRandomChamps(convertChampionDataToArray(champions.data), champsToGenerate);
      setRedChampions(champs.redTeam.sort((a, b) => a.name.localeCompare(b.name)));
      setBlueChampions(champs.blueTeam.sort((a, b) => a.name.localeCompare(b.name)));
    }
  }

  const regenerateItems = () => {
    if (items) {
      const mythicItems = selectMythicItems(items);
      const boots = selectBoots(items);
      const legendaries = selectLegendaryItems(items);
      if (mythicItems.length > 0 && boots.length > 0 && legendaries.length > 0) {
        setSixItems([
          randomize(mythicItems)[0],
          randomize(boots)[0],
          ...randomize(legendaries).slice(0, legendaryItemsToGenerate)
        ])
      }
    }
  }

  const regenerateAll = () => {
    regenerateChampions()
    regenerateItems()
  }

  useEffect(() => {
    
    async function fetchData() {
      await Promise.all([getChampions(), getItems()])
        .then(data => {
          const champions = data[0]
          const items = data[1]
          setChampions(champions)
          setItems(items)

          // const championImages = convertChampionDataToArray(champions.data).map(champion => {
          //   return `https://cdn.communitydragon.org/latest/champion/${champion.key}/square`
          // })
          // const itemImages = items.map(item => {
          //   var path = item.iconPath.split("/")
          //   const [pngName] = path.slice(-1)
          //   return `https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/assets/items/icons2d/${pngName.toLowerCase()}`
          // })

          // return [...championImages, ...itemImages]
        })
    }
    
    fetchData()
  }, [])


  useEffect(() => {
    regenerateChampions()
  }, [champions])

  useEffect(() => {
    regenerateItems()
  }, [items])

  const setNumberOfChampsChange = (e) => {
    var value = parseInt(e.target.value, 10);
    setChampsToGenerate(value);

  }

  const setNumberOfChampsBlur = (e) => {
    var value = parseInt(e.target.value, 10);

    if (value > maxChamps) value = maxChamps;
    if (value < minChamps) value = minChamps;

    setChampsToGenerate(value);
  }

  const setNumberOfLegendariesChange = (e) => {
    var value = parseInt(e.target.value, 10);
    setLegendaryItemsToGenerate(value);

  }

  const setNumberOfLegendariesBlur = (e) => {
    var value = parseInt(e.target.value, 10);

    if (value > maxLegendaries) value = maxLegendaries;
    if (value < minLegendaries) value = minLegendaries;

    setLegendaryItemsToGenerate(value);
  }

  return (
    <ThemeProvider theme={appTheme}>
      <CssBaseline enableColorScheme />
      <Grid container
        spacing={2}
        sx={{ padding: '5px' }}
        direction="column"
        alignItems="center"
        justifyContent="center">
        <Grid item xs={12} sx={{ m: 4 }} container justifyContent="center">
          <TextField
            sx={{ m: 2 }}
            inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
            label="Number of Champs (12-40)"
            onBlur={setNumberOfChampsBlur}
            onChange={setNumberOfChampsChange}
            value={champsToGenerate}
            />
          <TextField
            sx={{ m: 2 }}
            inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
            label="Legendary Items (4-8)"
            onBlur={setNumberOfLegendariesBlur}
            onChange={setNumberOfLegendariesChange}
            value={legendaryItemsToGenerate}
            />
          <Button
            sx={{ m: 2 }}
            onClick={() => regenerateAll()}
            variant="contained">
              ARAMdomize
          </Button>
        </Grid>
      </Grid>
      <Grid container
        spacing={2}
        sx={{ padding: '5px' }}>
        <ChampionList teamName='Team 1' championList={redChampions} />
        <ChampionList teamName='Team 2' championList={blueChampions} />
        <Grid
          container
          spacing={0}
          direction="column"
          alignItems="center"
        >
        <Box>
          <Typography variant="h5" sx={{ padding: '2px' }}>Items</Typography>
          <Grid container spacing={0}>
              {
                sixItems.map((item, i) => {
                  return <Box sx={{ position: 'relative' }} key={item.id+'-'+i}>
                    <Card>
                    <Zoom in><CardMedia
                      component="img"
                      sx={{ height: 96, width: 96 }}
                      image={`http://ddragon.leagueoflegends.com/cdn/12.22.1/img/item/${item.id}.png`} /></Zoom>
                      <Box
                        sx={{
                          position: 'absolute',
                          bottom: 0,
                          left: 0,
                          width: '100%',
                          bgcolor: 'rgba(0, 0, 0, 0.54)',
                          color: 'white',
                          padding: '0px',
                        }}
                      >
                        <Typography variant="body2" sx={{ padding: '2px' }}>{item.name}</Typography>
                      </Box>
                    </Card>
                    </Box>
                })
              }
          </Grid>
        </Box>
        </Grid>
      </Grid>

    </ThemeProvider>
  )
}

export default App

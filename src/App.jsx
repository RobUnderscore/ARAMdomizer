import { useEffect, useState } from 'react'
import { getChampions, getItems } from './api/datadragon'
import { Button, Card, CardMedia, ThemeProvider, CssBaseline, Grid, Typography, Box } from '@mui/material'
import { appTheme } from "./themes/theme";

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

  useEffect(() => {
    getChampions().then((champions) => setChampions(champions));
    getItems().then((items) => setItems(items));
  }, [])

  useEffect(() => {
    if (champions && champions.data) {
      const champs = selectRandomChamps(convertChampionDataToArray(champions.data), 15);
      setRedChampions(champs.redTeam);
      setBlueChampions(champs.blueTeam);
    }
  }, [champions])

  useEffect(() => {
    if (items) {
      const mythicItems = selectMythicItems(items);
      const boots = selectBoots(items);
      const legendaries = selectLegendaryItems(items);
      if (mythicItems.length > 0 && boots.length > 0 && legendaries.length > 0) {
        setSixItems([
          randomize(mythicItems)[0],
          randomize(boots)[0],
          ...randomize(legendaries).slice(0, 4)
        ])
      }
    }
  }, [items])

  useEffect(() => {
    console.log(sixItems)
  }, [sixItems])

  return (
    <ThemeProvider theme={appTheme}>
      <CssBaseline enableColorScheme />
      <Grid container spacing={2} sx={{ padding: '5px' }}>
        <Grid item sm={6} xs={12}>
        <Box>
          <Typography variant="h5" sx={{ padding: '2px' }}>Red Team</Typography>
          <Grid container spacing={0}>
              {
                redChampions.map((champion) => {
                  return <Box sx={{ position: 'relative' }} key={champion.key}>
                    <Card>
                    <CardMedia
                      component="img"
                      sx={{ height: 120 }}
                      image={`https://cdn.communitydragon.org/latest/champion/${champion.key}/square`}
                      key={champion.key} />
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
                        <Typography variant="body2" sx={{ padding: '2px' }}>{champion.name}</Typography>
                      </Box>
                    </Card>
                    </Box>
                })
              }
          </Grid>
        </Box>
          
        </Grid>
        <Grid item sm={6} xs={12}>
        <Box>
          <Typography variant="h5" sx={{ padding: '2px' }}>Blue Team</Typography>
          <Grid container spacing={0}>
              {
                blueChampions.map((champion) => {
                  return <Box sx={{ position: 'relative' }} key={champion.key}>
                    <Card>
                    <CardMedia
                      component="img"
                      sx={{ height: 120 }}
                      image={`https://cdn.communitydragon.org/latest/champion/${champion.key}/square`}
                      key={champion.key} />
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
                        <Typography variant="body2" sx={{ padding: '2px' }}>{champion.name}</Typography>
                      </Box>
                    </Card>
                    </Box>
                })
              }
          </Grid>
        </Box>
        </Grid>
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
                sixItems.map((item) => {
                  var path = item.iconPath.split("/")
                  const [pngName] = path.slice(-1)
                  return <Box sx={{ position: 'relative' }} key={item.id}>
                    <Card>
                    <CardMedia
                      component="img"
                      sx={{ height: 120 }}
                      image={`https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/assets/items/icons2d/${pngName.toLowerCase()}`} />
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

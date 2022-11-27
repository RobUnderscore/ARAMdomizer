import { Card, CardMedia, Grid, Typography, Box, Zoom } from '@mui/material'

function ChampionList({teamName, championList}) {
    return (
        <Grid item sm={6} xs={12}>
            <Box>
            <Typography variant="h5" sx={{ padding: '2px' }}>{teamName}</Typography>
            <Grid container spacing={0}>
                {
                championList.map((champion, i) => {
                    return <Box sx={{ position: 'relative' }} key={champion.key+'-'+i}>
                    <Card>
                        <Zoom in>
                            <CardMedia
                            component="img"
                            sx={{ height: 100, width: 100 }}
                            image={`http://ddragon.leagueoflegends.com/cdn/12.22.1/img/champion/${champion.id}.png`}
                            key={champion.key} />
                        </Zoom>
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
    )
}

export default ChampionList
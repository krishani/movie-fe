import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import axios from 'axios';
import { MOVIE_URL } from './UrlEndpoints';

const theme = createTheme();

export default function Album() {
  const [isLoggedIn, setIsLoggedIn] = React.useState(!!localStorage.getItem('accessToken'));
  const [movies, setMovies] = React.useState([]);
  const navigate = useNavigate();

  React.useEffect( async () => {
    if(isLoggedIn) {
      try {
        const response = await axios.get(MOVIE_URL, { headers: { "Authorization" : `Bearer ${localStorage.getItem('accessToken')}` }});
        setMovies(response.data.data);
      } catch (e) {
        const error = JSON.parse(JSON.stringify(e));
         if (error.status === 401 || error.status === 403) {
           localStorage.removeItem('accessToken');
           setIsLoggedIn(false);
         }
      }
    } else {
      navigate('/login');
    }
  }, [isLoggedIn]);

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    setIsLoggedIn(false);
  };

  const movieDataContent = (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppBar position="relative">
        <Toolbar>
          <Typography variant="h6" color="inherit" noWrap>
            Movie Collection
          </Typography>
          <Button variant="contained" onClick={() => { navigate('/addMovie');}}>Add Movie</Button>
          <Button variant="contained" onClick={handleLogout}>Logout</Button>
        </Toolbar>
      </AppBar>
      <main>
        <Box
          sx={{
            bgcolor: 'background.paper',
            pt: 8,
            pb: 6,
          }}
        >
          <Container maxWidth="sm">
            <Typography
              component="h1"
              variant="h2"
              align="center"
              color="text.primary"
              gutterBottom
            >
              Movies
            </Typography>
            <Typography variant="h5" align="center" color="text.secondary" paragraph>
              This is the latest movie collection from our application.
            </Typography>
            <Stack
              sx={{ pt: 4 }}
              direction="row"
              spacing={2}
              justifyContent="center"
            >
            </Stack>
          </Container>
        </Box>
        <Container sx={{ py: 8 }} maxWidth="md">
          <Grid container spacing={4}>
            {movies.map((movie) => (
              <Grid item key={movie.id} xs={12} sm={6} md={4}>
                <Card
                  sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}
                >
                  <CardMedia
                    component="img"
                    sx={{
                      // 16:9
                      pt: '56.25%',
                    }}
                    image="https://source.unsplash.com/random"
                    alt="random"
                  />
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography gutterBottom variant="h5" component="h2">
                      {movie.title}
                    </Typography>
                    <Typography>
                      {movie.description}
                    </Typography>
                    <Typography>
                      {movie.releasedDate}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button size="small">View</Button>
                    <Button size="small">Edit</Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </main>
      <Box sx={{ bgcolor: 'background.paper', p: 6 }} component="footer">
      </Box>
    </ThemeProvider>
  );

  return (movieDataContent);
}

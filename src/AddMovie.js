import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import axios from 'axios';
import { MOVIE_URL } from './UrlEndpoints';

const theme = createTheme();

export default function AddMovie() {
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const movie = {
      title: data.get('title') === '' ? null : data.get('title'),
      description: data.get('description') === '' ? null : data.get('description'),
      thumbnail: data.get('thumbnail') === '' ? null : data.get('thumbnail'),
      releasedDate: data.get('releasedDate') === '' ? null : data.get('releasedDate'),
    };
    try {
      await axios.post(MOVIE_URL, movie, { headers: { 'Authorization': `Bearer ${localStorage.getItem('accessToken')}` } });
      navigate('/');
    } catch (e) {
      console.log('An error received while adding a movie', e);
      const error = JSON.parse(JSON.stringify(e));
      if (error.status === 401 || error.status === 403) {
        localStorage.removeItem('accessToken');
        navigate('/login');
      }
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline/>
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
          </Avatar>
          <Typography component="h1" variant="h5">
            Add Movie
          </Typography>
          <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  autoComplete="given-name"
                  name="title"
                  required
                  fullWidth
                  id="title"
                  label="Movie Title"
                  autoFocus
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  autoComplete="releasedDate"
                  name="releasedDate"
                  fullWidth
                  id="releasedDate"
                  label="Released Date"
                  autoFocus
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  id="description"
                  label="Description"
                  name="description"
                  autoComplete="description"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  name="thumbnail"
                  label="Thumbnail"
                  type="thumbnail"
                  id="thumbnail"
                  autoComplete="thumbnail"
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Add Movie
            </Button>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}

const express = require('express'),
  morgan = require('morgan'),
  bodyParser = require('body-parser'),
  app = express();
const mongoose = require('mongoose');
const Models = require('./models.js');

const Movies = Models.Movie;
const Users = Models.User;

mongoose.connect('mongodb://localhost:27017/test',
{ useNewUrlParser: true, useUnifiedTopology: true});
// const topMovies = [
//   {
//     title: 'The Shawshank Redemption',
//     genre: 'Drama',
//     director: 'Frank Darabont',
//     cast: [
//       'Tim Robbins',
//       'Morgan Freeman'
//     ]
//   },
//   {
//     title: 'Forrest Gump',
//     genre: [
//       'Drama',
//       'Romance'
//     ],
//     director: 'Robert Zemeckis',
//     cast: [
//       'Tom Hanks',
//       'Robin Wright',
//       'Gary Sinise'
//     ]
//   },
//   {
//     title: 'The Dark Knight',
//     genre: [
//       'Action',
//       'Crime',
//       'Drama'
//     ],
//     director: 'Christopher Nolan',
//     cast: [
//       'Christian Bale',
//       'Heath Ledger'
//     ]
//   },
//   {
//     title: 'The Prestige',
//     genre: [
//       'Drama',
//       'Mystery',
//       'Sci-Fi'
//     ],
//     director: 'Christopher Nolan',
//     cast: [
//       'Christian Bale',
//       'Hugh Jackman',
//       'Scarlett Johansson'
//     ]
//   },
//   {
//     title: 'Step Brothers',
//     genre: 'Comedy',
//     director: 'Adam Mckay',
//     cast: [
//       'Will Ferrell',
//       'John C. Reilly',
//       'Mary Steenburgen'
//     ]
//   },
//   {
//     title: 'Interstellar',
//     genre: [
//       'Adventure',
//       'Drama',
//       'Sci-Fi'
//     ],
//     director: 'Christopher Nolan',
//     cast: [
//       'Matthew McConaughey',
//       'Anne Hathaway',
//       'Jessica Chastain'
//     ]
//   },
//   {
//     title: 'The Wolf of Wall Street',
//     genre: [
//       'Biography',
//       'Crime',
//       'Drama'
//     ],
//     director: 'Martin Scorsese',
//     cast: [
//       'Leonardo DiCaprio',
//       'Jonah Hill',
//       'Margot Robbie'
//     ]
//   },
//   {
//     title: 'There Will Be Blood',
//     genre: 'Drama',
//     director: 'Paul Thomas Anderson',
//     cast: [
//       'Daniel Day-Lewis',
//       'Paul Dano',
//       'Ciarán Hinds'
//     ]
//   },
//   {
//     title: 'Catch Me If You Can',
//     genre: [
//       'Biography',
//       'Crime',
//       'Drama'
//     ],
//     director: 'Steven Spielberg',
//     cast: [
//       'Leonardo DiCarprio',
//       'Tom Hanks',
//       'Christopher Walken'
//     ]
//   },
//   {
//     title: 'Gummo',
//     genre: [
//       'Comedy',
//       'Drama'
//     ],
//     director: 'Harmony Korine',
//     cast: [
//       'Nick Sutton',
//       'Jacob Sewell',
//       'Lara Tosh'
//     ]
//   }
// ];

app.use(morgan('common'));
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('Welcome to myFlix!');
});

app.get('/movies', (req, res) => {
  Movies.find()
  .then((movies) => {
    res.status(201).json(movies);
  })
  .catch((err) => {
    console.error(err);
    res.status(500).send('Error: ' + err);
  });
  // res.json(topMovies);
});

app.get('/movies/:title', (req, res) => {
  Movies.findOne({Title: req.params.Title})
    .then(movie => {
        res.status(201).json(movie);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: '+ err);
    });

  // res.json(topMovies.find((movie) => movie.title === req.params.title));
});

app.get('/movies/genres/:title', (req, res) => {
  Movies.findOne({Genre: req.params.Name})
    .then(movies => {
      res.status(201).json(movie);
    })
  // res.send('Movie Genre Description');
});

app.get('/directors/:name', (req, res) => {
  res.send('Director Bio');
});

app.post('/users', (req, res) => {
  res.send('You are now subscribed!');
});

app.put('/users/:name/:changeName', (req, res) => {
  res.send('Username Updated!');
});

app.post('/users/:name/favorites/:title', (req, res) => {
  res.send('Added ________ to your favorites!');
});

app.delete('/users/:name/favorites/:title', (req, res) => {
  res.send('Deleted ________ from your favorites!');
});

app.delete('/users/:name', (req, res) => {
  res.send('Account Deleted!');
});


app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Watching movies, be back soon!');
});

app.listen(8080, () => {
  console.log('The website server is always listening!');
});

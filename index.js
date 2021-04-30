const express = require('express'),
  morgan = require('morgan'),
  bodyParser = require('body-parser'),
  app = express();
const mongoose = require('mongoose');
const Models = require('./models.js');

const Movies = Models.Movie;
const Users = Models.User;
const cors = require('cors');
app.use(cors());
const { check, validationResult } = require('express-validator');

// mongoose.connect('mongodb://localhost:27017/test',
// { useNewUrlParser: true, useUnifiedTopology: true});
mongoose.connect( process.env.CONNECTION_URI,
   { useNewUrlParser: true, useUnifiedTopology: true });



app.use(morgan('common'));
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());
let auth = require('./auth')(app);
const passport = require('passport');
require('./passport');

app.get('/', (req, res) => {
  res.send('Welcome to myFlix!');
});

app.get('/movies',
 // passport.authenticate('jwt', { session: false }),
  (req, res) => {
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

app.get('/movies/:title', passport.authenticate('jwt', { session: false }), (req, res) => {
  Movies.findOne({Title: req.params.title})
    .then((movies) => {
        res.status(201).json(movies);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: '+ err);
    });

  // res.json(topMovies.find((movie) => movie.title === req.params.title));
});

app.get('/movies/genres/:title', passport.authenticate('jwt', { session: false }), (req, res) => {
  Movies.findOne({'Genre.Name': req.params.title})
    .then((movies) => {
      res.status(201).json(movies.Genre);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: '+ err);
    });
  // res.send('Movie Genre Description');
});

app.get('/directors/:name',passport.authenticate('jwt', { session: false }), (req, res) => {
    Movies.findOne({ 'Director.Name': req.params.name})
    .then((director) => {
      res.status(201).json(director.Director);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: '+ err);
    });

  // res.send('Director Bio');
});

app.post('/users',

[
  check('Username', 'Username is required').isLength({min: 5}),
  check('Username', 'Username contains non alphanumeric characters - not allowed.').isAlphanumeric(),
  check('Password', 'Password is required').not().isEmpty(),
  check('Email', 'Email does not appear to be valid').isEmail()
],
 (req, res) => {

  let errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errorss.array() });
  }
  let hashedPassword = Users.hashPassword(req.body.Password);
    Users.findOne({ Username: req.body.Username })
    .then((user) => {
      if (user) {
        return res.status(400).send(req.body.Username + ' already exists');
      } else {
        Users
          .create({
            Username: req.body.Username,
            Password:  hashedPassword,
            Email: req.body.Email,
            Birthday: req.body.Birthday
          })
          .then((user) =>{res.status(201).json(user)})
          .catch((error) => {
            console.error(err);
            res.status(500).send('Error: '+ err);
          })
      }
    })
   .catch((error) => {
      console.error(err);
      res.status(500).send('Error: '+ err);
    });
  //res.send('You are now subscribed!');
});

app.put('/users/:Username', passport.authenticate('jwt', { session: false }), (req, res) => {
  Users.findOneAndUpdate({ Username: req.params.Username}, { $set:
    {
      Username: req.body.Username,
      Password: req.body.Password,
      Email: req.body.Email,
      Birthday: req.body.Birthday
    }
  },{new:true},
  (err, updatedUser) => {
    if(err) {
      console.error(err);
      res.status(500).send('Error: ' + err);
    } else {
      res.json(updatedUser);
    }
  });
  // res.send('Username Updated!');
});

app.post('/users/:Username/Favorites/:MovieID', passport.authenticate('jwt', { session: false }), (req, res) => {
  Users.findOneAndUpdate({ Username: req.params.Username},{
    $push: { FavoriteMovies: req.params.MovieID}
  },
  { new: true},
  (err, updatedUser) => {
    if(err) {
      consolle.error(err);
      res.status(500).send('Error: ' + err);
    } else {
      res.json(updatedUser);
    }
  });
  // res.send('Added ________ to your favorites!');
});

app.delete('/users/:Username/Favorites/:MovieID', passport.authenticate('jwt', { session: false }), (req, res) => {
  Users.findOneAndUpdate({ Username: req.params.Username},{
    $pull: { FavoriteMovies: req.params.MovieID}
  },
  { new: true},
  (err, updatedUser) => {
    if(err) {
      consolle.error(err);
      res.status(500).send('Error: ' + err);
    } else {
      res.json(updatedUser);
    }
  });
  // res.send('Deleted ________ from your favorites!');
});

app.delete('/users/:Username', passport.authenticate('jwt', { session: false }), (req, res) => {
  Users.findOneAndRemove({ Username: req.params.Username })
    .then((user) => {
      if (!user) {
        res.status(400).send(req.params.Username + ' was not found');
      } else {
        res.status(200).send(req.params.Username + ' was deleted.');
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});


app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Watching movies, be back soon!');
});

const port = process.env.PORT || 8080;
app.listen(port, '0.0.0.0',() => {
 console.log('The website server is always listening on ' + port);
});

// app.listen(8080, () => {
//   console.log('The website server is always listening!');
// });

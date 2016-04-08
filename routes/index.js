var express = require('express');
var router = express.Router();
// require('dotenv').config();
var unirest = require('unirest');
require('dotenv').load();
// var db = require('monk')("localhost/movies");
// var movieCollection = db.get('movies');
var baseURL = 'http://api.themoviedb.org/3/';

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomInts(min, max, numberOfInts) {
  var randomIntsArray = [];
  var maxNumberOfIntsAllowed;
   if (min == 0) {
     maxNumberOfIntsAllowed = max + 1;
   } else {
     maxNumberOfIntsAllowed = max - min - 1;
   }
  if (numberOfInts > maxNumberOfIntsAllowed) {
    var err = "Error!! There aren't enough values to give you " + numberOfInts + " results.";
    throw(err);
  }

  while (randomIntsArray.length < numberOfInts) {
    var randomInt = getRandomInt(min, max);
    if (randomIntsArray.indexOf(randomInt) == -1) {
      randomIntsArray.push(randomInt);
    }
  }
  return randomIntsArray;
}

function getRandomValuesFromArray(array, numberOfValues) {

  var randomIntsArray = getRandomInts(0, array.length - 1, numberOfValues);
  var randomValuesArray = [];

  for (var i = 0; i < randomIntsArray.length; i++) {
      var randomInt = randomIntsArray[i];
      var arrayValue = array[randomInt];
      randomValuesArray.push(arrayValue);
  }
  return randomValuesArray;
}

// function noResult(result) {
//   var errorArray = [];
//   if (no result) {
//     "No results match your choices. Retry!".push(errorArray)
//   }
//   return errorArray;
// }

router.get('/', function(req, res, next) {
  res.render('index');

});

router.get('/first', function(req, res, next) {
  unirest.get(baseURL + 'movie/100?api_key=' + process.env.MOVIEKEY)
  .end(function (response) {
  res.render('first');
  });
});

router.post('/first', function(req, res, next) {
  console.log("this is right before cookie");
  res.cookie('runtime', req.body.runtime);
  console.log("this is right before redirect");
  res.redirect('/second');
});

router.get('/second', function(req, res, next) {
  console.log("this is on the second page");
  unirest.get(baseURL + 'genre/movie/list?api_key=' + process.env.MOVIEKEY)
  .end(function (response) {
    var genres = response.body.genres;
    var result = getRandomValuesFromArray(genres, 2);

  res.render('second', { title: 'Express',
                         result1: result[0],
                         result2: result[1]
                        });
    });
});

router.post('/second', function(req, res, next) {
  res.cookie('genreSelected', req.body.genreSelected);
  res.redirect('/third');
});

router.get('/third', function (req, res, next) {
  var randomNumbers = getRandomInts(1, 40, 2);

  unirest.get(baseURL + 'person/popular?page=' + randomNumbers[0] + '&api_key=' + process.env.MOVIEKEY)
  .end(function (response1) {

      unirest.get(baseURL + 'person/popular?page=' + randomNumbers[1] + '&api_key=' + process.env.MOVIEKEY)
      .end(function (response2) {

      var result1 = response1.body.results;
      var pic1 = response1.body.profile_path;
      var randomValuesArray = getRandomValuesFromArray(result1, 1);
      var result1 = randomValuesArray[0];

        var result2 = response2.body.results;
        var pic2 = response2.body.profile_path;
        var randomValuesArray2 = getRandomValuesFromArray(result2, 1);
        var result2 = randomValuesArray2[0];

  res.render('third', { title: 'Express',
                        result1: randomValuesArray[0],
                        result2: randomValuesArray2[0],
                        pic1: randomValuesArray[0],
                        pic2: randomValuesArray[1]
                        });

    });
  });
});

router.post('/third', function(req, res, next) {
  res.cookie('actorSelected', req.body.actorName);
  res.redirect('/result');
});

router.get('/result', function(req, res, next) {
  var genreSelected = req.cookies.genreSelected;
  var actorSelected = req.cookies.actorSelected;

    unirest.get(baseURL + 'discover/movie?with_cast=' + actorSelected + '&api_key=' + process.env.MOVIEKEY)
    .end(function (response) {



      var getMoviesByActor = response.body.results;
      var arrayOfMovieDeets = [];
      for (var i = 0; i < getMoviesByActor.length; i++) {

        var blankObjectWithMovieDeets = {
          genre_ids: getMoviesByActor[i].genre_ids,
          overview : getMoviesByActor[i].overview,
          title : getMoviesByActor[i].title,
          poster_path : getMoviesByActor[i].poster_path
          }

        arrayOfMovieDeets.push(blankObjectWithMovieDeets);

      }
      var genresMatchingGenreSelectedArray = [];

      for (var i = 0; i < arrayOfMovieDeets.length; i++) {
        var genre_idsArray = arrayOfMovieDeets[i].genre_ids;
        for (var j = 0; j < genre_idsArray.length; j++) {
          if (genre_idsArray[j] == genreSelected) {

          genresMatchingGenreSelectedArray.push(arrayOfMovieDeets[i]);
        }
      }
    }

    var movieSuggested = genresMatchingGenreSelectedArray[Math.floor(Math.random() * genresMatchingGenreSelectedArray.length)];

    if (!movieSuggested) {
      // handle the failure
      res.render('fail');
      return;
    }
    res.render('result', {
                           poster : movieSuggested.poster_path,
                           titleOfMovie : movieSuggested.title,
                           overviewOfMovie : movieSuggested.overview
                          });

  });

//add page and logic here to render a no result matches your choices page
//add ^^^ jade page
//fix so you can't submit before selecting a radio button on all jade pages
//add tv show or movie as the first question
//go through and make new tv routes
//add ^^^ jade pages
//edit the time question to work or just get rid of it
//make css look less 80's
//make login area/page/DB
//make list area where users can add tv/movies to watch later
//^^^ get from API/list making route thang

});

router.post('/result', function(req, res, next) {
    res.redirect('/first');
});

module.exports = router;

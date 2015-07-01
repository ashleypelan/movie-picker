var express = require('express');
var router = express.Router();
var unirest = require('unirest');
require('dotenv').load();
var db = require('monk')("localhost/movies");
// var actorsDB = require('monk')'localhost/actors_demo');
var movieCollection = db.get('movies');
// var actorsMovieCollection = db.get('actorsMovies');
var baseURL = 'http://api.themoviedb.org/3/';


//make for loop to push all movies in 1000 pages into the movies demo DB
//save actor ID that they selected and then search with_cast in the movies datatbase for person in that movie
//save genre ID that they selected and then search those movies for the genre id
//try and generate this with movie title, movie poster, and summary of movie
// var movieArray = [];
// //did page 230 accidentally & 560
// // for (var i = 0; i < 1000; i++) {
//   unirest.get(baseURL + "movie/popular?page=200" + '&api_key=' + process.env.MOVIEKEY)
//     .end(function (response) {
//
//       movieArray = response.body.results;
//
//       for (j=0; j < movieArray.length; j++) {
//         // var movie = movieArray[i];
//         console.log("*************");
//         console.log("*************");
//         console.log(movieArray[j].id);
//         console.log([j]);
//         console.log("*************");
//         console.log("*************");
//         movieCollection.insert({ movieID: movieArray[j].id,
//                                      title: movieArray[j].title,
//                                      overview: movieArray[j].overview,
//                                      genres: movieArray[j].genre_ids
//                                   });
//       }
//     });
//   // }


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

router.get('/', function(req, res, next) {
  res.render('index');

});

router.get('/first', function(req, res, next) {
  // var timeRangeSelected = req.cookies.runtime;
  // console.log(timeRangeSelected);
  unirest.get(baseURL + 'movie/100?api_key=' + process.env.MOVIEKEY)
  .end(function (response) {
    // var movieRuntime = response.body.runtime;
    // console.log(movieRuntime);
  res.render('first');
  });
});

router.post('/first', function(req, res, next) {
  res.cookie('runtime', req.body.runtime);
  res.redirect('/second');
});

router.get('/second', function(req, res, next) {
  unirest.get(baseURL + 'genre/movie/list?api_key=' + process.env.MOVIEKEY)
  .end(function (response) {
    var genres = response.body.genres;
    // console.log(genres);
    var result = getRandomValuesFromArray(genres, 2);
    // console.log(result);
    // console.log(result[0]);
    // console.log(result[1]);
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
  var randomNumbers = getRandomInts(1, 50, 2)
  // var random = Math.floor(Math.random() * 30);

  unirest.get(baseURL + 'person/popular?page=' + randomNumbers[0] + '&api_key=' + process.env.MOVIEKEY)
  .end(function (response1) {

      unirest.get(baseURL + 'person/popular?page=' + randomNumbers[1] + '&api_key=' + process.env.MOVIEKEY)
      .end(function (response2) {

      var result1 = response1.body.results;
      var pic1 = response1.body.profile_path;
      var randomValuesArray = getRandomValuesFromArray(result1, 1);
      // console.log(randomValuesArray[0].id);
      var result1 = randomValuesArray[0];
      // console.log(result1.id);
      // console.log(randomValuesArray);

        var result2 = response2.body.results;
        var pic2 = response2.body.profile_path;
        var randomValuesArray2 = getRandomValuesFromArray(result2, 1);
        var result2 = randomValuesArray2[0];
        // console.log(result2.id);


          // console.log(response1);
          // console.log(response2);

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

router.get('/result', function(req, res, next){
  var genreSelected = req.cookies.genreSelected;
  // console.log(genreSelected);
  var actorSelected = req.cookies.actorSelected;
  // console.log(actorSelected);

    unirest.get(baseURL + 'discover/movie?with_cast=' + actorSelected + '&api_key=' + process.env.MOVIEKEY)
    .end(function (response) {
      var getMoviesByActor = response.body.results;
      var arrayOfMovieDeets = [];
      for (var i = 0; i < getMoviesByActor.length; i++) {

        var blankObjectWithMovieDeets = {
          genre_ids: getMoviesByActor[i].genre_ids,
          overview : getMoviesByActor[i].overview,
          title : getMoviesByActor[i].title,
          name : getMoviesByActor[i].name,
          poster_path : getMoviesByActor[i].poster_path
          }

        arrayOfMovieDeets.push(blankObjectWithMovieDeets);



      }

      var genre_idsArray = []
      var genresMatchingGenreSelectedArray = []

      for (var j = 0; j < genre_idsArray.length; j++) {
        genre_idsArray.push(blankObjectWithMovieDeets.genre_ids[i]);

        if (blankObjectWithMovieDeets.genre_ids[i] === genreSelected) {
          genresMatchingGenreSelectedArray.push(blankObjectWithMovieDeets)

        }
      }
      console.log(blankObjectWithMovieDeets.genre_ids[0]);

                // console.log(genre_idsArray);
                // console.log(genresMatchingGenreSelectedArray);
                //






      // console.log(blankObjectWithMovieDeets.genre_ids[0]);
      // console.log(blankObjectWithMovieDeets.genre_ids[1]);


//genre_ids is an object of an array of genres
//get into the object and iterate through the array to search if the genre_id chosen matches any of the ones from actor chosen

  res.render('result', {

                        //  actorSelected : actorSelected
                        });


  });
});

router.get('/thanks', function(req, res, next) {

    res.redirect('/');
});




module.exports = router;

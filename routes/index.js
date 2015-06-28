var express = require('express');
var router = express.Router();
var unirest = require('unirest');


function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomArrayValue(array) {
  var randomNumber1 = getRandomInt(0, array.length -1);
  var randomNumber2 = getRandomInt(0, array.length -1);
  var arrayValue1 = array[randomNumber1];
  var arrayValue2 = array[randomNumber2];
  var resultArray = [arrayValue1, arrayValue2];
  if (arrayValue1 === arrayValue2) {
  return getRandomArrayValue(array);
  }
  return resultArray;
}

// for (var i = 0; i < movieGenres.length; i++) {
//   var individualGenre = movieGenres[i];
//
// }

router.get('/', function(req, res, next) {
  res.render('index');
});


router.get('/first', function(req, res, next) {
  unirest.get('http://api.themoviedb.org/3/genre/movie/list?api_key=' + process.env.MOVIEKEY)
  .end(function (response) {
    var genres = response.body.genres;

    var result = getRandomArrayValue(genres);
    console.log(result);




  res.render('first', { title: 'Express',
                        result1: result[0],
                        result2: result[1]
                        });
    });
});

router.get('/second', function(req, res, next) {
  unirest.get('http://api.themoviedb.org/3/person/popular?api_key=' + process.env.MOVIEKEY)
  .end(function (response) {
    var people = response.body.results;
    var result = getRandomArrayValue(people)
    console.log(result);
  res.render('second', { result1: result[0],
                         result2: result[1]
                         });
    });
});




module.exports = router;


//get list of movies from database
//randomize the movie
//then insert random variable into unires.get('https://..... mumbojumbo where "/550" is

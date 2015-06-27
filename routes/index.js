var express = require('express');
var router = express.Router();
var unirest = require('unirest');


// function getRandomInt(min, max) {
//   return Math.floor(Math.random() * (max - min + 1)) + min;
// }
//
// function getRandomArrayValue(array) {
//   var randomNumber = getRandomInt(0, array.count -1)
//   var arrayValue = array[randomNumber]
//   return arrayValue
// }


router.get('/', function(req, res, next) {
  unirest.get('https://api.themoviedb.org/3/movie/500?api_key=' + process.env.MOVIEKEY)
  .end(function (response) {
    // var movieIDNumber = response.body.id
    // console.log(movieIDNumber);
    var movieIDNumber = response.body.title;
    console.log(movieIDNumber);

  res.render('index', { title: 'Express',
                        info: movieIDNumber});

    });
});

router.get('/first', function(req, res, next) {
  res.render('first');
});

module.exports = router;


//get list of movies from database
//randomize the movie
//then insert random variable into unires.get('https://..... mumbojumbo where "/550" is

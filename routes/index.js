var express = require('express');
var router = express.Router();
var unirest = require('unirest');

var baseURL = 'http://api.themoviedb.org/3/'


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

function testFunction(name){
  console.log("some crazy shit " + name);
  console.log("************");
  console.log("************");

}



// function getRandomValuesFromArray(array, numberOfValues) {
//
//   var randomValuesArray = [];
//
//   if (numberOfValues > array.length) {
//     var err = "Error: numberOfValues can't be larger than array.length.";
//     throw(err);
//   }
//
//   while (randomValuesArray.length < numberOfValues) {
//     var randomNumber = getRandomInt(0, array.length - 1);
//     var arrayValue = array[randomNumber];
//     if (randomValuesArray.indexOf(arrayValue) == -1) {
//       randomValuesArray.push(arrayValue);
//     }
//   }
//
//   return randomValuesArray;
// }

// function getRandomArrayValue(array) {
//   var randomNumber1 = getRandomInt(0, array.length -1);
//   var randomNumber2 = getRandomInt(0, array.length -1);
//   var arrayValue1 = array[randomNumber1];
//   var arrayValue2 = array[randomNumber2];
//   var resultArray = [arrayValue1, arrayValue2];
//   if (arrayValue1 === arrayValue2) {
//   return getRandomArrayValue(array);
//   }
//   return resultArray;
// }

router.get('/', function(req, res, next) {
  res.render('index');
});

router.get('/first', function(req, res, next) {
  res.render('first');
});

var genreSelected;

router.get('/second', function(req, res, next) {
  unirest.get(baseURL + 'genre/movie/list?api_key=' + process.env.MOVIEKEY)
  .end(function (response) {
    var genres = response.body.genres;
    console.log(genres);
    var result = getRandomValuesFromArray(genres, 2);
    console.log(result);

  res.render('second', { title: 'Express',
                        result1: result[0],
                        result2: result[1]
                        });
    });
});


router.get('/third', function (req, res, next) {
  unirest.get(baseURL + 'person/popular?page=1&api_key=' + process.env.MOVIEKEY)
  .end(function (response1) {

      unirest.get(baseURL + 'person/popular?page=2&api_key=' + process.env.MOVIEKEY)
      .end(function (response2) {

        unirest.get(baseURL + 'person/popular?page=3&api_key=' + process.env.MOVIEKEY)
        .end(function (response3) {

          unirest.get(baseURL + 'person/popular?page=4&api_key=' + process.env.MOVIEKEY)
          .end(function (response4) {

            unirest.get(baseURL + 'person/popular?page=5&api_key=' + process.env.MOVIEKEY)
            .end(function (response5) {

        var results1 = response1.body.results;
        var pic1 = response1.body.profile_path;
        var randomValuesArray = getRandomValuesFromArray(results1, 2);

          var results2 = response2.body.results;
          var pic2 = response2.body.profile_path;
          var randomValuesArray2 = getRandomValuesFromArray(results2, 2);

            var results3 = response3.body.results;
            var pic3 = response3.body.profile_path;
            var randomValuesArray3 = getRandomValuesFromArray(results3, 2);

              var results4 = response4.body.results;
              var pic4 = response4.body.profile_path;
              var randomValuesArray4 = getRandomValuesFromArray(results4, 2);

              var results5 = response4.body.results;
              var pic5 = response4.body.profile_path;
              var randomValuesArray5 = getRandomValuesFromArray(results5, 2);

          res.render('third', { title: 'Express',
                                result1: randomValuesArray[0],
                                result2: randomValuesArray2[1],
                                results3: randomValuesArray3[2],
                                results4: randomValuesArray4[3],
                                results5: randomValuesArray5[4],
                                pic1: randomValuesArray[0],
                                pic2: randomValuesArray[1],
                                pic3: randomValuesArray[2],
                                pic4: randomValuesArray[3],
                                pic5: randomValuesArray[3]
                                });
          });
        });
      });
    });
  });
});


router.get('/result', function(req, res, next){
  res.render('result');
});




module.exports = router;


//get list of movies from database
//randomize the movie
//then insert random variable into unires.get('https://..... mumbojumbo where "/550" is

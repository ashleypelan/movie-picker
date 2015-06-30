var express = require('express');
var router = express.Router();
var unirest = require('unirest');
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

router.get('/', function(req, res, next) {
  res.render('index');

});

router.get('/first', function(req, res, next) {
  var timeRangeSelected = req.cookies.runtime;
  console.log(timeRangeSelected);
  unirest.get(baseURL + 'movie/100?api_key=' + process.env.MOVIEKEY)
  .end(function (response) {
    var movieRuntime = response.body.runtime;
    // console.log(movieRuntime);
  res.render('first');
  });
});

router.post('/first', function(req, res, next) {
  res.cookie('runtime', req.body.runtime);
  res.redirect('/second');
});

router.get('/second', function(req, res, next) {
  var genreSelected = req.cookies.genreSelected;
  console.log(req.cookies.runtime);
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

router.post('/second', function(req, res, next) {
  res.cookie('genreSelected', req.body.genreSelected);
  res.redirect('/third');
});

router.get('/third', function (req, res, next) {
  var actorSelected = req.cookies.actorSelected;

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

              unirest.get(baseURL + 'person/popular?page=6&api_key=' + process.env.MOVIEKEY)
              .end(function (response6) {

        console.log(response4);

      var result1 = response1.body.results;
      var pic1 = response1.body.profile_path;
      var randomValuesArray = getRandomValuesFromArray(result1, 2);

        var result2 = response2.body.results;
        var pic2 = response2.body.profile_path;
        var randomValuesArray2 = getRandomValuesFromArray(result2, 2);

          var results3 = response3.body.results;
          var pic3 = response3.body.profile_path;
          var randomValuesArray3 = getRandomValuesFromArray(results3, 2);

            var results4 = response4.body.results;
            var pic4 = response4.body.profile_path;
            var randomValuesArray4 = getRandomValuesFromArray(results4, 2);

              var results5 = response5.body.results;
              var pic5 = response5.body.profile_path;
              var randomValuesArray5 = getRandomValuesFromArray(results5, 2);

                var results6 = response6.body.results;
                var pic6 = response6.body.profile_path;
                var randomValuesArray6 = getRandomValuesFromArray(results6, 2);

                console.log(response6);

  res.render('third', { title: 'Express',
                        result1: randomValuesArray[0],
                        result2: randomValuesArray2[1],
                        results3: randomValuesArray3[2],
                        results4: randomValuesArray4[3],
                        results5: randomValuesArray5[4],
                        results6: randomValuesArray6[5],
                        pic1: randomValuesArray[0],
                        pic2: randomValuesArray[1],
                        pic3: randomValuesArray[2],
                        pic4: randomValuesArray[3],
                        pic5: randomValuesArray[4],
                        pic6: randomValuesArray[5]
                        });
            });
          });
        });
      });
    });
  });
});

router.post('/third', function(req, res, next) {
  res.cookie('actorSelected', req.body.actorSelected);
  res.redirect('/result');
});


router.get('/result', function(req, res, next){
  res.render('result');
});

  //do stuff here to combine all of users choices to display movies that fit into what they chose

//   res.render('result', {timeRangeSelected : timeRangeSelected,
//                         genreSelected : genreSelected,
//                         actorSelected : actorSelected
//   });
// });
//
// router.get('/thanks', function(req, res, next) {
//
//     res.redirect('/');
// });




module.exports = router;

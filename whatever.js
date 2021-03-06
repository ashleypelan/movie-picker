function getRandomValuesFromArray(array, numberOfValues) {

  var randomValuesArray = [];

  if (numberOfValues > array.length) {
    var err = "Error: numberOfValues can't be larger than array.length.";
    throw(err);
  }

  while (randomValuesArray.length < numberOfValues) {
    var randomNumber = getRandomInt(0, array.length - 1);
    var arrayValue = array[randomNumber];
    if (randomValuesArray.indexOf(arrayValue) == -1) {
      randomValuesArray.push(arrayValue);
    }
  }
  return randomValuesArray;
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

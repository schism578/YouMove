'use strict';
 
const videoSearchURL = 'https://www.googleapis.com/youtube/v3/search';
const googleApiKey = 'AIzaSyCxrK1XHc-SVjAMhKBwz6-Z0oZCvZrXk-A';
const nutritionixApiURL = 'https://trackapi.nutritionix.com/v2/search/instant';
const nutritionixId = '0f95c1c1';
const nutritionixApiKey = '68735624af11791c9bc823caa9321cd22c31cbcf';

let food = [] //map and join, think STORE databank form quiz app

//1st form with gender, height, weight, age
//2nd form user adds foods and submits for total calories --> calculate BMR --> calculate caloricDeficit

function generateBMR(gender, height, weight, age) {
  const a = gender ? 88.362 : 447.593
  const b = gender ? 13.397 : 9.247
  const c = gender ? 4.799 : 3.098
  const d = gender ? 5.677 : 4.330
  return a + (b * (weight * 0.453592)) + (c * (height * 2.54)) - (d * age);
}

function generateCalorieBurn() {
  const caloricDeficit = responseJson.calories - generateBMR();
}

function formatQueryParams(params) {
  const queryItems = Object.keys(params)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
  return queryItems.join('&');
}

function getFood(calories) {
  const headers = {
    x-app-id: nutritionixId,
    x-app-key: nutritionixApiKey
  };

  return fetch(nutritionixApiURL)
  .then(response => {
    if (response.ok) {
      return response.json();
    }
    throw new Error(response.statusText);
  })
  .catch(err => {
    $('#error-message').text(`Something went wrong with {other API}: ${err.message}`);
  });
}

function displayVideoResults(responseJson) {
  console.log(responseJson);
  $('#results-list').empty();
  for (let i = 0; i < responseJson.items.length; i++){
    $('#results-list').append(
      `<li><h3>${responseJson.items[i].snippet.title}</h3>
      <p>${responseJson.items[i].snippet.description}</p>
      <video src='${responseJson.items[i].search}' controls>(“Video Not Supported”)</video>
      </li>`
    )};
  $('#results').removeClass('hidden');
};


function getVideos(caloricDeficit, maxResults=3) {
  const params = {
    key: googleApiKey,
    q: `${caloricDeficit} calories workout` ,
    part: 'snippet',
    maxResults,
    type: 'video',
    list: 'exercise'
  };

  const queryString = formatQueryParams(params)
  const url = videoSearchURL + '?' + queryString;

  console.log(url);

  return fetch(url)
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })
    .catch(err => {
      $('#error-message').text(`Something went wrong with YouTube: ${err.message}`);
    });
}


function watchForm() {
  $('form').submit(event => {
    event.preventDefault();
    const searchTerm = $('#search-term').val();
    const maxResults = $('#max-results').val();
    getFood(calories)
    getVideos(caloricDeficit, maxResults)
    .then(responseJson => displayVideoResults(responseJson))
  });
}

$(watchForm);
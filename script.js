'use strict';
 
const videoSearchURL = 'https://www.googleapis.com/youtube/v3/search';
const googleApiKey = 'AIzaSyC1N7BXv1cLLheo2LWLCcOhgtKzpgYbIQM';

//Calculators:
function calculateBMR() {
  const weight = parseInt( $('#weight').val() );
  const height = parseInt( $('#height').val() );
  const age = parseInt( $('#age').val() );

  if ($('#gender').val() === 'male') {
    return (weight * 0.453592) * 10 + (height * 2.54) * 6.25 - age * 5 + 5
  } else {
    return (weight * 0.453592) * 10 + (height * 2.54) * 6.25 - age * 5 + 161
  }
}

//Page Generators:
function generateStartPage() {
  return `
      <p>Enter your gender, height, weight, and age to yield your BMR, or
          basal metabolic rate (how many calories you burn in a day just 
          sitting still).</p> 
      <p>Then enter your daily calorie intake to calculate a "goal caloric deficit" 
          based against your BMR.</p>
      <p>Workout videos or healthy recipes you can do at home will display or follow one of the 
          links below them to try something different!</p>
      `
}

function generateInputPage() {
      return `
      <form class='bmr-form' method="post">
        <fieldset name='user-search'>
          <legend>Enter Your Info:</legend>
            <ul>
              <li>
                <label for='gender'>Gender:</label>
                <select name='gender' id='gender'>
                  <option value='female'>female</option>
                  <option value='male'>male</option>
                </select>
              </li>
              <li>Height:</li>
              <input type='number' id='height' name='height' placeholder='70 (inches)' min="1" step="1" required>
              <li>Weight:</li>
              <input type='number' id='weight' name='weight' placeholder='170 (pounds)' min="1" step="1" required>
              <li>Age:</li>
              <input type='number' id='age' name='age' placeholder='23 (years)' min="1" step="1" required>
            </ul>
        </fieldset>
        <fieldset>
          <legend>Enter Your Daily Calories:</legend>
            <input type='number' class='calorie-query' placeholder='2000' min="1" step="1" required>
            <button type='submit'>Submit</button>
        </fieldset>
      </form>
      `
}

//Server request formatting:
function formatQueryParams(params) {
  const queryItems = Object.keys(params)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
  return queryItems.join('&');
}

function displayInfo(bmr, caloricDeficit) {
  $('h3').text(`Your BMR is ${bmr} calories. Based on your entered daily calories, 
  you want to have a caloric deficit of ${caloricDeficit} calories.`)
}
//YouTube Data:
function displayVideoResults(responseJson) {
  $('#results-list').empty();
  for (let i = 0; i < responseJson.items.length; i++){
    $('#results-list').append(
      `<li><h4>${responseJson.items[i].snippet.title}</h4>
      <p>${responseJson.items[i].snippet.description}</p>
      <div class="videoWrapper">
      <iframe width="560" height="315" src="https://www.youtube.com/embed/${responseJson.items[i].id.videoId}" 
      frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" 
      allowfullscreen></iframe>
      </div>
      </li>
      `
    )};
  $('#results').removeClass('hidden');
}

function getVideos(maxResults=3) {
  const bmr = calculateBMR();
  const searchBmr = ((bmr/100).toFixed()*100)
  const caloricDeficit = $('.calorie-query').val() - bmr;
  const searchCalories = ((caloricDeficit/100).toFixed()*100);
  const params = {
    key: googleApiKey,
    q: `${searchCalories} calorie ${caloricDeficit > 0 ? 'workout' : 'recipe'}`,
    part: 'snippet',
    maxResults,
    type: 'video',
    list: `${caloricDeficit > 0 ? 'exercise' : 'cooking'}`
  }

  const queryString = formatQueryParams(params)
  const videoURL = videoSearchURL + '?' + queryString

  return fetch(videoURL)
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })
    .then(responseJson => {
      displayInfo(searchBmr, searchCalories)
      displayVideoResults(responseJson)
    })
    
    .catch(err => {
      $('#error-message').text(`Something went wrong with YouTube: ${err.message}`);
    });
}

//Page Displayers:
function displayStartPage() {
  displayPage(generateStartPage())
}

function displayInputPage() {
  displayPage(generateInputPage())
}

function displayPage(html) {
  $('.user-form').html(html)
}

//Handlers:
function handleClickStart() {
  $('main').on('click', '.start-button', (event) => {
      displayInputPage()
  })
}

function handleSubmitCalories() {
  $('main').on('submit', '.bmr-form', event => {
    event.preventDefault();
    getVideos();
  });
}

function setupEventHandlers() {
  handleClickStart()
  handleSubmitCalories()
}

$(setupEventHandlers);
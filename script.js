'use strict';
 
const videoSearchURL = 'https://www.googleapis.com/youtube/v3/search';
const googleApiKey = 'AIzaSyCxrK1XHc-SVjAMhKBwz6-Z0oZCvZrXk-A';
let caloricDeficit = $(".calorie-query") - calculateBMR();

//Calculators:
function calculateBMR() {
  if ($(".gender") === "male") {
    return ($(".weight") * 0.453592) * 10 + ($(".height") * 2.54) * 6.25 - $(".age") * 5 + 5
  } else {
    return ($(".weight") * 0.453592) * 10 + ($(".height") * 2.54) * 6.25 - $(".age") * 5 + 161
  }
}

function generateCalorieBurn() {
  return `${caloricDeficit}`
}


//Page Generators:
function generateStartPage() {
  return `
      <p>Enter your gender, height, weight, and age to yield your BMR, or
          basal metabolic rate (how many calories you burn in a day just 
          sitting still).</p> 
      <p>Then enter your daily calorie intake to calculate a "goal caloric deficit" 
          based against your BMR.</p>
      <p>Workout videos you can do at home will display or follow one of the 
          links below them to do something different!</p>
      `
}

function generateInputPage(food) {
      return `
      <form class="bmr-form">
        <fieldset name="user-search">
          <legend>Enter Your Info:</legend>
            <ul>
              <li>
                <label for="Gender">Gender:</label>
                <select name="gender" id="gender">
                  <option value="male">male</option>
                  <option value="female">female</option>
                </select>
              </li>
              <li>Height:</li>
              <input type="number" id="height" name="height" placeholder="70 (inches)" required>
              <li>Weight:</li>
              <input type="number" id="weight" name="weight" placeholder="170 (pounds)" required>
              <li>Age:</li>
              <input type="number" id="age" name="age" placeholder="23 (years)" required>
            </ul>
              <button type="submit" >Calculate BMR</button>
        </fieldset>
      </form>

      <form class="calorie-form">
        <fieldset>
          <legend>Enter Your Daily Calories:</legend>
            <input type="number" class="calorie-query" placeholder="2000" required>
            <button type="submit">Submit</button>
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


//YouTube Data:
function displayVideoResults(responseJson) {
  console.log(responseJson);
  $('#results-list').empty();
  for (let i = 0; i < responseJson.items.length; i++){
    $('#results-list').append(
      `<li><h3>${responseJson.items[i].snippet.title}</h3>
      <p>${responseJson.items[i].snippet.description}</p>
      <video src='${responseJson.items[i].search}' controls>(“Video Not Supported”)</video>
      </li>
      `//add 'other' links
    )};
  $('#results').removeClass('hidden');
}

function getVideos(caloricDeficit, maxResults=3) {
  const params = {
    key: googleApiKey,
    q: `${caloricDeficit} calories workout`,
    part: 'snippet',
    maxResults,
    type: 'video',
    list: 'exercise'
  }

  const queryString = formatQueryParams(params)
  const videoURL = videoSearchURL + '?' + queryString;

  console.log(videoURL);

  return fetch(videoURL)
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })
    .then(responseJson => displayResults(responseJson))
    .catch(err => {
      $('#error-message').text(`Something went wrong with YouTube: ${err.message}`);
    });
}



//Page Displayers:
function displayStartPage() {
  displayPage(generateStartPage())
}

function displayInputPage() {
  console.log("displaying page")
  displayPage(generateInputPage())
}

function displayPage(html) {
  $(".user-form").html(html)
}



//Handlers:
function handleClickStart() {
  $("main").on("click", ".start-button", (event) => {
      displayInputPage()
  })
}

function handleSubmitBMR() {
  $('main').on("submit", ".bmr-form", event => {
    event.preventDefault();
    const male = ($(".weight") * 0.453592) * 10 + ($(".height") * 2.54) * 6.25 - $(".age") * 5 + 5;
    const female = ($(".weight") * 0.453592) * 10 + ($(".height") * 2.54) * 6.25 - $(".age") * 5 + 161;
    return `<span>${calculateBMR(gender) ? male : female}</span>`
  });
}

function handleSubmitCalories() {
  $('main').on("submit", ".calorie-form", event => {
    event.preventDefault();
    const calorieQuery = $(".calorie-query");
    const calories = calorieQuery.val();
    generateCalorieBurn(calories);
    displayVideoResults(caloricDeficit);
  });
}

function setupEventHandlers() {
  handleClickStart()
  handleSubmitBMR()
  handleSubmitCalories()
}

$(setupEventHandlers);
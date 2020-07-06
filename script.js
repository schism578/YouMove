'use strict';
 
const videoSearchURL = 'https://www.googleapis.com/youtube/v3/search';
const googleApiKey = 'AIzaSyCxrK1XHc-SVjAMhKBwz6-Z0oZCvZrXk-A';
const edamamApiURL = 'https://api.edamam.com/api/food-database/v2';
const edamamId = '347aa534';
const edamamApiKey = '775483288483a637da90fb07604782c7';
let food = []; //map and join, think STORE databank from quiz app


//Calculators:

function generateBMR() {
  console.log("BMR calculated");
  if ($(".gender") === "male") {
    return ($(".weight") * 0.453592) * 10 + ($(".height") * 2.54) * 6.25 - $(".age") * 5 + 5
  } else {
    return ($(".weight") * 0.453592) * 10 + ($(".height") * 2.54) * 6.25 - $(".age") * 5 + 161 
  }
}

//Will this operate to sum all the calories?
function calculateCalories() {
  const calories = responseJson.calories; //need to acquire 'calories' from API and sum
  return responseJson.ingr.filter(food => ingr.calories).val();
}

function generateCalorieBurn() {
  const caloricDeficit = calculateCalories() - generateBMR();
}



//Page Generators:
function generateStartPage() {
  return `
      <p>Enter your gender, height, weight, and age to yield your BMR, or
          basal metabolic rate (how many calories you burn in a day just 
          sitting still).</p> 
      <p>Then enter food items or your daily calorie
          intake to calculate a "goal caloric deficit" based against your BMR.</p>
      <p>Workout videos you can do at home will display or follow one of the 
          links below them to do something different!</p>
      `
}

function generateInputPage(food) {
    const foodList = `
              <ul class="food-list">
                  ${food.map((foodItem, index) => 
                    `<li class="food-item"><label for="food${index}">
                      ${foodItem}
                    </label></li>
                    `)
                  .join("\n")
                }
              </ul>
              `
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
      
      <form class="food-form">
        <fieldset name="food-search">
          <legend>Enter Your Food:</legend>
            <input type="text" class="food-query" placeholder="e.g. 1 cup Cheerios with 1 cup 
            skim milk and half banana" required>
            <button type="submit">Add Food</button>
              ${foodList}
            <img src="images/edamam-img.png" id="logo" alt="edamam logo">
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
    /*2nd form: user adds foods or daily calories and submits for total calories --> calculate BMR --> 
calculate caloricDeficit. Double 'required' inputs? Or one or the other?*/
}



//Server request formatting:
function formatQueryParams(params) {
  const queryItems = Object.keys(params)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
  return queryItems.join('&');
}



//Edamam Data:
function getFood(foodId) {
  const headers = {
    app_id: edamamId,
    app_key: edamamApiKey,
    "Access-Control-Allow-Origin": "https://schism578.github.io/api-hack/"
  }
  const params = {
    ingr: "",
    calories: ""
  };

  //Can this be duplicated like this for both Edamam and YouTube fetches?
  const queryString = formatQueryParams(params);
  const foodURL = edamamApiURL + '?' + queryString;

  return fetch(foodURL, {headers})
  .then(response => {
    if (response.ok) {
      return response.json();
    }
    throw new Error(response.statusText);
  })
  .catch(err => {
    $('#error-message').text(`Something went wrong with Nutritionix: ${err.message}`);
  });
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
};

function getVideos(caloricDeficit, maxResults=3) {
  const params = {
    key: googleApiKey,
    q: `${caloricDeficit} calories workout`,
    part: 'snippet',
    maxResults,
    type: 'video',
    list: 'exercise'
  };

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
  displayPage(generateInputPage(food))
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
    const male = $(".weight") * 10 + $(".height") * 6.25 - $(".age") * 5 + 5;
    const female = $(".weight") * 10 + $(".height") * 6.25 - $(".age") * 5 + 161;
    return `<span>${generateBMR() ? male : female}</span>`
  });
}

function handleSubmitFood() {
  $('main').on("submit", ".food-form", event => {
    event.preventDefault();
    const foodQuery = $(".food-query")
    const foodName = foodQuery.val()
    foodQuery.val("")
    getFood(foodName).then(responseJson => console.dir(responseJson))
  });
}

function handleSubmitCalorie() {
  $('main').on("submit", ".calorie-form", event => {
    event.preventDefault();
    
  });
}

function setupEventHandlers() {
  handleClickStart()
  handleSubmitBMR()
  handleSubmitFood()
  handleSubmitCalorie()
}

$(setupEventHandlers);
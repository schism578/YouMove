'use strict';
 
const videoSearchURL = 'https://www.googleapis.com/youtube/v3/search';
const googleApiKey = 'AIzaSyAvndNOy-MOjI-P7VI_Ixaz0eJw1p9tXIg';
const wgerApiURL = 'https://wger.de/api/v2';
const wgerApiKey = '68735624af11791c9bc823caa9321cd22c31cbcf';


function formatQueryParams(params) {
  const queryItems = Object.keys(params)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
  return queryItems.join('&');
}

function displayResults(responseJson) {
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

function getYouTubeVideos(maxResults=3) {
  const params = {
    key: googleApiKey,
    part: 'snippet',
    maxResults,
    type: 'video',
    list: 'exercise'
  };

  const queryString = formatQueryParams(params)
  const url = videoSearchURL + '?' + queryString;

  console.log(url);

  fetch(url)
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })
    .then(responseJson => displayResults(responseJson))
    .catch(err => {
      $('#error-message').text(`Something went wrong: ${err.message}`);
    });
}

function watchForm() {
  $('form').submit(event => {
    event.preventDefault();
    const searchTerm = $('#search-term').val();
    const maxResults = $('#max-results').val();
    getYouTubeVideos(maxResults);
  });
}

$(watchForm);
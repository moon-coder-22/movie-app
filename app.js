const API_KEY = '8c8e1a50-6322-4135-8875-5d40a5420d86';
const API_URL_TOP100 = 'https://kinopoiskapiunofficial.tech/api/v2.2/films/top?type=TOP_100_POPULAR_FILMS&page=1';
const API_URL_TOP250 = 'https://kinopoiskapiunofficial.tech/api/v2.2/films/top?type=TOP_250_BEST_FILMS&page=1';
const API_URL_SEARCH = 'https://kinopoiskapiunofficial.tech/api/v2.1/films/search-by-keyword?keyword='
getMovies(API_URL_TOP100);

async function getMovies(url) {
  const resp = await fetch(url, {
    headers: {
      "Content-Type": 'application/json',
      "X-API-KEY": API_KEY,
    },
  });
  const respData = await resp.json()
  showMovies(respData);
}

function showMovies(data) {
  const moviesEl = document.querySelector('.movies');

  // clear previos films
  document.querySelector('.movies').innerHTML = '';

  data.films.forEach(movie => {
    const movieEL = document.createElement('div');
    movieEL.classList.add('movie');
    movieEL.innerHTML = `
    <div class="movie__cover-inner">
          <img src="${movie.posterUrlPreview}" alt="${movie.nameRu}" class="movie__cover">
          <div class="movie__cover--darkened"></div>
        </div>
        <div class="movie_info">
          <div class="movie_title">${movie.nameRu}</div>
          <div class="movie_category">${movie.genres.map(
            (genre) => `${genre.genre}`
            ).join(', ')}</div>
          <div class="movie_avarage movie__avarage--${getClassByRate(movie.rating)}">${formatRating(movie.rating)}</div>
        </div>
    `;
    moviesEl.appendChild(movieEL);
  })
}

function getClassByRate(rating) {

  if (rating >= 7) {
    return 'green';
  } else if (rating >=5) {
    return 'orange';
  } else if (isNaN(rating)) {
    return 'green'
  } else {
    return 'red'
  } 
}

function formatRating(rating) {
  if (rating == null) {
    return '-'
  } else if (isNaN(rating)) {
    console.log(rating);
  return (rating == null) ? rating.split('.')[0] + "%" : "-";
  } else if (rating) {
    return String(Math.round(rating));
  }
}

const form = document.querySelector('form');
const search = document.querySelector('.header__search');

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const apiSearchURL = `${API_URL_SEARCH}${search.value}`;
  if (search.value) {
    getMovies(apiSearchURL);
    search.value = '';
  }
})
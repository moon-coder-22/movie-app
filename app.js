const API_KEY = '8c8e1a50-6322-4135-8875-5d40a5420d86';
const API_URL_TOP100 = 'https://kinopoiskapiunofficial.tech/api/v2.2/films/top?type=TOP_100_POPULAR_FILMS&page=1';
const API_URL_TOP250 = 'https://kinopoiskapiunofficial.tech/api/v2.2/films/top?type=TOP_250_BEST_FILMS&page=1';
const API_URL_SEARCH = 'https://kinopoiskapiunofficial.tech/api/v2.1/films/search-by-keyword?keyword=';
const APU_URL_MOVIE_DATA = 'https://kinopoiskapiunofficial.tech/api/v2.2/films/';
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
    movieEL.addEventListener('click', () => openModal(movie.filmId, data.films))
    moviesEl.appendChild(movieEL);
    return data.films;
  })
}

function getClassByRate(rating) {

  if (rating >= 7) {
    return 'green';
  } else if (rating >= 5) {
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
    return rating;
  }
}

async function fetchMovieData(id, url) {
  const resp = await fetch(url + id, {
    headers: {
      "Content-Type": 'application/json',
      "X-API-KEY": API_KEY,
    },
  });
  const respData = await resp.json();
  return respData;
}

async function openModal(id, filmsList) {
  modalEl.innerHTML = ""; //clear data from modal window berore delet
  console.log(id);
  modalEl.classList.add('modal--show');
  document.body.classList.add('stop-scrolling');

  let currentFilm = await fetchMovieData(id, APU_URL_MOVIE_DATA);
  // console.log(currentFilm);

  modalEl.innerHTML = `
  <div class="modal__card">
    <img class="modal__movie-backdrop" src="${currentFilm.posterUrlPreview}" alt="">
    <h2>
      <span class="modal__movie-title">${currentFilm.nameRu}, </span>
      <span class="modal__movie-release-year">${currentFilm.year}</span>
    </h2>
    <ul class="modal__movie-info">
      <div class="loader"></div>
      <li class="modal__movie-genre">${currentFilm.genres.map(genre => genre.genre).join(', ')}</li>
      ${currentFilm.filmLength ? `<li class="modal__movie-runtime">Время - ${currentFilm.filmLength} минут</li>` : ""}
      <li>Сайт: <a class="modal__movie-site" href="${currentFilm.webUrl}">${currentFilm.webUrl}</a></li>
      <li class="modal__movie-overview">${currentFilm.description.slice(0, -50) + "..."}</li>
    </ul>
    <button type="button" class="modal__button-close">Закрыть</button>
  </div>
`
  const btnClose = document.querySelector('.modal__button-close');
  btnClose.addEventListener('click', closeModal);
  
}


function closeModal() {
  modalEl.classList.remove('modal--show');
  document.body.classList.remove('stop-scrolling');

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

// Modal

const modalEl = document.querySelector('.modal');



window.addEventListener('click', (e) => {
  console.log(e.target, modalEl);
  if (e.target === modalEl) {
    closeModal()
  }
});

window.addEventListener('keydown', (e) => {
  if (e.keyCode === 27) {
    closeModal();
  }
})
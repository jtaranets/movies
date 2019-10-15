const imgDetailsPage = document.querySelector('.detailsPage__img');
const title = document.querySelector('.detailsPage__title');
const vote = document.querySelector('.js-vote');
const popularity = document.querySelector('.js-popularity');
const originalTitle = document.querySelector('.js-originalTitle');
const genre = document.querySelector('.js-genre');
const about = document.querySelector('.js-about');
const addToQueueBtn = document.querySelector('.js-addToQueue');
const addToWatchedBtn = document.querySelector('.js-addToWatched');
let toAddString;
const removeFromWatchedBtnText = `<i class="far fa-trash-alt detailsPage__icon"></i> <span class="detailsPage__btn">Remove from watched</span>`;
const removeFromQueueBtnText = `<i class="far fa-calendar-minus detailsPage__icon"></i> <span class="detailsPage__btn">Remove from queue</span>`;
const addToWatchedBtnText = `<i class="fas fa-video detailsPage__icon"></i> <span class="detailsPage__btn">Add to watched</span>`;
const addToQueueBtnText = `<i class="fas fa-calendar-plus detailsPage__icon"></i> <span class="detailsPage__btn">Add to queue</span>`;

function showDetails(film) {
  imgDetailsPage.setAttribute(
    'src',
    `https://image.tmdb.org/t/p/original${film.poster_path}`,
  );
  const yearOfTitle = getYearFromDate(film.release_date);
  title.textContent = `${film.original_title} (${yearOfTitle})`;
  vote.textContent = `${film.vote_average}/${film.vote_count}`;
  popularity.textContent = film.popularity;
  originalTitle.textContent = film.original_title;
  const res = film.genre_ids.map(elem => {
    const result = genres.find(el => el.id === elem);
    return result.name;
  });
  const genresRes = res.join(', ');
  genre.textContent = genresRes;
  about.textContent = film.overview;
  toggleTextBtn();
}

function addWatchedToLocaleStorage() {
const localStorageList = [];
  const savedToLocaleStorage = localStorage.getItem('watched');
  if (savedToLocaleStorage) {
    const array = JSON.parse(savedToLocaleStorage);
    const filter = array.find(item => item.id === selectFilm.id);
    if (filter) {
      return;
    }
    array.push(selectFilm);
    toAddString = JSON.stringify(array);
  } else {
    localStorageList.push(selectFilm);
    toAddString = JSON.stringify(localStorageList);
  }
  localStorage.setItem('watched', toAddString);
  toggleTextBtn();
}

function addQueueToLocaleStorage() {
const localStorageList = [];
  const savedToLocaleStorage = localStorage.getItem('queue');
  if (savedToLocaleStorage) {
    const array = JSON.parse(savedToLocaleStorage);
    const filter = array.find(item => item.id === selectFilm.id);
    if (filter) {
      return;
    }
    array.push(selectFilm);
    toAddString = JSON.stringify(array);
  } else {
    localStorageList.push(selectFilm);
    toAddString = JSON.stringify(localStorageList);
  }
  localStorage.setItem('queue', toAddString);
  toggleTextBtn();
}

function removeWatchedFromLocaleStorage() {
  const savedToWatched = localStorage.getItem('watched');
  const array = JSON.parse(savedToWatched);
  const filter = array.filter(item => item.id !== selectFilm.id);
  toAddString = JSON.stringify(filter);
  localStorage.setItem('watched', toAddString);
  toggleTextBtn();
}

function removeQueueFromLocaleStorage() {
  const savedToWatched = localStorage.getItem('queue');
  const array = JSON.parse(savedToWatched);
  const filter = array.filter(item => item.id !== selectFilm.id);
  toAddString = JSON.stringify(filter);
  localStorage.setItem('queue', toAddString);
  toggleTextBtn();
}

function toggleTextBtn() {
  const locStorWatched = localStorage.getItem('watched');
  const locStorQueue = localStorage.getItem('queue');
  const arrQueue = JSON.parse(locStorQueue);
  const checkQueue = () => {
    if (arrQueue) {
      const res = arrQueue.find(el => el.id === selectFilm.id);
      res
        ? (addToQueueBtn.innerHTML = `${removeFromQueueBtnText}`)
        : (addToQueueBtn.innerHTML = `${addToQueueBtnText}`);
    } else {
      addToQueueBtn.innerHTML = `${addToQueueBtnText}`;
    }
  };
  const arrWatched = JSON.parse(locStorWatched);
  const checkWatched = () => {
    if (arrWatched) {
      const res = arrWatched.find(item => item.id === selectFilm.id);
      res
        ? (addToWatchedBtn.innerHTML = `${removeFromWatchedBtnText}`)
        : (addToWatchedBtn.innerHTML = `${addToWatchedBtnText}`);
    } else {
      addToWatchedBtn.innerHTML = `${addToWatchedBtnText}`;
    }
  };
  checkQueue();
  checkWatched();
}

function toggleWatchedBtn() {
  if (addToWatchedBtn.textContent === ' Add to watched') {
    addWatchedToLocaleStorage();
  } else if (addToWatchedBtn.textContent === ' Remove from watched') {
    removeWatchedFromLocaleStorage();
  }
}

function toggleQueueBtn() {
  addToQueueBtn.textContent === ' Add to queue'
    ? addQueueToLocaleStorage()
    : removeQueueFromLocaleStorage();
}

addToWatchedBtn.addEventListener('click', toggleWatchedBtn);

addToQueueBtn.addEventListener('click', toggleQueueBtn);

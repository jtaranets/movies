'use strict';

let renderFilms;
let genres;
let pageNumber = 1;
let inputValue;
const form = document.querySelector('.homePage__form');
const input = document.querySelector('.homePage__input');
const prevBtn = document.querySelector('.js-prev');
const nextBtn = document.querySelector('.js-next');
const homePlaginationNumber = document.querySelector('.homepage__page');
const list = document.querySelector('.homePage__filmList');
const popWhenError = document.querySelector('.homePage__error');
const closeError = document.querySelector('.homePage__close-error-btn');
const detailsPage = document.querySelector('.detailsPage');

function fetchGenres() {
  fetch(
    'https://api.themoviedb.org/3/genre/movie/list?api_key=f1943ebda4bde31f3353b960641d381f&language=en-US',
  )
    .then(res => res.json())
    .then(data => {
      genres = data.genres;
      return genres;
    })
    .catch(err => console.log(err));
}

fetchGenres();

function createCards(name, imgPath, year, movieId) {
  const item = document.createElement('li');
  item.classList.add('homePage__filmItem', 'filmList__item');
  const img = document.createElement('img');
  img.classList.add('homePage__img', 'filmList__img');
  img.setAttribute('src', `https://image.tmdb.org/t/p/w500${imgPath}`);
  const movieName = document.createElement('p');
  movieName.classList.add('homePage__movieName', 'filmList__movieName');
  const res = getYearFromDate(year);
  movieName.textContent = `${name} (${res})`;
  item.append(img, movieName);
  item.addEventListener('click', () => activeDetailsPage(movieId, false));
  return item;
}

function getYearFromDate(string) {
  const res = string.slice(0, 4);
  return res;
}

function getPopularMovies() {
  let fragment = document.createDocumentFragment();
  list.innerHTML = '';
  fetch(
    `https://api.themoviedb.org/3/movie/popular?api_key=f1943ebda4bde31f3353b960641d381f&language=en-US&page=${pageNumber}`,
  )
    .then(res => res.json())
    .then(data => {
      data.results.forEach(el => {
        fragment.append(
          createCards(el.title, el.backdrop_path, el.release_date, el.id),
        );
      });
      list.append(fragment);
      renderFilms = data.results;
    });
}


function searchFilms(e) {
pageNumber = 1;
  e.preventDefault();
  inputValue = input.value;
  fetchMovies();
  prevBtn.removeEventListener('click', getPopularMovies);
  nextBtn.removeEventListener('click', getPopularMovies);
  prevBtn.addEventListener('click', fetchMovies);
  nextBtn.addEventListener('click', fetchMovies);
  form.reset();
}

function fetchMovies() {
  let fragment = document.createDocumentFragment();
  list.innerHTML = '';
  fetch(
    `https://api.themoviedb.org/3/search/movie?api_key=f1943ebda4bde31f3353b960641d381f&language=en-US&page=${pageNumber}&include_adult=false&query=${inputValue}`,
  )
    .then(res => res.json())
    .then(data => {
      if (data.results.length < 1) {
        incorrectInput();
      } else {
        backToHomePage();
      }
      data.results.forEach(el => {
        fragment.append(
          createCards(el.title, el.backdrop_path, el.release_date, el.id),
        );
      });
      list.append(fragment);
      renderFilms = data.results;
    })
    .catch(err => console.log(err));
}

function incorrectInput() {
  popWhenError.classList.remove('main__hidden');
  closeError.classList.remove('main__hidden');
  closeError.addEventListener('click', showHomePage);
  prevBtn.classList.add('main__hidden');
  nextBtn.classList.add('main__hidden');
  // detailsPage.classList.add('main__hidden');
  homePlaginationNumber.classList.add('main__hidden');
}

function backToHomePage(){
  popWhenError.classList.add('main__hidden');
  closeError.classList.add('main__hidden');
  prevBtn.classList.remove('main__hidden');
  nextBtn.classList.remove('main__hidden');
  homePlaginationNumber.classList.remove('main__hidden');
}

function plaginationNavigation(e) {
  if (e.target.textContent === 'Next') {
    pageNumber += 1;
  }
  if (e.target.textContent === 'Prev') {
    pageNumber -= 1;
    }
  homePlaginationNumber.textContent = pageNumber;
  if (homePlaginationNumber.textContent === "1") {
    prevBtn.disabled = true;
  }
  else{
    prevBtn.disabled = false;
  }
}

function initalBtnDisabling() {
  if (homePlaginationNumber.textContent === '1') {
    prevBtn.disabled = true;
  }
}

window.onload = showHomePage;

prevBtn.addEventListener('click', plaginationNavigation);
nextBtn.addEventListener('click', plaginationNavigation);
form.addEventListener('submit', searchFilms);

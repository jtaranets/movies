'use strict';

var renderFilms;
var genres;
var pageNumber = 1;
var inputValue;
var form = document.querySelector('.homePage__form');
var input = document.querySelector('.homePage__input');
var prevBtn = document.querySelector('.js-prev');
var nextBtn = document.querySelector('.js-next');
var homePlaginationNumber = document.querySelector('.homepage__page');
var list = document.querySelector('.homePage__filmList');
var popWhenError = document.querySelector('.homePage__error');
var closeError = document.querySelector('.homePage__close-error-btn');
var detailsPage = document.querySelector('.detailsPage');
var upBtn = document.querySelector('.homePage__up-btn');
var green = document.querySelector('.green');

function fetchGenres() {
  fetch('https://api.themoviedb.org/3/genre/movie/list?api_key=f1943ebda4bde31f3353b960641d381f&language=en-US').then(function (res) {
    return res.json();
  }).then(function (data) {
    genres = data.genres;
    return genres;
  })["catch"](function (err) {
    return console.log(err);
  });
}

fetchGenres();

function createCards(name, imgPath, year, movieId) {
  var item = document.createElement('li');
  item.classList.add('homePage__filmItem', 'filmList__item');
  var shadow = document.createElement('div');
  shadow.classList.add('filmList__shadow');
  var img = document.createElement('img');
  img.classList.add('homePage__img', 'filmList__img');
  img.setAttribute('src', "https://image.tmdb.org/t/p/w500".concat(imgPath));
  var movieName = document.createElement('p');
  movieName.classList.add('homePage__movieName', 'filmList__movieName');
  var res = getYearFromDate(year);
  movieName.textContent = "".concat(name, " (").concat(res, ")");
  item.append(img, shadow, movieName);
  item.addEventListener('click', function () {
    return activeDetailsPage(movieId, false);
  });
  return item;
}

function getYearFromDate(string) {
  var res = string.slice(0, 4);
  return res;
}

function getPopularMovies() {
  var fragment = document.createDocumentFragment();
  list.innerHTML = '';
  fetch("https://api.themoviedb.org/3/movie/popular?api_key=f1943ebda4bde31f3353b960641d381f&language=en-US&page=".concat(pageNumber)).then(function (res) {
    return res.json();
  }).then(function (data) {
    data.results.forEach(function (el) {
      fragment.append(createCards(el.title, el.backdrop_path, el.release_date, el.id));
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
  var fragment = document.createDocumentFragment();
  list.innerHTML = '';
  fetch("https://api.themoviedb.org/3/search/movie?api_key=f1943ebda4bde31f3353b960641d381f&language=en-US&page=".concat(pageNumber, "&include_adult=false&query=").concat(inputValue)).then(function (res) {
    return res.json();
  }).then(function (data) {
    if (data.results.length < 1) {
      incorrectInput();
    } else {
      backToHomePage();
    }

    data.results.forEach(function (el) {
      fragment.append(createCards(el.title, el.backdrop_path, el.release_date, el.id));
    });
    list.append(fragment);
    renderFilms = data.results;
  })["catch"](function (err) {
    return console.log(err);
  });
}

function incorrectInput() {
  popWhenError.classList.remove('main__hidden');
  closeError.classList.remove('main__hidden');
  closeError.addEventListener('click', showHomePage);
  prevBtn.classList.add('main__hidden');
  nextBtn.classList.add('main__hidden'); // detailsPage.classList.add('main__hidden');

  homePlaginationNumber.classList.add('main__hidden');
}

function backToHomePage() {
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

  initalBtnDisabling();
}

function initalBtnDisabling() {
  if (homePlaginationNumber.textContent === '1') {
    prevBtn.disabled = true;
  } else {
    prevBtn.disabled = false;
  }
}

function showScroll() {
  var currentHeight = window.scrollY;

  var goUp = function goUp() {
    window.scroll(0, 0);
  };

  upBtn.addEventListener('click', goUp); // console.log(window);

  if (currentHeight > window.innerHeight) {
    upBtn.classList.remove('main__hidden');
  } else {
    upBtn.classList.add('main__hidden');
  }
}

window.onload = showHomePage;
window.onscroll = showScroll;
prevBtn.addEventListener('click', plaginationNavigation);
nextBtn.addEventListener('click', plaginationNavigation);
form.addEventListener('submit', searchFilms);
"use strict";

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

var homeBtn = document.querySelector('.js-home');
var libraryBtn = document.querySelector('.js-library');
var logo = document.querySelector('.header__logo');
var homePage = document.querySelector('.homePage__block');
var myFilmLibraryPage = document.querySelector('.myFilmLibraryPage');
var selectFilm;
homeBtn.addEventListener('click', showHomePage);
libraryBtn.addEventListener('click', showLibraryPage);
logo.addEventListener('click', showHomePage);

function showHomePage() {
  backToHomePage();
  pageNumber = 1;
  homePlaginationNumber.textContent = pageNumber;
  prevBtn.removeEventListener('click', fetchMovies);
  nextBtn.removeEventListener('click', fetchMovies);
  prevBtn.addEventListener('click', getPopularMovies);
  nextBtn.addEventListener('click', getPopularMovies);
  initalBtnDisabling();
  getPopularMovies();
  detailsPage.classList.add('main__hidden');
  myFilmLibraryPage.classList.add('main__hidden');
  homePage.classList.remove('main__hidden');
}

function showLibraryPage() {
  detailsPage.classList.add('main__hidden');
  blankLibraryPage();
  myFilmLibraryPage.classList.remove('main__hidden');
  homePage.classList.add('main__hidden');
}

function activeDetailsPage(movieId, itsLibraryFilm) {
  homePage.classList.add('main__hidden');
  myFilmLibraryPage.classList.add('main__hidden');
  detailsPage.classList.remove('main__hidden');

  if (itsLibraryFilm) {
    console.log('hello');
    var allLocalStorageMovies = [];

    if (localStorage.getItem('watched')) {
      allLocalStorageMovies.push.apply(allLocalStorageMovies, _toConsumableArray(JSON.parse(localStorage.getItem('watched'))));
    }

    if (localStorage.getItem('queue')) {
      allLocalStorageMovies.push.apply(allLocalStorageMovies, _toConsumableArray(JSON.parse(localStorage.getItem('queue'))));
    }

    selectFilm = allLocalStorageMovies.find(function (elem) {
      return elem.id === movieId;
    });
  } else {
    selectFilm = renderFilms.find(function (el) {
      return el.id === movieId;
    });
  }

  showDetails(selectFilm);
}
"use strict";

var imgDetailsPage = document.querySelector('.detailsPage__img');
var title = document.querySelector('.detailsPage__title');
var vote = document.querySelector('.js-vote');
var popularity = document.querySelector('.js-popularity');
var originalTitle = document.querySelector('.js-originalTitle');
var genre = document.querySelector('.js-genre');
var about = document.querySelector('.js-about');
var addToQueueBtn = document.querySelector('.js-addToQueue');
var addToWatchedBtn = document.querySelector('.js-addToWatched');
var toAddString;
var removeFromWatchedBtnText = "<i class=\"far fa-trash-alt detailsPage__icon\"></i> <span class=\"detailsPage__btn\">Remove from watched</span>";
var removeFromQueueBtnText = "<i class=\"far fa-calendar-minus detailsPage__icon\"></i> <span class=\"detailsPage__btn\">Remove from queue</span>";
var addToWatchedBtnText = "<i class=\"fas fa-video detailsPage__icon\"></i> <span class=\"detailsPage__btn\">Add to watched</span>";
var addToQueueBtnText = "<i class=\"fas fa-calendar-plus detailsPage__icon\"></i> <span class=\"detailsPage__btn\">Add to queue</span>";

function showDetails(film) {
  imgDetailsPage.setAttribute('src', "https://image.tmdb.org/t/p/original".concat(film.poster_path));
  var yearOfTitle = getYearFromDate(film.release_date);
  title.textContent = "".concat(film.original_title, " (").concat(yearOfTitle, ")");
  vote.textContent = "".concat(film.vote_average, "/").concat(film.vote_count);
  popularity.textContent = film.popularity;
  originalTitle.textContent = film.original_title;
  var res = film.genre_ids.map(function (elem) {
    var result = genres.find(function (el) {
      return el.id === elem;
    });
    return result.name;
  });
  var genresRes = res.join(', ');
  genre.textContent = genresRes;
  about.textContent = film.overview;
  toggleTextBtn();
}

function addWatchedToLocaleStorage() {
  var localStorageList = [];
  var savedToLocaleStorage = localStorage.getItem('watched');

  if (savedToLocaleStorage) {
    var array = JSON.parse(savedToLocaleStorage);
    var filter = array.find(function (item) {
      return item.id === selectFilm.id;
    });

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
  var localStorageList = [];
  var savedToLocaleStorage = localStorage.getItem('queue');

  if (savedToLocaleStorage) {
    var array = JSON.parse(savedToLocaleStorage);
    var filter = array.find(function (item) {
      return item.id === selectFilm.id;
    });

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
  var savedToWatched = localStorage.getItem('watched');
  var array = JSON.parse(savedToWatched);
  var filter = array.filter(function (item) {
    return item.id !== selectFilm.id;
  });
  toAddString = JSON.stringify(filter);
  localStorage.setItem('watched', toAddString);
  toggleTextBtn();
}

function removeQueueFromLocaleStorage() {
  var savedToWatched = localStorage.getItem('queue');
  var array = JSON.parse(savedToWatched);
  var filter = array.filter(function (item) {
    return item.id !== selectFilm.id;
  });
  toAddString = JSON.stringify(filter);
  localStorage.setItem('queue', toAddString);
  toggleTextBtn();
}

function toggleTextBtn() {
  var locStorWatched = localStorage.getItem('watched');
  var locStorQueue = localStorage.getItem('queue');
  var arrQueue = JSON.parse(locStorQueue);

  var checkQueue = function checkQueue() {
    if (arrQueue) {
      var res = arrQueue.find(function (el) {
        return el.id === selectFilm.id;
      });
      res ? addToQueueBtn.innerHTML = "".concat(removeFromQueueBtnText) : addToQueueBtn.innerHTML = "".concat(addToQueueBtnText);
    } else {
      addToQueueBtn.innerHTML = "".concat(addToQueueBtnText);
    }
  };

  var arrWatched = JSON.parse(locStorWatched);

  var checkWatched = function checkWatched() {
    if (arrWatched) {
      var res = arrWatched.find(function (item) {
        return item.id === selectFilm.id;
      });
      res ? addToWatchedBtn.innerHTML = "".concat(removeFromWatchedBtnText) : addToWatchedBtn.innerHTML = "".concat(addToWatchedBtnText);
    } else {
      addToWatchedBtn.innerHTML = "".concat(addToWatchedBtnText);
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
  addToQueueBtn.textContent === ' Add to queue' ? addQueueToLocaleStorage() : removeQueueFromLocaleStorage();
}

addToWatchedBtn.addEventListener('click', toggleWatchedBtn);
addToQueueBtn.addEventListener('click', toggleQueueBtn);
"use strict";

var watchButton = document.querySelector('.js-libraryWatchedBtn');
var queueButton = document.querySelector('.js-libraryQueueBtn');
var element = document.getElementById('libraryListTemplate');
var noItemsToShow = document.querySelector('.myFilmLibraryPage__no-items');
var libraryWatchedList = document.querySelector('.js-libraryWatchedList');
var libraryQueueList = document.querySelector('.js-libraryQueueList');

function showNoItems() {
  libraryQueueList.innerHTML = '';
  libraryWatchedList.innerHTML = '';
  noItemsToShow.classList.remove('main__hidden');
}

function blankLibraryPage() {
  libraryQueueList.innerHTML = '';
  libraryWatchedList.innerHTML = '';
  noItemsToShow.classList.add('main__hidden');
}

function fillLibraryList(_ref) {
  var target = _ref.target;
  var elemToUSe = element.innerHTML.trim();
  var template = Handlebars.compile(elemToUSe);
  var item = target.textContent.toLowerCase();
  var resultFromLocStor = localStorage.getItem(item);

  if (resultFromLocStor) {
    var arrFromLocalStorage = JSON.parse(resultFromLocStor);

    if (arrFromLocalStorage.length > 0) {
      var result = template(arrFromLocalStorage);

      if (item === 'watched') {
        libraryQueueList.classList.add('main__hidden');
        noItemsToShow.classList.add('main__hidden');
        libraryWatchedList.classList.remove('main__hidden');
        libraryWatchedList.innerHTML = '';
        libraryWatchedList.insertAdjacentHTML('afterbegin', result);
      } else if (item === 'queue') {
        noItemsToShow.classList.add('main__hidden');
        libraryWatchedList.classList.add('main__hidden');
        libraryQueueList.classList.remove('main__hidden');
        libraryQueueList.innerHTML = '';
        libraryQueueList.insertAdjacentHTML('afterbegin', result);
      }

      var libraryItems = document.querySelectorAll('.myFilmLibraryPage__filmItem');
      libraryItems.forEach(function (el) {
        return el.addEventListener('click', function () {
          return activeDetailsPage(parseInt(el.dataset.id));
        }, true);
      });
    } else {
      showNoItems();
    }
  } else {
    showNoItems();
  }
}

watchButton.addEventListener('click', function (e) {
  return fillLibraryList(e);
});
queueButton.addEventListener('click', function (e) {
  return fillLibraryList(e);
});
const homeBtn = document.querySelector('.js-home');
const libraryBtn = document.querySelector('.js-library');
const logo = document.querySelector('.header__logo');
const homePage = document.querySelector('.homePage__block');
const myFilmLibraryPage = document.querySelector('.myFilmLibraryPage');
let selectFilm;

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
    let allLocalStorageMovies = [];
    if (localStorage.getItem('watched')) {
      allLocalStorageMovies.push(
        ...JSON.parse(localStorage.getItem('watched')),
      );
    }
    if (localStorage.getItem('queue')) {
      allLocalStorageMovies.push(...JSON.parse(localStorage.getItem('queue')));
    }
    selectFilm = allLocalStorageMovies.find(elem => elem.id === movieId);
  } else {
    selectFilm = renderFilms.find(el => el.id === movieId);
  }
  showDetails(selectFilm);
}

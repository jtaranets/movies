
const watchButton = document.querySelector('.js-libraryWatchedBtn');
const queueButton = document.querySelector('.js-libraryQueueBtn');
const element = document.getElementById('libraryListTemplate');
const noItemsToShow = document.querySelector('.myFilmLibraryPage__no-items');
const libraryWatchedList = document.querySelector('.js-libraryWatchedList');
const libraryQueueList = document.querySelector('.js-libraryQueueList');


function showNoItems() {
  libraryQueueList.innerHTML = '';
  libraryWatchedList.innerHTML = '';
  noItemsToShow.classList.remove('main__hidden');
}

function blankLibraryPage (){
  libraryQueueList.innerHTML = '';
  libraryWatchedList.innerHTML = '';
  noItemsToShow.classList.add('main__hidden');
}

function fillLibraryList({ target }) {
  const elemToUSe = element.innerHTML.trim();
  const template = Handlebars.compile(elemToUSe);
  const item = target.textContent.toLowerCase();
  const resultFromLocStor = localStorage.getItem(item);
  if (resultFromLocStor) {
    const arrFromLocalStorage = JSON.parse(resultFromLocStor);
    if (arrFromLocalStorage.length > 0) {
      const result = template(arrFromLocalStorage);
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
      const libraryItems = document.querySelectorAll(
        '.myFilmLibraryPage__filmItem',
      );
      libraryItems.forEach(el =>
        el.addEventListener(
          'click',
          () => activeDetailsPage(parseInt(el.dataset.id)),
          true,
        ),
      );
    } else {
      showNoItems();
    }
  } else {
    showNoItems();
  }
}

watchButton.addEventListener('click', e => fillLibraryList(e));
queueButton.addEventListener('click', e => fillLibraryList(e));

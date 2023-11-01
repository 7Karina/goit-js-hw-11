import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { getSearch } from './search-api';

const formEl = document.querySelector('#search-form');
const btnLoadEl = document.querySelector('.load-more');
const galleryEl = document.querySelector('.gallery');

let resultPage = 1;
let formValue = '';
let createNewDomEl = '';
let arrDataLength = 0;
let totalHits = 0;

async function onSearc(evt) {
  evt.preventDefault();
  formValue = formEl.elements.searchQuery.value;
  if (formValue.length == 0) {
    return alert('Форма не можу бути пуста');
  }
  resultPage = 1;
  arrDataLength = 0;
  totalHits = 0;
  await getSearch(formValue, resultPage)
    .then(data => {
      const arrData = data.data.hits;
      arrDataLength += arrData.length;
      totalHits = data.data.totalHits;
      if (arrData.length == 0) {
        return Notiflix.Notify.info(
          'Sorry, there are no images matching your search query. Please try again.'
        );
      }
      Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`);
      createDomEl(arrData);
      if (arrDataLength >= totalHits) {
        btnLoadEl.classList.add('is-hidden');
        Notiflix.Notify.info(
          "We're sorry, but you've reached the end of search results."
        );
      } else {
        btnLoadEl.classList.remove('is-hidden');
      }
    })
    .catch(err => Notiflix.Notify.failure(err.message))
    .finally();
}

formEl.addEventListener('submit', onSearc);
btnLoadEl.addEventListener('click', onLoader);

const lightbox = new SimpleLightbox('.gallery a', {
  sourceAttr: 'href',
  overlayOpacity: 0.4,
  animationSpeed: 500,
  captionsData: 'alt',
  captionPosition: 'bottom',
  captionDelay: 250,
});

function picture(arrData) {
  return arrData
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => `<div class="photo-card">
      <a class = "galery__link" href = "${largeImageURL}"><img class = "gallery__img" src="${webformatURL}" alt="${tags}" loading="lazy" /></a>
  <div class="info">
    <p class="info-item">
      <b>Likes:${likes}</b>
    </p>
    <p class="info-item">
      <b>Views:${views}</b>
    </p>
    <p class="info-item">
      <b>Comments:${comments}</b>
    </p>
    <p class="info-item">
      <b>Downloads:${downloads}</b>
    </p>
  </div>
</div>`
    )
    .join('');
}

function createDomEl(arrData) {
  createNewDomEl = picture(arrData);
  galleryEl.innerHTML = picture(arrData);
  lightbox.refresh();
}

async function onLoader() {
  resultPage += 1;
  await getSearch(formValue, resultPage).then(data => {
    const arrData = data.data.hits;
    arrDataLength += arrData.length;
    createDomEl += picture(arrData);
    galleryEl.innerHTML = createDomEl;
    lightbox.refresh();
    if (arrDataLength >= totalHits) {
      btnLoadEl.classList.add('is-hidden');
      Notiflix.Notify.info(
        "We're sorry, but you've reached the end of search results."
      );
    }
  });
}

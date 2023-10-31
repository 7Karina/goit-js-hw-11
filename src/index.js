import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { getSearch } from './search-api';

const formEl = document.querySelector('.search-form');
const btnLoadEl = document.querySelector('.load-more');
const galleryEl = document.querySelector('.gallery');

let resultPage = 1;
let formValue = '';
let createDom = '';
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
      createDom(arrData);
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
  <img src="" alt="" loading="lazy" />
  <div class="info">
    <p class="info-item">
      <b>Likes</b>
    </p>
    <p class="info-item">
      <b>Views</b>
    </p>
    <p class="info-item">
      <b>Comments</b>
    </p>
    <p class="info-item">
      <b>Downloads</b>
    </p>
  </div>
</div>`
    )
    .join('');
}

import axios from 'axios';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const BASE_URL = 'https://pixabay.com/api/';
const API_KEY = '40379426-0df14d4b6ac3f7b4d7f78cb30';
const searchQuery = '';

const params = new URLSearchParams({
  key: API_KEY,
  q: searchQuery,
  image_type: 'photo',
  orientation: 'horizontal',
  safesearch: true,
});

return fetch(`${BASE_URL}?${params}`)
  .then(response => {
    const data = response.data;
    if (data.hits.length > 0) {
      const images = data.hits;
      console.log(images);
    } else {
      Notiflix.Notify.info(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    }
  })
  .catch(error => {
    console.error('Error:', error);
    Notiflix.Notify.failure('Oops! Something went wrong. Please try again.');
  });

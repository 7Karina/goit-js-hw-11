import axios from 'axios';

const BASE_URL = 'https://pixabay.com/api/';
const API_KEY = '40379426-0df14d4b6ac3f7b4d7f78cb30';

export async function getSearch(searchQuery, pageNew) {
  const params = new URLSearchParams({
    key: API_KEY,
    q: searchQuery,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: true,
    page: pageNew,
    per_page: 40,
  });

  return await axios.get(`${BASE_URL}?${params}`);
}

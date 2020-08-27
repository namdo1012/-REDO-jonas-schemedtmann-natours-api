// TO MAKE THE MAP APPEAR YOU MUST
// ADD YOUR ACCESS TOKEN FROM
// https://account.mapbox.com
mapboxgl.accessToken =
  'pk.eyJ1IjoibmF0b3Vyc25hbWRvIiwiYSI6ImNrZWNtMWxzcTA4emcyeHM0cjJnbGl6OHYifQ.0OE-7jXO0gLX__3maO4hgw';
var map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/streets-v11',
});

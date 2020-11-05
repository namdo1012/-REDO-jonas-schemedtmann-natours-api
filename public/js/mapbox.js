// TO MAKE THE MAP APPEAR YOU MUST
// ADD YOUR ACCESS TOKEN FROM
// https://account.mapbox.com
// mapboxgl.accessToken =
//   'pk.eyJ1IjoibmF0b3Vyc25hbWRvIiwiYSI6ImNrZWRsZ3BlcjB0eTIyc21pbXhtaThmc3AifQ.MMh4VhJtH0mRo9bP9PfhPQ';
// var map = new mapboxgl.Map({
//   container: 'map',
//   style: 'mapbox://styles/mapbox/streets-v11',
// });

import mapboxgl from './../node_modules/mapbox-gl/dist/mapbox-gl-csp';

mapboxgl.accessToken =
  'pk.eyJ1IjoibmF0b3Vyc25hbWRvIiwiYSI6ImNrZWRsZ3BlcjB0eTIyc21pbXhtaThmc3AifQ.MMh4VhJtH0mRo9bP9PfhPQ';
var map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/streets-v11',
});

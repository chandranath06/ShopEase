// Central place to configure the backend API base URL.
// Change this one value when deploying the backend somewhere other than localhost.
const API_BASE_URL = window.location.origin.includes('localhost') || window.location.origin.includes('127.0.0.1')
  ? 'http://localhost:5000/api'
  : `${window.location.origin}/api`;

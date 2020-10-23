import axios from 'axios';

axios.defaults.timeout = 10000;
// axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
axios.defaults.headers.put['Content-Type'] = 'application/json';
axios.defaults.headers.post['Content-Type'] = 'application/json';
// axios.defaults.baseURL = 'http://10.10.8.21:26104/api';
axios.defaults.baseURL = 'http://localhost:3000/api';

export {
  axios
}
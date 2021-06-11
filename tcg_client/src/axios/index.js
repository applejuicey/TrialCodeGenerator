import axios from 'axios';

axios.defaults.timeout = 10000;
// axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
axios.defaults.headers.put['Content-Type'] = 'application/json';
axios.defaults.headers.post['Content-Type'] = 'application/json';
// axios.defaults.baseURL = 'http://172.16.10.23:3000/api';
axios.defaults.baseURL = 'http://localhost:3000/api';

export {
  axios
}
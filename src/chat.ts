import axios from 'axios';

let baseURL;

const axiosCC = axios.create({
  baseURL: baseURL,
  withCredentials: true,
});


export function setBaseUrl(url: string) {
  baseURL = url;
  axiosCC.defaults.baseURL = url;
}

export default axiosCC;

import axios from 'axios';

const baseInstance = axios.create({
    baseURL: 'https://my-burger-df13e.firebaseio.com/'
});

export default baseInstance;
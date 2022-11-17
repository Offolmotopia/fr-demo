import axios from 'axios';
import contact from "@/api/contact";

const config = {
    baseURL: 'http://localhost:8000/api/',
    headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
    },
};

const Http = axios.create(config)

// allows for modular api extension
export default { contact: contact(Http) };
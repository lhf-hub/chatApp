import axios from "axios";

export const httpRq = axios.create({

    baseURL: 'http://192.168.5.149:8080/chatApp/',

    headers: { 'X-Requested-With': 'XMLHttpRequest' },

    timeout: 10000,

    responseType: 'json',

    responseEncoding: 'utf8',
});
'use client'

import axios, { AxiosResponse, HttpStatusCode } from 'axios';
//import { cookies } from 'next/headers';
import {useRouter} from 'next/navigation';

export const fetchWrapper = {
    get,
    post,
    put,
    patch,
    delete: _delete
};

function get(url: string) {
    return axios.get(url, { 
        withCredentials: true,
        headers: authHeader(url) 
    }).then(handleResponse);
}

function post(url: string, body: any | undefined) {
    return axios.post(url, body, { 
        withCredentials: true,
        headers: { 'Content-Type': 'application/json', ...authHeader(url) } 
    }).then(handleResponse);
}

function put(url: string, body: any | undefined) {
    return axios.put(url, body, { 
        withCredentials: true,
        headers: { 'Content-Type': 'application/json', ...authHeader(url) } 
    }).then(handleResponse);
}

function patch(url: string, body: any | undefined) {
    return axios.patch(url, body, { 
        withCredentials: true,
        headers: { 'Content-Type': 'application/json', ...authHeader(url) } 
    }).then(handleResponse);
}

// prefixed with underscored because delete is a reserved word in javascript
function _delete(url: string) {
    return axios.delete(url, { 
        withCredentials: true,
        headers: authHeader(url) 
    }).then(handleResponse);
}

// helper functions

function authHeader(url: string) {

    return {}
    // return auth header with jwt if user is logged in and request is to the api url
    //const user = JSON.parse(localStorage.getItem('user')!);
    // const cookieStore = cookies();
    // if (!cookieStore.has('JWT_AUTH')) 
    //     return {};

    // const token = cookieStore.get('JWT_AUTH')?.value;
    // if(!token)
    //     return {};

    // return { Authorization: `Bearer ${token}` };
}

function handleResponse(response: AxiosResponse) {
    const data = response && response.data;
    const router = useRouter();
    if (response.status!==HttpStatusCode.Ok) {
        if ([401, 403].includes(response.status)) {
            // auto logout if 401 Unauthorized or 403 Forbidden response returned from api
            router.push('/login');
        }

        const error = (data && data.message) || response.statusText;
        return Promise.reject(error);
    }
    return data;
}
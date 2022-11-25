import { SECURE } from "@routes/api/v1";
import { AUTH, AUTH_SIGNIN } from "@routes/space";
import axios, { AxiosInstance } from "axios";
import Router from "next/router";
import Session from "supertokens-auth-react/recipe/session";

const instance: AxiosInstance = axios.create({ baseURL: process.env.NEXT_PUBLIC_API_HOST ? process.env.NEXT_PUBLIC_API_HOST + "/v1" : "" });
Session.addAxiosInterceptors(instance);
if (typeof window === 'undefined') {
    instance.interceptors.response.use((response) => {
        console.log(response)
        return response;
    }, (error) => {
        console.log(error)
        if (error.status == 401 && !Router.asPath.startsWith(AUTH)) {
            Router.push(AUTH_SIGNIN);
        };
        return Promise.reject(error);
    });
    instance.interceptors.request.use((request) => {
        Session.doesSessionExist().then((loggedIn) => {
            if (!loggedIn && request.url?.startsWith(SECURE) && !Router.asPath.startsWith(AUTH)) {
                Router.push(AUTH_SIGNIN);
            };
        });
    });
}

export function useApi(): [AxiosInstance, string] {
    const apiHost: string = process.env.NEXT_PUBLIC_API_HOST ? process.env.NEXT_PUBLIC_API_HOST : "";
    return [instance, apiHost.replace(/(^\w+:|^)\/\//, '')];
}
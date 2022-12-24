import { SECURE, V1 } from "@routes/api/v1";
import { AUTH, AUTH_SIGNIN, ROOT } from "@routes/space";
import axios, { AxiosInstance } from "axios";
import Router from "next/router";

const instance: AxiosInstance = axios.create({ baseURL: process.env.NEXT_PUBLIC_API_HOST ? process.env.NEXT_PUBLIC_API_HOST + V1 : "", withCredentials: true });
instance.interceptors.response.use(
    (r) => r,
    (error) => {
        if (!error.response) {
            return Promise.resolve(error);
        }
        if (error.response.status === 401) {
            if (!Router.asPath.startsWith(AUTH) && Router.asPath != ROOT) {
                Router.push(AUTH_SIGNIN);
            }
            return Promise.resolve(error);
        };
        return Promise.reject(error);
    }
);

export function useApi(): [AxiosInstance, string] {
    const apiHost: string = process.env.NEXT_PUBLIC_API_HOST ? process.env.NEXT_PUBLIC_API_HOST : "";
    return [instance, apiHost.replace(/(^\w+:|^)\/\//, '')];
}

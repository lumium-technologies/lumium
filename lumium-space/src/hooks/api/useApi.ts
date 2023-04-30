import { V1 } from "@routes/api/v1";
import { AUTH, AUTH_SIGNIN, ROOT } from "@routes/space";
import axios, { AxiosInstance } from "axios";
import Router from "next/router";
import { get_x_lumium_session_header as s } from 'lumium-renderer';

const instance: AxiosInstance = axios.create({ baseURL: process.env.NEXT_PUBLIC_API_HOST ? process.env.NEXT_PUBLIC_API_HOST + V1 : "" });

instance.interceptors.request.use((r) => {
    const session = localStorage.getItem(s());
    if (session) {
        r.headers[s()] = session;
    }
    return r;
});

instance.interceptors.response.use(
    (r) => {
        if (r.headers[s()]) {
            localStorage.setItem(s(), r.headers[s()])
        }
        return r;
    },
    (error) => {
        if (!error.response) {
            return Promise.reject(error);
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

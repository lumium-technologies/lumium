import axios, { AxiosInstance } from "axios";
import Session from "supertokens-auth-react/recipe/session";

const instance: AxiosInstance = axios.create({baseURL: process.env.NEXT_PUBLIC_API_HOST ? process.env.NEXT_PUBLIC_API_HOST + "/v1" : ""});
Session.addAxiosInterceptors(instance);

export function useApi(): [AxiosInstance, string] {
    const apiHost: string = process.env.NEXT_PUBLIC_API_HOST ? process.env.NEXT_PUBLIC_API_HOST : "";
    return [instance, apiHost.replace(/(^\w+:|^)\/\//, '')];
}

import { useAppStore } from "../cray-widget/store";
import axios from "axios";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { ENV } from "../cray-widget/env";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function prettifyAddress(hash: string = "") {
  return hash.substr(0, 6) + "..." + hash.substr(-4);
}
export const HIDE = (condition: boolean) => ({
  ...(condition && { hidden: true }),
});
export const SHOW = (condition?: boolean) => ({
  ...(!condition && { hidden: true }),
});
export const _sleep = (ms: number) =>
  new Promise((resolve) => setTimeout(() => resolve(true), ms));
export const xhr = axios.create({
  baseURL: ENV.VITE_API_HOST,
});
xhr.interceptors.request.use(
  function (config: any) {
    config.headers.apikey = useAppStore.getState().apikey;
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);
//
xhr.interceptors.request.use(
  function (config: any) {
    config.headers.testnet = JSON.stringify(!!useAppStore.getState().testnet);
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);
export function isValidNumber(n: any) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}

export const secondsToHours = (d) => {
  d = Number(d);
  var h = Math.floor(d / 3600);
  var m = Math.floor((d % 3600) / 60);
  var s = Math.floor((d % 3600) % 60);

  var hDisplay = h > 0 ? h + ":" : "";
  var mDisplay = m > 0 ? m + ":" : "";
  var sDisplay = s > 0 ? s + "" : "";
  return hDisplay + mDisplay + sDisplay;
};

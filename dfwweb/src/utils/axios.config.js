

import axios from "axios";
import { getLocalStorageData } from "./local-storage";

// Create axios instance function
const axiosInstance = (token = "") => {
    try {
        const instance = axios.create({
            baseURL: import.meta.env.VITE_BASE_URL,
        });

        instance.interceptors.request.use(
            (config) => {
                const userToken = getLocalStorageData("userData")?.authToken;
                if (userToken) {
                    config.headers.Authorization = `Bearer ${userToken}`;
                }
                return config;
            },
            (error) => Promise.reject(error)
        );

        instance.interceptors.response.use(

            response => response,
            error => {
                const errMsg = error.response?.data?.message;

                if (error.response?.status == 401) {

                    if (
                        errMsg === "account is blocked" ||
                        errMsg === "user not found"
                    ) {
                        localStorage.removeItem("userData");
                        window.location.href = "/";
                    } else if (errMsg == "Logged in from another device") {
                        localStorage.removeItem("userData");
                        window.location.href = "/";
                    }
                }

                return Promise.reject(error);
            }
        );

        return instance;
    } catch (error) {
        // console.error("Error creating axios instance:", error);
        return null;
    }
};

export { axiosInstance };

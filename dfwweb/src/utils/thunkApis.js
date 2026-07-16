import { createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance } from "./axios.config";

const AxiosInstance = axiosInstance();

//admin details
export const get_admin_details = createAsyncThunk("fetch/get_admin_details",
    async () => {
        try {
            const response = await AxiosInstance.get(`/user/admin_details`);
            return response?.data?.body;
        } catch (error) {
            // console.log(error)
            throw error
        }
    }
);
//user details
export const get_user_by_id = createAsyncThunk("fetch/get_user_by_id",
    async (id) => {
        try {
            const response = await AxiosInstance.get(`/user/profile_details/${id}`);
            return response?.data?.body;
        } catch (error) {
            // console.log(error)
            throw error
        }
    }
);

//cms
export const get_cms = createAsyncThunk("fetch/get_cms",
    async (type) => {
        try {
            const response = await AxiosInstance.get(`/user/getCms/${type}`);
            return response?.data?.body;
        } catch (error) {
            // console.log(error)
            throw error
        }
    }
);

//dashboard_content
export const get_dashboard_content = createAsyncThunk("fetch/get_dashboard_content",
    async () => {
        try {
            const response = await AxiosInstance.get(`/user/get_dashboard_content`);
            return response?.data?.body;
        } catch (error) {
            // console.log(error)
            throw error
        }
    }
);

//address
export const get_address_list = createAsyncThunk("fetch/get_address_list",
    async () => {
        try {
            const response = await AxiosInstance.get(`/user/address_list`);
            return response?.data?.body;
        } catch (error) {
            // console.log(error)
            throw error
        }
    }
);
export const get_address_details = createAsyncThunk("fetch/get_address_details",
    async (id) => {
        try {
            const response = await AxiosInstance.get(`/user/address_details/${id}`);
            return response?.data?.body;
        } catch (error) {
            // console.log(error)
            throw error
        }
    }
);


//service
export const get_service_list = createAsyncThunk("fetch/get_service_list",
    async () => {
        try {
            const response = await AxiosInstance.get(`/user/service_list`);
            return response?.data?.body;
        } catch (error) {
            // console.log(error)
            throw error
        }
    }
);

//service_type
export const get_service_type_list = createAsyncThunk("fetch/get_service_type_list",
    async (service_id) => {
        try {
            const response = await AxiosInstance.get(`/user/service_type_list/${service_id}`);
            return response?.data?.body;
        } catch (error) {
            // console.log(error)
            throw error
        }
    }
);


//orders
export const get_orders = createAsyncThunk("fetch/get_orders",
    async ({ currentPage, status }) => {
        try {
            const response = await AxiosInstance.get(`/user/order_list?page=${currentPage}&limit=${10}&status=${status}`);
            return response?.data?.body;
        } catch (error) {
            // console.log(error)
            throw error
        }
    }
);

export const get_order_details = createAsyncThunk("fetch/get_order_details",
    async (id) => {
        try {
            const response = await AxiosInstance.get(`/user/order_details/${id}`);
            return response?.data?.body;
        } catch (error) {
            // console.log(error)
            throw error
        }
    }
);

//notification
export const get_notifications = createAsyncThunk(
    "fetch/get_notifications",
    async ({ currentPage, limit }) => {
        try {
            const response = await AxiosInstance.get(
                `/user/notification_list?page=${currentPage}&limit=${limit}`
            );

            return {
                list: response?.data?.body?.data || [],    // <-- FIX
                total: response?.data?.body?.total || 0,   // <-- FIX
                page: currentPage,
                limit
            };
        } catch (error) {
            // console.log("Notification fetch error:", error);
            throw error
        }
    }
);


export const get_unread_notification_count = createAsyncThunk("fetch/get_unread_notification_count",
    async () => {
        try {
            const response = await AxiosInstance.get(`/user/unread_notification_count`);
            return response?.data?.body;
        } catch (error) {
            // console.log(error)
            throw error
        }
    }
);

export const get_delivery_charges = createAsyncThunk("fetch/get_delivery_charges",
    async () => {
        try {
            const response = await AxiosInstance.get(`/user/get_delivery_charges`);
            return response?.data?.body;
        } catch (error) {
            // console.log(error)
            throw error
        }
    }
);




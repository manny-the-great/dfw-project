import { createAsyncThunk } from "@reduxjs/toolkit";
import apiInstance from "../utils/apiInstance";


export const get_user_by_id = createAsyncThunk("fetch/get_user_by_id",
    async (id) => {
        try {
            const response = await apiInstance.get(`/adminProfile/${id}`);
            return response?.data;
        } catch (error) {
            // console.log(error)
        }
    }
);
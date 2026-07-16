import { createSlice } from "@reduxjs/toolkit";
import { get_user_by_id, get_orders, get_order_details, get_service_list, get_service_type_list, get_address_details, get_address_list, get_cms, get_dashboard_content, get_notifications, get_unread_notification_count, get_admin_details, get_delivery_charges } from "../../utils/thunkApis";

const initialState = {
    user: {},
    adminDetails: {},
    cms: {},
    addressList: [],
    addressDetails: {},
    serviceList: [],
    serviceTypeList: [],
    orders: [],
    orderDetails: {},
    dashboardContent: {},
    notificationList: [],
    unread_notification_count: 0,
    deliveryCharges:[],
}

const userSlice = createSlice({
    name: 'users',
    initialState,

    reducers: {
        clearUser(state) {
            state.user = {};
            state.addressList = [];
            state.addressDetails = {};
        }
    },
    extraReducers: (builder) => {
        builder.addCase(get_user_by_id.fulfilled, (state, action) => {
            state.user = action.payload;
        })
        builder.addCase(get_admin_details.fulfilled, (state, action) => {
            state.adminDetails = action.payload;
        })
        builder.addCase(get_cms.fulfilled, (state, action) => {
            state.cms = action.payload;
        })
        builder.addCase(get_dashboard_content.fulfilled, (state, action) => {
            state.dashboardContent = action.payload;
        })
        builder.addCase(get_address_list.fulfilled, (state, action) => {
            state.addressList = action.payload;
        })
        builder.addCase(get_address_details.fulfilled, (state, action) => {
            state.addressDetails = action.payload;
        })
        builder.addCase(get_service_list.fulfilled, (state, action) => {
            state.serviceList = action.payload;
        })
        builder.addCase(get_service_type_list.fulfilled, (state, action) => {
            state.serviceTypeList = action.payload;
        })
        builder.addCase(get_orders.fulfilled, (state, action) => {
            state.orders = action.payload;
        })
        builder.addCase(get_order_details.fulfilled, (state, action) => {
            state.orderDetails = action.payload;
        })

        builder.addCase(get_delivery_charges.fulfilled, (state, action) => {
            state.deliveryCharges = action.payload;
        })

        builder.addCase(get_unread_notification_count.fulfilled, (state, action) => {
            state.unread_notification_count = action.payload;
        })
        builder.addCase(get_notifications.fulfilled, (state, action) => {
            const { list, page } = action.payload;

            if (page === 1) {
                state.notificationList = list;      // first load
            } else {
                state.notificationList = [...state.notificationList, ...list]; // append for infinite scroll
            }
        });

    }
});

export const { clearUser } = userSlice.actions;

export default userSlice.reducer;






import { createSlice } from "@reduxjs/toolkit";
import { get_user_by_id } from "../../utils/thunkApis";

const initialState = {
    user: {},
}

const userSlice = createSlice({
    name: 'users',
    initialState,
    reducers: {
    },
    extraReducers: (builder) => {
        builder.addCase(get_user_by_id.fulfilled, (state, action) => {
            state.user = action.payload;
        })

    }
});

export const { updateEscortStatusLocally } = userSlice.actions;

export default userSlice.reducer;






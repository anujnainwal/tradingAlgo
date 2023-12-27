import { createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosInstance } from "../../config/axiosInstance";



export const userLogin = createAsyncThunk(
  "/user/login",
  async (data, { rejectWithValue }) => {
    try {
      const response = await AxiosInstance.post(
        "http://localhost:9000/api/v1/login",
        data
      );
      localStorage.setItem("accesstoken", response.data.accessToken);
      localStorage.setItem("refreshtoken", response.data.refreshToken);
      localStorage.setItem("userid", response.data.userInfo._id);

      return response.data;
    } catch (error) {
      return rejectWithValue(error?.response.data);
    }
  }
);

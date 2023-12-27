import { createSlice } from "@reduxjs/toolkit";
// import { userLogin, userStatus } from "./userThunk";

const initialState = {
   
    backTestForm: [],
  };
  
  const backTestSlice = createSlice({
    name: "backTest",
    initialState,
    reducers: {
      formValue: (state, action) => {
     
        state.backTestForm = action;
      },
    },
  });
  
  export const { reducer } = backTestSlice;
  export const { formValue } = backTestSlice.actions; 
  export default backTestSlice.reducer;
  
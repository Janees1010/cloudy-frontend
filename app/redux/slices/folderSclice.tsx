import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ChildrenType } from "@/app/(drive)/drive/page";


interface initialStateType {
  parentId: string;
  childrens: ChildrenType[];
}

const initialState: initialStateType = {
  parentId: "",
  childrens: [],
};

const folderSlice = createSlice({
  name: "folderSlice",
  initialState: initialState,
  reducers: {
    addChildren: (state, action) => {
      state.parentId = action.payload.parentId;
      state.childrens = action.payload.childrens;
    },
    updateChildren: (state, action) => {
      state.childrens.push(action.payload);
    },
    updatParentId:(state,action)=>{
        state.parentId = action.payload.parentId
    },
    removeChildren:(state,action)=>{
      state.childrens = state.childrens.filter((child)=> child._id != action.payload.id)
    }
  },
});

export const { addChildren, updateChildren,removeChildren,updatParentId } = folderSlice.actions;
export default folderSlice.reducer;

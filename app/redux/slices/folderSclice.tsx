import {createSlice,PayloadAction} from "@reduxjs/toolkit"
import { ChildrenType } from "@/app/(drive)/drive/page"
import { userSlice } from "./userSlices"

interface initialStateType {
  parentId:string,
  childrens:ChildrenType[]
}

const initialState:initialStateType = {
    parentId:"",
    childrens:[]
}

const folderSlice = createSlice({
    name:"folderSlice",
    initialState:initialState,
    reducers:{
         addChildren:(state,action)=>{
            state.parentId = action.payload.parentId
            state.childrens = action.payload.childrens
         },
         updateChildren:(state,action)=>{
            state.childrens.push(action.payload)
         }
    }
})

export const {addChildren,updateChildren} =  folderSlice.actions
export default folderSlice.reducer

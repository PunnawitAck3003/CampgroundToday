import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { ReservationItem } from "../../../interfaces"

type CartState = {
    campgroundItems: ReservationItem[]
}

const initialState:CartState = {campgroundItems:[]}

export const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers:{
        addReservation: (state, action:PayloadAction<ReservationItem>)=>{
            state.campgroundItems.push(action.payload)
        },
        removeReservation:(state, action:PayloadAction<ReservationItem>) =>{
            const remainItems = state.campgroundItems.filter(obj=>{
                return ( (obj.campgroundName!==action.payload.campgroundName) || (obj.bookingDate!==action.payload.bookingDate) || (obj.checkoutDate!==action.payload.checkoutDate));
            })
            state.campgroundItems = remainItems
        }
    }
})

export const { addReservation, removeReservation } = cartSlice.actions
export default cartSlice.reducer
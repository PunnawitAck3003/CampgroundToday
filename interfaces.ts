export interface ReservationItem{
  camgroundId: string
  campgroundName: string
  user: number
  numOfDays: number
  bookingDate: string
  checkoutDate: string 
}

export interface CampgroundItem {
  _id: string
  name: string
  address: string
  district: string
  province: string
  postalcode: string
  tel: string
  picture: string
  __v: number
  id: string
}

export interface CampgroundJson {
  success: boolean
  count: number
  pagination: Object
  data: CampgroundItem[]
}

// export interface ReservationItem{
//     carId: string
//     carModel: string
//     numOfDays: number
//     pickupDate: string
//     pickupLocation: string
//     returnDate: string
//     returnLocation: string
// }
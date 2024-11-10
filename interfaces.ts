export interface ReservationItem{
  campgroundId: string
  campgroundName: string
  user: string
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

export interface CampgroundFromBooking{
  _id: string
  name: string
  address: string
  tel: string
  id: string
}

export interface BookingItem{
  _id: string
  bookingDate: string
  checkoutDate: string
  user: string
  campground: CampgroundFromBooking
  createdAt: string
  __v: number
}

export interface AllBookingJson{
  success: boolean
  count: number
  data: BookingItem[]
}

export interface UserProfile {
  _id: string;
  name: string;
  email: string;
  tel: string;
  role: string;
  createdAt: string;
  __v: number;
}

export interface UserProfileResponse {
  success: boolean;
  data: UserProfile;
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
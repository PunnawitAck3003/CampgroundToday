/*
// ClientReservationCart.tsx
import { useState, useCallback } from "react"
import { BookingItem, UserProfile } from "../../interfaces"
import BookingItemCard from "./BookingItemCard" // Import the card component

type Props = {
  bookings: BookingItem[]
  userProfile: UserProfile
}

const ClientReservationCart = ({ bookings, userProfile }: Props) => {
  const [editing, setEditing] = useState<{ [key: string]: boolean }>({})
  const [tempBookingDates, setTempBookingDates] = useState<{ [key: string]: { bookingDate: string; checkoutDate: string } }>({})

  const handleDelete = useCallback(async (bookingId: string) => {
    // Handle delete logic here
  }, [])

  const handleUpdate = useCallback(async (bookingId: string) => {
    // Handle update logic here
  }, [tempBookingDates])

  const startEditing = (bookingId: string, isEditing: boolean) => {
    // Set the state for editing
    setEditing((prev) => ({ ...prev, [bookingId]: isEditing }))
  }

  const handleDateChange = (bookingId: string, dateType: "bookingDate" | "checkoutDate", value: string) => {
    setTempBookingDates((prev) => ({
      ...prev,
      [bookingId]: {
        ...prev[bookingId],
        [dateType]: value,
      },
    }))
  }

  return (
    <div>
      {userProfile && bookings.map((reservationItem) => (
        <BookingItemCard
          key={reservationItem._id}
          reservationItem={reservationItem}
          userProfile={userProfile}
          editing={editing}
          tempBookingDates={tempBookingDates}
          startEditing={startEditing}
          handleUpdate={handleUpdate}
          handleDelete={handleDelete}
          handleDateChange={handleDateChange}
        />
      ))}
    </div>
  )
}

export default ClientReservationCart
*/
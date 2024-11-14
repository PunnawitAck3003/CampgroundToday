/*
// ReservationCartServer.tsx
import { GetServerSideProps } from "next"
import { AllBookingJson, BookingItem, UserProfile } from "../../interfaces"
import ClientReservationCart from "./ClientReservationCart"
import getBookings from "@/libs/getBookings"
import getUserProfile from "@/libs/getUserProfile"

type Props = {
  bookings: BookingItem[]
  userProfile: UserProfile
  error: string | null
}

export default function ReservationCartServer({ bookings, userProfile, error }: Props) => {
  if (error) return <div>{error}</div>

  return (
    <ClientReservationCart
      bookings={bookings}
      userProfile={userProfile}
    />
  )
}

// Server-side data fetching
export const getServerSideProps: GetServerSideProps = async (context) => {
  //const session = context.req.cookies.session // Or use session management logic
  const { data: session } = useSession()
  if (!session?.user?.token) {
    return {
      props: {
        bookings: [],
        userProfile: null,
        error: "You must be logged in to view bookings"
      }
    }
  }

  try {
    const bookingsData: AllBookingJson = await getBookings(session.user.token)
    const profileData = await getUserProfile(session.user.token)

    const filteredBookings = profileData.data.role === "admin"
      ? bookingsData.data
      : bookingsData.data.filter((item) => item.user === profileData.data._id)

    return {
      props: {
        bookings: filteredBookings,
        userProfile: profileData.data,
        error: null
      }
    }
  } catch (error) {
    console.error("Error fetching bookings or user profile:", error)
    return {
      props: {
        bookings: [],
        userProfile: null,
        error: "Failed to fetch bookings or user profile"
      }
    }
  }
}
*/


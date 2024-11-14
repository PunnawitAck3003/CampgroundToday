"use client"
import { useEffect, useState, useCallback, useMemo } from "react"
import { useSession } from "next-auth/react"
import { AllBookingJson, BookingItem, UserProfile } from "../../interfaces"
import getBookings from "@/libs/getBookings"
import getUserProfile from "@/libs/getUserProfile"
import deleteBooking from "@/libs/deleteBooking"
import updateBooking from "@/libs/updateBooking"
import dayjs, { Dayjs } from "dayjs"
import BookingItemCard from "./BookingItemCard"

export default function ReservationCart() {
    const { data: session } = useSession()
    const [bookings, setBookings] = useState<BookingItem[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
    const [editing, setEditing] = useState<{ [key: string]: boolean }>({})
    const [tempBookingDates, setTempBookingDates] = useState<{ [key: string]: { bookingDate: Dayjs; checkoutDate: Dayjs } }>({})

    useEffect(() => {
        const fetchBookingsAndUser = async () => {
            if (session?.user?.token) {
                try {
                    setLoading(true)
                    const bookingsData: AllBookingJson = await getBookings(session.user.token)
                    const profileData = await getUserProfile(session.user.token)

                    setUserProfile(profileData.data)

                    const filteredBookings = profileData.data.role === "admin"
                        ? bookingsData.data
                        : bookingsData.data.filter((item) => item.user === profileData.data._id)

                    setBookings(filteredBookings)
                } catch (error) {
                    console.error("Error fetching bookings or user profile:", error)
                    setError("Failed to fetch bookings or user profile")
                } finally {
                    setLoading(false)
                }
            } else {
                setError("You must be logged in to view bookings")
                setLoading(false)
            }
        }

        fetchBookingsAndUser()
    }, [session])

    const handleDelete = useCallback(async (bookingId: string) => {
        const confirmed = window.confirm("Are you sure you want to delete this booking?");
        if(confirmed){
            if (!session?.user?.token) return
            try {
                await deleteBooking(session.user.token, bookingId)
                setBookings((prevBookings) => prevBookings.filter((item) => item._id !== bookingId))
            } catch (error) {
                console.error("Error deleting booking:", error)
                setError("Failed to delete booking")
            }
            console.log("delete booking")
        }
        
    }, [session?.user?.token])

    const handleUpdate = useCallback(async (bookingId: string) => {
        if (!session?.user?.token || !tempBookingDates[bookingId]) return
        const { bookingDate, checkoutDate } = tempBookingDates[bookingId]
        const createdAt = dayjs().format("YYYY-MM-DD")

        try {
            await updateBooking(
                session.user.token,
                bookingId,
                bookingDate.format("YYYY-MM-DD"),
                checkoutDate.format("YYYY-MM-DD"),
                createdAt
            )
            setBookings((prevBookings) =>
                prevBookings.map((item) =>
                    item._id === bookingId ? { ...item, bookingDate: bookingDate.toISOString(), checkoutDate: checkoutDate.toISOString() } : item
                )
            )
            setEditing((prevEditing) => ({ ...prevEditing, [bookingId]: false }))
        } catch (error) {
            console.error("Error updating booking:", error)
            setError("Failed to update booking")
        }
    }, [session?.user?.token, tempBookingDates])

    const startEditing = (bookingId: string, isEditing: boolean) => {
        if (isEditing) {
            const bookingItem = bookings.find((item) => item._id === bookingId)
            if (bookingItem) {
                setTempBookingDates({
                    ...tempBookingDates,
                    [bookingId]: {
                        bookingDate: dayjs(bookingItem.bookingDate),
                        checkoutDate: dayjs(bookingItem.checkoutDate),
                    },
                })
            }
        }
        setEditing((prevEditing) => ({ ...prevEditing, [bookingId]: isEditing }))
    }

    const handleDateChange = (bookingId: string, dateType: "bookingDate" | "checkoutDate", value: Dayjs) => {
        setTempBookingDates((prev) => ({
            ...prev,
            [bookingId]: {
                ...prev[bookingId],
                [dateType]: value,
            },
        }))
    }

    if (loading) return <div>Loading...</div>
    if (error) return <div>{error}</div>

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

"use client"
import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { AllBookingJson, BookingItem, UserProfile, CampgroundJson, CampgroundItem  } from "../../interfaces"
import getBookings from "@/libs/getBookings"
import getCampgrounds from "@/libs/getCampgrounds"
import getUserProfile from "@/libs/getUserProfile"
import deleteBooking from "@/libs/deleteBooking"
import updateBooking from "@/libs/updateBooking"
import dayjs, { Dayjs } from "dayjs"

export default function ReservationCart() {
    const { data: session } = useSession()
    const [bookings, setBookings] = useState<BookingItem[]>([])
    const [campgrounds, setCampgrounds] = useState<CampgroundItem[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
    const [editing, setEditing] = useState<{ [key: string]: boolean }>({})
    const [tempBookingDates, setTempBookingDates] = useState<{ [key: string]: { bookingDate: Dayjs; checkoutDate: Dayjs } }>({})
    const [searchTermName, setSearchTermName] = useState('')
    const [searchTermUserID, setSearchTermUserID] = useState("")
    // const [searchTermStartDate, setsearchTermStartDate] = useState<Dayjs|null>(null);
    // const [searchTermEndDate, setsearchTermEndDate] = useState<Dayjs|null>(null);

    useEffect(() => {
        const fetchBookingsAndUser = async () => {
            if (session?.user?.token) {
                try {
                    setLoading(true)
                    const bookingsData: AllBookingJson = await getBookings(session.user.token)
                    const profileData = await getUserProfile(session.user.token)
                    setUserProfile(profileData.data)
                    const campgroundData: CampgroundJson = await getCampgrounds()
                    setCampgrounds(campgroundData.data)

                    // Filter bookings for non-admins to only show the user's own bookings
                    const filteredBookings = profileData.data.role === "admin"
                        ? bookingsData.data
                        : bookingsData.data.filter((item) => item.user === profileData.data._id)
                    setBookings(filteredBookings)
                    
                    // Filter campground for to only show the user's own bookings
                    // const userCampground = campgrounds.filter((item) => item._id === profileData.data._id)
                    // setCampgrounds(userCampground)
                    
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

    const handleDelete = async (bookingId: string) => {
        const confirmed = window.confirm("Are you sure you want to delete this booking?");
        if(confirmed){
            if (!session?.user?.token) return
            try {
                await deleteBooking(session.user.token, bookingId)
                setBookings(bookings.filter((item) => item._id !== bookingId))
            } catch (error) {
                console.error("Error deleting booking:", error)
                setError("Failed to delete booking")
            }
        }
        
    }

    const handleUpdate = async (bookingId: string) => {
        const confirmed = window.confirm("Are you sure you want to update this booking?");
        if(confirmed){
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
                setBookings(
                    bookings.map((item) =>
                        item._id === bookingId ? { ...item, bookingDate: bookingDate.toISOString(), checkoutDate: checkoutDate.toISOString() } : item
                    )
                )
                setEditing({ ...editing, [bookingId]: false })
            } catch (error) {
                console.error("Error updating booking:", error)
                setError("Failed to update booking")
            }
        } 
    }

    const startEditing = (bookingId: string) => {
        const bookingItem = bookings.find((item) => item._id === bookingId)
        if (bookingItem) {
            setTempBookingDates({
                ...tempBookingDates,
                [bookingId]: {
                    bookingDate: dayjs(bookingItem.bookingDate),
                    checkoutDate: dayjs(bookingItem.checkoutDate),
                },
            })
            setEditing({ ...editing, [bookingId]: true })
        }
    }

    const handleDateChange = (bookingId: string, dateType: "bookingDate" | "checkoutDate", value: Dayjs) => {
        setTempBookingDates({
            ...tempBookingDates,
            [bookingId]: {
                ...tempBookingDates[bookingId],
                [dateType]: value,
            },
        })
    }

    const reservationItemForCurrentUser = bookings.filter(userBooking => {
        if ((searchTermName === "") && (searchTermUserID === "")) {
            return true;
        } 
        else if (userProfile?.role === "user") {
            const matchName = userBooking.campground.name.toLowerCase().includes(searchTermName.toLowerCase());
            return matchName;
        }
        else if (userProfile?.role === "admin") {
            const matchName = userBooking.campground.name.toLowerCase().includes(searchTermName.toLowerCase());
            const matchUserID = userBooking.user.toLowerCase().includes(searchTermUserID.toLowerCase());
            return matchName && matchUserID;
        }
    });

    if (loading) return <div className="flex justify-center items-center h-64 text-lg font-semibold text-blue-600 animate-pulse">Loading reservations...</div>
    if (error) return <div className="flex justify-center items-center h-64 text-lg font-semibold text-red-600 animate-pulse">{error}</div>

    return (
        <>
            <div className="flex flex-wrap justify-center space-x-4 space-y-4 md:space-y-0">
                <input
                    type="text"
                    placeholder="Search by Campground Name."
                    value={searchTermName}
                    onChange={(e) => setSearchTermName(e.target.value)}
                    className="search-input p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-64"
                />
                {
                    userProfile?.role === "admin" && (
                    <input
                        type="text"
                        placeholder="Search by User ID."
                        value={searchTermUserID}
                        onChange={(e) => setSearchTermUserID(e.target.value)}
                        className="search-input p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-64"
                    />
                    )
                }
            </div>
            {reservationItemForCurrentUser.map((reservationItem) => {
                const bookingDate = dayjs(reservationItem.bookingDate).format("YYYY-MM-DD")
                const checkoutDate = dayjs(reservationItem.checkoutDate).format("YYYY-MM-DD")
                const durationInDays = Math.ceil(dayjs(reservationItem.checkoutDate).diff(dayjs(reservationItem.bookingDate), "day"))

                return (
                    <div className="bg-slate-200 rounded px-5 mx-5 py-2 my-2" key={reservationItem._id}>
                        <div className="text-xl">{reservationItem.campground.name}</div>
                        {
                            userProfile?.role === "admin" && <div className="text-sm">Booked by: {reservationItem.user || "Unknown User"}</div>
                        }
                        
                        <div className="text-sm">Booking Date: {bookingDate}</div>
                        <div className="text-sm">Checkout Date: {checkoutDate}</div>
                        <div className="text-md">Duration: {durationInDays} day(s)</div>
                        {editing[reservationItem._id] ? (
                            <>
                                <input
                                    type="date"
                                    value={tempBookingDates[reservationItem._id].bookingDate.format("YYYY-MM-DD")}
                                    onChange={(e) =>
                                        handleDateChange(reservationItem._id, "bookingDate", dayjs(e.target.value))
                                    }
                                />
                                <input
                                    type="date"
                                    value={tempBookingDates[reservationItem._id].checkoutDate.format("YYYY-MM-DD")}
                                    onChange={(e) =>
                                        handleDateChange(reservationItem._id, "checkoutDate", dayjs(e.target.value))
                                    }
                                />
                                <button
                                    className="block rounded-md bg-green-600 hover:bg-green-700 px-3 py-2 text-white shadow-sm"
                                    onClick={() => handleUpdate(reservationItem._id)}
                                >
                                    Save Changes
                                </button>
                                <button
                                    className="block rounded-md bg-gray-500 hover:bg-gray-600 px-3 py-2 text-white shadow-sm"
                                    onClick={() => setEditing({ ...editing, [reservationItem._id]: false })}
                                >
                                    Cancel
                                </button>
                            </>
                        ) : (
                            <>
                                <button
                                    className="block rounded-md bg-blue-600 hover:bg-blue-700 px-3 py-2 text-white shadow-sm"
                                    onClick={() => startEditing(reservationItem._id)}
                                >
                                    Edit Dates
                                </button>
                                <div className="py-0.5"></div>
                                <button
                                    className="block rounded-md bg-red-600 hover:bg-red-700 px-3 py-2 text-white shadow-sm"
                                    onClick={() => handleDelete(reservationItem._id)}
                                >
                                    Remove from Your Reservations
                                </button>
                            </>
                        )}
                    </div>
                )
            })}
        </>
    )
}

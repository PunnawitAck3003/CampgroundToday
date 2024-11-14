import { BookingItem, UserProfile } from "../../interfaces";
import dayjs, { Dayjs } from "dayjs"

export default function BookingItemCard({ reservationItem, userProfile, editing, tempBookingDates, startEditing, handleUpdate, handleDelete, handleDateChange }
    :{reservationItem:BookingItem, userProfile:UserProfile, editing:{ [key: string]: boolean }, tempBookingDates:{ [key: string]: { bookingDate: Dayjs; checkoutDate: Dayjs } }
, startEditing:Function, handleUpdate:Function, handleDelete:Function, handleDateChange:Function}) {
    const bookingDate = dayjs(reservationItem.bookingDate).format("YYYY-MM-DD")
    const checkoutDate = dayjs(reservationItem.checkoutDate).format("YYYY-MM-DD")
    const durationInDays = Math.ceil(dayjs(reservationItem.checkoutDate).diff(dayjs(reservationItem.bookingDate), "day"))

    return (
        <div className="bg-slate-200 rounded px-5 mx-5 py-2 my-2" key={reservationItem._id}>
            <div className="text-xl">{reservationItem.campground.name}</div>
            {userProfile?.role === "admin" && <div className="text-sm">Booked by: {reservationItem.user || "Unknown User"}</div>}
            <div className="text-sm">Booking Date: {bookingDate}</div>
            <div className="text-sm">Checkout Date: {checkoutDate}</div>
            <div className="text-md">Duration: {durationInDays} day(s)</div>
            {editing[reservationItem._id] ? (
                <>
                    <input
                        type="date"
                        value={tempBookingDates[reservationItem._id].bookingDate.format("YYYY-MM-DD")}
                        onChange={(e) => handleDateChange(reservationItem._id, "bookingDate", dayjs(e.target.value))}
                    />
                    <input
                        type="date"
                        value={tempBookingDates[reservationItem._id].checkoutDate.format("YYYY-MM-DD")}
                        onChange={(e) => handleDateChange(reservationItem._id, "checkoutDate", dayjs(e.target.value))}
                    />
                    <button
                        className="block rounded-md bg-green-600 hover:bg-green-700 px-3 py-2 text-white shadow-sm"
                        onClick={() => handleUpdate(reservationItem._id)}
                    >
                        Save Changes
                    </button>
                    <button
                        className="block rounded-md bg-gray-500 hover:bg-gray-600 px-3 py-2 text-white shadow-sm"
                        onClick={() => startEditing(reservationItem._id, false)}
                    >
                        Cancel
                    </button>
                </>
            ) : (
                <>
                    <button
                        className="block rounded-md bg-blue-600 hover:bg-blue-700 px-3 py-2 text-white shadow-sm"
                        onClick={() => startEditing(reservationItem._id, true)}
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
}
"use client"

import DateReserve from "@/components/DateReserve";
import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import dayjs, { Dayjs } from "dayjs";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { ReservationItem } from "../../../interfaces";
import { addReservation } from "@/redux/features/cartSlice";
import { useSession } from "next-auth/react";
import getUserProfile from "@/libs/getUserProfile";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions"
import { UserProfile, UserProfileResponse } from "../../../interfaces";
import createBooking from "@/libs/createBooking";

export default function Reservations() {
    const { data: session} = useSession();
    const urlParams = useSearchParams()
    const cid = urlParams.get('id')
    const name = urlParams.get('name')
    //const dispatch = useDispatch<AppDispatch>()

    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [bookingDate, setBookingDate] = useState<Dayjs | null>(null)
    const [checkoutDate, setCheckoutDate] = useState<Dayjs | null>(null)

    useEffect(() => {
        const fetchUserProfile = async () => {
            if (session?.user.token) {
                const profileResponse: UserProfileResponse = await getUserProfile(session.user.token);
                //const userProfile = await getUserProfile(session.user.token);
                const userProfile = profileResponse.data
                setProfile(userProfile);
            }
        };

        if (session) {
            fetchUserProfile();
        }
    }, [session]);

    

    const makeReservation = async () => {
        if (cid && name && bookingDate && checkoutDate && profile && session?.user.token) {
            /*const item: ReservationItem = {
                campgroundId: cid,
                campgroundName: name,
                user: profile._id,
                numOfDays: checkoutDate.diff(bookingDate, "day"),
                bookingDate: dayjs(bookingDate).format("YYYY/MM/DD"),
                checkoutDate: dayjs(checkoutDate).format("YYYY/MM/DD")
            }*/
            //dispatch(addReservation(item))
            try {
                const createdAt = dayjs().format("YYYY-MM-DD"); // Assuming you want the current date as the createdAt value
                await createBooking(
                    session.user.token,
                    cid,
                    dayjs(bookingDate).format("YYYY-MM-DD"),
                    dayjs(checkoutDate).format("YYYY-MM-DD"),
                    createdAt
                );
                // Optionally handle success (e.g., show a message, redirect, etc.)
            } catch (error) {
                // Handle error (e.g., show error message)
                console.error("Error making reservation:", error);
            }
        }
    }
    //interserting

    if (!session) {
        return <div>You must be logged in to make a reservation.</div>;
    }

    return (
        <main className="w-[100%] flex flex-col items-center space-y-4">
            <div className="text-xl font-medium">New Reservation</div>
            <div className="text-xl font-medium">Campground: {name}</div>

            <div className="w-fit space-y-2">
                <div className="text-md text-left text-gray-600">Booking Date</div>
                <DateReserve onDateChange={(value: Dayjs) => { setBookingDate(value) }}  />
                <div className="text-md text-left text-gray-600">Checkout Date</div>
                <DateReserve onDateChange={(value: Dayjs) => { setCheckoutDate(value) }}  />
            </div>

            <button className="block rounded-md bg-sky-600 hover:bg-indigo-600 px-3 py-2
            text-white shadow-sm" onClick={makeReservation}>
                Book this Campground
            </button>

        </main>
    );
}

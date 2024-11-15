"use client"

import DateReserve from "@/components/DateReserve";
import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import dayjs, { Dayjs } from "dayjs";
import { useSession } from "next-auth/react";
import getUserProfile from "@/libs/getUserProfile";
import { UserProfile, UserProfileResponse } from "../../../interfaces";
import createBooking from "@/libs/createBooking";

export default function Reservations() {
    const { data: session } = useSession();
    const urlParams = useSearchParams()
    const cid = urlParams.get('id')
    const name = urlParams.get('name')

    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [bookingDate, setBookingDate] = useState<Dayjs | null>(null)
    const [checkoutDate, setCheckoutDate] = useState<Dayjs | null>(null)

    useEffect(() => {
        const fetchUserProfile = async () => {
            if (session?.user.token) {
                const profileResponse: UserProfileResponse = await getUserProfile(session.user.token);
                const userProfile = profileResponse.data
                setProfile(userProfile);
            }
        };

        if (session) {
            fetchUserProfile();
        }
    }, [session]);



    const makeReservation = async () => {
        console.log(cid)
        if(bookingDate==null || checkoutDate==null){
            alert("Please select booking date and checkout date.")
        }
        if(cid==null){
            alert("Please select campground from camground page.")
        }
        if (cid && name && bookingDate!=null && checkoutDate!=null && profile && session?.user.token) {
            if (checkoutDate.diff(bookingDate, "day") > 3) {
                alert("You can book up to 3 nights.")
            } else {
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
                    alert("Booking complete.")
                } catch (error) {
                    // Handle error (e.g., show error message)
                    console.error("Error making reservation:", error);
                }

            }
        }
    }

    if (!session) {
        return <div className="flex justify-center items-center h-64 text-lg font-semibold text-red-600 animate-pulse">You must be logged in to make a reservation.</div>;
    }

    return (
        <main className="w-[100%] flex flex-col items-center space-y-4 p-2">
            <div className="text-3xl font-semibold text-gray-900 mb-3">New Reservation</div>
            <div className="text-xl text-gray-600 mb-6">Campground: {name}</div>

            <div className="w-fit space-y-2">
                <div className="text-md text-left text-gray-600">Booking Date</div>
                <DateReserve onDateChange={(value: Dayjs) => { setBookingDate(value) }} />
                <div className="text-md text-left text-gray-600">Checkout Date</div>
                <DateReserve onDateChange={(value: Dayjs) => { setCheckoutDate(value) }} />
            </div>

            <button className="block rounded-md bg-sky-600 hover:bg-indigo-600 px-3 py-2
            text-white shadow-sm" onClick={makeReservation}>
                Book this Campground
            </button>

        </main>
    );
}

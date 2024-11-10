import { AllBookingJson } from "../../interfaces";

export default async function getBookings(): Promise<AllBookingJson> {
    const response = await fetch("https://campground-today-backend-yeye.vercel.app/api/v1/bookings", {next: {tags:['bookings']}});
    
    if (!response.ok) {
        throw new Error("Failed to fetch bookings");
    }

    const data = await response.json();

    // Ensure the structure matches CampgroundJson
    return {
        success: data.success,
        count: data.count,
        data: data.data
    };
}
export default async function getBooking(id:string) {
    const response = await fetch(`https://campground-today-backend-yeye.vercel.app/api/v1/bookings/${id}`, {next: {tags:['booking']}})
    if(!response.ok){
        throw new Error("Failed to fetch a booking")
    }

    return await response.json()
}

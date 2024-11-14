export default async function getBooking(id:string) {
    const response = await fetch(`${process.env.BACKEND_URL}/api/v1/bookings/${id}`, {next: {tags:['booking']}})
    if(!response.ok){
        throw new Error("Failed to fetch a booking")
    }

    return await response.json()
}

export default async function createBooking(token: string, campgroundId: string,cbookingDate: string, ccheckoutDate: string, ccreatedAt: string) {
    const response = await fetch(`https://campground-today-backend-yeye.vercel.app:443/api/v1/campgrounds/${campgroundId}/bookings`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
            bookingDate: cbookingDate,
            checkoutDate: ccheckoutDate,
            createdAt: ccreatedAt//	string($date) example: 2023-08-20
        }),
    });

    if (!response.ok) {
        const errorMessage = `Failed to create campground: ${response.status} ${response.statusText}`;
        throw new Error(errorMessage);
    }

    const message = `Status to create campground: ${response.status} ${response.statusText}`;
    console.log(message)

    return await response.json();
}

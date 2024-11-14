export default async function updateBooking(token: string,id: string,cbookingDate: string, ccheckoutDate: string, ccreatedAt: string) {
    const response = await fetch(`${process.env.BACKEND_URL}/api/v1/bookings/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
            bookingDate: cbookingDate,
            checkoutDate: ccheckoutDate,
            createdAt: ccreatedAt
        }),
    });

    if (!response.ok) {
        const errorMessage = `Failed to update booking: ${response.status} ${response.statusText}`;
        throw new Error(errorMessage);
    }

    const message = `Status to update booking: ${response.status} ${response.statusText}`;
    console.log(message)

    return await response.json();
}

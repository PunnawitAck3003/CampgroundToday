export default async function deleteCampground(token: string, id: string) {
    const response = await fetch(`${process.env.BACKEND_URL}/api/v1/campgrounds/${id}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        const errorMessage = `Failed to delete campground: ${response.status} ${response.statusText}`;
        throw new Error(errorMessage);
    }

    return await response.json();
}

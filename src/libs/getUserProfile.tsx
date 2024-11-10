import { UserProfileResponse } from "../../interfaces"; // Adjust the import path accordingly

export default async function getUserProfile(token: string): Promise<UserProfileResponse> {
    const url = "https://campground-today-backend-yeye.vercel.app:443/api/v1/auth/me";

    try {
        const response = await fetch(url, {
            method: "GET",
            headers: {
                authorization: `Bearer ${token}`,
            },
        });

        // Check for HTTP errors
        if (!response.ok) {
            const errorMessage = `Failed to get user profile: ${response.status} ${response.statusText}`;
            throw new Error(errorMessage);
        }

        // Try parsing JSON response
        const data: UserProfileResponse = await response.json();
        return data;

    } catch (error) {
        // Log the error or handle it further as needed
        console.error("Error fetching user profile:", error);
        throw new Error("Error fetching user profile");
    }
}

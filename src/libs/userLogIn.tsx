export default async function userLogIn(userEmail: string, userPassword: string) {
    const response = await fetch(`${process.env.BACKEND_URL}/api/v1/auth/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            email: userEmail,
            password: userPassword
        }),
    });

    console.log("Response status:", response.status);
    if (!response.ok) {
        const errorData = await response.json();
        console.error("Login failed:", errorData);
        throw new Error(errorData.msg || "Failed to log-in");  
    }

    return await response.json();
}

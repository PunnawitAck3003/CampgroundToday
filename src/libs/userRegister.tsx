export default async function userRegister(userName: string, userEmail: string, userPassword: string, userTel: string) {
    const response = await fetch(`${process.env.BACKEND_URL}/api/v1/auth/register`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            name: userName,
            email: userEmail,
            tel: userTel,
            role: 'user',
            password: userPassword
        }),
    });

    console.log("Response status:", response.status);
    if (!response.ok) {
        const errorData = await response.json();
        console.error("Register failed:", errorData);
        throw new Error(errorData.msg || "Failed to register");  
    }

    return await response.json();
}

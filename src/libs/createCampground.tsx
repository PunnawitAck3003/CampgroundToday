export default async function createCampground(token: string, cName: string, cAddress: string, cDistrict: string, cProvince: string, cPostalcode: string, cTel: string, cPicture: string) {
    const response = await fetch(`${process.env.BACKEND_URL}/api/v1/campgrounds`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
            name: cName,
            address: cAddress,
            district: cDistrict,
            province: cProvince,
            postalcode: cPostalcode,
            tel: cTel,
            picture: cPicture
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

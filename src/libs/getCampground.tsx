export default async function getCampground(id:string) {
    const response = await fetch(`https://campground-today-backend-yeye.vercel.app/api/v1/campgrounds/${id}`)
    if(!response.ok){
        throw new Error("Failed to fetch a campground")
    }

    return await response.json()
}

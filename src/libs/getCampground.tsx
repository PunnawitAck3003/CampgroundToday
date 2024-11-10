export default async function getCampground(id:string) {
    const response = await fetch(`https://campground-today-backend-yeye.vercel.app/api/v1/campgrounds/${id}`, {next: {tags:['campground']}})
    if(!response.ok){
        throw new Error("Failed to fetch a campground")
    }

    return await response.json()
}

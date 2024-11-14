export default async function getCampground(id:string) {
    const response = await fetch(`${process.env.BACKEND_URL}/api/v1/campgrounds/${id}`, {next: {tags:['campground']}})
    if(!response.ok){
        throw new Error("Failed to fetch a campground")
    }

    return await response.json()
}

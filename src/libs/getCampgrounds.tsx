import { resolve } from "path"

export default async function getCampgrounds() {

    await new Promise((resolve)=>setTimeout(resolve, 5000))

    const response = await fetch("https://campground-today-backend-yeye.vercel.app/api/v1/campgrounds", {next: {tags:['campgrounds']}})
    if(!response.ok){
        throw new Error("Failed to fetch campgrounds")
    }

    return await response.json()
}
export default async function getCampgrounds(): Promise<CampgroundJson> {
    const response = await fetch("https://campground-today-backend-yeye.vercel.app/api/v1/campgrounds", {next: {tags:['campgrounds']}});
    
    if (!response.ok) {
        throw new Error("Failed to fetch campgrounds");
    }

    const data = await response.json();

    // Ensure the structure matches CampgroundJson
    return {
        success: data.success,
        count: data.count,
        pagination: data.pagination,
        data: data.data
    };
}

/*
export default async function getCampgrounds(): Promise<Campground[]> {
    // Simulate a delay
    // await new Promise((resolve) => setTimeout(resolve, 1000));

    try {
        const response = await fetch("https://campground-today-backend-yeye.vercel.app/api/v1/campgrounds", {
            next: { tags: ['campgrounds'] }
        });

        if (!response.ok) {
            throw new Error("Failed to fetch campgrounds");
        }

        // Parse and return the JSON response as an array of Campground
        return await response.json();
    } catch (error) {
        console.error("Error fetching campgrounds:", error);
        throw error;
    }
}
*/


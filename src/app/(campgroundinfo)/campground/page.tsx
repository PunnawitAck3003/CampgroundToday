import getCampgrounds from "@/libs/getCampgrounds"
import CampgroundCatalog from "@/components/CampgroundCatalog"
import { Suspense } from "react"
import { LinearProgress } from "@mui/material"
import CampgroundPanel from "@/components/CampgroundPanel"

export default async function Campground(){
    const campgrounds = await getCampgrounds()

    return (
        <main className="text-center p-5">
            <h1 className="texl-xl font-medium">
                Select Campground
            </h1>
            <Suspense fallback={<p>Loading ... <LinearProgress/></p>}>
            <CampgroundCatalog campgroundJson={campgrounds}/>
            </Suspense>

            <hr className="my-10"/>
            <h1 className="text-xl font-medium">TRY Client-side Campground Panel</h1>
            <CampgroundPanel/>
        </main>
    )
}
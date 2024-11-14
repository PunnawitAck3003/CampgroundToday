import ProductCard from "./ProductCard"
import Link from "next/link"
//import { CampgroundItem, CampgroundJson } from "interfaces";
import { CampgroundItem, CampgroundJson } from "../../interfaces"

export default async function CampgroundCatalog({campgroundJson}:{campgroundJson:CampgroundJson}){
    const campgroundJsonReady = await campgroundJson//fetch from server
    return(
        <>
        Explore {campgroundJsonReady.count} campgrounds in our catalog
        <div style={{
                margin: "20px", display: "flex",
                flexDirection: "row", flexWrap: "wrap", justifyContent: "space-around",
                alignContent: "space-around", padding: "10px"
            }}>
                {
                    campgroundJsonReady.data.map((campground:CampgroundItem) => (
                        <Link href={`/campground/${campground.id}`}
                        className="w-[100%] sm:w-[50%] md:[30%] lg:w-[25%]
                        p-2 sm:p-4 md:p-4 lg:p-2">
                            <ProductCard campgroundName={campground.name} imgSrc={campground.picture}/>
                        </Link>
                    ))
                }
            </div>
        </>
    )
}
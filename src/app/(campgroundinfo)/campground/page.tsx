import getCampgrounds from "@/libs/getCampgrounds"
import CampgroundCart from "@/components/CampgroundCart"

export default async function Campground() {
    return (
        <main className="p-5 max-w-6xl mx-auto text-center">
            <h1 className="text-3xl font-semibold text-gray-900 mb-3">
                Select Campground
            </h1>
            <div className="text-xl text-gray-600 mb-6">
                Explore handpicked campgrounds available for your next adventure.
            </div>
            <CampgroundCart />
        </main>
    )
}

import CampgroundManage from "@/components/CampgroundManage"

export default function ManagePage() {
    return (
        <main className="text-center text-lg p-5">
            <h1 className="text-3xl font-semibold text-gray-900 mb-3">
                Manage Campground
            </h1>
            <CampgroundManage />
        </main>
    )
}
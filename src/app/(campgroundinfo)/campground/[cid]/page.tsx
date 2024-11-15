"use client"
import Image from "next/image"
import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import getCampground from "@/libs/getCampground"
import Link from "next/link"
import { useSession } from "next-auth/react"
import getUserProfile from "@/libs/getUserProfile"
import { CampgroundItem } from "../../../../../interfaces"

export default function CampgroundDetailPage() {
    const router = useRouter()
    const { data: session } = useSession() // Client-side session handling
    const [campgroundDetail, setCampgroundDetail] = useState<CampgroundItem | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [isAdmin, setIsAdmin] = useState(false)
    const { cid } = useParams()

    useEffect(() => {
        const fetchData = async () => {
            if (!session || !session.user?.token) {
                router.push("/login") // Redirect if no session
                return
            }

            setIsLoading(true)
            try {
                const id = Array.isArray(cid) ? cid[0] : cid // Ensure `cid` is a string
                if (!id) return

                const campgroundData = await getCampground(id)
                setCampgroundDetail(campgroundData.data)

                const profile = await getUserProfile(session.user.token)
                setIsAdmin(profile.data.role === "admin")
            } catch (error) {
                console.error("Error fetching campground details:", error)
            } finally {
                setIsLoading(false)
            }
        }

        if (cid) fetchData()
    }, [cid, session, router])

    if (isLoading) return <div className="flex justify-center items-center h-64 text-lg font-semibold text-blue-600 animate-pulse">Loading campground details...</div>
    if (!campgroundDetail) return <div className="flex justify-center items-center h-64 text-lg font-semibold text-blue-600 animate-pulse">Campground details not found.</div>

    return (
        <main className="p-5 max-w-7xl mx-auto text-center">
            <h1 className="text-3xl font-semibold text-gray-800 mb-5">{campgroundDetail.name}</h1>

            <div className="flex flex-col sm:flex-row items-center sm:items-start sm:justify-start my-5 space-y-5 sm:space-y-0 sm:space-x-8">
                {/* Campground Image */}
                <Image
                    src={campgroundDetail.picture}
                    alt={`${campgroundDetail.name} Image`}
                    width={0}
                    height={0}
                    sizes="100vw"
                    className="rounded-lg w-full sm:w-[35%] h-auto mb-5 sm:mb-0 shadow-lg"
                />

                {/* Campground Details */}
                <div className="text-lg sm:text-md text-gray-700 space-y-4 sm:w-1/2 mx-5">
                    <div className="font-semibold text-xl">{campgroundDetail.name}</div>

                    <table className="table-auto border-collapse w-full text-left mb-8">
                        <tbody>
                            <tr>
                                <td className="py-2 px-4 font-medium text-gray-700">Address:</td>
                                <td className="py-2 px-4">{campgroundDetail.address}</td>
                            </tr>
                            <tr>
                                <td className="py-2 px-4 font-medium text-gray-700">District:</td>
                                <td className="py-2 px-4">{campgroundDetail.district}</td>
                            </tr>
                            <tr>
                                <td className="py-2 px-4 font-medium text-gray-700">Province:</td>
                                <td className="py-2 px-4">{campgroundDetail.province}</td>
                            </tr>
                            <tr>
                                <td className="py-2 px-4 font-medium text-gray-700">Postal code:</td>
                                <td className="py-2 px-4">{campgroundDetail.postalcode}</td>
                            </tr>
                            <tr>
                                <td className="py-2 px-4 font-medium text-gray-700">Tel.:</td>
                                <td className="py-2 px-4">{campgroundDetail.tel}</td>
                            </tr>
                        </tbody>
                    </table>

                    {/* Reservation Button */}
                    <Link
                        href={`/reservations?id=${campgroundDetail.id}&name=${campgroundDetail.name}`}
                        className="block rounded-md bg-sky-600 hover:bg-indigo-600 px-4 py-2 text-white shadow-md mt-5 transition-all duration-200"
                    >
                        Make Reservation
                    </Link>

                    {/* Admin Management */}
                    {isAdmin && (
                        <>
                            <div className="text-md font-semibold">ID: {campgroundDetail.id}</div>
                            <Link
                                href={`/manage`}
                                className="block rounded-md bg-sky-600 hover:bg-indigo-600 px-4 py-2 text-white shadow-md mt-2 transition-all duration-200"
                            >
                                Manage Campground
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </main>
    )
}

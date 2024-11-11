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
    //const cid = router.query.cid as string // Use router to get the "cid" parameter

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

    if (isLoading) return <div>Loading...</div>
    if (!campgroundDetail) return <div>Campground details not found.</div>

    return (
        <main className="text-center p-5">
            <h1 className="text-lg font-medium mb-5">{campgroundDetail.name}</h1>

            <div className="flex flex-col sm:flex-row items-center sm:items-start sm:justify-center my-5">
                <Image
                    src={campgroundDetail.picture}
                    alt={`${campgroundDetail.name} Image`}
                    width={0}
                    height={0}
                    sizes="100vw"
                    className="rounded-lg w-full sm:w-[30%] mb-5 sm:mb-0"
                />

                <div className="text-md mx-5 text-left space-y-2">
                    <div className="font-semibold">{campgroundDetail.name}</div>
                    <div>Address: {campgroundDetail.address}</div>
                    <div>District: {campgroundDetail.district}</div>
                    <div>Province: {campgroundDetail.province}</div>
                    <div>Tel: {campgroundDetail.tel}</div>

                    <Link
                        href={`/reservations?id=${campgroundDetail.id}&name=${campgroundDetail.name}`}
                        className="block rounded-md bg-sky-600 hover:bg-indigo-600 px-3 py-2 text-white shadow-sm mt-5"
                    >
                        Make Reservation
                    </Link>

                    {isAdmin && (
                        <>
                            <div className="text-md font-semibold">ID: {campgroundDetail.id}</div>
                            <Link
                                href={`/reservations/manage`}
                                className="block rounded-md bg-sky-600 hover:bg-indigo-600 px-3 py-2 text-white shadow-sm mt-2"
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
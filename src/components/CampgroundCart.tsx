"use client"
import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { CampgroundJson, CampgroundItem } from "../../interfaces"
import getCampgrounds from "@/libs/getCampgrounds"
import deleteCampground from "@/libs/deleteCampground"
import Image from "next/image"
import Link from "next/link"
import { UserProfile } from "../../interfaces"
import getUserProfile from "@/libs/getUserProfile"

export default function CampgroundCart() {
    const [campgrounds, setCampgrounds] = useState<CampgroundItem[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [errorMessage, setErrorMessage] = useState<string | null>(null)
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
    const { data: session } = useSession()

    useEffect(() => {
        const fetchCampgroundsAndUserProfile = async () => {
            if (session?.user?.token) {
                try {
                    const campgroundData = await getCampgrounds()
                    setCampgrounds(campgroundData.data)
                    
                    // Assuming userProfile is fetched from an endpoint like getUserProfile
                    const profileData = await getUserProfile(session.user.token)
                    setUserProfile(profileData.data)
                    setIsLoading(false)
                } catch (error) {
                    console.error("Error fetching campgrounds or user profile:", error)
                    setErrorMessage("Failed to fetch campgrounds or user profile")
                    setIsLoading(false)
                }
            } else {
                setErrorMessage("You must be logged in to view campgrounds")
                setIsLoading(false)
            }
        }

        fetchCampgroundsAndUserProfile()
    }, [session])

    const handleDelete = async (campgroundId: string) => {
        if (!session?.user?.token) return
        try {
            await deleteCampground(session.user.token, campgroundId)
            setCampgrounds(campgrounds.filter((campground) => campground.id !== campgroundId))
        } catch (error) {
            console.error("Error deleting campground:", error)
            setErrorMessage("Failed to delete campground")
        }
    }

    if (isLoading) {
        return <div>Loading campgrounds...</div>
    }

    if (errorMessage) {
        return <div>{errorMessage}</div>
    }

    return (
        <div className="flex flex-wrap justify-center">
            {campgrounds.map((campground) => (
                <Link
                    key={campground.id}
                    href={`/campground/${campground.id}`}
                    className="w-full sm:w-[50%] md:w-[30%] lg:w-[25%] p-2 sm:p-4 md:p-4 lg:p-2"
                >
                    <div className="bg-white shadow-lg rounded-lg overflow-hidden hover:shadow-xl transition-shadow">
                        <div className="w-full h-48 relative">
                            <Image
                                src={campground.picture}
                                alt={`${campground.name} Picture`}
                                fill
                                className="object-cover"
                            />
                        </div>
                        <div className="p-4">
                            <h3 className="text-lg font-semibold">{campground.name}</h3>
                            <p className="text-sm text-gray-600">{campground.address}</p>
                        </div>
                        {userProfile?.role === "admin" && (
                            <div className="p-4">
                                <button
                                    onClick={(e) => {
                                        e.preventDefault()  // Prevent navigation on delete click
                                        handleDelete(campground.id)
                                    }}
                                    className="w-full bg-red-600 text-white py-2 rounded hover:bg-red-700"
                                >
                                    Delete Campground
                                </button>
                            </div>
                        )}
                    </div>
                </Link>
            ))}
        </div>
    )
}

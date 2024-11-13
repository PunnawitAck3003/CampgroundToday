"use client"
import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { CampgroundJson, CampgroundItem } from "../../interfaces"
import getCampgrounds from "@/libs/getCampgrounds"
import deleteCampground from "@/libs/deleteCampground"
import updateCampground from "@/libs/updateCampground"
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
    const [editingCampground, setEditingCampground] = useState<string | null>(null)
    const [tempCampgroundData, setTempCampgroundData] = useState<CampgroundItem | null>(null)

    useEffect(() => {
        const fetchCampgroundsAndUserProfile = async () => {
            if (session?.user?.token) {
                try {
                    const campgroundData = await getCampgrounds()
                    setCampgrounds(campgroundData.data)

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
        const confirmed = window.confirm("Are you sure you want to delete this campground?");
        if (confirmed) {
            if (!session?.user?.token) return
            try {
                await deleteCampground(session.user.token, campgroundId)
                setCampgrounds(campgrounds.filter((campground) => campground.id !== campgroundId))
            } catch (error) {
                console.error("Error deleting campground:", error)
                setErrorMessage("Failed to delete campground")
            }
        }
    }

    const startEditing = (campground: CampgroundItem) => {
        setEditingCampground(campground.id)
        setTempCampgroundData(campground)
    }

    const handleUpdate = async () => {
        const confirmed = window.confirm("Are you sure you want to save changes to this campground?");
        if (confirmed) {
            if (!session?.user?.token || !tempCampgroundData) return
            try {
                await updateCampground(
                    session.user.token,
                    tempCampgroundData.id,
                    tempCampgroundData.name,
                    tempCampgroundData.address,
                    tempCampgroundData.district,
                    tempCampgroundData.province,
                    tempCampgroundData.postalcode,
                    tempCampgroundData.tel,
                    tempCampgroundData.picture
                )
                setCampgrounds(
                    campgrounds.map((campground) =>
                        campground.id === tempCampgroundData.id ? tempCampgroundData : campground
                    )
                )
                setEditingCampground(null)
            } catch (error) {
                console.error("Error updating campground:", error)
                setErrorMessage("Failed to update campground")
            }
        }
    }

    if (isLoading) {
        return (
          <div className="flex justify-center items-center h-64 text-lg font-semibold text-blue-600 animate-pulse">
            Loading campgrounds...
          </div>
        );
      }

    if (errorMessage) {
        return <div>{errorMessage}</div>
    }

    return (
        <div className="flex flex-wrap justify-center">
            {campgrounds.map((campground) => {
                const isEditing = editingCampground === campground.id
                const Container = isEditing ? 'div' : Link

                return (
                    <Container
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
                                {isEditing ? (
                                    <>
                                        <input
                                            type="text"
                                            value={tempCampgroundData?.name || ""}
                                            onChange={(e) =>
                                                setTempCampgroundData({ ...tempCampgroundData!, name: e.target.value })
                                            }
                                            className="w-full border p-2 rounded"
                                        />
                                        <input
                                            type="text"
                                            value={tempCampgroundData?.address || ""}
                                            onChange={(e) =>
                                                setTempCampgroundData({ ...tempCampgroundData!, address: e.target.value })
                                            }
                                            className="w-full border p-2 mt-2 rounded"
                                        />
                                        <input
                                            type="text"
                                            value={tempCampgroundData?.district || ""}
                                            onChange={(e) =>
                                                setTempCampgroundData({ ...tempCampgroundData!, district: e.target.value })
                                            }
                                            className="w-full border p-2 mt-2 rounded"
                                        />
                                        <input
                                            type="text"
                                            value={tempCampgroundData?.province || ""}
                                            onChange={(e) =>
                                                setTempCampgroundData({ ...tempCampgroundData!, province: e.target.value })
                                            }
                                            className="w-full border p-2 mt-2 rounded"
                                        />
                                        <input
                                            type="text"
                                            value={tempCampgroundData?.postalcode || ""}
                                            onChange={(e) =>
                                                setTempCampgroundData({ ...tempCampgroundData!, postalcode: e.target.value })
                                            }
                                            className="w-full border p-2 mt-2 rounded"
                                        />
                                        <input
                                            type="text"
                                            value={tempCampgroundData?.tel || ""}
                                            onChange={(e) =>
                                                setTempCampgroundData({ ...tempCampgroundData!, tel: e.target.value })
                                            }
                                            className="w-full border p-2 mt-2 rounded"
                                        />
                                        <input
                                            type="text"
                                            value={tempCampgroundData?.picture || ""}
                                            onChange={(e) =>
                                                setTempCampgroundData({ ...tempCampgroundData!, picture: e.target.value })
                                            }
                                            className="w-full border p-2 mt-2 rounded"
                                        />
                                        <button
                                            onClick={(e) => {
                                                e.preventDefault() // Prevent navigation on save
                                                handleUpdate()
                                            }}
                                            className="w-full bg-green-600 text-white py-2 mt-2 rounded hover:bg-green-700"
                                        >
                                            Save Changes
                                        </button>
                                        <button
                                            onClick={(e) => {
                                                e.preventDefault() // Prevent navigation on cancel
                                                setEditingCampground(null)
                                                setTempCampgroundData(null)
                                            }}
                                            className="w-full bg-gray-500 text-white py-2 mt-2 rounded hover:bg-gray-600"
                                        >
                                            Cancel
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <h3 className="text-lg font-semibold">{campground.name}</h3>
                                        <p className="text-sm text-gray-600">{campground.address}</p>
                                        {userProfile?.role === "admin" && (
                                            <>
                                                <button
                                                    onClick={(e) => {
                                                        e.preventDefault() // Prevent navigation on delete click
                                                        handleDelete(campground.id)
                                                    }}
                                                    className="w-full bg-red-600 text-white py-2 rounded hover:bg-red-700"
                                                >
                                                    Delete Campground
                                                </button>
                                                <button
                                                    onClick={(e) => {
                                                        e.preventDefault() // Prevent navigation on edit click
                                                        startEditing(campground)
                                                    }}
                                                    className="w-full bg-blue-600 text-white py-2 mt-2 rounded hover:bg-blue-700"
                                                >
                                                    Edit Campground
                                                </button>
                                            </>
                                        )}
                                    </>
                                )}
                            </div>
                        </div>
                    </Container>
                )
            })}
        </div>
    )
}
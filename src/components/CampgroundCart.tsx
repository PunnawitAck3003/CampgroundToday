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
    const [searchTermName, setSearchTermName] = useState('')
    const [searchTermDistrict, setSearchTermDistrict] = useState('')
    const [searchTermProvince, setSearchTermProvince] = useState('')

    useEffect(() => {
        const fetchCampgroundsAndUserProfile = async () => {
            try {
                const campgroundData = await getCampgrounds()
                setCampgrounds(campgroundData.data)

                if (session?.user?.token) {
                    const profileData = await getUserProfile(session.user.token)
                    setUserProfile(profileData.data)
                }
                setIsLoading(false)
            } catch (error) {
                console.error("Error fetching campgrounds or user profile:", error)
                setErrorMessage("Failed to fetch campgrounds or user profile")
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
        // Show confirmation dialog
        const confirmed = window.confirm("Are you sure you want to save changes to this campground?");
        if (!confirmed) return;
    
        // Ensure session token and temporary data exist
        if (!session?.user?.token || !tempCampgroundData) {
            setErrorMessage("Session expired or invalid data.");
            return;
        }
    
        try {
            // Call the API to update the campground
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
            );
    
            // Update the local state efficiently
            setCampgrounds((prevCampgrounds) =>
                prevCampgrounds.map((campground) =>
                    campground.id === tempCampgroundData.id ? tempCampgroundData : campground
                )
            );
    
            // Clear editing state
            setEditingCampground(null);
            setTempCampgroundData(null);
        } catch (error) {
            // Log the error and show an error message to the user
            console.error("Error updating campground:", error);
            setErrorMessage("Failed to update campground. Please try again later.");
        }
    };
    

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-64 text-lg font-semibold text-blue-600 animate-pulse">
                Loading campgrounds...
            </div>
        );
    }

    if (errorMessage) {
        return <div className="flex justify-center items-center h-64 text-lg font-semibold text-red-600 animate-pulse">
            {errorMessage}
        </div>
    }

    const filteredCampgrounds = campgrounds.filter(campground => {
        // If no search queries, return all campgrounds
        if ((searchTermName == "") && (searchTermDistrict == "") && (searchTermProvince == "")) {
            return true;
        }
        // If any search query matches, return the campground that matches
        else {
            const nameMatches = campground.name.toLowerCase().includes(searchTermName.toLowerCase());
            const districtMatches = campground.district.toLowerCase().includes(searchTermDistrict.toLowerCase());
            const provinceMatches = campground.province.toLowerCase().includes(searchTermProvince.toLowerCase());
            return nameMatches && districtMatches && provinceMatches;

            // const nameMatches = searchTermName && campground.name.toLowerCase().includes(searchTermName.toLowerCase());
            // const districtMatches = searchTermDistrict && campground.district.toLowerCase().includes(searchTermDistrict.toLowerCase());
            // const provinceMatches = searchTermProvince && campground.province.toLowerCase().includes(searchTermProvince.toLowerCase());
            // return nameMatches && districtMatches && provinceMatches;
        }
    });

    return (
        <div>
            <div className="flex flex-wrap justify-center space-x-4 space-y-4 md:space-y-0">
                <input
                    type="text"
                    placeholder="Search by name."
                    value={searchTermName}
                    onChange={(e) => setSearchTermName(e.target.value)}
                    className="search-input p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-64"
                />
                <input
                    type="text"
                    placeholder="Search by district."
                    value={searchTermDistrict}
                    onChange={(e) => setSearchTermDistrict(e.target.value)}
                    className="search-input p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-64"
                />
                <input
                    type="text"
                    placeholder="Search by province."
                    value={searchTermProvince}
                    onChange={(e) => setSearchTermProvince(e.target.value)}
                    className="search-input p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-64"
                />
                {userProfile?.role == "admin" &&
                    <Link
                        href={`/manage`}
                        className="block rounded-md bg-sky-600 hover:bg-indigo-600 px-4 py-2 text-white shadow-md mt-5 transition-all duration-200"
                    >
                        Manage Campground
                    </Link>
                }
            </div>

            <div className="flex flex-wrap justify-center">
                {filteredCampgrounds.map((campground) => {
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
                                                onClick={async (e) => {
                                                    e.preventDefault();
                                                    setIsLoading(true);
                                                    try {
                                                        await handleUpdate();
                                                    } catch (error) {
                                                        console.error("Error updating:", error);
                                                    } finally {
                                                        setIsLoading(false);
                                                    }
                                                }}
                                                className="w-full bg-green-600 text-white py-2 mt-2 rounded hover:bg-green-700"
                                                disabled={isLoading}
                                            >
                                                {isLoading ? "Saving..." : "Save Changes"}
                                            </button>
                                            <button
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    setEditingCampground(null);
                                                    setTempCampgroundData(null);
                                                }}
                                                className="w-full bg-gray-500 text-white py-2 mt-2 rounded hover:bg-gray-600"
                                            >
                                                Cancel
                                            </button>

                                        </>
                                    ) : (
                                        <>
                                            <h3 className="text-lg font-semibold">{campground.name}</h3>
                                            <p className="text-sm text-gray-600">{`${campground.district}, ${campground.province}`}</p>
                                            {userProfile?.role === "admin" && (
                                                <>
                                                    <button
                                                        onClick={(e) => {
                                                            e.preventDefault() // Prevent navigation on delete click
                                                            handleDelete(campground.id)
                                                        }}
                                                        className="w-full bg-red-600 text-white py-2 mt-1 rounded hover:bg-red-700"
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
        </div>
    )
}
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions"
import getUserProfile from "@/libs/getUserProfile";
import { revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import createCampground from "@/libs/createCampground";
import deleteCampground from "@/libs/deleteCampground";
import updateCampground from "@/libs/updateCampground";

export default async function CampgroundManage() {

    function renderInput(id: string, placeholder: string) {
        return (
            <div className="flex flex-col w-full my-2">
                <label htmlFor={id} className="block text-gray-700 font-medium mb-1">
                    {placeholder}
                </label>
                <input
                    type="text"
                    id={id}
                    name={id}
                    placeholder={placeholder}
                    className="bg-white border-2 border-gray-300 rounded w-full p-2 text-gray-700 focus:outline-none focus:border-blue-500"
                    required
                />
            </div>
        );
    }

    const addCampground = async (addCampgroundForm: FormData) => {
        "use server"

        const session = await getServerSession(authOptions)
        if (!session || !session.user?.token) return null

        const name = (addCampgroundForm.get("name") as string) || "";
        const address = (addCampgroundForm.get("address") as string) || "";
        const district = (addCampgroundForm.get("district") as string) || "";
        const province = (addCampgroundForm.get("province") as string) || "";
        const postalcode = (addCampgroundForm.get("postalcode") as string) || "";
        const tel = (addCampgroundForm.get("tel") as string) || "";
        const picture = (addCampgroundForm.get("picture") as string) || "";

        try {
            const campground = await createCampground(session.user.token, name, address, district, province, postalcode, tel, picture)
        } catch (error) {
            console.error("Error creating campground:", error);
        }

        revalidateTag("campgrounds")
        redirect("/campground")

    }

    const ddeleteCampground = async (ddeleteCampgroundForm: FormData) => {
        "use server"

        const session = await getServerSession(authOptions)
        if (!session || !session.user?.token) return null

        const cid = (ddeleteCampgroundForm.get("campgroundid") as string) || "";

        try {
            //const campground = await createCampground(session.user.token, name,address,district,province,postalcode,tel,picture)
            const delC = await deleteCampground(session.user.token, cid)
        } catch (error) {
            console.error("Error deleting campground:", error);
        }

        revalidateTag("campgrounds")
        redirect("/campground")
    }

    const uupdateCampground = async (uupdateCampgroundForm: FormData) => {
        "use server"

        const session = await getServerSession(authOptions)
        if (!session || !session.user?.token) return null
        const cid = (uupdateCampgroundForm.get("campgroundid") as string) || "";
        const name = (uupdateCampgroundForm.get("name") as string) || "";
        const address = (uupdateCampgroundForm.get("address") as string) || "";
        const district = (uupdateCampgroundForm.get("district") as string) || "";
        const province = (uupdateCampgroundForm.get("province") as string) || "";
        const postalcode = (uupdateCampgroundForm.get("postalcode") as string) || "";
        const tel = (uupdateCampgroundForm.get("tel") as string) || "";
        const picture = (uupdateCampgroundForm.get("picture") as string) || "";

        try {
            const campground = await updateCampground(session.user.token, cid, name, address, district, province, postalcode, tel, picture)
        } catch (error) {
            console.error("Error updating campground:", error);
        }

        revalidateTag("campgrounds")
        revalidateTag("campground")
        redirect("/campground")

    }

    const session = await getServerSession(authOptions)
    if (!session || !session.user?.token) return null

    const profile = await getUserProfile(session.user.token)
    var createdAt = new Date(profile.data.createdAt)


    return (
        <main className="bg-gray-100 p-8 rounded-md shadow-md mx-auto">
            <div className="text-3xl font-bold text-gray-800 mb-6">{profile.data.name}</div>

            <table className="table-auto border-collapse text-left mb-8">
                <tbody>
                    <tr>
                        <td className="py-2 px-4 font-medium text-gray-700">Email:</td>
                        <td className="py-2 px-4">{profile.data.email}</td>
                    </tr>
                    <tr>
                        <td className="py-2 px-4 font-medium text-gray-700">Tel.:</td>
                        <td className="py-2 px-4">{profile.data.tel}</td>
                    </tr>
                    <tr>
                        <td className="py-2 px-4 font-medium text-gray-700">Member Since:</td>
                        <td className="py-2 px-4">{createdAt.toLocaleDateString()}</td>
                    </tr>
                </tbody>
            </table>

            {profile.data.role === "admin" && (
                <div className="flex flex-col lg:flex-row lg:space-x-4 space-y-4 lg:space-y-0">
                    {/* Add Campground Form */}
                    <form
                        action={addCampground}
                        className="flex-1 p-6 bg-white rounded-md shadow-md"
                    >
                        <h2 className="text-xl font-semibold text-blue-600 mb-4">
                            Create Campground
                        </h2>
                        {renderInput("name", "Campground Name")}
                        {renderInput("address", "Campground Address")}
                        {renderInput("district", "Campground District")}
                        {renderInput("province", "Campground Province")}
                        {renderInput("postalcode", "Campground Postal Code")}
                        {renderInput("tel", "Telephone")}
                        {renderInput("picture", "Picture URL")}
                        <button
                            type="submit"
                            className="w-full bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded-md mt-4"
                        >
                            Add New Campground
                        </button>
                    </form>

                    {/* Delete Campground Form */}
                    <form
                        action={ddeleteCampground}
                        className="flex-1 p-6 bg-white rounded-md shadow-md"
                    >
                        <h2 className="text-xl font-semibold text-red-600 mb-4">
                            Delete Campground
                        </h2>
                        {renderInput("campgroundid", "Campground ID")}
                        <button
                            type="submit"
                            className="w-full bg-red-500 hover:bg-red-700 text-white py-2 px-4 rounded-md mt-4"
                        >
                            Delete Campground
                        </button>
                    </form>

                    {/* Update Campground Form */}
                    <form
                        action={uupdateCampground}
                        className="flex-1 p-6 bg-white rounded-md shadow-md"
                    >
                        <h2 className="text-xl font-semibold text-green-600 mb-4">
                            Update Campground
                        </h2>
                        {renderInput("campgroundid", "Campground ID")}
                        {renderInput("name", "Campground Name")}
                        {renderInput("address", "Campground Address")}
                        {renderInput("district", "Campground District")}
                        {renderInput("province", "Campground Province")}
                        {renderInput("postalcode", "Campground Postal Code")}
                        {renderInput("tel", "Telephone")}
                        {renderInput("picture", "Picture URL")}
                        <button
                            type="submit"
                            className="w-full bg-green-500 hover:bg-green-700 text-white py-2 px-4 rounded-md mt-4"
                        >
                            Update Campground
                        </button>
                    </form>
                </div>
            )}
        </main>
    );
}
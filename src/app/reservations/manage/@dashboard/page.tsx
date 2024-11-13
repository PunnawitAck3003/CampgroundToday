import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions"
import getUserProfile from "@/libs/getUserProfile";
import Car from "@/db/models/Car";
import Campground from "@/db/models/Campground";
import { dbConnect } from "@/db/dbConnect";
import { revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import createCampground from "@/libs/createCampground";
import deleteCampground from "@/libs/deleteCampground";
import updateCampground from "@/libs/updateCampground";
//https://drive.google.com/uc?id=1Vsq3yGo0TbJtNnD-Q-GmIKEPhi774W_O
export default async function DashboardPage(){

    const addCampground = async(addCampgroundForm:FormData) => {
        "use server"

        const session = await getServerSession(authOptions)
        if(!session || !session.user?.token) return null

        const name = (addCampgroundForm.get("name") as string) || "";
        const address = (addCampgroundForm.get("address") as string) || "";
        const district = (addCampgroundForm.get("district") as string) || "";
        const province = (addCampgroundForm.get("province") as string) || "";
        const postalcode = (addCampgroundForm.get("postalcode") as string) || "";
        const tel = (addCampgroundForm.get("tel") as string) || "";
        const picture = (addCampgroundForm.get("picture") as string) || "";

        try{
            const campground = await createCampground(session.user.token, name,address,district,province,postalcode,tel,picture)
        }catch (error) {
            console.error("Error creating campground:", error);
        }

        revalidateTag("campgrounds")
        redirect("/campground")

    }

    const ddeleteCampground = async(ddeleteCampgroundForm:FormData) => {
        "use server"

        const session = await getServerSession(authOptions)
        if(!session || !session.user?.token) return null

        const cid = (ddeleteCampgroundForm.get("campgroundid") as string) || "";

        try{
            //const campground = await createCampground(session.user.token, name,address,district,province,postalcode,tel,picture)
            const delC = await deleteCampground(session.user.token, cid)
        }catch (error) {
            console.error("Error deleting campground:", error);
        }

        revalidateTag("campgrounds")
        redirect("/campground")
    }
    
    const uupdateCampground = async(uupdateCampgroundForm:FormData) => {
        "use server"

        const session = await getServerSession(authOptions)
        if(!session || !session.user?.token) return null
        const cid = (uupdateCampgroundForm.get("campgroundid") as string) || "";
        const name = (uupdateCampgroundForm.get("name") as string) || "";
        const address = (uupdateCampgroundForm.get("address") as string) || "";
        const district = (uupdateCampgroundForm.get("district") as string) || "";
        const province = (uupdateCampgroundForm.get("province") as string) || "";
        const postalcode = (uupdateCampgroundForm.get("postalcode") as string) || "";
        const tel = (uupdateCampgroundForm.get("tel") as string) || "";
        const picture = (uupdateCampgroundForm.get("picture") as string) || "";

        try{
            const campground = await updateCampground(session.user.token, cid, name,address,district,province,postalcode,tel,picture)
        }catch (error) {
            console.error("Error updating campground:", error);
        }

        revalidateTag("campgrounds")
        revalidateTag("campground")
        redirect("/campground")

    }
 
    const session = await getServerSession(authOptions)
    if(!session || !session.user?.token) return null

    const profile = await getUserProfile(session.user.token)
    var createdAt = new Date(profile.data.createdAt)
    return(
        <main className="bg-slate-100 m-5 p-5">
            <div className = 'text-2xl'>
                {profile.data.name}
            </div>
            <table className='table-auto border-seperate border-spacing-2'>
                <tbody>
                    <tr><td>Email</td><td>{profile.data.email}</td></tr>
                    <tr><td>Tel.</td><td>{profile.data.tel}</td></tr>
                    <tr><td>Member Since</td><td>{createdAt.toString()}</td></tr>
                </tbody>
            </table>

            {
                (profile.data.role=="admin")?
                <form action={addCampground}>
                    <div className="text-xl text-blue-700 py-3">Create Campground</div>
                    <div className="flex items-center w-1/2 my-2">
                        <label className="w-auto block text-gray-700 pr-4" htmlFor="name">
                            Name
                        </label>
                        <input type = 'text' required id="name" name = "name" placeholder="Campground Name"
                        className='bg-white border-2 border-gray-200 rounded w-full p-2
                        text-gray-700 focus:outline-none focus:border-blue-400'
                        />
                    </div>
                    <div className="flex items-center w-1/2 my-2">
                        <label className="w-auto block text-gray-700 pr-4" htmlFor="address">
                            Address
                        </label>
                        <input type = 'text' required id="address" name = "address" placeholder="Campground Address"
                        className='bg-white border-2 border-gray-200 rounded w-full p-2
                        text-gray-700 focus:outline-none focus:border-blue-400'
                        />
                    </div>
                    <div className="flex items-center w-1/2 my-2">
                        <label className="w-auto block text-gray-700 pr-4" htmlFor="district">
                            District
                        </label>
                        <input type = 'text' required id="district" name = "district" placeholder="Campground District"
                        className='bg-white border-2 border-gray-200 rounded w-full p-2
                        text-gray-700 focus:outline-none focus:border-blue-400'
                        />
                    </div>
                    <div className="flex items-center w-1/2 my-2">
                        <label className="w-auto block text-gray-700 pr-4" htmlFor="province">
                            Province
                        </label>
                        <input type = 'text' required id="province" name = "province" placeholder="Campground Province"
                        className='bg-white border-2 border-gray-200 rounded w-full p-2
                        text-gray-700 focus:outline-none focus:border-blue-400'
                        />
                    </div>
                    <div className="flex items-center w-1/2 my-2">
                        <label className="w-auto block text-gray-700 pr-4" htmlFor="postalcode">
                            Postalcode
                        </label>
                        <input type = 'text' required id="postalcode" name = "postalcode" placeholder="Campground Postalcode"
                        className='bg-white border-2 border-gray-200 rounded w-full p-2
                        text-gray-700 focus:outline-none focus:border-blue-400'
                        />
                    </div>
                    <div className="flex items-center w-1/2 my-2">
                        <label className="w-auto block text-gray-700 pr-4" htmlFor="tel">
                            Tel.
                        </label>
                        <input type = 'text' required id="tel" name = "tel" placeholder="Tel."
                        className='bg-white border-2 border-gray-200 rounded w-full p-2
                        text-gray-700 focus:outline-none focus:border-blue-400'
                        />
                    </div>
                    <div className="flex items-center w-1/2 my-2">
                        <label className="w-auto block text-gray-700 pr-4" htmlFor="picture">
                            Picture
                        </label>
                        <input type = 'text' required id="picture" name = "picture" placeholder="URL"
                        className='bg-white border-2 border-gray-200 rounded w-full p-2
                        text-gray-700 focus:outline-none focus:border-blue-400'
                        />
                    </div>
                    <button type="submit" className="bg-blue-500 hover:bg-blue-700
                    text-white p-2 rounded">Add New Campground</button>
                </form>
                : null

            }
            {
                (profile.data.role=="admin")?
                <form action={ddeleteCampground}>
                    <div className="text-xl text-blue-700 py-3">Delete Campground</div>
                    <div className="flex items-center w-1/2 my-2">
                        <label className="w-auto block text-gray-700 pr-4" htmlFor="campgroundid">
                            ID
                        </label>
                        <input type = 'text' required id="campgroundid" name = "campgroundid" placeholder="Campground ID"
                        className='bg-white border-2 border-gray-200 rounded w-full p-2
                        text-gray-700 focus:outline-none focus:border-blue-400'
                        />
                    </div>
                    <button type="submit" className="bg-blue-500 hover:bg-blue-700
                    text-white p-2 rounded">Delete Campground</button>
                </form>
                : null

            }
            {
                (profile.data.role=="admin")?
                <form action={uupdateCampground}>
                    <div className="text-xl text-blue-700 py-3">Update Campground</div>
                    <div className="flex items-center w-1/2 my-2">
                        <label className="w-auto block text-gray-700 pr-4" htmlFor="campgroundid">
                            ID
                        </label>
                        <input type = 'text' required id="campgroundid" name = "campgroundid" placeholder="Campground ID"
                        className='bg-white border-2 border-gray-200 rounded w-full p-2
                        text-gray-700 focus:outline-none focus:border-blue-400'
                        />
                    </div>
                    <div className="flex items-center w-1/2 my-2">
                        <label className="w-auto block text-gray-700 pr-4" htmlFor="name">
                            Name
                        </label>
                        <input type = 'text' required id="name" name = "name" placeholder="Campground Name"
                        className='bg-white border-2 border-gray-200 rounded w-full p-2
                        text-gray-700 focus:outline-none focus:border-blue-400'
                        />
                    </div>
                    <div className="flex items-center w-1/2 my-2">
                        <label className="w-auto block text-gray-700 pr-4" htmlFor="address">
                            Address
                        </label>
                        <input type = 'text' required id="address" name = "address" placeholder="Campground Address"
                        className='bg-white border-2 border-gray-200 rounded w-full p-2
                        text-gray-700 focus:outline-none focus:border-blue-400'
                        />
                    </div>
                    <div className="flex items-center w-1/2 my-2">
                        <label className="w-auto block text-gray-700 pr-4" htmlFor="district">
                            District
                        </label>
                        <input type = 'text' required id="district" name = "district" placeholder="Campground District"
                        className='bg-white border-2 border-gray-200 rounded w-full p-2
                        text-gray-700 focus:outline-none focus:border-blue-400'
                        />
                    </div>
                    <div className="flex items-center w-1/2 my-2">
                        <label className="w-auto block text-gray-700 pr-4" htmlFor="province">
                            Province
                        </label>
                        <input type = 'text' required id="province" name = "province" placeholder="Campground Province"
                        className='bg-white border-2 border-gray-200 rounded w-full p-2
                        text-gray-700 focus:outline-none focus:border-blue-400'
                        />
                    </div>
                    <div className="flex items-center w-1/2 my-2">
                        <label className="w-auto block text-gray-700 pr-4" htmlFor="postalcode">
                            Postalcode
                        </label>
                        <input type = 'text' required id="postalcode" name = "postalcode" placeholder="Campground Postalcode"
                        className='bg-white border-2 border-gray-200 rounded w-full p-2
                        text-gray-700 focus:outline-none focus:border-blue-400'
                        />
                    </div>
                    <div className="flex items-center w-1/2 my-2">
                        <label className="w-auto block text-gray-700 pr-4" htmlFor="tel">
                            Tel.
                        </label>
                        <input type = 'text' required id="tel" name = "tel" placeholder="Tel."
                        className='bg-white border-2 border-gray-200 rounded w-full p-2
                        text-gray-700 focus:outline-none focus:border-blue-400'
                        />
                    </div>
                    <div className="flex items-center w-1/2 my-2">
                        <label className="w-auto block text-gray-700 pr-4" htmlFor="picture">
                            Picture
                        </label>
                        <input type = 'text' required id="picture" name = "picture" placeholder="URL"
                        className='bg-white border-2 border-gray-200 rounded w-full p-2
                        text-gray-700 focus:outline-none focus:border-blue-400'
                        />
                    </div>
                    <button type="submit" className="bg-blue-500 hover:bg-blue-700
                    text-white p-2 rounded">Update Campground</button>
                </form>
                : null

            }

        </main>
    );
}
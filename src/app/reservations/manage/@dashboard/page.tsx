import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions"
import getUserProfile from "@/libs/getUserProfile";
import Car from "@/db/models/Car";
import Campground from "@/db/models/Campground";
import { dbConnect } from "@/db/dbConnect";
import { revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
//https://drive.google.com/uc?id=1Vsq3yGo0TbJtNnD-Q-GmIKEPhi774W_O
export default async function DashboardPage(){

    const addCampground = async(addCarForm:FormData) => {
        "use server"
        const name = addCarForm.get("name")
        const address = addCarForm.get("address")
        const district = addCarForm.get("district")
        const province = addCarForm.get("province")
        const postalcode = addCarForm.get("postalcode")
        const tel = addCarForm.get("tel")
        const picture = addCarForm.get("picture")

        try{
            await dbConnect()
            const car = await Campground.create({
                "name": name,
                "address": address,
                "district": district,
                "province": province,
                "postalcode": postalcode,
                "tel": tel,
                "picture": picture
            })

        }catch(error){
            console.log(error)
        }

        revalidateTag("campgrounds")
        redirect("/campground")

    }
    const session = await getServerSession(authOptions)
    if(!session || !session.user.token) return null

    const profile = await getUserProfile(session.user.token)
    var createdAt = new Date(profile.data.createdAt)
    return(
        <main className="bg-slate-100 m-5 p-5">
            <div className = 'text-2xl'>
                {profile.data.name}
            </div>
            <table className='table-auto border-seperate border-spacing-2'>
                <tbody>
                    <tr><td>Email</td> <td>{profile.data.email}</td></tr>
                    <tr><td>Tel.</td> <td>{profile.data.tel}</td></tr>
                    <tr><td>Member Since</td> <td>{createdAt.toString()}</td></tr>
                </tbody>
            </table>

            {
                (profile.data.role=="admin")?
                <form action={addCampground}>
                    <div className="text-xl text-blue-700">Create Campground</div>
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

        </main>
    );
}
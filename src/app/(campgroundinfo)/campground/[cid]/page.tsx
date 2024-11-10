import Image from "next/image"
import getCampground from "@/libs/getCampground"
import Link from "next/link"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions"
import getUserProfile from "@/libs/getUserProfile"

export default async function CampgroundDetailPage({ params }: { params: { cid: string } }) {
    const campgroundDetail = await getCampground(params.cid)

    const session = await getServerSession(authOptions)
    if(!session || !session.user?.token) return null

    const profile = await getUserProfile(session.user.token)

    return (
        <main className="text-center p-5">
            <h1 className="text-lg font-medium">
                {campgroundDetail.data.name}
            </h1>
            <div className="flex flex-row my-5">
                <Image src={campgroundDetail.data.picture}
                    alt='Campground Image'
                    width={0} height={0} sizes="100vw"
                    className="rounded-lg w-[30%]"
                />
                <div className="text-md mx-5 text-left">{campgroundDetail.data.name}
                    {
                        (profile.data.role=="admin") &&
                        <div className="text-md mx-5">ID: {campgroundDetail.data.id}</div>
                    }
                    <div className="text-md mx-5">Address: {campgroundDetail.data.address}</div>
                    <div className="text-md mx-5">District: {campgroundDetail.data.district}</div>
                    <div className="text-md mx-5">Province: {campgroundDetail.data.province}</div>
                    <div className="text-md mx-5">Tel. {campgroundDetail.data.tel}</div>
                    <Link href={`/reservations?id=${params.cid}&name=${campgroundDetail.data.name}`}>
                        <button className="block rounded-md bg-sky-600 hover:bg-indigo-600 px-3 py-2
                            text-white shadow-sm">
                            Make Reservation
                        </button>
                    </Link>
                    {
                        (profile.data.role=="admin") &&
                        <Link href={`/reservations/manage`}>
                        <button className="block rounded-md bg-sky-600 hover:bg-indigo-600 px-3 py-2
                            text-white shadow-sm">
                            Manage this campground
                        </button>
                    </Link>
                    }
                </div>

            </div>

        </main>
    )
}

// export async function generateStaticParams() {
//     return [{ cid: '001' }, { cid: '002' }, { cid: '003' }, { cid: '004' }]
// }
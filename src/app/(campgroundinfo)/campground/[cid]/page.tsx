import Image from "next/image"
import getCampground from "@/libs/getCampground"
import Link from "next/link"

export default async function CampgroundDetailPage({ params }: { params: { cid: string } }) {
    const campgroundDetail = await getCampground(params.cid)
    /**
     * Mock Data for demo
     */
    /*
    const mockCarRepo = new Map()
    mockCarRepo.set("001",{ cid: "001", name: "Chulalongkorn Hospital", image: "/img/chula.jpg" })
    mockCarRepo.set("002",{ cid: "002", name: "Rajavithi Hospital", image: "/img/rajavithi.jpg" })
    mockCarRepo.set("003",{ cid: "003", name: "Thammasat University Hospital", image: "/img/thammasat.jpg" })
    mockCarRepo.set("004",{ cid: "004", name: "vajira", image: "/img/vajira.jpg" })
    */

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
                </div>

            </div>

        </main>
    )
}

// export async function generateStaticParams() {
//     return [{ cid: '001' }, { cid: '002' }, { cid: '003' }, { cid: '004' }]
// }
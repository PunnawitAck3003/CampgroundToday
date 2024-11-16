import ReservationCart from "@/components/ReservationCart"

export default function CartPage(){
    return (
        <main className="p-5">
            <h1 className="text-center text-3xl font-semibold text-gray-900 mb-3">
                Reservation
            </h1>
            <ReservationCart></ReservationCart>
        </main>
    )
}
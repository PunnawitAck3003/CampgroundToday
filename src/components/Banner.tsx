"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useSession } from "next-auth/react";

export default function Banner() {
    const covers = ["/img/campground1.jpg", "/img/campground3.jpg"];
    const [index, setIndex] = useState(0);
    const [fade, setFade] = useState(true);
    const router = useRouter();

    const { data: session } = useSession();

    useEffect(() => {
        const interval = setInterval(() => {
            setFade(false);
            setTimeout(() => {
                setIndex((prevIndex) => (prevIndex + 1) % covers.length);
                setFade(true);
            }, 250);
        }, 5000);

        return () => clearInterval(interval);
    }, [covers.length]);

    return (
        <div
            className="relative w-full overflow-hidden cursor-pointer shadow-lg border border-green-600 rounded-lg h-[500px]"
            onClick={() => setIndex(index + 1)}
        >
            <div className={`transition-opacity duration-300 ${fade ? "opacity-100" : "opacity-0"}`}>
                <Image
                    src={covers[index % covers.length]}
                    alt="banner"
                    fill={true}
                    priority
                    style={{ objectFit: "cover" }}
                />
            </div>

            {/* Overlay with Text */}
            <div className="absolute inset-0 flex flex-col items-start justify-end bg-gradient-to-t from-black via-transparent to-transparent text-white z-10 p-4 md:p-5 ">
                <div className="mb-20 md:mb-0 mr-5">
                    <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold">Campground Today</h1>
                    <h3 className="text-sm md:text-lg lg:text-xl font-serif mt-2 text-gray-200">
                        Get ready to camp, explore, and make unforgettable memories.
                    </h3>
                </div>
            </div>


            {/* Session Greeting */}
            {session && (
                <div className="absolute top-5 right-10 ml-5 font-semibold text-white text-base md:text-lg lg:text-xl z-30">
                    Welcome {session.user?.name}
                </div>
            )}

            {/* Call to Action Button */}
            <button
                className="bg-green-700 text-white border border-transparent
            ml-2 font-semibold py-1 px-3 md:py-2 md:px-4 lg:py-2 lg:px-4
            rounded-lg z-30 absolute bottom-2 right-2 md:bottom-5 md:right-5
            hover:bg-white hover:text-green-700 hover:border-green-700 transition duration-200 text-xs md:text-base lg:text-lg"
                onClick={(e) => {
                    e.stopPropagation();
                    router.push("/campground");
                }}
            >
                Check Campground NOW
            </button>
        </div>
    );
}

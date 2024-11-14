'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useSession } from 'next-auth/react';

export default function Banner() {
    const covers = ['/img/campground1.jpg', '/img/campground3.jpg'];
    const [index, setIndex] = useState(0);
    const [fade, setFade] = useState(true);
    const router = useRouter();

    const { data: session } = useSession();
    console.log(`Hi ${session?.user._id}`);
    //console.log(session?.user.token);

    // Automatically change the image every 5 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            setFade(false);
            setTimeout(() => {
                setIndex((prevIndex) => (prevIndex + 1) % covers.length);
                setFade(true);
            }, 250); // Delay for smooth transition
        }, 5000);

        // Cleanup interval on component unmount
        return () => clearInterval(interval);
    }, [covers.length]);

    return (
        <div
            className="relative w-full h-[500px] overflow-hidden cursor-pointer"
            onClick={() => { setIndex(index + 1); }}
        >
            <div className={`transition-opacity duration-300 ${fade ? 'opacity-100' : 'opacity-0'}`}>
                <Image
                    src={covers[index % covers.length]}
                    alt='banner'
                    fill={true}
                    priority
                    style={{ objectFit: 'cover' }}
                />
            </div>

            <div className="absolute inset-0 flex items-end justify-start bg-black bg-opacity-5 text-white z-10 p-5">
                <div>
                    <h1 className="text-4xl font-medium">Campground Today</h1>
                    <h3 className="text-xl font-serif mt-2">Get ready to camp, explore, and make unforgettable memories.</h3>
                </div>
            </div>


            {session ? (
                <div className="absolute top-5 right-10 font-semibold text-white text-xl z-30">
                    Welcome {session.user?.name}
                </div>
            ) : null}

            <button
                className="bg-white text-cyan-600 border border-cyan-600 font-semibold py-2 px-4 m-2 rounded z-30 absolute bottom-5 right-5 hover:bg-cyan-600 hover:text-white hover:border-transparent transition duration-200"
                onClick={(e) => { e.stopPropagation(); router.push('/campground'); }}
            >
                Check Campground NOW
            </button>
        </div>
    );
}

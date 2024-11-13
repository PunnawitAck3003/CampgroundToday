'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from './banner.module.css';
import Image from 'next/image';
import { useSession } from 'next-auth/react';

export default function Banner() {
    const covers = ['/img/campground1.jpg', '/img/campground3.jpg'];
    const [index, setIndex] = useState(0);
    const [fade, setFade] = useState(true);
    const router = useRouter();

    const { data: session } = useSession();
    console.log(session?.user.token);

    // Automatically change the image every 5 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            setFade(false);
            setTimeout(() => {
                setIndex((prevIndex) => (prevIndex + 1) % covers.length);
                setFade(true);
            }, 500); // Delay for smooth transition
        }, 5000);

        // Cleanup interval on component unmount
        return () => clearInterval(interval);
    }, [covers.length]);

    return (
        <div className={styles.banner} onClick={() => { setIndex(index + 1); }}>
            <div className={fade ? styles.fadeIn : styles.fadeOut}>
                <Image
                    src={covers[index % covers.length]}
                    alt='banner'
                    fill={true}
                    priority
                    objectFit='cover'
                />
            </div>

            <div className={styles.bannerText}>
                <h1 className='text-4xl font-medium'>Campground Today</h1>
                <h3 className='text-xl font-serif'>Get ready to camp, explore, and make unforgettable memories.</h3>
            </div>
            {session ? (
                <div className='z-30 absolute top-5 right-10 font-semibold text-cyan-800 text-xl'>
                    Hello {session.user?.name}
                </div>
            ) : null}
            <button
                className='bg-white text-cyan-600 border-cyan-600 font-semibold py-2 px-2 m-2 rounded z-30 absolute bottom-0 right-0 hover:bg-cyan-600 hover:text-white hover:border-transparent'
                onClick={(e) => { e.stopPropagation(); router.push('/campground'); }}
            >
                Check Campground NOW
            </button>
        </div>
    );
}

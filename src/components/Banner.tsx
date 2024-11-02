'use client'
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './banner.module.css'
import Image from 'next/image';
import { useSession } from 'next-auth/react';
// user interaction
export default function Banner(){
    const covers = ['/img/campground1.jpg', '/img/campground3.jpg']
    const [index, setIndex] = useState(0)
    const router = useRouter()

    const { data: session } = useSession()
    console.log(session?.user.token)

    return(
        <div className={styles.banner} onClick={()=>{setIndex(index+1)}}>
            <Image src={covers[index%2]}
            alt = 'banner'
            fill = {true}
            priority
            objectFit='cover'/>

            <div className={styles.bannerText}>
                <h1 className='text-4xl font-medium'>Campground Today</h1>
                <h3 className='text-xl font-serif'>Get vaccinated today to protect yourself and community อิอิ!</h3>
            </div>
            {
                session? <div className='z-30 absolute top-5 right-10 font-semibold text-cyan-800 text-xl'>
                    Hello {session.user?.name}</div>
                    : null
            }
            <button className='bg-white text-cyan-600 border-cyan-600
            font-semibold py-2 px-2 m-2 rounded z-30 absolute bottom-0 right-0
            hover:bg-cyan-600 hover:text-white hover:border-transparent'
            onClick={(e)=>{e.stopPropagation(); router.push('/campground')}}
            >
                Check Campground NOW
            </button>
        </div>
    );
}
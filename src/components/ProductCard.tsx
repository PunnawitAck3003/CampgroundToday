//import styles from './productcard.module.css'
import Image from 'next/image';
import InteractiveCard from './InteractiveCard';
import { on } from 'process';

export default function ProductCard( {campgroundName, imgSrc, onCompare} :
    {campgroundName:string, imgSrc:string, onCompare?:Function}) {

    return (
        <InteractiveCard contentName={campgroundName}>
            <div className='w-full h-[70%] relative rounded-t-lg'>
                <Image src={imgSrc}
                    alt='Product Picture'
                    fill={true}
                    className='object-cover rounded-t-lg'
                />
            </div>
            <div className='w-full h-[15%] p-[10px]'>{campgroundName}</div>
            {
                onCompare? <button className='block h-[10%] text-sm rounded-md bg-sky-600
                hover:bg-indigo-600 mx-2 px-1 py-1 text-white shadow-sm'
                onClick={(e)=>{onCompare(campgroundName); e.stopPropagation(); e.preventDefault()}}
                >Compare</button>:''
            }
        </InteractiveCard>
    );
}
import Image from 'next/image';
import TopMenuItem from './TopMenuItem';
import { getServerSession } from 'next-auth';
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import Link from "next/link";

export default async function TopMenu() {
    const session = await getServerSession(authOptions);
    console.log(session?.user)
    if (!session) console.log("no session");

    return (
        <div className="h-12 bg-white fixed top-0 left-0 right-0 z-30 border-t border-b border-gray-200 flex items-center px-4 shadow-md">
            {/* Left-aligned Menu */}
            <div className="flex flex-row items-center">
                <Link href="/" className="h-10">
                    <Image
                        src={'/img/logo1.jpg'}
                        alt="logo"
                        width={0}
                        height={0}
                        sizes="100vh"
                        className="h-full w-auto cursor-pointer"
                    />
                </Link>
                <TopMenuItem title="Campground" pageRef="/campground" />
                {session?.user.role=="user" && (
                    <TopMenuItem title="My Reservations" pageRef="/cart" />
                )}
                <TopMenuItem title="About" pageRef="/about" />
            </div>

            {/* Right-aligned Menu */}
            <div className="flex flex-row items-center ml-auto">
                {session && (
                    <TopMenuItem title="My Reservations" pageRef="/cart" />
                )}
                {session ? (
                    <Link href="/api/auth/signout">
                        <div className="flex items-center h-full px-2 text-cyan-600 text-sm cursor-pointer">
                            Sign-Out of {session.user?.name}
                        </div>
                    </Link>
                ) : (
                    <>
                        <Link href="/api/auth/signin">
                            <div className="flex items-center h-full px-2 text-cyan-600 text-sm cursor-pointer">
                                Sign-In
                            </div>
                        </Link>
                        <Link href="/register">
                            <div className="flex items-center h-full px-2 text-cyan-600 text-sm cursor-pointer">
                                Register
                            </div>
                        </Link>
                    </>
                )}
            </div>
        </div>
    );
}

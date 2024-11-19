"use client"
import React, { useState, useEffect } from "react";

export default function About() {
    const [fadeIn, setFadeIn] = useState(false);

    useEffect(() => {
        setFadeIn(true);
    }, []);

    return (
        <div
            className={`transition-opacity duration-[2000ms] ${fadeIn ? 'opacity-100' : 'opacity-0'} bg-cover bg-center text-white p-6 rounded-lg`}
            style={{ backgroundImage: 'url(/img/Yurucamp%20background.gif)' }}
        >
            <h1 className="text-center text-3xl font-semibold text-gray-900 mb-3">
                About Us
            </h1>
            <p className="text-center text-lg text-gray-700 bg-white bg-opacity-60 p-6 rounded-md">
                <strong>About CampgroundToday</strong>
                <br />
                 Welcome to <strong>CampgroundToday</strong>, your ultimate destination for discovering and reserving the perfect camping spot. Whether you're looking to escape to the serene landscapes of Thailand or embark on an adventure inspired by the beautiful locations featured in the anime <i>Yuru Camp</i> in Japan, we've got you covered.
                <br /><br />
                At CampgroundToday, we believe that camping is more than just a getaway—it's a chance to reconnect with nature, create lasting memories, and embrace the outdoors. Our platform offers a curated selection of campsites from across Thailand and Japan, making it easier than ever to plan your next adventure.
                <br /><br />
                <strong>What We Offer</strong>
                <ul className="list-disc pl-5">
                    <li><strong>Diverse Campsites:</strong> From the tropical beauty of Thailand to the tranquil Japanese countryside, we feature a variety of campsites that cater to different preferences and needs.</li>
                    <li><strong>Yuru Camp Inspiration:</strong> For anime fans, we’ve specifically highlighted campsites that were featured in <i>Yuru Camp</i>—a series that beautifully captures the essence of camping in Japan. Now, you can visit these iconic spots yourself.</li>
                    <li><strong>Seamless Reservations:</strong> With our user-friendly platform, you can easily search, compare, and book campsites with just a few clicks, ensuring a stress-free start to your outdoor journey.</li>
                </ul>
                <br />
                <strong>Our Mission</strong>
                <br />
                Our mission is simple: to inspire a love for camping and make it easier for people to experience the beauty of nature. Whether you’re a seasoned camper or a first-timer, CampgroundToday is here to guide you toward your perfect camping destination.
                <br /><br />
                Join us today and begin your next adventure!
            </p>

            <div className="flex justify-center space-x-10 p-8">
                {/* Founder 1 */}
                <div className="flex flex-col items-center">
                    <img src="\img\ackPic.jfif" alt="Founder 1" className="w-48 h-48 rounded-full border-4 border-gray-300 mb-4" />
                    <div className="text-center">
                        <h3 className="font-semibold text-xl text-shadow">Punnawit Bhoopat</h3>
                        <p className="text-white opacity-90 text-shadow">Founder</p>
                        <p className="text-white opacity-80 text-shadow">ID: 6532124121</p>
                        <a href="https://github.com/PunnawitAck3003/" target="_blank" className="text-blue-500">GitHub</a>
                    </div>
                </div>
                {/* Co-Founder */}
                <div className="flex flex-col items-center">
                    <img src="img\winnie the pooh - Square cropped.png" alt="Co-Founder" className="w-48 h-48 rounded-full border-4 border-gray-300 mb-4" />
                    <div className="text-center">
                        <h3 className="font-semibold text-xl text-shadow">Poopha Suwananek</h3>
                        <p className="text-white opacity-90 text-shadow">Co-Founder</p>
                        <p className="text-white opacity-80 text-shadow">ID: 6532141821</p>
                        <a href="https://github.com/yeyethepooh" target="_blank" className="text-blue-500">GitHub</a>
                    </div>
                </div>
            </div>

            
            <div className="flex items-center justify-center h-screen">
                <iframe
                    className="border border-gray-200"
                    width="800" height="450"
                    src="https://embed.figma.com/design/LDQPRNKWNCX5x1u7LSM3PN/CampgroundToday?embed-host=share"
                    allowFullScreen
                />
            </div>
        </div>
    );
}

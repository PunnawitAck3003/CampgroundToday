"use client";
import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import Banner from "@/components/Banner";

const About = dynamic(() => import("@/components/aboutPage"), { ssr: false });

export default function Home() {
  const [showAbout, setShowAbout] = useState(false);
  const [fadeIn, setFadeIn] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;

      if (scrollPosition >= documentHeight / 2) {
        if (!showAbout) {
          setShowAbout(true);
        }
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, [showAbout]);

  useEffect(() => {
    if (showAbout) {
      setTimeout(() => setFadeIn(true), 100);
    }
  }, [showAbout]);

  return (
    <main className="py-5">
      <Banner />
      <div className="h-32"></div>
      {showAbout && (
        <div
          className={`transition-opacity duration-[2000ms] ${fadeIn ? 'opacity-100' : 'opacity-0'} bg-cover bg-center text-white p-6 rounded-lg`}
          style={{ backgroundImage: 'url(/img/Yurucamp%20background.gif)' }}
        >
          <About />
        </div>
      )}
    </main>
  );
}

import React, { useState } from "react";
import { FaChevronLeft, FaChevronRight, FaChevronDown } from "react-icons/fa";
import { Link } from "react-router-dom"; // Import Link for navigation

const Landing: React.FC = () => {
    const [currentFeature, setCurrentFeature] = useState(0);

    // List of features with descriptions
    const features = [
        {
            title: "Mood Tracker",
            description:
                "Check in with yourself every day! Track how you're feeling, spot patterns, and learn what makes you tick. It's like having a little emotional sidekick cheering you on.",
        },
        {
            title: "Journal",
            description:
                "Your personal thought dump—no judgment, just a cozy space to let it all out. Write, reflect, rant, or dream. Whatever’s on your mind, it belongs here.",
        },
        {
            title: "Community",
            description:
                "Find your people! Share your story, swap tips, or just vibe with others who get it. We’re all in this together.",
        },
        {
            title: "Resources",
            description:
                "From quick reads to handy tools and exercises, we’ve got the good stuff to help you out. Think of it as your go-to self-care toolkit.",
        },
    ];

    // Handle navigation
    const goToPrevious = () => {
        setCurrentFeature((prev) => (prev === 0 ? features.length - 1 : prev - 1));
    };

    const goToNext = () => {
        setCurrentFeature((prev) => (prev === features.length - 1 ? 0 : prev + 1));
    };

    return (
        <>
            {/* Landing Section */}
            <div
                className="w-full h-screen bg-cover bg-center flex flex-col items-center justify-center relative"
                style={{ backgroundImage: "url('/src/assets/img/main_bg.PNG')" }}
            >
                <div className="text-center text-white font-serif">
                    <h1 className="text-6xl font-bold mb-4">HealMY</h1>
                    <p className="text-lg font-light">Feel Better, One Step at a Time.</p>
                </div>

                {/* See More Section */}
                <div className="absolute bottom-10 flex flex-col items-center">
                    <p className="text-white text-base mb-1 animate-bounce">See More</p>
                    <div
                        className="w-8 h-8 flex items-center justify-center bg-transparent text-white rounded-full cursor-pointer hover:bg-[#DA8359] transition duration-300"
                        onClick={() =>
                            document.getElementById("about-section")?.scrollIntoView({ behavior: "smooth" })
                        }
                    >
                        <FaChevronDown className="text-lg" />
                    </div>
                </div>
            </div>

            {/* About and Features Section */}
            <div id="about-section" className="w-full h-screen bg-gray-100 flex">
                {/* About Section */}
                <div className="text-center w-1/2 flex flex-col items-center justify-center border-r border-[#47663B] p-4">
                    <h2 className="text-4xl font-serif text-[#47663B] mb-4">About HealMY</h2>
                    <p className="text-md max-w-lg text-[#A5B68D]">
                        HealMY is your go-to web app for tracking moods, journaling your thoughts,
                        and connecting with a supportive community. It's a safe space to reflect,
                        grow, and discover resources to help you feel better every day.
                    </p>
                    <p className="text-md max-w-lg text-[#A5B68D] mt-4">
                        We’re here to remind you—you’re not alone on this journey. Let’s take it
                        one step at a time, together.
                    </p>

                    {/* Join Us Button */}
                    <Link to="/SignUp">
                        <button className="border-2 border-[#47663B] rounded-full px-10 py-2 text-md font-semibold text-[#47663B] hover:bg-[#A5B68D] hover:text-white transition duration-300 mt-8">
                            Join Us
                        </button>
                    </Link>
                </div>

                {/* Features Section */}
                <div className="w-1/2 flex flex-col items-center justify-center p-4 relative">
                    <h3 className="text-4xl font-serif text-[#47663B] mb-4">Features</h3>
                    <div className="flex items-center justify-between w-full">
                        {/* Left Arrow */}
                        <button
                            onClick={goToPrevious}
                            className="p-3 rounded-full bg-transparent hover:bg-gray-200 transition duration-300"
                        >
                            <FaChevronLeft className="text-[#47663B] text-xl" />
                        </button>

                        {/* Current Feature */}
                        <div className="flex flex-col items-center text-center">
                            {/* Feature Title */}
                            <div className="border-2 border-[#47663B] rounded-full px-6 py-2 text-lg font-semibold text-[#47663B] mb-4">
                                {features[currentFeature].title}
                            </div>

                            {/* Feature Description */}
                            <p className="text-[#A5B68D] text-base max-w-md">
                                {features[currentFeature].description}
                            </p>
                        </div>

                        {/* Right Arrow */}
                        <button
                            onClick={goToNext}
                            className="p-3 rounded-full bg-transparent hover:bg-gray-200 transition duration-300"
                        >
                            <FaChevronRight className="text-[#1F4529] text-xl" />
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Landing;

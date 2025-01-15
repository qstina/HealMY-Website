import React, { useState } from "react";
import { FaChevronLeft, FaChevronRight, FaChevronDown } from "react-icons/fa";
import { Link } from "react-router-dom";

const App: React.FC = () => {
    const [currentFeature, setCurrentFeature] = useState(0);

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

    const goToPrevious = () => {
        setCurrentFeature((prev) => (prev === 0 ? features.length - 1 : prev - 1));
    };

    const goToNext = () => {
        setCurrentFeature((prev) => (prev === features.length - 1 ? 0 : prev + 1));
    };

    return (
        <>
            <div
                className="w-full border-b-2 border-black h-screen bg-[#ECDFCC] flex flex-col items-center justify-center relative">
                <div className="absolute top-5 left-5 flex font-serif text-black text-2xl">HealMY</div>
                <div className="absolute top-5 right-5 flex space-x-4">
                    <Link to="/login">
                        <button className="bg-white border-2 border-black rounded-full px-6 py-2 text-black font-semibold hover:bg-[#A5B68D] hover:text-white transition duration-300">
                            Log In
                        </button>
                    </Link>
                    <Link to="/signup">
                        <button className="bg-white border-2 border-black rounded-full px-6 py-2 text-black font-semibold hover:bg-[#A5B68D] hover:text-white transition duration-300">
                            Sign Up
                        </button>
                    </Link>
                </div>

                <div className="text-center font-serif">
                    <h1 className="text-6xl text-black font-bold mb-4">HealMY</h1>
                    <p className="text-lg font-light text-black">Feel Better, One Step at a Time.</p>
                </div>

                <div className="absolute bottom-10 flex flex-col items-center">
                    <p className="text-black text-base mb-1 animate-bounce">See More</p>
                    <div
                        className="w-8 h-8 flex items-center justify-center bg-transparent text-black rounded-full cursor-pointer hover:bg-[#A5B68D] hover:text-white transition duration-300"
                        onClick={() =>
                            document.getElementById("about-section")?.scrollIntoView({ behavior: "smooth" })
                        }
                    >
                        <FaChevronDown className="text-lg" />
                    </div>
                </div>
            </div>

            <div id="about-section" className="w-full h-screen bg-[#ECDFCC] flex">
                <div className="text-center w-1/2 flex flex-col items-center justify-center p-4">
                    <div className="border-2 border-black p-10 rounded-lg bg-white">
                        <h2 className="text-4xl font-serif text-black mb-4">About HealMY</h2>
                        <p className="text-md max-w-lg text-black">
                            HealMY is your go-to web app for tracking moods, journaling your thoughts,
                            and connecting with a supportive community. It's a safe space to reflect,
                            grow, and discover resources to help you feel better every day.
                        </p>
                        <p className="text-md max-w-lg text-black mt-4">
                            We’re here to remind you—you’re not alone on this journey. Let’s take it
                            one step at a time, together.
                        </p>

                        <Link to="/SignUp">
                            <button className="border-2 border-black bg-black rounded-full px-10 py-2 text-md font-semibold text-white hover:bg-[#A5B68D] hover:text-white transition duration-300 mt-8">
                                Join Us
                            </button>
                        </Link>
                    </div>
                </div>

                <div className="w-1/2 bg-white flex flex-col items-center justify-center p-10 relative border-l-2 border-black">
                    <h3 className="text-4xl font-serif text-black mb-4">Features</h3>
                    <div className="flex items-center justify-between w-full">
                        <button
                            onClick={goToPrevious}
                            className="p-3 rounded-full bg-transparent text-black hover:bg-[#A5B68D] hover:text-white transition duration-300"
                        >
                            <FaChevronLeft className="text-xl" />
                        </button>

                        <div className="flex flex-col items-center text-center">
                            <div className="border-2 border-black bg-black rounded-full px-6 py-2 text-lg font-semibold text-white mb-4">
                                {features[currentFeature].title}
                            </div>
                            <p className="text-black text-base max-w-md">
                                {features[currentFeature].description}
                            </p>
                        </div>

                        <button
                            onClick={goToNext}
                            className="p-3 rounded-full bg-transparent text-black hover:bg-[#A5B68D] hover:text-white transition duration-300"
                        >
                            <FaChevronRight className="text-xl" />
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default App;

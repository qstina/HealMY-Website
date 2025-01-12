import { Link, useLocation } from "react-router-dom";
import { CgProfile } from "react-icons/cg";

const Navbar = () => {
    const location = useLocation();

    const isActive = (path: string) => location.pathname === path;

    return (
        <nav className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-white py-3 px-8 rounded-full flex justify-between items-center w-[90%] max-w-4xl z-50">
            {/* Logo */}
            <Link
                to="/home"
                className="text-2xl font-serif font-bold text-gray-800 hover:text-gray-600"
            >
                HealMY
            </Link>

            {/* Navigation Links */}
            <div className="flex space-x-6">
                <Link
                    to="/home"
                    className={`text-lg ${
                        isActive("/home") ? "text-gray-800 font-bold" : "text-gray-500"
                    } hover:text-gray-800`}
                >
                    Home
                </Link>
                <Link
                    to="/moodtracker"
                    className={`text-lg ${
                        isActive("/moodtracker") ? "text-gray-800 font-bold" : "text-gray-500"
                    } hover:text-gray-800`}
                >
                    Mood Tracker
                </Link>
                <Link
                    to="/journal"
                    className={`text-lg ${
                        isActive("/journal") ? "text-gray-800 font-bold" : "text-gray-500"
                    } hover:text-gray-800`}
                >
                    Journal
                </Link>
                <Link
                    to="/community"
                    className={`text-lg ${
                        isActive("/community") ? "text-gray-800 font-bold" : "text-gray-500"
                    } hover:text-gray-800`}
                >
                    Community
                </Link>
                <Link
                    to="/resources"
                    className={`text-lg ${
                        isActive("/resources") ? "text-gray-800 font-bold" : "text-gray-500"
                    } hover:text-gray-800`}
                >
                    Resources
                </Link>
            </div>

            {/* Profile Icon */}
            <Link to="/profile" className="text-2xl text-gray-500 hover:text-gray-800">
                <CgProfile />
            </Link>
        </nav>
    );
};

export default Navbar;

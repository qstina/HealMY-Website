import { Link, useLocation } from "react-router-dom";
import { CgProfile } from "react-icons/cg";

const Navbar = () => {
    const location = useLocation();

    const isActive = (path: string) => location.pathname === path;

    return (
        <nav className="fixed top-4 left-1/2 transform -translate-x-1/2 py-3 px-8 flex justify-between items-center w-[90%] max-w-4xl z-50 font-serif">
            {/* Logo */}
            <Link
                to="/home"
                className="text-2xl font-serif text-black hover:text-gray-600"
            >
                HealMY
            </Link>

            {/* Navigation Links */}
            <div className="flex space-x-6">
                <Link
                    to="/moodtracker"
                    className={`text-lg ${
                        isActive("/moodtracker") ? "font-bold" : ""
                    } text-black hover:text-gray-600`}
                >
                    Mood Tracker
                </Link>
                <Link
                    to="/journal"
                    className={`text-lg ${
                        isActive("/journal") ? "font-bold" : ""
                    } text-black hover:text-gray-600`}
                >
                    Journal
                </Link>
                <Link
                    to="/community"
                    className={`text-lg ${
                        isActive("/community") ? "font-bold" : ""
                    } text-black hover:text-gray-600`}
                >
                    Community
                </Link>
                <Link
                    to="/resources"
                    className={`text-lg ${
                        isActive("/resources") ? "font-bold" : ""
                    } text-black hover:text-gray-600`}
                >
                    Resources
                </Link>
            </div>

            {/* Profile Icon */}
            <Link to="/profile" className="text-2xl text-black hover:text-gray-600">
                <CgProfile />
            </Link>
        </nav>
    );
};

export default Navbar;

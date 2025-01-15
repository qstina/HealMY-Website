import { useEffect, useState } from "react";
import { getFirestore, collection, getDocs, query, where } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";

const MoodCalendar = () => {
    const [moodStats, setMoodStats] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
    const [selectedMood, setSelectedMood] = useState<any | null>(null);

    const auth = getAuth();
    const db = getFirestore();

    useEffect(() => {
        const fetchMoodStats = async () => {
            if (!auth.currentUser) return;

            const userId = auth.currentUser.uid;
            const moodsRef = collection(db, "moods");
            const q = query(moodsRef, where("userId", "==", userId));
            const querySnapshot = await getDocs(q);

            const stats: any[] = [];
            querySnapshot.forEach((doc) => {
                stats.push({ id: doc.id, ...doc.data() });
            });

            setMoodStats(stats);
            setLoading(false);
        };

        fetchMoodStats();
    }, [auth, db]);

    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
    const monthNames = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
    ];
    const dayLabels = ["Sun", "Mon", "Tues", "Wed", "Thurs", "Fri", "Sat"];

    const prevMonth = () => {
        setCurrentMonth((prev) => (prev === 0 ? 11 : prev - 1));
        if (currentMonth === 0) setCurrentYear((prev) => prev - 1);
    };

    const nextMonth = () => {
        setCurrentMonth((prev) => (prev === 11 ? 0 : prev + 1));
        if (currentMonth === 11) setCurrentYear((prev) => prev + 1);
    };

    const getMoodColor = (mood: string) => {
        switch (mood) {
            case "Happy":
                return "bg-yellow-400";
            case "Sad":
                return "bg-blue-400";
            case "Neutral":
                return "bg-gray-400";
            case "Excited":
                return "bg-green-400";
            case "Angry":
                return "bg-red-400";
            case "Relaxed":
                return "bg-purple-400";
            default:
                return "bg-gray-200";
        }
    };

    const handleDayClick = (day: number) => {
        const moodForDay = moodStats.find((mood) => {
            const moodDate = new Date(mood.timestamp.seconds * 1000);
            return (
                moodDate.getDate() === day &&
                moodDate.getMonth() === currentMonth &&
                moodDate.getFullYear() === currentYear
            );
        });

        if (moodForDay) {
            setSelectedMood(moodForDay);
        } else {
            setSelectedMood(null);
        }
    };

    const closeModal = () => {
        setSelectedMood(null);
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="w-full max-h-full">
            <div className="flex justify-center items-center mb-4">
                <button
                    className="p-2 text-black hover:bg-[#A5B68D] hover:text-white rounded-full transition duration-300"
                    onClick={prevMonth}
                >
                    <FontAwesomeIcon icon={faChevronLeft} />
                </button>
                <h3 className="text-xl font-serif text-center text-black font-bold mx-4">
                    {monthNames[currentMonth]} {currentYear}
                </h3>
                <button
                    className="p-2 text-black hover:bg-[#A5B68D] hover:text-white rounded-full transition duration-300"
                    onClick={nextMonth}
                >
                    <FontAwesomeIcon icon={faChevronRight} />
                </button>
            </div>
            <div className="grid grid-cols-7 gap-1">
                {dayLabels.map((label) => (
                    <div key={label} className="text-center text-sm font-bold text-black">
                        {label}
                    </div>
                ))}
                {Array.from({ length: firstDayOfMonth }, (_, i) => (
                    <div key={`empty-${i}`} className="p-2"></div>
                ))}
{Array.from({ length: daysInMonth }, (_, i) => {
    const day = i + 1;
    const moodForDay = moodStats.find((mood) => {
        const moodDate = new Date(mood.timestamp.seconds * 1000);
        return (
            moodDate.getDate() === day &&
            moodDate.getMonth() === currentMonth &&
            moodDate.getFullYear() === currentYear
        );
    });

    const moodColor = moodForDay ? getMoodColor(moodForDay.mood) : "";
    const additionalClasses = moodForDay
        ? moodColor
        : "border-2 border-black bg-white";

    return (
        <div
            key={day}
            className={`p-1.5 rounded-md cursor-pointer ${additionalClasses} hover:scale-105 transition-transform`}
            onClick={() => handleDayClick(day)}
        >
            <p
                className={`text-center text-xs font-bold ${
                    moodForDay ? "text-white" : "text-black"
                }`}
            >
                {day}
            </p>
        </div>
    );
})}

            </div>

            {selectedMood && (
    <div
        className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-50 z-50"
    >
        <div className="bg-white rounded-lg p-4 w-3/4 max-w-md relative">
            <h3 className="text-xl font-bold mb-4">Mood Details</h3>
            <p><strong>Mood:</strong> {selectedMood.mood}</p>
            <p><strong>Notes:</strong> {selectedMood.notes || "No notes available."}</p>
            <button
                className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
                onClick={closeModal}
            >
                ✖
            </button>
        </div>
    </div>
)}

        </div>
    );
};

export default MoodCalendar;

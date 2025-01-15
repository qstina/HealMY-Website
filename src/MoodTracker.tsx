import { useState, useEffect } from "react";
import { getFirestore, collection, addDoc, Timestamp } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { Link } from "react-router-dom";
import Navbar from "./Navbar"; // Importing Navbar

const MoodTracker = () => {
    const [mood, setMood] = useState('');
    const [notes, setNotes] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [userId, setUserId] = useState<string | null>(null);
    const [isNavbarVisible, setIsNavbarVisible] = useState(true);

    const moods = [
        { label: 'Happy', color: 'bg-yellow-400' },
        { label: 'Sad', color: 'bg-blue-400' },
        { label: 'Neutral', color: 'bg-gray-400' },
        { label: 'Excited', color: 'bg-green-400' },
        { label: 'Angry', color: 'bg-red-400' },
        { label: 'Relaxed', color: 'bg-purple-400' }
    ];

    const db = getFirestore();
    const auth = getAuth();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUserId(user.uid);
            } else {
                setUserId(null);
            }
        });

        return () => unsubscribe();
    }, [auth]);

    useEffect(() => {
        let lastScrollTop = 0;
        const handleScroll = () => {
            const scrollTop = window.scrollY;
            setIsNavbarVisible(scrollTop <= lastScrollTop);
            lastScrollTop = scrollTop;
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const handleMoodSelect = (selectedMood: string) => {
        setMood(selectedMood);
        setError('');
    };

    const handleNotesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNotes(e.target.value);
    };

    const saveMood = async () => {
        if (!userId) {
            setError('You need to log in to save your mood.');
            return;
        }

        if (!mood) {
            setError('Please select a mood.');
            return;
        }

        try {
            const moodData = {
                userId,
                mood,
                notes,
                timestamp: Timestamp.now(),
            };

            await addDoc(collection(db, 'moods'), moodData);

            setError('');
            setSuccess('Mood saved successfully!');
            setMood('');
            setNotes('');
        } catch (error) {
            setError('Failed to save mood, please try again.');
            console.error("Error saving mood data: ", error);
        }
    };

    return (
        <div className="w-full min-h-screen bg-[#ECDFCC] text-gray-900">
            {isNavbarVisible && <Navbar />}

            {/* Content */}
            <div className="w-full text-center py-20 font-serif">
                <h3 className="mt-6 text-4xl  text-black">Mood Tracker</h3>
                <p className="text-lg font-sans text-black">
                    How are you feeling today?
                </p>
            </div>

            <div className="-mt-8 w-full max-w-[400px] mx-auto flex flex-col items-center">
                <div className="flex flex-wrap justify-center mb-4">
                    {moods.map((moodOption, index) => (
                        <button
                            key={index}
                            className={`w-24 h-20 m-2 text-white font-semibold rounded-full ${mood === moodOption.label ? 'ring-4 ring-[#47663B]' : ''} ${moodOption.color} transition-transform transform hover:scale-105`}
                            onClick={() => handleMoodSelect(moodOption.label)}
                        >
                            {moodOption.label}
                        </button>
                    ))}
                </div>

                <input
                    type="text"
                    placeholder="Why are you feeling this way? (optional)"
                    className="w-full py-2 mb-4 px-4 bg-white border-2 border-black rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#A5B68D] text-gray-900"
                    value={notes}
                    onChange={handleNotesChange}
                />

                <button
                    className="w-full py-3 bg-black border-2 border-black text-white font-semibold rounded-lg hover:bg-[#A5B68D] transition-colors duration-300 mb-4"
                    onClick={saveMood}
                >
                    Save Mood
                </button>

                {error && (
                    <div className="w-full text-center text-red-500 font-medium mt-2">
                        {error}
                    </div>
                )}
                {success && (
                    <div className="w-full text-center text-green-500 font-medium mt-2">
                        {success}
                    </div>
                )}

                <Link
                    to="/home"
                    className="w-full py-3 bg-transparent border-2 border-black text-black font-semibold rounded-lg text-center hover:bg-[#A5B68D] hover:text-white transition-colors duration-300"
                >
                    View Your Monthly Mood Summary
                </Link>
            </div>
        </div>
    );
};

export default MoodTracker;

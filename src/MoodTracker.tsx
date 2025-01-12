import { useState } from "react";
import { getDatabase, ref, set, push } from "firebase/database";
import { getAuth } from "firebase/auth"; // For user authentication
import { Link } from "react-router-dom";  // Import Link from react-router-dom

const MoodTracker = () => {
    const [mood, setMood] = useState('');
    const [notes, setNotes] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const moods = [
        { label: 'Happy', color: 'bg-yellow-400' },
        { label: 'Sad', color: 'bg-blue-400' },
        { label: 'Neutral', color: 'bg-gray-400' },
        { label: 'Excited', color: 'bg-green-400' },
        { label: 'Angry', color: 'bg-red-400' },
        { label: 'Relaxed', color: 'bg-purple-400' }
    ];

    const db = getDatabase();
    const auth = getAuth();

    const handleMoodSelect = (selectedMood: string) => {
        setMood(selectedMood);
        setError('');
    };

    const handleNotesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNotes(e.target.value);
    };

    const saveMood = async () => {
        if (!mood) {
            setError('Please select a mood.');
        } else {
            try {
                // Get the current authenticated user's ID (if available)
                const user = auth.currentUser;
                const userId = user ? user.uid : "guest"; // Default to "guest" if not logged in
                
                // Create a new record in Realtime Database
                const moodData = {
                    userId,
                    mood,
                    notes,
                    timestamp: new Date().toISOString()
                };
                
                // Save the mood data under the 'moods' node in the database
                const moodRef = push(ref(db, 'moods/'));
                await set(moodRef, moodData);

                setError('');
                setSuccess('Mood saved successfully!');
                setMood('');
                setNotes('');
            } catch (error) {
                setError('Failed to save mood, please try again.');
                console.error("Error saving mood data: ", error);
            }
        }
    };

    return (
        <div className="w-full h-screen bg-cover bg-center" style={{ backgroundImage: "url('/src/assets/img/main_bg.PNG')" }}>
            <div className="w-full flex flex-col items-center justify-center h-full">
                {/* Header section */}
                <div className="text-white text-center mb-10 font-serif">
                    <h3 className="text-4xl font-bold mb-2">Mood Tracker</h3>
                    <p className="text-lg">Select your mood for the day and add some notes</p>
                </div>

                {/* Mood selection buttons */}
                <div className="w-full max-w-[400px] flex flex-col items-center font-sans">
                    <div className="flex flex-wrap justify-center mb-6">
                        {moods.map((moodOption, index) => (
                            <button
                                key={index}
                                className={`w-24 h-24 m-2 text-white font-semibold rounded-full ${mood === moodOption.label ? `border-4 border-white` : ''} ${moodOption.color}`}
                                onClick={() => handleMoodSelect(moodOption.label)}>
                                {moodOption.label}
                            </button>
                        ))}
                    </div>

                    {/* Notes input */}
                    <div className="w-full flex flex-col mb-6">
                        <input
                            type="text"
                            placeholder="Why are you feeling this way? (keywords)"
                            className="w-full text-white py-2 mb-4 bg-transparent border-b border-gray-500 focus:outline"
                            value={notes}
                            onChange={handleNotesChange}
                        />
                    </div>

                    {/* Button to save mood and notes */}
                    <div className="w-full flex flex-col mb-4">
                        <button
                            className="w-full bg-transparent border border-white text-white my-2 font-semibold rounded-md p-4 text-center flex items-center"
                            onClick={saveMood}>
                            Save Mood
                        </button>
                    </div>

                    {/* Display success or error message */}
                    {error && <div className="text-red-500 mb-4">{error}</div>}
                    {success && <div className="text-green-500 mb-4">{success}</div>}
                </div>

                <div className="w-full flex flex-col mb-4">
                    <Link to="/moodstats" className="w-full bg-transparent border border-white text-white my-2 font-semibold rounded-md p-4 text-center flex items-center">
                        View Monthly Stats
                    </Link>
                </div>
                
            </div>
            
        </div>
    );
};

export default MoodTracker;

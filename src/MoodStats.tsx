import { useState, useEffect } from "react";
import { getDatabase, ref, query, orderByChild, startAt, endAt, get } from "firebase/database"; // Add get() method
import { getAuth } from "firebase/auth"; // For user authentication
import { format, startOfMonth, endOfMonth, eachDayOfInterval } from "date-fns"; // Helper functions to manage dates

const MoodStats = () => {
    const [stats, setStats] = useState<any>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const db = getDatabase();
    const auth = getAuth();

    useEffect(() => {
        const fetchStats = async () => {
            try {
                // Get the current authenticated user's ID
                const user = auth.currentUser;
                const userId = user ? user.uid : "guest"; // Default to "guest" if not logged in

                // Get the start and end of the current month
                const currentMonthStart = startOfMonth(new Date());
                const currentMonthEnd = endOfMonth(new Date());

                // Format the start and end of the month as ISO strings
                const startOfMonthStr = currentMonthStart.toISOString();
                const endOfMonthStr = currentMonthEnd.toISOString();

                // Log start and end of the month to ensure correct date range
                console.log("Start of Month:", startOfMonthStr);
                console.log("End of Month:", endOfMonthStr);

                // Query the moods in the database for the current user and month
                const moodsRef = ref(db, 'moods');
                const moodQuery = query(
                    moodsRef,
                    orderByChild('timestamp'),
                    startAt(startOfMonthStr),
                    endAt(endOfMonthStr)
                );

                // Fetch the data from the database
                const snapshot = await get(moodQuery);
                const moodData = snapshot.val();

                // Check if mood data is fetched
                console.log("Mood Data from Firebase:", moodData);

                if (!moodData) {
                    console.log("No mood data found for the current month.");
                    setError('No mood data found for the current month.');
                    setLoading(false);
                    return;
                }

                // Group moods by day
                const dailyMoods: { [key: string]: string } = {}; // Map to store moods by day
                Object.keys(moodData).forEach((key) => {
                    const moodRecord = moodData[key];
                    if (moodRecord.userId === userId) {
                        const day = format(new Date(moodRecord.timestamp), 'yyyy-MM-dd'); // Get the date in YYYY-MM-DD format
                        dailyMoods[day] = moodRecord.mood; // Assign the mood to that day
                    }
                });

                // Get all days in the current month
                const daysInMonth = eachDayOfInterval({ start: currentMonthStart, end: currentMonthEnd });

                // Prepare the stats for rendering
                const mappedStats = daysInMonth.map((day) => {
                    const dayStr = format(day, 'yyyy-MM-dd');
                    return {
                        date: dayStr,
                        mood: dailyMoods[dayStr] || 'No mood recorded',
                    };
                });

                setStats(mappedStats);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching mood stats:', error);
                setError('Failed to fetch mood stats.');
                setLoading(false);
            }
        };

        fetchStats();
    }, [db, auth]);

    return (
        <div className="w-full h-screen bg-cover bg-center" style={{ backgroundImage: "url('/src/assets/img/main_bg.PNG')" }}>
            <div className="w-full flex flex-col items-center justify-center h-full">
                {/* Header section */}
                <div className="text-white text-center mb-10 font-serif">
                    <h3 className="text-4xl font-bold mb-2">Monthly Mood Stats</h3>
                    <p className="text-lg">See how your mood has been this month!</p>
                </div>

                {/* Stats display */}
                <div className="w-full max-w-[400px] flex flex-col items-center font-sans">
                    {loading ? (
                        <div className="text-white">Loading...</div>
                    ) : error ? (
                        <div className="text-red-500">{error}</div>
                    ) : (
                        <>
                            <div className="grid grid-cols-7 gap-2">
                                {stats.map((stat: { date: string, mood: string }) => {
                                    const date = new Date(stat.date);
                                    const dayOfWeek = date.getDay();
                                    const dayOfMonth = date.getDate();

                                    return (
                                        <div key={stat.date} className="text-center">
                                            <div className="text-lg">{dayOfMonth}</div>
                                            <div className={`p-2 mt-1 rounded ${stat.mood === 'Happy' ? 'bg-yellow-400' : stat.mood === 'Sad' ? 'bg-blue-400' : stat.mood === 'Excited' ? 'bg-green-400' : 'bg-gray-400'}`}>
                                                {stat.mood}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MoodStats;

import { useEffect, useState } from "react";
import { getAuth } from "firebase/auth";
import { getFirestore, doc, getDoc, collection, getDocs, addDoc, Timestamp } from "firebase/firestore";
import { getDatabase, ref, get } from "firebase/database";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import MoodCalendar from "./MoodCalendar";
import Sentiment from "sentiment";

const Home = () => {
    const [nickname, setNickname] = useState<string>("User");
    const [currentDate, setCurrentDate] = useState<string>("");
    const [posts, setPosts] = useState<
        {
            author: string;
            content: string;
            isAnonymous: boolean;
            loveCount: number;
            retweetCount: number;
            timestamp: string;
        }[]
    >([]);
    const [playlist, setPlaylist] = useState<{ name: string; url: string }>({
        name: "Relaxing Vibes",
        url: "https://open.spotify.com/playlist/2ICsoqznj70Er8TSbzsssj?si=569a41b8c4b84bb7",
    });
    const [content, setContent] = useState<string>("");
    const [currentPostIndex, setCurrentPostIndex] = useState<number>(0);
    const [lastVisitedResources, setLastVisitedResources] = useState<
        { title: string; type: string; timestamp: string; link: string }[]
    >([]);

    const auth = getAuth();
    const db = getFirestore();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserData = async () => {
            if (!auth.currentUser) {
                navigate("/login");
                return;
            }

            const userRef = doc(db, "users", auth.currentUser.uid);
            const docSnap = await getDoc(userRef);

            if (docSnap.exists()) {
                const userData = docSnap.data();
                setNickname(userData.nickname || "User");
            } else {
                navigate("/set-username");
            }
        };

        const fetchPosts = async () => {
            const postsRef = collection(db, "posts");
            const postsSnapshot = await getDocs(postsRef);
            const postsList = postsSnapshot.docs.map((doc) => {
                const data = doc.data();
                return {
                    author: data.isAnonymous ? "Anonymous" : data.author || "Anonymous",
                    content: data.content || "",
                    isAnonymous: data.isAnonymous || false,
                    loveCount: data.loveCount || 0,
                    retweetCount: data.retweetCount || 0,
                    timestamp: data.timestamp
                        ? new Date(data.timestamp.toMillis()).toLocaleString()
                        : "Unknown time",
                };
            });
            setPosts(postsList);
        };

        const fetchUserVisits = async () => {
            if (auth.currentUser) {
                const userVisitsRef = ref(getDatabase(), `users/${auth.currentUser.uid}/resourceVisits`);
                const snapshot = await get(userVisitsRef);

                if (snapshot.exists()) {
                    const visits = Object.values(snapshot.val()) as { title: string; type: string; timestamp: string; link: string }[];
                    const sortedVisits = visits.sort(
                        (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
                    );
                    setLastVisitedResources(sortedVisits.slice(0, 1)); // Show only the most recent visit
                }
            }
        };

        const date = new Date();
        const options: Intl.DateTimeFormatOptions = {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
        };
        setCurrentDate(date.toLocaleDateString("en-US", options));

        const playlists = [
            { name: "Relaxing Vibes", url: "https://open.spotify.com/playlist/2ICsoqznj70Er8TSbzsssj?si=569a41b8c4b84bb7" },
            { name: "Energy Boost", url: "https://open.spotify.com/playlist/4Ml5Nl2omDd28ZMYgkOOi5?si=d17c04c0d71a4ea4" },
            { name: "Focus Beats", url: "https://open.spotify.com/playlist/4qiXz01GKItSoWxTABz2Ye?si=0c5937d6f9b64b2f" },
            { name: "Chill Hits", url: "https://open.spotify.com/playlist/6610Iw29gxRT9apOen4qC7?si=0529ae35c36a43d2" },
            { name: "Upbeat Moods", url: "https://open.spotify.com/playlist/4S1WLV2TDaMG0OJEqAlKcb?si=044278f2bc1b417f" },
            { name: "Throwback Jams", url: "https://open.spotify.com/playlist/4wWS0TF83A9k3WEQhYRREc?si=cef896ec03324e12" },
            { name: "Feel-Good Hits", url: "https://open.spotify.com/playlist/76MkarNpZsWdmcIhWP0DIc?si=72ffe61041824ca6" },
        ];
        const todayIndex = new Date().getDay(); // 0-6 (Sunday-Saturday)
        setPlaylist(playlists[todayIndex]);

        fetchUserData();
        fetchPosts();
        fetchUserVisits();
    }, [auth, db, navigate]);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentPostIndex((prevIndex) => (prevIndex + 1) % posts.length);
        }, 5000);

        return () => clearInterval(interval);
    }, [posts.length]);

    const handlePostSubmit = async () => {
        if (content.trim() === "") {
            alert("Please write something before submitting!");
            return;
        }
    
        const sentiment = new Sentiment();
        const analysis = sentiment.analyze(content);
    
        if (analysis.score < 1) {
            alert("Please keep posts positive and uplifting!");
            return;
        }
    
        try {
            const timestamp = Timestamp.now();
            const newPost = {
                content,
                author: nickname,
                isAnonymous: false,
                loveCount: 0,
                retweetCount: 0,
                timestamp, // Firestore-compatible
            };
    
            // Add to Firestore
            await addDoc(collection(db, "posts"), newPost);
    
            // Convert timestamp to string for local state
            const formattedPost = {
                ...newPost,
                timestamp: timestamp.toDate().toLocaleString(), // Convert to string
            };
    
            setPosts([formattedPost, ...posts]);
            setContent("");
            alert("Post submitted successfully!");
        } catch (error) {
            console.error("Error adding post: ", error);
            alert("Failed to submit the post.");
        }
    };
    

    return (
        <div className="h-screen bg-white">
            <Navbar />
            <div className="pt-20 w-full h-screen bg-[#ECDFCC] p-8">
                <div className="text-center mb-2">
                    <h2 className="text-4xl font-serif">Hi, {nickname}!</h2>
                    <p className="text-md">{`Today is ${currentDate}.`}</p>
                </div>
                <div className="grid grid-cols-2 gap-3 h-[80%] p-4">
                    <div className="bg-transparent p-4 rounded-lg flex flex-col items-center">
                        <h2 className="text-lg font-serif text-center text-black mb-2">
                            Your Monthly Mood Summary
                        </h2>
                        <div className="overflow-hidden w-full max-h-[90%] px-4 py-2 border-2 border-black rounded-lg">
                            <MoodCalendar />
                        </div>
                    </div>
                    <div className="bg-transparent p-4 flex flex-col items-center">
                        <h2 className="text-lg font-serif text-black mb-4 text-center">
                            What Made Your Day Today? 🌟
                        </h2>
                        <textarea
                            className="w-full max-w-md h-20 p-4 mb-4 border-2 border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A5B68D]"
                            placeholder="Write something uplifting!"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                        />
                        <button
                            onClick={handlePostSubmit}
                            className="w-full max-w-md py-2 bg-transparent border-2 border-black rounded-lg text-black hover:bg-[#A5B68D] transition"
                        >
                            Post
                        </button>
                        <div className="relative overflow-hidden h-40 w-full max-w-md mt-4">
                            {posts.length === 0 ? (
                                <p className="text-gray-500 text-center">
                                    No posts to display yet. Share something!
                                </p>
                            ) : (
                                posts.map((post, index) => (
                                    <div
                                        key={index}
                                        className={`absolute top-0 left-0 w-full transition-opacity duration-500 ${
                                            index === currentPostIndex ? "opacity-100" : "opacity-0"
                                        }`}
                                    >
                                        <div className="bg-white px-4 py-2 rounded-lg shadow">
                                            <p className="text-gray-800 text-sm mb-1">{post.content}</p>
                                            <p className="text-gray-600 text-xs italic">- {post.author}</p>
                                            <p className="text-gray-500 text-xs mt-1">{`⏰ ${post.timestamp}`}</p>
                                            <div className="flex justify-between text-xs mt-2">
                                                <span>❤️ {post.loveCount}</span>
                                                <span>🔁 {post.retweetCount}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                    <div className="bg-transparent flex flex-col items-center">
                        <h2 className="text-lg font-serif text-center text-black mb-4">
                            Hey, I got a Spotify playlist for you!
                        </h2>
                        <a
                            href={playlist.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-4 py-2 border-2 border-black rounded-full text-center text-black text-md font-sans hover:bg-[#A5B68D] transition duration-200"
                        >
                            Click for Surprise
                        </a>
                    </div>
                    <div className="bg-transparent p-2 rounded-lg flex flex-col items-center text-center -mt-2">
                        <h3 className="text-lg font-serif text-black mb-4">Your Recent Visits:</h3>
                        {lastVisitedResources.length > 0 ? (
                    <div className="w-full">
                        <a
                        href={lastVisitedResources[0].link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-black hover:underline"
                        >
                        {lastVisitedResources[0].title}
                        </a>
                        <p className="text-xs text-gray-500 italic mt-1">{`Visited on ${new Date(
                        lastVisitedResources[0].timestamp
                        ).toLocaleString()}`}</p>
                        </div>
                        ) : (
                        <p className="text-sm text-gray-600">No recent visits yet.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;

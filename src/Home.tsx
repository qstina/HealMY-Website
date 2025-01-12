import { useEffect, useState } from "react";
import { getAuth } from "firebase/auth";
import { getFirestore, doc, getDoc, collection, getDocs } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";

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

        fetchUserData();

        const date = new Date();
        const options: Intl.DateTimeFormatOptions = {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
        };
        setCurrentDate(date.toLocaleDateString("en-US", options));

        fetchPosts();
    }, [auth, db, navigate]);

    // Clone posts for seamless looping
    const displayPosts = [...posts, ...posts];

    return (
        <div className="h-screen bg-white">
            <Navbar />
            <div className="w-full h-screen bg-[#ECDFCC] p-8">
                {/* Greeting Section */}
                <div className="text-center mb-8">
                    <h2 className="text-4xl font-serif mb-2">Hi, {nickname}!</h2>
                    <p className="text-2xl">{`Today is ${currentDate}.`}</p>
                </div>

                {/* Split Screen Layout */}
                <div className="grid grid-cols-2 gap-4 h-[80%]">
                    {/* Mood Stats Section */}
                    <div className="bg-transparent border-2 border-gray-700 p-4 rounded-lg flex items-center justify-center">
                        <h2 className="text-xl font-bold text-gray-700">Mood Stats</h2>
                    </div>

                    {/* Community Section */}
                    <div className="bg-transparent border-2 border-gray-700 p-4 rounded-lg relative">
                        <h2 className="text-lg font-bold text-gray-700 mb-2 text-center">
                            What Made Your Day Today? 🌟
                        </h2>
                        <div className="overflow-hidden h-32 mt-2 relative">
                            <div className="scrolling-posts">
                                {displayPosts.length === 0 ? (
                                    <p className="text-gray-500">
                                        No posts to display yet. Check back soon!
                                    </p>
                                ) : (
                                    displayPosts.map((post, index) => (
                                        <div
                                            key={index}
                                            className="bg-yellow-100 px-4 py-2 rounded-md mb-2 shadow w-fit"
                                        >
                                            <p className="text-gray-800 text-sm mb-1">
                                                {post.content}
                                            </p>
                                            <p className="text-gray-600 text-xs italic">
                                                {`- ${post.author}`}
                                            </p>
                                            <p className="text-gray-500 text-xs mt-1">
                                                {`⏰ ${post.timestamp}`}
                                            </p>
                                            <div className="flex justify-between text-xs mt-2">
                                                <span>❤️ {post.loveCount}</span>
                                                <span>🔁 {post.retweetCount}</span>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Journal Section */}
                    <div className="bg-transparent border-2 border-gray-700 p-4 rounded-lg flex items-center justify-center">
                        <h2 className="text-xl font-bold text-gray-700">Journal</h2>
                    </div>

                    {/* Resources Section */}
                    <div className="bg-transparent border-2 border-gray-700 p-4 rounded-lg flex items-center justify-center">
                        <h2 className="text-xl font-bold text-gray-700">Resources</h2>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;
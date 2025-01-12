import { useState, useEffect } from "react";
import { getAuth } from "firebase/auth";
import { getFirestore, collection, addDoc, getDocs, doc, getDoc, Timestamp, updateDoc } from "firebase/firestore"; 
import { useNavigate } from "react-router-dom";
import Sentiment from "sentiment";

const Community = () => {
    const [content, setContent] = useState<string>('');
    const [nickname, setNickname] = useState<string>('');
    const [username, setUsername] = useState<string>('');
    const [posts, setPosts] = useState<any[]>([]);
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
                setUsername(userData.username || "user123");
            } else {
                navigate("/set-username");
            }
        };

        fetchUserData();

        const fetchPosts = async () => {
            const postsRef = collection(db, "posts");
            const postsSnapshot = await getDocs(postsRef);
            const postsList = postsSnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setPosts(postsList);
        };

        fetchPosts();
    }, [auth, db, navigate]);

    const handlePostSubmit = async () => {
        if (content.trim() === "") {
            alert("Please write something before submitting!");
            return;
        }
    
        // Perform sentiment analysis
        const sentiment = new Sentiment();
        const analysis = sentiment.analyze(content);
    
        if (analysis.score < 1) {
            alert("Please keep posts positive and uplifting!");
            return;
        }
    
        try {
            await addDoc(collection(db, "posts"), {
                content,
                author: `${nickname} @${username}`,
                timestamp: Timestamp.now(),
                loveCount: 0,
                retweetCount: 0,
            });
            setContent("");
            alert("Post submitted successfully!");
    
            const postsRef = collection(db, "posts");
            const postsSnapshot = await getDocs(postsRef);
            const postsList = postsSnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setPosts(postsList);
        } catch (error) {
            console.error("Error adding post: ", error);
            alert("Failed to submit the post.");
        }
    };

    const handleLoveClick = async (postId: string, loveCount: number) => {
        try {
            const postRef = doc(db, "posts", postId);
            await updateDoc(postRef, {
                loveCount: loveCount + 1
            });
            setPosts(posts.map(post => 
                post.id === postId ? { ...post, loveCount: loveCount + 1 } : post
            ));
        } catch (error) {
            console.error("Error liking post: ", error);
        }
    };

    return (
        <div className="w-full h-screen bg-yellow-100 p-8">
            <div className="max-w-xl mx-auto bg-white p-6 rounded-lg shadow-lg">
                <h2 className="text-2xl font-serif mb-4 text-center">
                    What Made Your Day Today? 🌟
                </h2>

                {/* Post input */}
                <textarea
                    className="w-full h-32 p-4 mb-4 border rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    placeholder="Share a heartwarming or funny moment!"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                />

                {/* Submit button */}
                <button
                    onClick={handlePostSubmit}
                    className="w-full py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600"
                >
                    Post
                </button>
            </div>

            {/* Posts Section */}
            <div className="max-w-xl mx-auto mt-6 bg-white p-6 rounded-lg shadow-lg">
                <h3 className="text-xl font-serif mb-4 text-center">Community Posts</h3>

                {posts.length === 0 ? (
                    <p>No posts yet! Be the first to share something uplifting! 🌻</p>
                ) : (
                    <div>
                        {posts.map((post) => (
                            <div key={post.id} className="border-b pb-4 mb-4">
                                <p className="font-semibold text-blue-600">
                                    {post.author}
                                </p>
                                <p>{post.content}</p>

                                {/* Love Button */}
                                <div className="mt-4">
                                    <button
                                        onClick={() => handleLoveClick(post.id, post.loveCount)}
                                        className="text-red-500 hover:text-red-700"
                                    >
                                        ❤️ {post.loveCount}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Community;

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth } from "firebase/auth";
import { getFirestore, doc, setDoc, collection, query, where, getDocs } from "firebase/firestore";

const SetUsername = () => {
    const [nickname, setNickname] = useState('');
    const [username, setUsername] = useState('');
    const [error, setError] = useState('');
    const auth = getAuth();
    const navigate = useNavigate();
    const db = getFirestore();

    // Function to check if username already exists in Firestore
    const isUsernameTaken = async (username: string) => {
        const usersRef = collection(db, "users");
        const q = query(usersRef, where("username", "==", username));
        const querySnapshot = await getDocs(q);
        return !querySnapshot.empty;  // Returns true if username exists, false otherwise
    };

    const handleSetUsername = async () => {
        if (!nickname || !username) {
            setError('Both fields are required.');
            return;
        }

        if (!auth.currentUser) {
            setError('User is not authenticated.');
            return;
        }

        // Check if username is already taken
        const taken = await isUsernameTaken(username);
        if (taken) {
            setError('Username is already taken. Please choose another one.');
            return;
        }

        try {
            // Save nickname and username to Firestore
            const userRef = doc(db, "users", auth.currentUser.uid);
            await setDoc(userRef, { nickname, username });
            navigate("/home");  // Navigate to profile after setting the username and nickname
        } catch (err) {
            setError('Failed to set username.');
            console.error(err);
        }
    };

    return (
        <div className="w-full h-screen bg-cover bg-center" style={{ backgroundImage: "url('/src/assets/img/main_bg.PNG')" }}>
            <div className="w-full flex flex-col items-center justify-center h-full">
                {/* Header section outside the form */}
                <div className="text-white text-center mb-10 font-serif">
                    <h3 className="text-4xl font-bold mb-2">Choose a Nickname and Username</h3>
                    <p className="text-lg">Set your nickname and username to continue.</p>
                </div>

                {/* Form fields */}
                <div className="w-full max-w-[400px] flex flex-col items-center font-sans">
                    {/* Input field for nickname */}
                    <div className="w-full flex flex-col mb-6">
                        <input
                            type="text"
                            placeholder="Nickname"
                            value={nickname}
                            onChange={(e) => setNickname(e.target.value)}
                            className="w-full text-white py-2 mb-4 bg-transparent border-b border-gray-500 focus:outline"
                        />
                    </div>

                    {/* Input field for username */}
                    <div className="w-full flex flex-col mb-6">
                        <input
                            type="text"
                            placeholder="Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full text-white py-2 mb-4 bg-transparent border-b border-gray-500 focus:outline"
                        />
                    </div>

                    {/* Display error message if there is one */}
                    {error && <div className="text-red-500 mb-4">{error}</div>}

                    {/* Button to set username and nickname */}
                    <div className="w-full flex flex-col mb-4">
                        <button
                            className="w-full bg-transparent border border-white text-white my-2 font-semibold rounded-md p-4 text-center flex items-center"
                            onClick={handleSetUsername}
                        >
                            Continue
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default SetUsername;

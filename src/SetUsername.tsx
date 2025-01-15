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

    const isUsernameTaken = async (username: string) => {
        const usersRef = collection(db, "users");
        const q = query(usersRef, where("username", "==", username));
        const querySnapshot = await getDocs(q);
        return !querySnapshot.empty;
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

        const taken = await isUsernameTaken(username);
        if (taken) {
            setError('Username is already taken. Please choose another one.');
            return;
        }

        try {
            const userRef = doc(db, "users", auth.currentUser.uid);
            await setDoc(userRef, { nickname, username });
            navigate("/home");
        } catch (err) {
            setError('Failed to set username.');
            console.error(err);
        }
    };

    return (
        <div className="w-full h-screen bg-[#ECDFCC] flex items-center justify-center">
            <div className="w-full max-w-lg bg-white p-6 rounded-lg border-2 border-black">
                <div className="text-center mb-6 font-serif">
                    <h3 className="text-3xl text-black mb-2">Choose a Nickname and Username!</h3>
                    <p className="text-lg font-sans text-black"></p>
                </div>

                <div className="w-full flex flex-col mb-2">
                    <input
                        type="text"
                        placeholder="Nickname"
                        value={nickname}
                        onChange={(e) => setNickname(e.target.value)}
                        className="w-full py-2 mb-2 bg-white border-2 border-black rounded-lg px-4 focus:outline-none focus:ring-2 focus:ring-[#A5B68D]"
                    />
                </div>

                <div className="w-full flex flex-col mb-2">
                    <input
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full py-2 mb-4 bg-white border-2 border-black rounded-lg px-4 focus:outline-none focus:ring-2 focus:ring-[#A5B68D]"
                    />
                </div>

                {error && <div className="text-red-500 mb-4 text-center">{error}</div>}

                <button
                    className="w-full py-3 bg-black border-2 border-black text-white font-semibold rounded-lg hover:bg-[#A5B68D] transition-colors duration-300"
                    onClick={handleSetUsername}
                >
                    Continue
                </button>
            </div>
        </div>
    );
};

export default SetUsername;

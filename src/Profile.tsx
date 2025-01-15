import { useEffect, useState } from "react";
import { getAuth, signOut } from "firebase/auth";
import { getFirestore, doc, getDoc, updateDoc } from "firebase/firestore";
import { MdEdit } from "react-icons/md";
import Navbar from "./Navbar"; // Importing Navbar

const Profile = () => {
    const [username, setUsername] = useState('');
    const [nickname, setNickname] = useState('');
    const [birthdate, setBirthdate] = useState('');
    const [gender, setGender] = useState('');
    const [editableNickname, setEditableNickname] = useState(false);
    const [editableBirthdate, setEditableBirthdate] = useState(false);
    const [editableGender, setEditableGender] = useState(false);
    const [loading, setLoading] = useState(true);
    const [isNavbarVisible, setIsNavbarVisible] = useState(true);
    const auth = getAuth();
    const db = getFirestore();

    useEffect(() => {
        const fetchUserData = async () => {
            if (!auth.currentUser) {
                console.log("User is not authenticated");
                setLoading(false);
                return;
            }

            const userRef = doc(db, "users", auth.currentUser.uid);
            const docSnap = await getDoc(userRef);

            if (docSnap.exists()) {
                const userData = docSnap.data();
                setUsername(userData.username);
                setNickname(userData.nickname || '');
                setBirthdate(userData.birthdate || '');
                setGender(userData.gender || '');
            } else {
                console.log("No user data found!");
            }
            setLoading(false);
        };

        fetchUserData();
    }, [auth, db]);

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

    const handleNicknameChange = (event: React.ChangeEvent<HTMLInputElement>) => setNickname(event.target.value);
    const handleGenderChange = (event: React.ChangeEvent<HTMLSelectElement>) => setGender(event.target.value);
    const handleBirthdateChange = (event: React.ChangeEvent<HTMLInputElement>) => setBirthdate(event.target.value);

    const handleSaveProfile = async () => {
        if (auth.currentUser) {
            const userRef = doc(db, "users", auth.currentUser.uid);
            await updateDoc(userRef, { nickname, birthdate, gender });
        }
    };

    const handleLogout = async () => {
        await signOut(auth);
        window.location.href = "/login"; // Redirect to login page
    };

    const toggleEdit = (field: string) => {
        if (field === 'nickname') setEditableNickname(!editableNickname);
        if (field === 'birthdate') setEditableBirthdate(!editableBirthdate);
        if (field === 'gender') setEditableGender(!editableGender);
    };

    if (loading) return <div className="h-screen flex justify-center items-center">Loading...</div>;

    return (
        <div className="w-full min-h-screen bg-[#ECDFCC] text-gray-900">
            {isNavbarVisible && <Navbar />}

            <div className="w-full flex justify-center pt-20 px-8">
                <div className="mt-16 w-full max-w-sm text-center border-2 border-black bg-white p-6 rounded-lg">
                    <h2 className="text-3xl font-serif mb-4 text-black">Hi, {nickname}!</h2>

                    <p className="text-lg mb-4">Username: {username}</p>

                    <div className="mb-4 flex items-center">
                        <input
                            type="text"
                            placeholder="Nickname"
                            value={nickname}
                            onChange={handleNicknameChange}
                            readOnly={!editableNickname}
                            className="w-full p-3 bg-transparent border-2 border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A5B68D]"
                        />
                        <MdEdit
                            onClick={() => toggleEdit('nickname')}
                            className="text-black cursor-pointer ml-2"
                            size={20}
                        />
                    </div>

                    <div className="mb-4 flex items-center">
                        <input
                            type="date"
                            value={birthdate}
                            onChange={handleBirthdateChange}
                            readOnly={!editableBirthdate}
                            className="w-full p-3 bg-transparent border-2 border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A5B68D]"
                        />
                        <MdEdit
                            onClick={() => toggleEdit('birthdate')}
                            className="text-black cursor-pointer ml-2"
                            size={20}
                        />
                    </div>

                    <div className="mb-4 flex items-center">
                        <select
                            value={gender}
                            onChange={handleGenderChange}
                            disabled={!editableGender}
                            className="w-full p-3 bg-transparent border-2 border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A5B68D]"
                        >
                            <option value="">Select Gender</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                        </select>
                        <MdEdit
                            onClick={() => toggleEdit('gender')}
                            className="text-black cursor-pointer ml-2"
                            size={20}
                        />
                    </div>

                    <button
                        className="w-full py-3 bg-black border-2 border-black text-white font-semibold rounded-lg hover:bg-[#A5B68D] transition-colors duration-300 mb-4"
                        onClick={handleSaveProfile}
                    >
                        Save
                    </button>

                    <button
                        className="w-full py-3 bg-red-500 border-2 border-black text-white font-semibold rounded-lg hover:bg-red-600 transition-colors duration-300"
                        onClick={handleLogout}
                    >
                        Log Out
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Profile;

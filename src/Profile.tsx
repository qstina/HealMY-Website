import { useEffect, useState } from "react";
import { getAuth, signOut } from "firebase/auth";
import { getFirestore, doc, getDoc, updateDoc } from "firebase/firestore";
import { MdEdit } from "react-icons/md";

const Profile = () => {
    const [username, setUsername] = useState('');
    const [nickname, setNickname] = useState('');
    const [birthdate, setBirthdate] = useState('');
    const [gender, setGender] = useState('');
    const [editableNickname, setEditableNickname] = useState(false);
    const [editableBirthdate, setEditableBirthdate] = useState(false);
    const [editableGender, setEditableGender] = useState(false);
    const [loading, setLoading] = useState(true);
    const auth = getAuth();
    const db = getFirestore();

    // Fetch user data on component mount
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

    // Handle profile field changes
    const handleNicknameChange = (event: React.ChangeEvent<HTMLInputElement>) => setNickname(event.target.value);
    const handleGenderChange = (event: React.ChangeEvent<HTMLSelectElement>) => setGender(event.target.value);
    const handleBirthdateChange = (event: React.ChangeEvent<HTMLInputElement>) => setBirthdate(event.target.value);

    // Update profile info in Firestore
    const handleSaveProfile = async () => {
        if (auth.currentUser) {
            const userRef = doc(db, "users", auth.currentUser.uid);
            await updateDoc(userRef, { nickname, birthdate, gender });
        }
    };

    // Handle logout
    const handleLogout = async () => {
        await signOut(auth);
        window.location.href = "/login"; // Redirect to login page
    };

    const toggleEdit = (field: string) => {
        if (field === 'nickname') setEditableNickname(!editableNickname);
        if (field === 'birthdate') setEditableBirthdate(!editableBirthdate);
        if (field === 'gender') setEditableGender(!editableGender);
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="w-full h-screen flex justify-center items-center bg-[#A5B68D] text-white">
            <div className="w-full max-w-sm text-center font-sans">
                {/* Greeting with Nickname */}
                <div className="mb-6">
                    <h2 className="text-3xl mb-4">Hi, {nickname}!</h2>
                </div>

                <p className="text-xl mb-4">Username: {username}</p>

                {/* Nickname Field */}
                <div className="mb-4 flex items-center">
                    <input
                        type="text"
                        placeholder="Nickname"
                        value={nickname}
                        onChange={handleNicknameChange}
                        readOnly={!editableNickname}
                        className="w-full p-3 bg-transparent border-b border-gray-500 mb-4 text-white"
                    />
                    <MdEdit
                        onClick={() => toggleEdit('nickname')}
                        className="text-white cursor-pointer ml-2"
                        size={20}
                    />
                </div>

                {/* Birthdate Field */}
                <div className="mb-4 flex items-center">
                    <input
                        type="date"
                        value={birthdate}
                        onChange={handleBirthdateChange}
                        readOnly={!editableBirthdate}
                        className="w-full p-3 bg-transparent border-b border-gray-500 mb-4 text-white"
                    />
                    <MdEdit
                        onClick={() => toggleEdit('birthdate')}
                        className="text-white cursor-pointer ml-2"
                        size={20}
                    />
                </div>

                {/* Gender Field */}
                <div className="mb-4 flex items-center">
                    <select
                        value={gender}
                        onChange={handleGenderChange}
                        disabled={!editableGender}
                        className="w-full p-3 bg-transparent border-b border-gray-500 mb-4 text-white"
                    >
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                    </select>
                    <MdEdit
                        onClick={() => toggleEdit('gender')}
                        className="text-white cursor-pointer ml-2"
                        size={20}
                    />
                </div>

                {/* Save Button */}
                <button
                    className="w-full bg-green-500 py-3 text-white font-semibold rounded-md mb-4"
                    onClick={handleSaveProfile}
                >
                    Save
                </button>

                {/* Logout Button */}
                <button
                    className="w-full bg-red-500 py-3 text-white font-semibold rounded-md"
                    onClick={handleLogout}
                >
                    Log Out
                </button>
            </div>
        </div>
    );
};

export default Profile;

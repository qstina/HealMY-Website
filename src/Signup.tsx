import { useState } from "react";
import { getAuth, GoogleAuthProvider, signInWithPopup, createUserWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";

const Signup = () => {
    // Initialize Firebase authentication and navigation
    const auth = getAuth();
    const navigate = useNavigate();

    // State variables for managing authentication state, email, password, and error messages
    const [authing, setAuthing] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');

    // Function to handle sign-in with Google
    const signInWithGoogle = async () => {
        setAuthing(true);

        // Use Firebase to sign in with Google
        signInWithPopup(auth, new GoogleAuthProvider())
            .then(response => {
                console.log(response.user.uid);
                navigate('/set-username');  // Redirect to SetUsername page
            })
            .catch(error => {
                console.log(error);
                setAuthing(false);
            });
    };

    // Function to handle sign-in with email and password
    const signUpWithEmail = async () => {
        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }

        setAuthing(true);
        setError('');

        // Use Firebase to create a new user with Email and Password
        createUserWithEmailAndPassword(auth, email, password)
            .then(response => {
                console.log(response.user.uid);
                navigate('/set-username');  // Redirect to SetUsername page
            })
            .catch(error => {
                console.log(error);
                setAuthing(false);
            });
    };

    return (
        <div className="w-full h-screen bg-cover bg-center" style={{ backgroundImage: "url('/src/assets/img/main_bg.PNG')" }}>
            <div className="w-full flex flex-col items-center justify-center h-full">
                {/* Header section outside the form */}
                <div className="text-white text-center mb-10 font-serif">
                    <h3 className="text-4xl font-bold mb-2">Sign Up</h3>
                    <p className="text-lg">Come and Join Us!</p>
                </div>

                {/* Form fields without any box */}
                <div className="w-full max-w-[400px] flex flex-col items-center font-sans">
                    {/* Input fields for email and password */}
                    <div className="w-full flex flex-col mb-6">
                        <input
                            type="email"
                            placeholder="Email"
                            className="w-full text-white py-2 mb-4 bg-transparent border-b border-gray-500 focus:outline"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)} />
                        <input
                            type="password"
                            placeholder="Password"
                            className="w-full text-white py-2 mb-4 bg-transparent border-b border-gray-500 focus:outline"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)} />
                        <input
                            type="password"
                            placeholder="Confirm Password"
                            className="w-full text-white py-2 mb-4 bg-transparent border-b border-gray-500 focus:outline"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)} />
                    </div>

                    {/* Display error message if there is one */}
                    {error && <div className="text-red-500 mb-4">{error}</div>}

                    {/* Buttons to sign up with email and password */}
                    <div className="w-full flex flex-col mb-4">
                        <button
                            className="w-full bg-transparent border border-white text-white my-2 font-semibold rounded-md p-4 text-center flex items-center"
                            onClick={signUpWithEmail}
                            disabled={authing}>
                            Sign Up with Email and Password
                        </button>
                    </div>

                    {/* Divider with OR text */}
                    <div className="w-full flex items-center justify-center relative py-4">
                        <div className="w-full h-[1px] bg-transparent"></div>
                        <p className="text-lg absolute text-white bg-transparent px-2">OR</p>
                    </div>

                    {/* Button to sign up with Google */}
                    <div className="w-full flex flex-col mb-4">
                        <button
                            className="w-full bg-white text-black my-2 font-semibold rounded-md p-4 text-center flex items-center"
                            onClick={signInWithGoogle}
                            disabled={authing}>
                            Log In with Google
                        </button>
                    </div>

                    {/* Link to login page */}
                    <div className="w-full flex items-center justify-center mt-10">
                        <p className="text-sm font-normal text-gray-400">
                            Already have an account?
                            <a href="/login" className="font-semibold text-blue-500 hover:underline"> Log in</a>
                        </p>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Signup;

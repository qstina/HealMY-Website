import { useState } from "react";
import { getAuth, GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";

const Login = () => {
    const auth = getAuth();
    const navigate = useNavigate();

    const [authing, setAuthing] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const signInWithGoogle = async () => {
        setAuthing(true);

        signInWithPopup(auth, new GoogleAuthProvider())
            .then(response => {
                console.log(response.user.uid);
                navigate('/home');
            })
            .catch(error => {
                console.log(error);
                setAuthing(false);
            });
    };

    const signInWithEmail = async () => {
        setAuthing(true);
        setError('');

        signInWithEmailAndPassword(auth, email, password)
            .then(response => {
                console.log(response.user.uid);
                navigate('/home');
            })
            .catch(error => {
                console.log(error);
                setAuthing(false);
                setError('Failed to login. Please check your credentials and try again.');
            });
    };

    return (
        <div className="w-full h-screen bg-[#ECDFCC] flex items-center justify-center">
            <div className="w-full max-w-sm bg-white p-6 rounded-lg border-2 border-black">
                <div className="text-center mb-6 font-serif">
                    <h3 className="text-3xl text-black mb-2">Login</h3>
                    <p className="text-lg font-sans text-black">Welcome Back!</p>
                </div>

                <div className="w-full flex flex-col mb-6">
                    <input
                        type="email"
                        placeholder="Email"
                        className="w-full py-2 mb-4 bg-transparent border-2 border-black rounded-lg px-4 focus:outline-none focus:ring-2 focus:ring-[#A5B68D]"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        className="w-full py-2 mb-4 bg-transparent border-2 border-black rounded-lg px-4 focus:outline-none focus:ring-2 focus:ring-[#A5B68D]"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>

                {error && <div className="text-red-500 mb-4 text-center">{error}</div>}

                <button
                    className="w-full py-3 bg-transparent border-2 border-black text-black font-semibold rounded-lg hover:bg-[#A5B68D] transition-colors duration-300 mb-4"
                    onClick={signInWithEmail}
                    disabled={authing}
                >
                    Log In with Email and Password
                </button>

                <div className="w-full flex items-center justify-center relative py-4 mb-4">
                    <div className="w-full h-[1px] bg-black"></div>
                    <p className="text-lg text-gray-500 absolute bg-white px-2">OR</p>
                </div>

                <button
                    className="w-full py-3 bg-black text-white font-semibold rounded-lg hover:bg-gray-800 transition-colors duration-300 mb-4"
                    onClick={signInWithGoogle}
                    disabled={authing}
                >
                    Log In with Google
                </button>

                <div className="w-full text-center mt-6">
                    <p className="text-sm font-normal text-gray-600">
                        Don't have an account? 
                        <a href="/signup" className="font-semibold text-blue-500 hover:underline"> Sign Up</a>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;

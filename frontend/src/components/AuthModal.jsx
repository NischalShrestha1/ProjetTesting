import { useState } from "react";
import { useNavigate } from "react-router-dom"; // for redirect
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { loginUser, registerUser, selectUserLoading, selectUserError, clearUserError } from '../store';
export default function AuthModal({ onClose, onUserUpdate }) {
  const dispatch = useAppDispatch();
  const isLoading = useAppSelector(selectUserLoading);
  const error = useAppSelector(selectUserError);
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (error) {
      dispatch(clearUserError());
    }

    try {
      if (isLogin) {
        // Login request using Redux
        await dispatch(loginUser({
          email: formData.email,
          password: formData.password,
        })).unwrap();

        alert("Login successful!");
        onClose();
        navigate("/");
      } else {
        // Registration validation
        if (formData.password !== formData.confirmPassword) {
          setError("Passwords do not match");
          return;
        }

        await dispatch(registerUser({
          email: formData.email,
          password: formData.password,
        })).unwrap();

        alert("Registration successful!");
        onClose();
        navigate("/");
      }
    } catch (err) {
      // Error is already handled by Redux state
      console.error('Auth error:', err);
    }
   };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="relative bg-gray-900 rounded-xl p-6 sm:p-8 w-full max-w-md sm:max-w-lg md:max-w-xl mx-auto max-h-[90vh] overflow-y-auto border border-gray-700 shadow-2xl">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-pink-600 hover:text-white text-2xl font-bold"
        >
          &times;
        </button>

        {/* Logo */}
        <p className="text-center text-white text-3xl font-bold font-anime hover:text-primary transition mb-4">
          Anime<span className="text-primary">Merch</span>
        </p>

        <h2 className="text-center text-white text-xl font-bold mb-4">
          {isLogin ? "Login" : "Register"}
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full">


          <div>
            <label className="text-white block mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-2 border rounded text-black focus:outline-none focus:ring-2 focus:ring-pink-500"
              required
            />
          </div>

          <div>
            <label className="text-white block mb-1">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full p-2 border rounded text-black focus:outline-none focus:ring-2 focus:ring-pink-500"
              required
            />
          </div>

          {!isLogin && (
            <div>
              <label className="text-white block mb-1">Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full p-2 border rounded text-black focus:outline-none focus:ring-2 focus:ring-pink-500"
                required
              />
            </div>
          )}

          {error && <p className="text-red-500">{error}</p>}

          <button
            type="submit"
            className="w-full bg-primary hover:bg-pink-600 text-white py-2 rounded disabled:opacity-50"
            disabled={isLoading}
          >
            {isLoading ? "Processing..." : (isLogin ? "Login" : "Register")}
          </button>
        </form>

        {/* Toggle link */}
        <p className="text-center text-sm mt-2">
          <span className="text-gray-300">
            {isLogin ? "Don't have an account?" : "Already have an account?"}
          </span>{" "}
          <button
            onClick={() => {
              setIsLogin(!isLogin);
              dispatch(clearUserError());
              setFormData({
                email: "",
                password: "",
                confirmPassword: "",
              });
            }}
            className="text-blue-400 hover:text-blue-300 underline ml-1"
          >
            {isLogin ? "Register" : "Login"}
          </button>
        </p>
      </div>
    </div>
  );
}

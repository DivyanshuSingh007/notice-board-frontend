import LoginForm from "../components/LoginForm";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-200">
      <div className="bg-white p-8 rounded-2xl shadow-md w-full max-w-md">
        <h1 className="text-3xl font-extrabold mb-2 text-center text-green-700">Ramnagar Colony Society</h1>
        <h2 className="text-2xl font-bold mb-6 text-center text-blue-600">
          Society Notice Board Login
        </h2>
        <LoginForm />
        <div className="mt-6 text-center">
          <span className="text-gray-700 mr-2">Not registered?</span>
          <button
            className="text-blue-600 underline font-semibold"
            onClick={() => navigate("/register")}
          >
            Register
          </button>
        </div>
      </div>
    </div>
  );
}

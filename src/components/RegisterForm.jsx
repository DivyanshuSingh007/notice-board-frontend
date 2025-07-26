import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";

export default function RegisterForm() {
  const [formData, setFormData] = useState({
    email: "",
    first_name: "",
    last_name: "",
    mobile_no: "",
    password: "",
  });

  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await API.post("/auth/register", formData);
      navigate("/login");
    } catch {
      setError("Registration failed. User may already exist.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {["email", "first_name", "last_name", "mobile_no", "password"].map((field) => (
        <div key={field}>
          <label className="block mb-1 text-sm font-medium text-gray-700">
            {field.replace("_", " ").toUpperCase()}
          </label>
          <input
            type={field === "password" ? "password" : field === "email" ? "email" : "text"}
            name={field}
            value={formData[field]}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400"
          />
        </div>
      ))}
      {error && (
        <div>
          <p className="text-red-500 text-sm">{error}</p>
          {error.includes("already exist") && (
            <button
              type="button"
              className="mt-2 text-blue-600 underline"
              onClick={() => navigate("/login")}
            >
              Go to Login
            </button>
          )}
        </div>
      )}
      <button
        type="submit"
        className="w-full py-2 bg-green-600 hover:bg-green-700 text-white rounded-xl transition duration-200"
      >
        Register
      </button>
    </form>
  );
}

import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaUserPlus } from "react-icons/fa";
import globalBackendRoute from "../../config/Config";

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "student", // default role
  });
  const [error, setError] = useState("");
  const { name, email, password, role } = formData;

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const validateInputs = () => {
    const trimmedName = name.trim();
    const trimmedEmail = email.trim();

    if (!trimmedName) return "Name cannot be empty or just spaces.";
    if (name !== trimmedName) return "Name cannot start or end with a space.";

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!trimmedEmail.match(emailRegex)) return "Enter a valid email address.";
    if (email !== trimmedEmail)
      return "Email cannot start or end with a space.";

    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d])[A-Za-z\d\S]{8,}$/;
    if (!password.match(passwordRegex))
      return "Password must be 8+ characters with uppercase, lowercase, number, and special character.";

    if (!["teacher", "student"].includes(role)) return "Invalid role selected.";

    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validateInputs();
    if (validationError) return setError(validationError);

    try {
      await axios.post(`${globalBackendRoute}/api/register`, formData);
      alert("Registration successful. Redirecting to login.");
      navigate("/superadmin-login");
    } catch {
      setError("Registration failed. Try again.");
    }
  };

  return (
    <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <FaUserPlus className="iconPrimary" />
        <h2 className="mt-6 text-center headingTextMobile lg:headingText">
          Register a new account
        </h2>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-sm">
        {error && <p className="errorText mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="name" className="formLabel">
              Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              required
              className="formInput mt-2"
            />
          </div>

          <div>
            <label htmlFor="email" className="formLabel">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="formInput mt-2"
            />
          </div>

          <div>
            <label htmlFor="password" className="formLabel">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="formInput mt-2"
            />
          </div>

          <div>
            <label htmlFor="role" className="formLabel">
              Register as
            </label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              required
              className="formInput mt-2"
            >
              <option value="student">Student</option>
              <option value="teacher">Teacher</option>
            </select>
          </div>

          <button type="submit" className="primaryBtn">
            Register
          </button>
        </form>

        <p className="mt-6 text-center paragraphTextMobile lg:paragraphText">
          Superadmin sign in page?{" "}
          <a href="/superadmin-login" className="linkTextMobile lg:linkText">
            Sign in
          </a>
        </p>
      </div>
    </div>
  );
};

export default Register;

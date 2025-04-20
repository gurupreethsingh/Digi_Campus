import React, { useState, useContext } from "react";
import axios from "axios";
import { FaSignInAlt } from "react-icons/fa";
import { AuthContext } from "../../components/auth_components/AuthManager";
import globalBackendRoute from "../../config/Config";

const TeacherLogin = () => {
  const { login } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: "teacher", // ✅ Hidden role for teacher
  });
  const [error, setError] = useState("");
  const { email, password } = formData;

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const validateInputs = () => {
    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();

    if (!trimmedEmail || !trimmedPassword) {
      return "Email and password are required.";
    }

    if (email !== trimmedEmail) {
      return "Email cannot start or end with spaces.";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!trimmedEmail.match(emailRegex)) {
      return "Please enter a valid email address.";
    }

    if (password !== trimmedPassword) {
      return "Password cannot start or end with spaces.";
    }

    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validateInputs();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      const response = await axios.post(
        `${globalBackendRoute}/api/teacher-login`,
        formData
      );
      login(response.data.token);
      alert("Login successful, redirecting...");
      setError("");
    } catch {
      setError("Login failed. Try again.");
    }
  };

  return (
    <div className="compactWidth py-12">
      {/* Header */}
      <div className="text-center">
        <FaSignInAlt className="iconPrimary mx-auto" size={48} />
        <h2 className="headingTextMobile lg:headingText mt-4">
          Teacher Sign in
        </h2>
      </div>

      {/* Form */}
      <div className="mt-10">
        {error && <p className="errorText text-center mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email Input */}
          <div>
            <label
              htmlFor="email"
              className="formLabel flex items-center gap-2"
            >
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="formInput mt-2"
              placeholder="Enter your email address"
            />
          </div>

          {/* Password Input with Forgot Link */}
          <div>
            <div className="flex items-center justify-between">
              <label
                htmlFor="password"
                className="formLabel flex items-center gap-2"
              >
                Password
              </label>
              <a
                href="/forgot-password"
                className="text-sm text-indigo-500 hover:text-indigo-600 font-bold"
              >
                Forgot password?
              </a>
            </div>
            <input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="formInput mt-2"
              placeholder="Enter your password"
            />
          </div>

          {/* ✅ Hidden Role Field (teacher) */}
          <input type="hidden" name="role" value="teacher" />

          <button type="submit" className="primaryBtn">
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default TeacherLogin;

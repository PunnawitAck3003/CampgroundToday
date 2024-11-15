"use client"
import { useState } from "react";
import userRegister from "@/libs/userRegister";

export default function RegisterForm() {
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userPassword, setUserPassword] = useState("");
  const [userTel, setUserTel] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const result = await userRegister(userName, userEmail, userPassword, userTel);
      console.log("Registration successful:", result);
      alert("Registration successful");
      // You can redirect the user or show a success message
    } catch (err) {
      setError("Registration failed. Please try again.");
      console.error("Error registering user:", err);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white rounded-md shadow-md">
      <h2 className="text-2xl font-bold mb-4">Register</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="userName" className="block text-sm font-medium text-gray-700">Name:</label>
          <input
            type="text"
            id="userName"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            required
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label htmlFor="userEmail" className="block text-sm font-medium text-gray-700">Email:</label>
          <input
            type="email"
            id="userEmail"
            value={userEmail}
            onChange={(e) => setUserEmail(e.target.value)}
            required
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label htmlFor="userPassword" className="block text-sm font-medium text-gray-700">Password:</label>
          <input
            type="password"
            id="userPassword"
            value={userPassword}
            onChange={(e) => setUserPassword(e.target.value)}
            required
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label htmlFor="userTel" className="block text-sm font-medium text-gray-700">Phone number:</label>
          <input
            type="tel"
            id="userTel"
            value={userTel}
            onChange={(e) => setUserTel(e.target.value)}
            required
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <button
          type="submit"
          className="w-full mt-4 px-4 py-2 bg-blue-600 text-white font-semibold rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Register
        </button>
      </form>
    </div>
  );
}

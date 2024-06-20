import React from "react";
import { useNavigate } from "react-router-dom";

export function VerificationPage() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col justify-center items-center h-screen">
      <h1 className="text-3xl font-bold mb-4">Verify Your Email</h1>
      <p className="text-lg mb-8">
        A verification email has been sent to your email address. Please check
        your inbox and click on the verification link to complete the
        registration.
      </p>
      <button
        onClick={() => navigate("/")}
        className="py-2 px-4 bg-indigo-600 text-white rounded"
      >
        Back to Home
      </button>
    </div>
  );
}

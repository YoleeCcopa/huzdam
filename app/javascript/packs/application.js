import React from "react";
import { createRoot } from "react-dom/client";
import SignupForm from "../components/SignupForm";
import LoginForm from "../components/LoginForm";

document.addEventListener("DOMContentLoaded", () => {
  const signupContainer = document.getElementById("signup-root");
  if (signupContainer) {
    const root = createRoot(signupContainer);
    root.render(<SignupForm />);
  }

  const loginContainer = document.getElementById("login-root");
  if (loginContainer) {
    const root = createRoot(loginContainer);
    root.render(<LoginForm />);
  }
});
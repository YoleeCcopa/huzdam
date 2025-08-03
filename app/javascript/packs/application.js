import React from "react";
import { createRoot } from "react-dom/client";
import SignupForm from "../components/SignupForm";

document.addEventListener("DOMContentLoaded", () => {
  const root = createRoot(document.getElementById("signup-root"));
  root.render(<SignupForm />);
});
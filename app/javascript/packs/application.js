import React from "react";
import { createRoot } from "react-dom/client";
import SignupForm from "../components/SignupForm";

document.addEventListener("DOMContentLoaded", () => {
    const container = document.getElementById("signup-root");
    if (container) {
        const root = createRoot(container);
        root.render( <SignupForm /> );
    }
});
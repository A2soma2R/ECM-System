"use strict";

// ===== Login Form =====
const loginForm = document.getElementById("loginForm");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const loginButton = document.getElementById("loginButton");
const loginMessage = document.getElementById("loginMessage");

// ===== Password Visibility Toggle =====
const togglePasswordButton = document.getElementById(
  "togglePasswordButton"
);
const passwordVisibilitySlash = document.getElementById(
  "passwordVisibilitySlash"
);

const setPasswordVisibility = (visible) => {
  passwordInput.type = visible ? "text" : "password";

  const label = visible ? "Hide password" : "Show password";

  togglePasswordButton.setAttribute("aria-label", label);
  togglePasswordButton.title = label;
  passwordVisibilitySlash.toggleAttribute("hidden", !visible);
};

togglePasswordButton.addEventListener("click", () => {
  setPasswordVisibility(passwordInput.type === "password");
});

// ===== Login Message =====
const showLoginMessage = (message, type = "error") => {
  loginMessage.textContent = message;
  loginMessage.className = `form-message ${type}`;
  loginMessage.hidden = false;
};

// ===== Login Button =====
const setLoginLoading = (isLoading) => {
  loginButton.disabled = isLoading;
  togglePasswordButton.disabled = isLoading;

  loginButton.textContent = isLoading ? "Signing in..." : "Sign in";
  loginForm.setAttribute("aria-busy", String(isLoading));
};

// ===== Clear Validation Feedback =====
const clearValidationFeedback = () => {
  loginMessage.hidden = true;
  emailInput.removeAttribute("aria-invalid");
  passwordInput.removeAttribute("aria-invalid");
};

// ===== Field Validation Error =====
const showFieldError = (input, message) => {
  input.setAttribute("aria-invalid", "true");
  showLoginMessage(message);
  input.focus();
  return false;
};

// ===== Login Validation =====
const validateLogin = () => {
  emailInput.value = emailInput.value.trim();

  // ===== Email Validation =====
  if (!emailInput.value) {
    return showFieldError(
      emailInput,
      "Enter your email address."
    );
  }

  if (emailInput.validity.typeMismatch) {
    return showFieldError(
      emailInput,
      "Enter a valid email address."
    );
  }

  // ===== Password Validation =====
  if (!passwordInput.value) {
    return showFieldError(
      passwordInput,
      "Enter your password."
    );
  }

  return true;
};

// ===== Clear Previous Session =====
const clearSession = () => {
  sessionStorage.removeItem("ecmToken");
  sessionStorage.removeItem("ecmUser");
};

// ===== Login Request =====
const handleLogin = async (event) => {
  event.preventDefault();

  if (loginButton.disabled) {
    return;
  }

  clearValidationFeedback();

  if (!validateLogin()) {
    return;
  }

  setPasswordVisibility(false);
  setLoginLoading(true);

  try {
    clearSession();

    // ===== Send Login Credentials =====
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: emailInput.value,
        password: passwordInput.value,
      }),
    });

    const data = await response.json();

    // ===== Login Error =====
    if (!response.ok) {
      showLoginMessage(
        data.message || "Unable to sign in. Please try again."
      );
      return;
    }

    // ===== Login Response Validation =====
    if (typeof data.token !== "string" || !data.token || !data.user) {
      throw new Error("Invalid login response");
    }

    // ===== Save User Session =====
    sessionStorage.setItem("ecmToken", data.token);
    sessionStorage.setItem("ecmUser", JSON.stringify(data.user));

    passwordInput.value = "";

    // ===== Open Files Page =====
    window.location.replace("/files.html");
  } catch (error) {
    // ===== Connection or Storage Error =====
    try {
      clearSession();
    } catch (storageError) {
      console.error("Unable to clear browser session.");
    }

    showLoginMessage(
      "Unable to complete sign-in. Check your connection and allow browser storage, then try again."
    );
  } finally {
    setLoginLoading(false);
  }
};

// ===== Event Listeners =====
loginForm.addEventListener("submit", handleLogin);
emailInput.addEventListener("input", clearValidationFeedback);
passwordInput.addEventListener("input", clearValidationFeedback);

// ===== Page Startup =====
setPasswordVisibility(false);
setLoginLoading(false);
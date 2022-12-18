// import e from "express";
const form = document.getElementById("survey-form");
const username = document.getElementById("username");
const email = document.getElementById("email");
const age = document.getElementById("age");
// const state = document.getElementById('state')
const city = document.getElementById("city");
const password = document.getElementById("password");
const password2 = document.getElementById("password2");

form.addEventListener("submit", (e) => {
  e.preventDefault();

  validateInputs();
});

const setError = (element, message) => {
  const inputControl = element.parentElement;
  const errorDisplay = inputControl.querySelector(".error");

  errorDisplay.innerText = message;
  inputControl.classList.add("error");
  inputControl.classList.remove("success");
};

const setSuccess = (element) => {
  const inputControl = element.parentElement;
  const errorDisplay = inputControl.querySelector(".error");

  errorDisplay.innerText = "";
  inputControl.classList.add("success");
  inputControl.classList.remove("error");
};

const isValidEmail = (email) => {
  const re =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
};

const validateInputs = () => {
  const usernameValue = username.value.trim();
  const emailValue = email.value.trim();
  const passwordValue = password.value.trim();
  const password2Value = password2.value.trim();
  const ageValue = age.value.trim();
  const stateValue = state.value.trim();
  const cityValue = city.value.trim();

  if (usernameValue === "") {
    setError(username, "Username is required");
  } else if (usernameValue.trim.length === 0) {
    setError(username, "Length is 0");
  }
  let regex = /^[A-Za-z0-9]*$/;
  if (!regex.test(usernameValue.trim)) {
    setError(username, "input valid username");
  } else {
    setSuccess(username);
  }

  if (emailValue === "") {
    setError(email, "Email is required");
  } else if (!isValidEmail(emailValue)) {
    setError(email, "Provide a valid email address");
  } else if (emailValue.trim.length === 0) {
    setError(email, "Length of email is 0");
  }
  let regex1 = /^[A-Za-z0-9_!#$%&'*+\/=?`{|}~^.-]+@[A-Za-z0-9.-]+$/gm;
  if (!regex1.test(emailValue)) {
    setError("Error: email not valid");
  } else {
    setSuccess(email);
  }

  if (stateValue === "") {
    setError(state, "State is required");
  } else {
    setSuccess(age);
  }

  if (cityValue === "") {
    setError(city, "City is required");
  } else {
    setSuccess(city);
  }

  if (ageValue === "") {
    setError(age, "Age is required");
  } else if (ageValue < 16) {
    setError(age, "Age cannot be less than 16");
  } else if (ageValue > 120) {
    setError(age, "Age is more thn 120, please input valid age");
  } else {
    setSuccess(age);
  }
  if (ageValue === "") {
    setError(age, "Age is required");
  } else if (ageValue < 16) {
    setError(age, "Age cannot be less than 16 for this website");
  } else if (ageValue > 120) {
    setError(age, "Age is more thn 120, please input valid age");
  } else {
    setSuccess(age);
  }

  if (passwordValue === "") {
    setError(password, "Password is required");
  } else if (passwordValue.length < 6) {
    setError(password, "Password must be at least 8 character.");
  } else if (typeof passwordValue !== "string")
    setError("Error: password must be a string");
  else if (passwordValue.trim().length === 0)
    setError("Error: password cannot be an empty string or just spaces");
  let regex2 = /^(?=.*\d)(?=.*[A-Z])(?=.*[^0-9])(?=.*[!@#$%^&*]).{6,}$/;

  if (!regex2.test(passwordValue))
    setError(
      "Error: password must contain at least one uppercase character, one number and one sp else"
    );
  else {
    setSuccess(password);
  }

  if (password2Value === "") {
    setError(password, "Password is required");
  } else if (password2Value !== passwordValue) {
    setError(password2, "Passwords doesn't match");
  } else if (password2Value.length < 6) {
    setError(password, "Password must be at least 8 character.");
  } else if (typeof password2Value !== "string")
    setError("Error: password must be a string");
  else if (password2Value.trim().length === 0)
    setError("Error: password cannot be an empty string or just spaces");
  let regex3 = /^(?=.*\d)(?=.*[A-Z])(?=.*[^0-9])(?=.*[!@#$%^&*]).{6,}$/;

  if (!regex3.test(password2Value))
    setError(
      "Error: password must contain at least one uppercase character, one number and one sp else"
    );
  else {
    setSuccess(password);
  }
};

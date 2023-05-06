// Variables
// import { printJob } from "./app1.js";
var currentUser;
const sendBtn = document.getElementById("sendBtn"),
  portSelect = document.getElementById("port-select"),
  crew = document.getElementById("crew"),
  email = document.getElementById("email"),
  vessel = document.getElementById("vessel"),
  whatsApp = document.getElementById("whatsapp-number"),
  cell = document.getElementById("cell-number"),
  pickUp = document.getElementById("pickup-select"),
  dropOff = document.getElementById("dropoff-select"),
  numberCrew = document.getElementById("number-crew"),
  dateJa = document.getElementById("date-ja"),
  timeJa = document.getElementById("time-ja"),
  remarks = document.getElementById("remarks"),
  verificationCode = document.getElementById("verification-code"),
  resetBtn = document.getElementById("resetBtn"),
  sendEmailForm = document.getElementById("email-form"),
  
  
  u_whatsApp = document.getElementById("user-whatsApp"),
  u_email = document.getElementById("user-email"),
  u_cell = document.getElementById("user-cell"),
  u_role = document.getElementById("u_role"),
  u_password = document.getElementById("user-password"),
  u_vessel = document.getElementById("user-vessel"),
  u_first_name = document.getElementById("user-first-name"),
  u_last_name = document.getElementById("user-last-name");
  // u_register_submit = document.getElementById("u_register_submit");
// Event Listeners

eventListeners();

function eventListeners() {
  // App Init
  document.addEventListener("DOMContentLoaded", appInit);
  // u_register_submit.addEventListener("submit", registerNewUser);
  const portSelect = document.querySelector("#port-select");
  portSelect.style.display = "block";

  // Validate the forms
  email.addEventListener("blur", validateField);
  pickUp.addEventListener("blur", validateField);
  dropOff.addEventListener("blur", validateField);
  numberCrew.addEventListener("blur", validateField);
  dateJa.addEventListener("blur", validateField);
  timeJa.addEventListener("blur", validateField);
  remarks.addEventListener("blur", validateField);
  verificationCode.addEventListener("blur", validateField);

  // Send Email & reset button
  // sendEmailForm.addEventListener("submit", sendEmail);
  resetBtn.addEventListener("click", resetForm);
}

// Functions

// App Initialization
function appInit() {
  // disable the send button on load
  sendBtn.disabled = true;
}
// function registerNewUser1(e) {
//   e.preventDefault();
//   console.log("newUser  submitted");
//   // disable the register button on load
//   u_register_submit.disabled = true;
// }
// register a new  n User
function registerNewUser(e) {
  e.preventDefault();

  let table = "sci_users";
  const newUser= {
   
    u_email:u_email.value,
    u_password:u_password.value,
    u_vessel:u_vessel.value,
    u_last_name:u_last_name.value,
    u_first_name:u_first_name.value,
    u_cell:u_cell.value,
    u_role:u_role.value || "mule",
    u_whatsApp:u_whatsApp.value,
  
  };

  console.log(newUser);

//   $.ajax("/register", {
//     type: "POST",
//     data: newUser,
//   }).then(function () {
//     console.log("new user registered added");
//     console.log("request for registering an user  passed step1");
// })


  // // disable the send button on load
  // sendBtn.disabled = true;
}

function sendEmail(e) {
  e.preventDefault();

  // show the spinner
  const spinner = document.querySelector("#spinner");
  spinner.style.display = "block";

  // Show the image
  const sendEmailImg = document.createElement("img");
  sendEmailImg.src = "./assets/img/mail.gif";
  sendEmailImg.style.display = "block";

  // Hide Spinner then show the send Email image
  setTimeout(function () {
    // Hide the spinner
    spinner.style.display = "none";

    // Show the image
    document.querySelector("#loaders").appendChild(sendEmailImg);
    let pickUpObject = {
      portSelect: portSelect.value,
      crew: crew.value,
      email: email.value,
      vessel: vessel.value,
      whatsApp: whatsApp.value,
      cell: cell.value,
      pickUp: pickUp.value,
      dropOff: dropOff.value,
      numberCrew: numberCrew.value,
      dateJa: dateJa.value,
      timeJa: timeJa.value,
      remarks: remarks.value,
      verificationCode: verificationCode.value,
    };

    printJob(pickUpObject);
    // save to database
    saveToDataBase(pickUpObject);
    console.log(pickUpObject);
    // After 5 seconds, hide the image and reset the form
    setTimeout(function () {
      sendEmailForm.reset();
      sendEmailImg.remove();
    }, 5000);
  }, 3000);
}
// save a new pick up to database 
function saveToDataBase(pickUpObject) {
  let table = "sci_pickups";
  $.ajax("/api/" + table, {
    type: "POST",
    data: pickUpObject,
  }).then(function () {
    console.log("pick up added");
    console.log("request passed step1");
  });
}

// Validate the fields
function validateField() {
  let errors;

  // Validate the Length of the field
  validateLength(this);

  // Validate the email
  if (this.type === "email") {
    validateEmail(this);
  }

  // Both will return errors, then check if there're any errors
  errors = document.querySelectorAll(".error");

  // Check that the inputs are not empty
  if (
    email.value !== "" &&
    crew.value !== "" &&
    pickUp.value !== "" &&
    dropOff.value !== "" &&
    dateJa.value !== "" &&
    timeJa.value !== ""
  ) {
    if (errors.length === 0) {
      // the button should be enabled
      sendBtn.disabled = false;
    }
  }
}
// Validate the Length of the fields
function validateLength(field) {
  if (field.value.length > 0) {
    field.style.borderBottomColor = "green";
    field.classList.remove("error");
  } else {
    field.style.borderBottomColor = "red";
    field.classList.add("error");
  }
}
// validate email (checks for @ in the value )
function validateEmail(field) {
  let emailText = field.value;
  // check if the emailText contains the @ sign
  if (emailText.indexOf("@") !== -1) {
    field.style.borderBottomColor = "green";
    field.classList.remove("error");
  } else {
    field.style.borderBottomColor = "red";
    field.classList.add("error");
  }
}

// Reset the form
function resetForm(e) {
  e.preventDefault();

  sendEmailForm.reset();
  // disable the send button on load
  sendBtn.disabled = true;
}
export {currentUser};
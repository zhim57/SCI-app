// Variables
var currentJobs;

const  displayDiv = document.getElementById("display1-div");

console.log("its alive2");
displayDiv.innerText=  "its alive2";
// Event Listeners

eventListeners();

function eventListeners() {
  // App Init
  document.addEventListener("DOMContentLoaded", appInit);
  // const portSelect = document.querySelector("#port-select");
  // portSelect.style.display = "block";

  // Validate the forms
  // email.addEventListener("blur", validateField);
  // pickUp.addEventListener("blur", validateField);
  // dropOff.addEventListener("blur", validateField);
  // numberCrew.addEventListener("blur", validateField);
  // dateJa.addEventListener("blur", validateField);
  // timeJa.addEventListener("blur", validateField);
  // remarks.addEventListener("blur", validateField);
  // verificationCode.addEventListener("blur", validateField);

  // // Send Email & reset button
  // sendEmailForm.addEventListener("submit", sendEmail);
  // resetBtn.addEventListener("click", resetForm);
}

// Functions

// App Initialization
function appInit() {
  // disable the send button on load
  // sendBtn.disabled = true;
}

function sendEmail(e) {
  e.preventDefault();

  // show the spinner
  const spinner = document.querySelector("#spinner");
  spinner.style.display = "block";

  // Show the image
  const sendEmailImg = document.createElement("img");
  sendEmailImg.src = "img/mail.gif";
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
      pickUp: pickUp.value,
      dropOff: dropOff.value,
      numberCrew: numberCrew.value,
      dateJa: dateJa.value,
      timeJa: timeJa.value,
      remarks: remarks.value,
      verificationCode: verificationCode.value,
    };
    displayDiv.innerHTML= ` crew name: ${pickUpObject.crew} <br>
    vessel name: ${pickUpObject.vessel} <br>
    pick up location: ${pickUpObject.pickUp} <br>
   drop Off Location : ${pickUpObject.dropOff} <br>
    Pick up date: ${pickUpObject.dateJa} :  ${pickUpObject.timeJa}  <br>
    `;
    console.log(pickUpObject);
    // After 5 seconds, hide the image and reset the form
    setTimeout(function () {
      sendEmailForm.reset();
      sendEmailImg.remove();
    }, 5000);
  }, 3000);
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
  if (email.value !== "" && crew.value !== "" && remarks.value !== "") {
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

// print a job 
function printJob2(pickUpObject) {
  const displayDiv1 = document.createElement("div");
  currentJobs.innerHTML= ` crew name: ${pickUpObject.crew} <br>
  vessel name: ${pickUpObject.vessel} <br>
  pick up location: ${pickUpObject.pickUp} <br>
 drop Off Location : ${pickUpObject.dropOff} <br>
  Pick up date: ${pickUpObject.dateJa} :  ${pickUpObject.timeJa}  <br>
  `;
  document.querySelector("#display-div").appendChild(currentJobs);
}

export {printJob2};
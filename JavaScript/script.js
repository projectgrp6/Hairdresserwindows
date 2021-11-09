let pass = ["103", "114", "111", "117", "112", "48", "54"]; // group06

let usr;
let remark;
let psswrrd;
function validateUser() {
  usr = document.querySelector("#usr").value;
  psswrrd = document.querySelector("#pass").value;
  remark = document.querySelector("#credRemark");

  if (usr !== "Group6" || psswrrd == "" || usr == "") {
    remark.innerHTML = "Invalid Credential";
  } else if (usr === "Group6" && pass.length == psswrrd.length) {
    validatepass();
  }
}
function validatepass() {
  for (let i = 0; i < pass.length; i++) {
    if (Number(pass[i]) == psswrrd.charCodeAt(i)) {
      if (i === pass.length - 1) {
        remark.innerHTML = "Valid succeed";
        console.log("here we are");
        window.location.href = "CreateAppointment.html";
      }
    } else {
      console.log("Invalid Password");
    }
  }
}

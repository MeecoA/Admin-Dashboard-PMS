let secLink = document.querySelector("#secLink");
let persLink = document.querySelector("#councilLink");
let resiLink = document.querySelector("#resiLink");
let visiLink = document.querySelector("#visiLink");
let vehiLink = document.querySelector("#vehicLink");
let logLink = document.querySelector("#logsLink");
let archiveLink = document.querySelector("#archiveLink");
let annoLink = document.querySelector(".anno-link");
let napLink = document.querySelector("#napLink");
let dropDown = document.querySelector(".menu-btn");
let dropdownContent = document.querySelector(".dropdown-container");
let dropDownLogs = document.querySelector(".menu-btn-logs");
let dropdownContentLogs = document.querySelector(".dropdown-container-logs");

function generateDropdown() {
  dropDown.addEventListener("click", function () {
    dropDownLogs.classList.remove("active");
    dropdownContentLogs.style.display = "none";
    dropDown.classList.toggle("active");

    vehiLink.classList.remove("active");
    // logLink.classList.remove("active");
    annoLink.classList.remove("active");

    secLink.classList.remove("active");
    persLink.classList.remove("active");
    // resiLink.classList.remove("active");
    visiLink.classList.remove("active");

    if (dropdownContent.style.display === "flex") {
      dropdownContent.style.display = "none";
    } else {
      dropdownContent.style.display = "flex";
    }
  });
}
generateDropdown();
const themeBtn = document.querySelector(".theme-btn");

themeBtn.onclick = function () {
  const moon = document.querySelector(".moon");
  document.body.classList.toggle("dark-theme");
  if (document.body.classList.contains("dark-theme")) {
    moon.src = "../images/sun.png";
  } else {
    moon.src = "../images/moon.png";
  }
};

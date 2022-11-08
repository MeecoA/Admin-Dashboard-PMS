let secLink = document.querySelector("#secLink");
let persLink = document.querySelector("#councilLink");
let resiLink = document.querySelector("#resiLink");
let visiLink = document.querySelector("#visiLink");
let vehiLink = document.querySelector(".vehi-link");
let logLink = document.querySelector("#logsLink");
let annoLink = document.querySelector(".anno-link");
generateTable();
// //for the data table
function generateTable() {
  $(document).ready(function () {
    $("table.display").DataTable({
      dom: "Bfrtip",
      buttons: ["copy", "csv", "excel", "pdf", "print"],
    });
  });
}
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
// let headerTitle = document.querySelector("#headerTitle");
// //ajax - users side bar

// function loadSec() {
//   headerTitle.textContent = "Users";
//   let xhttp = new XMLHttpRequest();
//   xhttp.onreadystatechange = function () {
//     if (this.readyState == 4 && this.status == 200) {
//       document.getElementById("content").innerHTML = this.responseText;
//       secLink.classList.add("active");
//       persLink.classList.remove("active");
//       resiLink.classList.remove("active");
//       visiLink.classList.remove("active");
//       generateTable();
//       let addSec = document.querySelector("#addSec");
//       addSec.addEventListener("click", () => {});
//     }
//   };
//   xhttp.open("GET", "/sidebar/user-security.html", true);
//   xhttp.send();
// }

// function loadPersonnel() {
//   headerTitle.textContent = "Users";
//   let xhttp = new XMLHttpRequest();
//   xhttp.onreadystatechange = function () {
//     if (this.readyState == 4 && this.status == 200) {
//       document.getElementById("content").innerHTML = this.responseText;
//       secLink.classList.remove("active");
//       persLink.classList.add("active");
//       resiLink.classList.remove("active");
//       visiLink.classList.remove("active");
//     }
//   };
//   xhttp.open("GET", "../sidebar/user-personnel.html", true);
//   xhttp.send();
// }
// function loadResidents() {
//   headerTitle.textContent = "Users";
//   let xhttp = new XMLHttpRequest();
//   xhttp.onreadystatechange = function () {
//     if (this.readyState == 4 && this.status == 200) {
//       document.getElementById("content").innerHTML = this.responseText;
//       secLink.classList.remove("active");
//       persLink.classList.remove("active");
//       resiLink.classList.add("active");
//       visiLink.classList.remove("active");
//       generateTable();
//     }
//   };
//   xhttp.open("GET", "../sidebar/user-resident.html", true);
//   xhttp.send();
// }

function loadVisitors() {
  headerTitle.textContent = "Users";
  let xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      document.getElementById("content").innerHTML = this.responseText;
      secLink.classList.remove("active");
      persLink.classList.remove("active");
      resiLink.classList.remove("active");
      visiLink.classList.add("active");

      generateTable();
    }
  };
  xhttp.open("GET", "../sidebar/user-visitor.html", true);
  xhttp.send();
}

// function loadVehicles() {
//   headerTitle.textContent = "Vehicles";
//   let xhttp = new XMLHttpRequest();
//   xhttp.onreadystatechange = function () {
//     if (this.readyState == 4 && this.status == 200) {
//       document.getElementById("content").innerHTML = this.responseText;
//       secLink.classList.remove("active");
//       persLink.classList.remove("active");
//       resiLink.classList.remove("active");
//       visiLink.classList.add("active");

//       dropdownContent.style.display = "none";
//       dropDown.classList.remove("active");
//       vehiLink.classList.add("active");
//       logLink.classList.remove("active");
//       annoLink.classList.remove("active");
//       generateTable();
//     }
//   };
//   xhttp.open("GET", "../sidebar/vehicles.html", true);
//   xhttp.send();
// }

// function loadLogs() {
//   headerTitle.textContent = "Logs";
//   let xhttp = new XMLHttpRequest();
//   xhttp.onreadystatechange = function () {
//     if (this.readyState == 4 && this.status == 200) {
//       document.getElementById("content").innerHTML = this.responseText;
//       secLink.classList.remove("active");
//       persLink.classList.remove("active");
//       resiLink.classList.remove("active");
//       visiLink.classList.add("active");

//       dropdownContent.style.display = "none";
//       dropDown.classList.remove("active");
//       vehiLink.classList.remove("active");
//       logLink.classList.add("active");
//       annoLink.classList.remove("active");
//       generateTable();
//     }
//   };
//   xhttp.open("GET", "../sidebar/logs.html", true);
//   xhttp.send();
// }

// function loadAnnounce() {
//   headerTitle.textContent = "Announcements";
//   let xhttp = new XMLHttpRequest();
//   xhttp.onreadystatechange = function () {
//     if (this.readyState == 4 && this.status == 200) {
//       document.getElementById("content").innerHTML = this.responseText;
//       secLink.classList.remove("active");
//       persLink.classList.remove("active");
//       resiLink.classList.remove("active");
//       visiLink.classList.add("active");

//       dropdownContent.style.display = "none";
//       dropDown.classList.remove("active");
//       vehiLink.classList.remove("active");
//       logLink.classList.remove("active");
//       annoLink.classList.add("active");
//       generateTable();
//     }
//   };
//   xhttp.open("GET", "../sidebar/announce.html", true);
//   xhttp.send();
// }

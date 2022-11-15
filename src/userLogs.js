import * as fire from "../src/index.js";
console.log("database: ", fire.database);

async function displayLogs() {
  const myQuery = fire.doQuery(fire.myCollection(fire.db, "logs"));
  fire.myOnSnapshot(myQuery, (snapshot) => {
    //based on the query, //change this back!
    const unsubCollection = fire.myOnSnapshot(myQuery, (snapshot) => {
      //based on the query
      let logs = [];
      let index = 0;
      snapshot.docs.forEach((doc) => {
        let unpackData = { ...doc.data() };
        let objSize = Object.keys(unpackData).length;
        Object.entries(unpackData).map((element, index) => {
          if (objSize - 1 !== index) {
            console.log("time_in", element[1]["time_in"]);
            console.log("time_out", element[1]["time_out"]);

            element[1]["time_in"]["timestamp"] =
              element[1]["time_in"]["timestamp"] === ""
                ? ""
                : new Date(element[1]["time_in"]["timestamp"]).toLocaleString("en-GB", { timeZone: "UTC" });
            element[1]["time_out"]["timestamp"] =
              element[1]["time_out"]["timestamp"] === ""
                ? ""
                : new Date(element[1]["time_out"]["timestamp"]).toLocaleString("en-GB", { timeZone: "UTC" });

            index += 1; //increment
            logs.push(element[1]);
          }
        });
      });

      jQuery((e) => {
        console.log("DataTable");
        $("#table_id").DataTable({
          scrollX: true,
          pageLength: 10,
          data: logs,
          columns: [
            { data: "time_in.timestamp" },
            { data: "time_out.timestamp" },
            {
              data: (data, type, dataToSet) => {
                return data.time_in.gate_number + ", " + data.time_out.gate_number;
              },
            },
            // {"data": "time_out.officer_uid"},
            {
              data: (data, type, dataToSet) => {
                return data.time_in.officer_uid + ", " + data.time_out.officer_uid;
              },
            },
            { data: "first_name" },
            { data: "last_name" },
            { data: "middle_name" },
            { data: "plate_number" },
            { data: "vehicle_model" },
          ],
          columnDefs: [
            {
              defaultContent: "-",
              targets: "_all",
            },
          ],
          dom: "Bfrtip",
          buttons: [
            {
              extend: "copyHtml5",
              exportOptions: {
                columns: [0, 1, 2, 3, 4, 5, 6, 7],
              },
            },
            {
              extend: "print",
              exportOptions: {
                columns: [0, 1, 2, 3, 4, 5, 6, 7],
              },
            },
            {
              extend: "pdfHtml5",
              exportOptions: {
                columns: [0, 1, 2, 3, 4, 5, 6, 7],
              },
            },
            "colvis",
          ],
        });
      }); //jQuery
    }); //end of function
  }); //end of snapshot function
}

// dropdown function
let dropDown = document.querySelector(".menu-btn-logs");
let dropdownContent = document.querySelector(".dropdown-container-logs");
let dropDownSec = document.querySelector(".menu-btn");
let dropdownContentSec = document.querySelector(".dropdown-container");
function generateDropdown() {
  dropDown.addEventListener("click", function () {
    dropDownSec.classList.remove("active");
    dropdownContentSec.style.display = "none";
    dropDown.classList.toggle("active");
    vehiLink.classList.remove("active");
    logLink.classList.remove("active");
    annoLink.classList.remove("active");
    secLink.classList.remove("active");
    persLink.classList.remove("active");
    vehiLink.classList.remove("active");

    // resiLink.classList.remove("active");
    visiLink.classList.remove("active");
    napLink.classList.remove("active");
    if (dropdownContent.style.display === "flex") {
      dropdownContent.style.display = "none";
    } else {
      dropdownContent.style.display = "flex";
    }
  });
} //end of function
generateDropdown();
const loadLogs = document.querySelector("#logsLink");
loadLogs.addEventListener("click", () => {
  headerTitle.textContent = "Logs";
  let xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      document.getElementById("content").innerHTML = this.responseText;
      secLink.classList.remove("active");
      persLink.classList.remove("active");
      resiLink.classList.remove("active");
      visiLink.classList.remove("active");

      // dropdownContent.style.display = "none";
      // dropDown.classList.remove("active");
      vehiLink.classList.remove("active");
      logLink.classList.add("active");
      annoLink.classList.remove("active");

      displayLogs();
      // end getting data
    } //end if ready state
  };
  xhttp.open("GET", "../sidebar/logs.html", true);
  xhttp.send();
}); //ajax end for user logs

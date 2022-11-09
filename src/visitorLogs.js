import * as fire from "../src/index.js";
console.log("database: ", fire.database);

async function displayVisitorLogs() {
  const myQuery = fire.doQuery(fire.myCollection(fire.db, "visitor-logs"));
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
        $("#table_visitor").DataTable({
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
                columns: [0, 1, 2, 3, 4, 5, 6, 7, 8],
              },
            },
            {
              extend: "print",
              exportOptions: {
                columns: [0, 1, 2, 3, 4, 5, 6, 7, 8],
              },
            },
            {
              extend: "pdfHtml5",
              exportOptions: {
                columns: [0, 1, 2, 3, 4, 5, 6, 7, 8],
              },
            },
            "colvis",
          ],
        });
      }); //jQuery
    }); //end of function
  }); //end of snapshot function
}
// ajax start for visitor logs
const loadVisitors = document.querySelector("#visiLink");
loadVisitors.addEventListener("click", () => {
  headerTitle.textContent = "Logs";
  let xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      document.getElementById("content").innerHTML = this.responseText;
      secLink.classList.remove("active");
      persLink.classList.remove("active");
      resiLink.classList.remove("active");
      visiLink.classList.add("active");

      // dropdownContent.style.display = "none";
      // dropDown.classList.remove("active");
      vehiLink.classList.remove("active");
      logLink.classList.remove("active");
      annoLink.classList.remove("active");

      displayVisitorLogs(); //display visitor log
      // end getting data
    } //end if ready state
  };
  xhttp.open("GET", "../sidebar/visitorlogs.html", true);
  xhttp.send();
}); //ajax end for visitor logs

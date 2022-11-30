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

            element[1]['time_in']['timestamp'] = element[1]['time_in']['timestamp'] === null ? '-' : element[1]['time_in']['timestamp'].toDate().toLocaleString() + ", Gate #" + element[1]['time_in']['gate_number'];
            
            element[1]['time_out']['timestamp'] = element[1]['time_out']['timestamp'] === null ? '-' : element[1]['time_out']['timestamp'].toDate().toLocaleString() + ", Gate #" + element[1]['time_in']['gate_number'];
            
          
            element[1]['time_out']['officer_uid'] = element[1]['time_out']['officer_uid'] === null ? '-' : element[1]['time_out']['officer_uid'];

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
              customize: function (win) {
                $(win.document.body).css("font-size", "12pt").prepend(`<div class="header-container">
                <img
                  src="https://lh6.googleusercontent.com/ijbIEy2U5qlRSzF8bkpk9msm1TjRHhU-RYmsdtvaRjxmY9XJCzYcTnfmNWLc-WcylYSiGyRHPdGJ6VgTPdyCv65j76HgtfrymqFjdv7nZNdYx-kML0ryA6whkuWzwx-mpCg-s0vgFtMxBb4s3AhrRuv6Iv0lXY5IhgKLJlJYud06NpP6YJWMT82XubNKEGo1=w1280"
                  alt=""
                />
                <br />
                <br />
                <div class="print-type-holder">
                  <div class="title-print">VISITOR LOGS</div>
                  <br>
                  <br>
                </div>
              </div>
              
              `);

                $(win.document.body).find("table").addClass("compact").css("font-size", "inherit");
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
      napLink.classList.remove("active");
      vehiLink.classList.remove("active");

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

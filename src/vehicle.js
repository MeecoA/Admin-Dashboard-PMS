import * as fire from "../src/index";

/* 
    // ######### NOTE!
    Do not forget to add the limit function to the index.js

    import { 
                 // limit the number of documents
    } from 'firebase/firestore';

    export const doLimit = limit;
    */

//AJAX START FOR FACULTY
const loadVehicles = document.querySelector("#vehicLink");

loadVehicles.addEventListener("click", () => {
  headerTitle.textContent = "Users";
  let xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = async function () {
    if (this.readyState == 4 && this.status == 200) {
      document.getElementById("content").innerHTML = this.responseText;
      secLink.classList.remove("active");
      persLink.classList.remove("active");
      resiLink.classList.remove("active");
      visiLink.classList.remove("active");
      vehiLink.classList.add("active");
      napLink.classList.remove("active");
      dropdownContent.style.display = "none";
      dropDown.classList.remove("active");
      dropDownLogs.classList.remove("active");
      dropdownContentLogs.style.display = "none";

      // generateTable();

      // rendering the data
      var t = $("#vehictable").DataTable({
        dom: "Bfrtip",
        buttons: [
          {
            extend: "copyHtml5",
            exportOptions: {
              columns: [0, 1, 2, 3, 4],
            },
          },
          {
            extend: "print",
            exportOptions: {
              columns: [0, 1, 2, 3, 4],
            },
          },
          {
            extend: "pdfHtml5",
            exportOptions: {
              columns: [0, 1, 2, 3, 4],
            },
          },
          "colvis",
        ],
      });
      const buttonsColvis = document.querySelector(".buttons-colvis");
      buttonsColvis.textContent = "Filter By Category";

      $(".table-body-vehicles").on("click", "tr", function (e) {
        var data = t.row(this).data();
        alert("you clicked on " + data[1] + "'s row");
      });
      const renderVehicles = (doc) => {}; //end of render sec

      const colRef = fire.myCollection(fire.db, "vehicle-information");
      const vehicleQuery = fire.doQuery(colRef, fire.doLimit(10));

      const docsSnap = await fire.myGetDocs(vehicleQuery);
      docsSnap.forEach((doc) => {
        let myData = doc.data();
        // console.log("data", doc.id);

        const vehicle = Object.keys(myData)
          .filter((key) => key !== "vehicle_length")
          // .filter((key) => key.includes("Name"))
          .reduce((obj, key) => {
            return Object.assign(obj, {
              [key]: myData[key],
            });
          }, {});

        // Mag-rurun kapag walang laman

        const vehicleKeys = Object.keys(myData);
        vehicleKeys.forEach((data, index) => {
          if (data !== "vehicle_length") {
            const entry = vehicle[data];
            // Id, Plate, Vehicle Owner, Vehicle(Images), Model, QR Code, Use Types

            if (typeof entry.qrCode === "object") {
              entry.qrCode = entry.qrCode.toString();
            }
            console.table([doc.id, data, entry.images[1], entry.model[0], entry.qrCode, entry.use_types]);

            // table
            var temp = t.row.add([doc.id, data, entry.model[0]]).draw(false).node();
            $(temp).attr("data-id", `${doc.id}`);
          }
        });

        // console.log(doc.id, Object.keys(myData).toString(), vehicle);
      });
    } //end if ready state
  };
  xhttp.open("GET", "../sidebar/vehicles.html", true);
  xhttp.send();
});
//AJAX END FOR FACULTY

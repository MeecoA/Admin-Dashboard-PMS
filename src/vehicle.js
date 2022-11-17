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
              columns: [0, 1, 2],
            },
          },
          {
            extend: "print",
            exportOptions: {
              columns: [0, 1, 2],
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
                <div class="title-print">VEHICLE INFORMATION</div>
                <br>
                <br>
              </div>
            </div>
            
            `);

              $(win.document.body).find("table").css("font-size", "inherit");
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
      const viewVehicles = (doc, entry) => {
        //viewing vehicles
      }; //end of render sec

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
            var temp = t.row
              .add([
                doc.id,
                data,
                entry.model[0],
                `
                <a href="#viewVehicle" rel="modal:open" class="view-vehicle-button"><iconify-icon
                class="view-icon"
                icon="bi:eye-fill"
                style="color: black"
                width="16"
                height="16"
              ></iconify-icon>View</a>
              </div>
            </div>
          `,
              ])
              .draw(false)
              .node();
            $(temp).attr("data-id", `${doc.id}`);

            viewVehicles(doc, entry);
            const viewVehicle = document.querySelector(`[data-id='${doc.id}'] .view-vehicle-button`);

            viewVehicle.addEventListener("click", () => {
              $("#viewVehicle").fadeIn();
              const viewPlate = document.querySelector(".viewPlate");
              const viewModel = document.querySelector(".viewModel");
              const vehicleViewPic = document.querySelector("#vehicleViewPic");
              vehicleViewPic.src = entry.images[1];
              viewPlate.textContent = data;
              viewModel.textContent = entry.model[0];
            });
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

import * as fire from "../src/index";

/* 
    // ######### NOTE!
    Do not forget to add the limit function to the index.js

    import { 
                 // limit the number of documents
    } from 'firebase/firestore';

    export const doLimit = limit;
    */
let countVehicle = 1;
//AJAX START FOR FACULTY
const loadVehicles = document.querySelector("#vehicLink");

loadVehicles.addEventListener("click", () => {
  headerTitle.textContent = "Vehicles";
  let xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = async function () {
    if (this.readyState == 4 && this.status == 200) {
      document.getElementById("content").innerHTML = this.responseText;
      secLink.classList.remove("active");
      persLink.classList.remove("active");
      resiLink.classList.remove("active");
      visiLink.classList.remove("active");
      annoLink.classList.remove("active");
      archiveLink.classList.remove("active");
      vehiLink.classList.add("active");
      napLink.classList.remove("active");
      dropdownContent.style.display = "none";
      dropDown.classList.remove("active");
      dropDownLogs.classList.remove("active");
      dropdownContentLogs.style.display = "none";
      veriLink.classList.remove("active");
      let dataVehicle = [];
      const colRef = fire.myCollection(fire.db, "vehicle-information");
      const vehicleQuery = fire.doQuery(colRef);

      let currentIndex = 0;

      const docsSnap = await fire.myGetDocs(vehicleQuery);
      docsSnap.forEach(async (doc) => {
        let vehicleData = { ...doc.data() };
        let appendData = { a: "" };

        const vehicle = Object.keys(vehicleData)
          .filter((key) => key !== "vehicle_length")
          // .filter((key) => key.includes("Name"))
          .reduce((obj, key) => {
            return Object.assign(obj, {
              [key]: vehicleData[key],
            });
          }, {});

        let ownerFullName = "";
        let ownerProfilePic = "";

        await getAccountInformationOwner(doc.id).then((evt) => {
          // console.log('event: ', evt)
          // If middle name is undefined
          // if (typeof evt["middle_name"] === "undefined" || evt["middle_name"].trim() === "") {
          //   console.log(true);
          //   evt["middle_name"] = " ";
          // }

          // appendData['vehicle_owner'] = `${evt['last_name']} ${evt['first_name']} ${evt['middle_name'][0]}`;
          ownerFullName = `${evt["last_name"]} ${evt["first_name"]} `;

          // Check the profile picture.
          if (typeof evt["profile_pic"] === "undefined" || evt["profile_pic"] === null) {
            // appendData['profile_pic'] = 'https://firebasestorage.googleapis.com/v0/b/bulsu---pms.appspot.com/o/placeholders%2Fprofile-circled.svg?alt=media&token=5d172c80-6cc4-4ddd-841b-8877a6813010';
            ownerProfilePic =
              "https://firebasestorage.googleapis.com/v0/b/bulsu---pms.appspot.com/o/placeholders%2Fprofile-circled.svg?alt=media&token=5d172c80-6cc4-4ddd-841b-8877a6813010";
          } else {
            // appendData['profile_pic'] = evt['profile_pic'];
            ownerProfilePic = evt["profile_pic"];
          }
        });

        const vehicleKeys = Object.keys(vehicleData);
        console.log("vehicleKeys", vehicleKeys);
        vehicleKeys.forEach((data, index) => {
          if (data !== "vehicle_length") {
            const entry = vehicle[data];
            console.log("this is the", entry);
            // console.log('current entry: ', entry, ownerFullName);
            console.log("current entry: ", ownerFullName);
            // Id, Plate, Vehicle Owner, Vehicle(Images), Model, QR Code, Use Types

            if (typeof entry.qrCode === "object") {
              entry.qrCode = entry.qrCode.toString();
            }

            appendData = {
              index: index,
              uid: doc.id,
              vehicle_owner: ownerFullName,
              profile_pic: ownerProfilePic,
              plate_number: data,
              model: entry.model[0],
              qrCode: entry.qrCode,
              entry: entry.use_types,
              registration_date: entry.createdAt.toDate().toDateString(),
              classification: entry.classification,
              code_category: entry.code_category,
              license_code: entry.license_code,
              color: entry.color,
              year: entry.year,
              remarks: entry.remarks,
            };

            // Check the vehicle image
            if (typeof entry.images[1] === "undefined" || entry.images[1] === null) {
              appendData["image"] =
                "https://firebasestorage.googleapis.com/v0/b/bulsu---pms.appspot.com/o/placeholders%2Fvehicle-car-16-filled.svg?alt=media&token=8bb41423-816c-4de8-8a4c-22f597fd2b04";
            } else {
              appendData["image"] = entry.images[1];
            }
            console.log("appendData", appendData);

            appendData["action"] = "";
            appendData["index"] = countVehicle;
            countVehicle += 1;

            dataVehicle.push(appendData);
            console.log("This is the count ", countVehicle);
          }
        });
        appendData = null; //delete from memory

        // Display the table after all the neccessary are ready.
        currentIndex = currentIndex + 1;
        // console.log('::', currentIndex, docsSnap.docs);
        if (currentIndex === docsSnap.docs.length) {
          // console.log('HAHAHA');
          // console.log('final vehicleInformation: ', dataVehicle);
          jQuery((e) => {
            console.log("DataTable");
            var table = $("#vehictable").DataTable({
              scrollX: true,
              data: dataVehicle,
              dom: "Bfrtip",
              buttons: [
                {
                  extend: "copyHtml5",
                  exportOptions: {
                    columns: [1, 2, 3, 4],
                  },
                },
                {
                  extend: "print",
                  header: true,
                  title: "Vehicles Information Report - Administrator",
                  exportOptions: {
                    columns: [1, 2, 3, 4],
                  },
                  customize: function (win) {
                    $(win.document.body).css("font-size", "12pt").prepend(`<div class="header-container">
                    <img
                      src="https://firebasestorage.googleapis.com/v0/b/bulsu---pms.appspot.com/o/header%2Fheader-print.png?alt=media&token=c86c9641-c200-4e94-89a1-c96e83c34a81"
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

                    $(win.document.body).find("table").addClass("compact").css("font-size", "inherit");
                  },
                },
                {
                  extend: "pdfHtml5",
                },
                "colvis",
              ],
              columns: [
                // { data: "index" },
                { data: "uid" },
                {
                  data: (data, type, dataToSet) => {
                    return `<img src="${data.profile_pic}" alt="profile picture" width="20" height="20">
							${data.vehicle_owner}`;
                  },
                },
                { data: "plate_number" },
                {
                  data: (data, type, dataToSet) => {
                    return `<img src="${data.image}" alt="profile picture" width="20" height="20">
							${data.model}`;
                  },
                },
                { data: "registration_date" },
                {
                  defaultContent: `<button class="button-vehicles">
                  <a href="#viewVehicle" rel="modal:open" class="view-vehicle-button"><iconify-icon
                  class="view-icon"
                  icon="bi:eye-fill"
                  class="iconifys"
                  width="16"
                  height="16"
                ></iconify-icon>
                <div>View</div>
                </a></button>
            `,
                },
              ],
              createdRow: function (row, data, dataIndex) {
                $(row).attr("data-id", `${data.uid}`);
              },
            });
            const buttonsColvis = document.querySelector(".buttons-colvis");
            buttonsColvis.textContent = "Filter By Category";
            // $("#vehictable").on("click", "tbody tr", function () {
            //   var row = table.row($(this)).data();
            //   console.log(row); //full row of array data
            //   console.log(row.index); //EmployeeId
            // });

            $("#vehictable tbody").on("click", "button", function () {
              var row = table.row($(this).parents("tr")).data();
              console.log(row); //full row of array data
              console.log(row.index); //EmployeeId
              const viewPlate = document.querySelector(".viewPlate");
              const viewModel = document.querySelector(".viewModel");
              const viewOwner = document.querySelector(".viewOwner");

              const viewClassification = document.querySelector("#view-classification");
              const viewColor = document.querySelector("#view-color");
              const viewLicense_Category = document.querySelector("#view-license-category");
              const viewYear = document.querySelector("#view-year");
              const viewRemarks = document.querySelector("#view-remarks");

              const vehicleViewPic = document.querySelector("#vehicleViewPic");
              viewPlate.textContent = row.plate_number;
              viewModel.textContent = row.model;
              viewOwner.textContent = row.vehicle_owner;

              // Check if the field is not yet defined
              if (typeof row.classification === undefined || row.classification === null) {
                viewClassification.textContent = "-";
              } else {
                viewClassification.textContent = row.classification;
              }
              if (typeof row.color === undefined || row.color === null) {
                viewColor.textContent = "-";
              } else {
                viewColor.textContent = row.color;
              }
              if (typeof row.code_category === undefined || row.code_category === null) {
                viewClassification.textContent = "-";
              } else {
                viewLicense_Category.textContent = `${row.license_code}, ${row.code_category}`;
              }
              if (typeof row.year === undefined || row.year === null) {
                viewYear.textContent = "-";
              } else {
                viewYear.textContent = row.year;
              }
              if (typeof row.remarks === undefined || row.remarks === null) {
                viewRemarks.textContent = "-";
              } else {
                viewRemarks.textContent = row.remarks;
              }

              // console.log("row.classification", row.classification);
              // console.log("row.code_category", row.code_category);
              // console.log("row.color", row.color);
              // console.log("row.license_code", row.license_code);
              // console.log("row.year", row.year);
              // console.log("row.remarks", row.remarks);

              vehicleViewPic.src = row.image;
            });
          });
        } else {
          // console.log('currentIndex: ' + currentIndex)
          // console.log('currentIndex: ' + currentIndex)
        }

        // console.log(doc.id, Object.keys(vehicleData).toString(), vehicle);
      }); //end of docSnap

      async function getAccountInformationOwner(userUID) {
        let vehicle = undefined;
        const docVehicleActivity = fire.myDoc(fire.db, "account-information", userUID);
        const docVSnap = await fire.myGetDoc(docVehicleActivity);
        if (docVSnap.exists()) {
          // vehicle = Object.keys(docVSnap.data()).filter((e) => {
          //     if(e !== 'vehicle_length') {
          //         return e;
          //     }
          // }).toString();
          return { ...docVSnap.data() };
        } else {
          vehicle = "N/A";
        }
        return vehicle;
      }

      console.log("hetoooooo", dataVehicle);
    } //end if ready state
  };
  xhttp.open("GET", "../sidebar/vehicles.html", true);
  xhttp.send();
});
//AJAX END FOR FACULTY

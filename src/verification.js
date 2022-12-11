import { doc } from "firebase/firestore";
import * as fire from "../src/index.js";
console.log("database: ", fire.database);

//AJAX START FOR FACULTY
const loadVerify = document.querySelector("#veriLink");

loadVerify.addEventListener("click", () => {
  headerTitle.textContent = "Verification";
  let xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = async function () {
    if (this.readyState == 4 && this.status == 200) {
      document.getElementById("content").innerHTML = this.responseText;
      secLink.classList.remove("active");
      persLink.classList.remove("active");
      resiLink.classList.remove("active");
      visiLink.classList.remove("active");
      napLink.classList.remove("active");
      vehiLink.classList.remove("active");
      archiveLink.classList.remove("active");
      veriLink.classList.add("active");
      let dataVehicle = [];
      const colRef = fire.myCollection(fire.db, "vehicle-information");
      const vehicleQuery = fire.doQuery(colRef);

      let currentIndex = 0;
      let countVehicle = 1;

      const docsSnap = await fire.myGetDocs(vehicleQuery);
      docsSnap.forEach(async (doc) => {
        let vehicleData = { ...doc.data() };
        let appendData = { a: "" };

        let vehicle = Object.keys(vehicleData)
          .filter((key) => key !== "vehicle_length")
          // .filter((key) => key.includes("Name"))
          .reduce((obj, key) => {
            return Object.assign(obj, {
              [key]: vehicleData[key],
            });
          }, {});

        // vehicle.filter((data) => {
        //     return data.is_vehicle_verified !== null || data.is_vehicle_verified !== undefined
        // });
        // console.log("vehicle list: ", vehicle)

        let ownerFullName = "";
        let ownerProfilePic = "";

        await getAccountInformationOwner(doc.id).then((evt) => {
          // If middle name is undefined
          if (typeof evt["middle_name"] === "undefined" || evt["middle_name"].trim() === "") {
            console.log(true);
            evt["middle_name"] = " ";
          }

          // appendData['vehicle_owner'] = `${evt['last_name']} ${evt['first_name']} ${evt['middle_name'][0]}`;
          ownerFullName = `${evt["last_name"]} ${evt["first_name"]} ${evt["middle_name"][0]}`;

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
        // console.log('vehicleKeys', vehicleKeys);
        vehicleKeys.forEach((data, index) => {
          if (data !== "vehicle_length") {
            const entry = vehicle[data];
            // console.log('current entry: ', entry, ownerFullName);
            // console.log('current entry: ', ownerFullName);
            // Id, Plate, Vehicle Owner, Vehicle(Images), Model, QR Code, Use Types

            if (typeof entry.qrCode === "object") {
              entry.qrCode = entry.qrCode.toString();
            }

            console.log("isVehicleVerified: ", typeof entry.is_vehicle_verified !== "undefined");
            // Check if the vehicle has sent verification
            if (typeof entry.is_vehicle_verified !== "undefined") {
              if (entry.is_vehicle_verified === true) {
                entry.is_vehicle_verified = "Approved";
              } else {
                entry.is_vehicle_verified = "Pending";
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
                verify_kyc: entry.verification_kyc,
                verify_receipt: entry.verification_receipt,
                status: entry.is_vehicle_verified,
                registration_date: entry.createdAt.toDate(),
              };

              // Check the vehicle image
              if (typeof entry.images[1] === "undefined" || entry.images[1] === null) {
                appendData["image"] =
                  "https://firebasestorage.googleapis.com/v0/b/bulsu---pms.appspot.com/o/placeholders%2Fvehicle-car-16-filled.svg?alt=media&token=8bb41423-816c-4de8-8a4c-22f597fd2b04";
              } else {
                appendData["image"] = entry.images[1];
              }
              // console.log('appendData', appendData);

              appendData["action"] = "";
              appendData["index"] = countVehicle;
              countVehicle += 1;
              dataVehicle.push(appendData);
            }
          }
        });
        appendData = null; //delete from memory

        // Display the table after all the neccessary are ready.
        currentIndex = currentIndex + 1;
        // console.log('::', currentIndex, docsSnap.docs);

        console.log("dataVehicle", dataVehicle);
        if (currentIndex === docsSnap.docs.length) {
          // console.log('HAHAHA');
          // console.log('final vehicleInformation: ', dataVehicle);
          jQuery((e) => {
            console.log("DataTable");
            $("#table_vehicles").DataTable({
              scrollX: true,
              data: dataVehicle,
              dom: "Bfrtip",

              buttons: [
                {
                  extend: "copyHtml5",
                  exportOptions: {
                    columns: [2, 3, 4, 5],
                  },
                },
                {
                  extend: "print",
                  header: true,
                  title: "Faculty Report - Administrator",
                  exportOptions: {
                    columns: [2, 3, 4, 5],
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
                      <div class="title-print">FACULTY</div>
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
                    columns: [2, 3, 4, 5],
                  },
                },
                "colvis",
              ],
              columns: [
                { data: "index" },
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
                { data: "status" },
                {
                  data: (data, type, dataToSet) => {
                    return `
                                  <button class="view-verification" receipt="${data.verify_kyc}" kyc="${data.verify_receipt}" plate="${data.plate_number}" data-key="${data.uid}">View</button>`;
                    // return `
                    // <button class="view-verification" receipt="${data.verify_kyc}" kyc="${data.verify_receipt}" plate="${data.plate_number}" data-key="${data.uid}">View</button>
                    // <button class="accept-verification" plate="${data.plate_number}" data-key="${data.uid}">Accept</button>
                    // <button class="deny-verification" plate="${data.plate_number}" data-key="${data.uid}">Deny</button>`;
                  },
                },
              ],
            }); //end of DataTable plugin initialization

            const viewVerification = document.querySelectorAll(".view-verification");
            const acceptVerification = document.querySelectorAll(".accept-verification");
            const denyVerification = document.querySelectorAll(".deny-verification");

            viewVerification.forEach((view, index) => {
              view.addEventListener("click", () => {
                console.log("View button: ", view.getAttribute("data-key"), " : ", view.getAttribute("plate"));

                Swal.fire({
                  // icon: 'error',
                  title: "Vehicle Verification",
                  // text: 'Something went wrong!',
                  html: `
                              <div class="popup-verification">
                                  <div>
                                      <p>Official Receipt / Certificate of Registration</p>
                                      <img src="${view.getAttribute("kyc")}" alt="kyc"/>
                                  </div> 
                                  <div>
                                      <p>KYC Verification</p>
                                      <img src="${view.getAttribute("receipt")}" alt="kyc"/>
                                  </div> 
                              </div>
                              `,
                  showConfirmButton: false,
                  footer: `<div>
                                  <button class="popup-accept">Accept</button>
                                  <button class="popup-deny">Deny</button>
                              </div>
                              `,
                });

                document.querySelector(".popup-accept").addEventListener("click", () => {
                  console.log("popup-accept");
                  console.log("uid: ", view.getAttribute("data-key"));
                  console.log("plate: ", view.getAttribute("plate"));

                  const docRefAccount = fire.myDoc(fire.db, "vehicle-information", view.getAttribute("data-key"));
                  fire
                    .myUpdateDoc(docRefAccount, {
                      [`${view.getAttribute("plate")}.is_vehicle_verified`]: true,
                      [`${view.getAttribute("plate")}.is_vehicle_date`]: fire.myServerTimestamp,
                    })
                    .then(() => {
                      Swal.fire({
                        icon: "success",
                        title: "Verification accepted.",
                        // text: 'Something went wrong!',
                      });
                    });

                  swal.close();
                });
                document.querySelector(".popup-deny").addEventListener("click", () => {
                  console.log("popup-deny");
                  console.log("uid: ", view.getAttribute("data-key"));
                  console.log("plate: ", view.getAttribute("plate"));

                  const docRefAccount = fire.myDoc(fire.db, "vehicle-information", view.getAttribute("data-key"));
                  fire
                    .myUpdateDoc(docRefAccount, {
                      [`${view.getAttribute("plate")}.is_vehicle_verified`]: fire.doDeleteField(),
                      [`${view.getAttribute("plate")}.is_vehicle_date`]: fire.myServerTimestamp,
                    })
                    .then(() => {
                      Swal.fire({
                        title: "Are you sure?",
                        text: "You won't be able to revert this!",
                        icon: "warning",
                        showCancelButton: true,
                        confirmButtonColor: "#3085d6",
                        cancelButtonColor: "#d33",
                        confirmButtonText: "Yes, Deny",
                      }).then((result) => {
                        if (result.isConfirmed) {
                          Swal.fire("Denied!", "This entry has been denied.", "success");
                        }
                      });
                      //   Swal.fire({
                      //     icon: "success",
                      //     title: "Verification rejected.",
                      //     // text: 'Something went wrong!',
                      //   }).then(() => {
                      //     window.location.reload();
                      //   });
                    });
                  swal.close();
                });
              });
            }); // end of viewVerification
          }); // end of jQuery DataTable call
        } // end of currentIndex === docsSnap.docs.length
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
      console.log(dataVehicle);
    } //end if ready state
  };
  xhttp.open("GET", "../sidebar/verification.html", true);
  xhttp.send();
});
//AJAX END FOR FACULTY

import * as fire from "../src/index.js";
console.log("database: ", fire.database);

// displayLogs(); //display logs

// jQuery(function () {
//   $("#logs-id").on("click", (e) => {
//     console.log("Logs qr.js");

//   });
// });

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
    // resiLink.classList.remove("active");
    visiLink.classList.remove("active");

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

// AJAX Start for Admin Council
const loadCouncil = document.querySelector("#councilLink");
loadCouncil.addEventListener("click", () => {
  ajaxCouncil();
});

function ajaxCouncil() {
  headerTitle.textContent = "Users";
  let xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      document.getElementById("content").innerHTML = this.responseText;
      secLink.classList.remove("active");
      persLink.classList.add("active");
      resiLink.classList.remove("active");
      visiLink.classList.remove("active");
      var t = $("#councilTable").DataTable({
        dom: "Bfrtip",
        buttons: [
          {
            extend: "copyHtml5",
            exportOptions: {
              columns: [0, 1, 2, 3, 4, 5],
            },
          },
          {
            extend: "print",
            exportOptions: {
              columns: [0, 1, 2, 3, 4, 5],
            },
          },
          {
            extend: "pdfHtml5",
            exportOptions: {
              columns: [0, 1, 2, 3, 4, 5],
            },
          },
          "colvis",
        ],
      });
      const buttonsColvis = document.querySelector(".buttons-colvis");
      buttonsColvis.textContent = "Filter By Category";
      // $(".facultyTbody").on("click", "tr", function (e) {
      //   var data = t.row(this).data();
      //   alert("you clicked on " + data[1] + "'s row");
      // });

      const imgInputCouncil = document.querySelector("#imgInputCouncil");
      imgInputCouncil.addEventListener("change", (e) => {
        var image = document.querySelector("#outputCouncil");
        image.src = URL.createObjectURL(e.target.files[0]);
      });

      const addCouncilForm = document.querySelector("#addCouncilForm");
      addCouncilForm.addEventListener("submit", (e) => {
        e.preventDefault();
        //adding council
        const email = addCouncilForm.email.value;
        const password = addCouncilForm.password.value;
        fire.doAuth(fire.auth, email, password).then((cred) => {
          const userAdminCouncil = fire.myDoc(fire.myCollection(fire.db, "admin-council"), cred.user.uid);
          fire
            .doSetDoc(userAdminCouncil, {
              firstname: addCouncilForm.fname.value,
              lastname: addCouncilForm.lname.value,
              middlename: addCouncilForm.mname.value,
              email: addCouncilForm.email.value,
              phone: addCouncilForm.phone.value,
              idnum: addCouncilForm.idnum.value,
            })
            .then(() => {
              alert("Admin Council Created: ", cred.user);
              addCouncilForm.reset();
              var image = document.querySelector("#output");
              image.src = "https://static.thenounproject.com/png/571343-200.png";
            });
          const storage = fire.storage;
          const storageRef = fire.myStorageRef(storage, `admin_council/${cred.user.uid}/profilepic.jpg`);
          var file = document.querySelector("#imgInputCouncil").files[0];
          var name = file.name;
          var metadata = {
            contentType: file.type,
          };
          fire.myUploadBytes(storageRef, file).then((snapshot) => {
            console.log("UPLOADED");
          });
        });
      }); //end adding data
      // creating table data for council
      let iD;
      const councilTable = document.querySelector(".tbody-council");
      const renderCouncil = (docu) => {
        var tableTr = t.row
          .add([
            docu.id,
            `${docu.data().firstname} ${docu.data().middlename} ${docu.data().lastname}`,
            docu.data().idnum,
            docu.data().email,
            docu.data().phone,
            `<div class="drop-container-council">
            <button class="drop-btn-council">ACTIONS
            <iconify-icon icon="bxs:down-arrow" style="color: black;" width="12" height="12"></iconify-icon>
            </button>
            <div class="drop-content-council" id="dropCouncil">
              <a href="#viewCouncil" rel="modal:open" class="view-council-button"><iconify-icon
              class="view-icon"
              icon="bi:eye-fill"
              style="color: black"
              width="16"
              height="16"
            ></iconify-icon>View</a>

                <a href="#editmodal" rel="modal:open" class = 'edit-button'>
                <iconify-icon
                class="view-icon"
                icon="bxs:user-circle" style="color: black;" width="16" height="16"></iconify-icon>Edit Info</a>

              <a href="#editAccInfo" rel="modal:open" class = "editCouncilAccBtn">
              <iconify-icon
                class="view-icon"
                icon="fa6-solid:key" style="color: black;" width="16" height="16"></iconify-icon>Edit Account</a>

                <a href="#" class="delete-button-council">
                <iconify-icon
                  class="view-icon"
                  icon="ep:delete-filled"
                  style="color: black"
                  width="16"
                  height="16"
                ></iconify-icon>
                Delete User</a>
            </div>
          </div>
        `,
          ])
          .draw(false)
          .node();
        $(tableTr).attr("data-id", `${docu.id}`);

        const councilDelete = document.querySelector(`[data-id='${docu.id}'] .delete-button-council`);
        councilDelete.addEventListener("click", () => {
          const docRef = fire.myDoc(fire.db, "admin-council", docu.id);
          fire.myDeleteDoc(docRef).then(() => {
            console.log("deleted successfully");
          });
        }); //end of deleting data

        //editing data -- edit useer information only
        const editCouncilForm = document.querySelector("#editCouncilForm");
        const editCouncilBtn = document.querySelector(`[data-id='${docu.id}'] .edit-button`);

        editCouncilBtn.addEventListener("click", () => {
          iD = docu.id;

          editCouncilForm.fname.value = docu.data().firstname;
          editCouncilForm.lname.value = docu.data().lastname;
          editCouncilForm.mname.value = docu.data().middlename;
          editCouncilForm.phone.value = docu.data().phone;
          editCouncilForm.idnum.value = docu.data().idnum;
        });

        //for edit submit
        editCouncilForm.addEventListener("submit", (e) => {
          e.preventDefault();
          const docRef = fire.myDoc(fire.db, "admin-council", iD);

          fire
            .myUpdateDoc(docRef, {
              firstname: editCouncilForm.fname.value,
              lastname: editCouncilForm.lname.value,
              middlename: editCouncilForm.mname.value,
              phone: editCouncilForm.phone.value,
              idnum: editCouncilForm.idnum.value,
            })
            .then(() => {
              ajaxCouncil();
            });
        });

        const dropCouncil = document.querySelector(`[data-id='${docu.id}'] .drop-btn-council`);
        const dropCouncilContent = document.querySelector(`[data-id='${docu.id}'] #dropCouncil`);
        dropCouncil.addEventListener("click", () => {
          dropCouncilContent.classList.toggle("show");
        });
        //dropdown - if user clicks outside of the dropdown
        window.onclick = function (event) {
          if (!event.target.matches(".drop-btn-council")) {
            var dropdowns = document.getElementsByClassName("drop-content-council");
            var i;
            for (i = 0; i < dropdowns.length; i++) {
              var openDropdown = dropdowns[i];
              if (openDropdown.classList.contains("show")) {
                openDropdown.classList.remove("show");
              }
            }
          }
        };
        // Edit Account -- email and password
        const editSecAccInfo = document.querySelector("#editCouncilAccForm");
        const editSeccAccBtn = document.querySelector(`[data-id='${docu.id}'] .editCouncilAccBtn`);
        const emailBox = document.querySelector(".email-box");
        const passBox = document.querySelector(".password-box");

        // script for edit account modal
        const changeEmailBtn = document.querySelector(".change-email-button");
        const changePassBtn = document.querySelector(".change-password-button");
        changeEmailBtn.addEventListener("click", () => {
          passBox.classList.add("hide-change");
          emailBox.classList.remove("hide-change");
          changePassBtn.classList.remove("title-bg");
          changeEmailBtn.classList.add("title-bg");
        });
        changePassBtn.addEventListener("click", () => {
          passBox.classList.remove("hide-change");
          emailBox.classList.add("hide-change");
          changePassBtn.classList.add("title-bg");
          changeEmailBtn.classList.remove("title-bg");
        });
        editSeccAccBtn.addEventListener("click", () => {
          passBox.classList.add("hide-change");
          changeEmailBtn.classList.add("title-bg");
          editSecAccInfo.email.value = docu.data().email;
          editSecAccInfo.password.value = docu.data().password;
        });
        //for updating edit
        editSecAccInfo.addEventListener("submit", (e) => {
          e.preventDefault();
          const docRef2 = myDoc(fire.db, "admin-council", iD);
          fire
            .myUpdateDoc(docRef2, {
              email: editSecAccInfo.secEmail.value,
              password: editSecAccInfo.secPassword.value,
            })
            .then(() => {});
        });
        // end upate
        //viewing the council information
        const councilViewPic = document.querySelector("#councilViewPic");
        const viewName = document.querySelector(".viewCouncilName");
        const viewPhone = document.querySelector(".viewCouncilPhone");
        const viewEmail = document.querySelector(".viewCouncilEmail");
        const viewCouncilButton = document.querySelector(`[data-id='${docu.id}'] .view-council-button`);
        const fullName = `${docu.data().firstname} ${docu.data().middlename} ${docu.data().lastname}`;
        viewCouncilButton.addEventListener("click", () => {
          //retrieving the photo
          const storagePic = fire.storage;
          const storageRef = fire.myStorageRef(storagePic, `admin_council/${docu.id}/profilepic.jpg`);
          fire.myGetDownloadUrl(storageRef).then((url) => {
            console.log(url);
            councilViewPic.src = url;
          });

          viewName.textContent = fullName;
          viewPhone.textContent = docu.data().phone;
          viewEmail.textContent = docu.data().email;
        });

        //end viewing
      }; //end of renderCouncil
      fire.myOnSnapshot(fire.councilColRef, (snapshot) => {
        snapshot.docChanges().forEach((change) => {
          if (change.type === "added") {
            renderCouncil(change.doc);
          }
          if (change.type === "removed") {
            let row = document.querySelector(`[data-id="${change.doc.id}"]`);
            // let tbody = row.parentElement;
            councilTable.removeChild(row);
          }
          if (change.type === "modified") {
            let row = document.querySelector(`[data-id="${change.doc.id}"]`);
            councilTable.removeChild(row);
            renderCouncil(change.doc);
          }
        });
      });
    } //end if ready state
  };
  xhttp.open("GET", "../sidebar/user-council.html", true);
  xhttp.send();
}

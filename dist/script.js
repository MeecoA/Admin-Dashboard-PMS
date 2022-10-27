import * as fire from "../src/index.js";
console.log("database: ", fire.database);

// displayLogs(); //display logs

// jQuery(function () {
//   $("#logs-id").on("click", (e) => {
//     console.log("Logs qr.js");

//   });
// });
const loadLogs = document.querySelector("#logsLink");
function displayLogs() {
  const myQuery = fire.doQuery(fire.myCollection(fire.database, "logs"));
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
            console.log(index, element[1]);
            element[1]["time_in"] = Date(new Date(0).setUTCSeconds(element[1]["time_in"]["seconds"]));
            element[1]["time_out"] =
              element[1]["time_out"] === ""
                ? ""
                : new Date(element[1]["time_out"]).toLocaleString("en-GB", { timeZone: "UTC" });

            index += 1; //increment
            logs.push(element[1]);
          }
        });
      });
      console.log(logs);

      //Sort the data by time_scanned
      logs.sort(function (a, b) {
        return new Date(a.time_scanned) - new Date(b.time_scanned);
      });
      console.log("sorted:", logs); //print the result

      jQuery((e) => {
        console.log("DataTable");
        $(".table_id").DataTable({
          dom: "Bfrtip",
          buttons: ["copy", "csv", "excel", "pdf", "print"],
          data: logs,
          columns: [{ data: "time_in" }, { data: "time_out" }, { data: "plate_number" }, { data: "owner" }],
        });
      }); //jQuery
    }); //end of function
  }); //end of snapshot function
}

loadLogs.addEventListener("click", () => {
  headerTitle.textContent = "Logs";
  let xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      document.getElementById("content").innerHTML = this.responseText;
      secLink.classList.remove("active");
      persLink.classList.remove("active");
      resiLink.classList.remove("active");
      visiLink.classList.add("active");

      dropdownContent.style.display = "none";
      dropDown.classList.remove("active");
      vehiLink.classList.remove("active");
      logLink.classList.add("active");
      annoLink.classList.remove("active");
      displayLogs();
      // end getting data
    } //end if ready state
  };
  xhttp.open("GET", "../sidebar/logs.html", true);
  xhttp.send();
});

// Adding Admin Council
const loadCouncil = document.querySelector("#councilLink");
loadCouncil.addEventListener("click", () => {
  headerTitle.textContent = "Users";
  let xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      document.getElementById("content").innerHTML = this.responseText;
      secLink.classList.remove("active");
      persLink.classList.add("active");
      resiLink.classList.remove("active");
      visiLink.classList.remove("active");

      const addCouncilForm = document.querySelector("#addCouncilForm");
      addCouncilForm.addEventListener("submit", (e) => {
        e.preventDefault();
        //adding council
        fire
          .myAddDoc(fire.councilColRef, {
            firstname: addCouncilForm.fname.value,
            lastname: addCouncilForm.lname.value,
            middlename: addCouncilForm.mname.value,
            email: addCouncilForm.email.value,
            phone: addCouncilForm.phone.value,
            idnum: addCouncilForm.idnum.value,
          })
          .then(() => {
            addCouncilForm.reset();
          });
        //authenticate council
        const email = addCouncilForm.email.value;
        const password = addCouncilForm.password.value;
        fire.doAuth(fire.auth, email, password).then((cred) => {
          console.log("Admin Council Created: ", cred.user);
          addCouncilForm.reset();
        });
      });
      // creating table data for council
      let iD;
      const councilTable = document.querySelector(".tbody-council");
      const renderCouncil = (docu) => {
        const tr = `<tr data-id='${docu.id}'>
        <td>${docu.id}</td>
        <td>${docu.data().firstname} ${docu.data().middlename} ${docu.data().lastname}</td>
        <td>${docu.data().idnum}</td>
        <td>${docu.data().email}</td>
        <td>${docu.data().phone}</td>
        <td>
        <div class="drop-container-council">
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

              <a href="#" class="delete-button">
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
      </td>
      </tr>`;
        councilTable.insertAdjacentHTML("beforeend", tr);
        // deleting data
        const councilDelete = document.querySelector(`[data-id='${docu.id}'] .delete-button`);
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
              firstname: editSecForm.secFname.value,
              middlename: editSecForm.secMname.value,
              lastname: editSecForm.secLname.value,
              position: editSecForm.position.value,
              // email: editSecForm.secEmail.value,
              phone: editSecForm.secPhone.value,
              province: editSecForm.secProvince.value,
              street: editSecForm.secStreet.value,
              municipality: editSecForm.secMunicip.value,
              barangay: editSecForm.secBrgy.value,
              // password: editSecForm.secPassword.value,
            })
            .then(() => {});
        });

        const dropCouncil = document.querySelector(`[data-id='${docu.id}'] .drop-btn-council`);
        const dropCouncilContent = document.querySelector(`[data-id='${docu.id}'] #dropCouncil`);
        dropCouncil.addEventListener("click", () => {
          dropCouncilContent.classList.toggle("show");
        });
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
        const viewName = document.querySelector(".viewCouncilName");
        const viewPhone = document.querySelector(".viewCouncilPhone");
        const viewEmail = document.querySelector(".viewCouncilEmail");
        const viewCouncilButton = document.querySelector(`[data-id='${docu.id}'] .view-council-button`);
        const fullName = `${docu.data().firstname} ${docu.data().middlename} ${docu.data().lastname}`;
        viewCouncilButton.addEventListener("click", () => {
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
});

import * as fire from "../src/index.js";
console.log("database: ", fire.database);

const loadNap = document.querySelector("#napLink");

loadNap.addEventListener("click", () => {
  ajaxNap();
});

function ajaxNap() {
  headerTitle.textContent = "Users";
  let xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      document.getElementById("content").innerHTML = this.responseText;
      secLink.classList.remove("active");
      persLink.classList.remove("active");
      resiLink.classList.remove("active");
      visiLink.classList.remove("active");
      vehiLink.classList.remove("active");

      loadNap.classList.add("active");
      var t = $("#napTable").DataTable({
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

      const imgInputNap = document.querySelector("#imgInputNap");
      imgInputNap.addEventListener("change", (e) => {
        var image = document.querySelector("#outputNap");
        image.src = URL.createObjectURL(e.target.files[0]);
      });

      const addNapForm = document.querySelector("#addNapForm");
      addNapForm.addEventListener("submit", (e) => {
        e.preventDefault();
        //adding council
        const email = addNapForm.email.value;
        const password = addNapForm.password.value;
        fire.doAuth(fire.auth, email, password).then((cred) => {
          const userNap = fire.myDoc(fire.myCollection(fire.db, "nonacademic"), cred.user.uid);
          fire
            .doSetDoc(userNap, {
              firstname: addNapForm.fname.value,
              lastname: addNapForm.lname.value,
              middlename: addNapForm.mname.value,
              email: addNapForm.email.value,
              phone: addNapForm.phone.value,
              idnum: addNapForm.idnum.value,
            })
            .then(() => {
              alert("Non Academic Personnel Created: ", cred.user);
              addNapForm.reset();
              var image = document.querySelector("#output");
              image.src = "https://static.thenounproject.com/png/571343-200.png";
            });
          const storage = fire.storage;
          const storageRef = fire.myStorageRef(storage, `nonacademic/${cred.user.uid}/profilepic.jpg`);
          var file = document.querySelector("#imgInputNap").files[0];
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
      const napTable = document.querySelector(".tbody-nap");
      const renderNap = (docu) => {
        var tableTr = t.row
          .add([
            docu.id,
            `${docu.data().firstname} ${docu.data().middlename} ${docu.data().lastname}`,
            docu.data().idnum,
            docu.data().email,
            docu.data().phone,
            `<div class="drop-container-nap">
            <button class="drop-btn-nap">ACTIONS
            <iconify-icon icon="bxs:down-arrow" style="color: black;" width="12" height="12"></iconify-icon>
            </button>
            <div class="drop-content-nap" id="dropNap">
              <a href="#viewNap" rel="modal:open" class="view-nap-button"><iconify-icon
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

              <a href="#editAccInfo" rel="modal:open" class = "editNapAccBtn">
              <iconify-icon
                class="view-icon"
                icon="fa6-solid:key" style="color: black;" width="16" height="16"></iconify-icon>Edit Account</a>

                <a href="#" class="delete-button-nap">
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

        const napDelete = document.querySelector(`[data-id='${docu.id}'] .delete-button-nap`);
        napDelete.addEventListener("click", () => {
          const docRef = fire.myDoc(fire.db, "nonacademic", docu.id);
          fire.myDeleteDoc(docRef).then(() => {
            console.log("deleted successfully");
          });
        }); //end of deleting data

        //editing data -- edit useer information only
        const editNapForm = document.querySelector("#editNapForm");
        const editNapBtn = document.querySelector(`[data-id='${docu.id}'] .edit-button`);

        editNapBtn.addEventListener("click", () => {
          iD = docu.id;

          editNapForm.fname.value = docu.data().firstname;
          editNapForm.lname.value = docu.data().lastname;
          editNapForm.mname.value = docu.data().middlename;
          editNapForm.phone.value = docu.data().phone;
          editNapForm.idnum.value = docu.data().idnum;
        });

        //for edit submit
        editNapForm.addEventListener("submit", (e) => {
          e.preventDefault();
          const docRef = fire.myDoc(fire.db, "nonacademic", iD);

          fire
            .myUpdateDoc(docRef, {
              firstname: editNapForm.fname.value,
              lastname: editNapForm.lname.value,
              middlename: editNapForm.mname.value,
              phone: editNapForm.phone.value,
              idnum: editNapForm.idnum.value,
            })
            .then(() => {
              ajaxNap();
            });
        });

        const dropNap = document.querySelector(`[data-id='${docu.id}'] .drop-btn-nap`);
        const dropNapContent = document.querySelector(`[data-id='${docu.id}'] #dropNap`);
        dropNap.addEventListener("click", () => {
          dropNapContent.classList.toggle("show");
        });
        //dropdown - if user clicks outside of the dropdown
        window.onclick = function (event) {
          if (!event.target.matches(".drop-btn-nap")) {
            var dropdowns = document.getElementsByClassName("drop-content-nap");
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
        const editNapAccInfo = document.querySelector("#editNapAccForm");
        const editNapAccBtn = document.querySelector(`[data-id='${docu.id}'] .editNapAccBtn`);
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
        editNapAccBtn.addEventListener("click", () => {
          passBox.classList.add("hide-change");
          changeEmailBtn.classList.add("title-bg");
          editNapAccInfo.email.value = docu.data().email;
          editNapAccInfo.password.value = docu.data().password;
        });
        //for updating edit
        editNapAccInfo.addEventListener("submit", (e) => {
          e.preventDefault();
          const docRef2 = myDoc(fire.db, "admin-council", iD);
          fire
            .myUpdateDoc(docRef2, {
              email: editNapAccInfo.secEmail.value,
              password: editNapAccInfo.secPassword.value,
            })
            .then(() => {});
        });
        // end upate
        //viewing the council information
        const napViewPic = document.querySelector("#napViewPic");
        const viewName = document.querySelector(".viewNapName");
        const viewPhone = document.querySelector(".viewNapPhone");
        const viewEmail = document.querySelector(".viewNapEmail");
        const viewNapButton = document.querySelector(`[data-id='${docu.id}'] .view-nap-button`);
        const fullName = `${docu.data().firstname} ${docu.data().middlename} ${docu.data().lastname}`;
        viewNapButton.addEventListener("click", () => {
          //retrieving the photo
          const storagePic = fire.storage;
          const storageRef = fire.myStorageRef(storagePic, `nonacademic/${docu.id}/profilepic.jpg`);
          fire.myGetDownloadUrl(storageRef).then((url) => {
            console.log(url);
            napViewPic.src = url;
          });

          viewName.textContent = fullName;
          viewPhone.textContent = docu.data().phone;
          viewEmail.textContent = docu.data().email;
        });

        //end viewing
      }; //end of renderCouncil
      fire.myOnSnapshot(fire.napColRef, (snapshot) => {
        snapshot.docChanges().forEach((change) => {
          if (change.type === "added") {
            renderNap(change.doc);
          }
          if (change.type === "removed") {
            let row = document.querySelector(`[data-id="${change.doc.id}"]`);
            // let tbody = row.parentElement;
            napTable.removeChild(row);
          }
          if (change.type === "modified") {
            let row = document.querySelector(`[data-id="${change.doc.id}"]`);
            napTable.removeChild(row);
            renderNap(change.doc);
          }
        });
      });
    } //end if ready state
  };
  xhttp.open("GET", "../sidebar/user-nap.html", true);
  xhttp.send();
}

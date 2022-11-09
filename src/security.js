import * as fire from "../src/index.js";
console.log("database: ", fire.database);

//AJAX START FOR SECURITY
const loadSec = document.querySelector("#secLink");

loadSec.addEventListener("click", () => {
  ajaxSec();
});

function ajaxSec() {
  headerTitle.textContent = "Users";
  let xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      document.getElementById("content").innerHTML = this.responseText;
      secLink.classList.add("active");
      persLink.classList.remove("active");
      resiLink.classList.remove("active");
      visiLink.classList.remove("active");
      logsLink.classList.remove("active");
      //data tables
      var t = $("#sectable").DataTable({
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
            customize: function (win) {
              $(win.document.body)
                .css("font-size", "10pt")
                .prepend(
                  '<img src="http://datatables.net/media/images/logo-fade.png" style="position:absolute; top:0; left:0;" />'
                );

              $(win.document.body).find("table").addClass("compact").css("font-size", "inherit");
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

      // preview of uploaded photo
      const imgInput = document.querySelector("#imgInput");
      imgInput.addEventListener("change", (e) => {
        var image = document.querySelector("#output");
        image.src = URL.createObjectURL(e.target.files[0]);
      });

      //adding data
      const addSecurity = document.querySelector("#addSecForm");
      addSecurity.addEventListener("submit", (e) => {
        e.preventDefault();
        // authenticate
        const email = addSecurity.secEmail.value;
        const password = addSecurity.secPassword.value;
        fire.doAuth(auth, email, password).then((cred) => {
          const userSec = fire.myDoc(fire.myCollection(fire.db, "security"), cred.user.uid);
          fire
            .doSetDoc(userSec, {
              barangay: addSecurity.secBrgy.value,
              position: addSecurity.position.value,
              email: addSecurity.secEmail.value,
              firstname: addSecurity.secFname.value,
              lastname: addSecurity.secLname.value,
              middlename: addSecurity.secMname.value,
              municipality: addSecurity.secMunicip.value,
              password: addSecurity.secPassword.value,
              phone: addSecurity.secPhone.value,
              province: addSecurity.secProvince.value,
              street: addSecurity.secStreet.value,
              createdAt: serverTimestamp(),
            })
            .then(() => {
              // alert("Security Created: ", cred.user);
              ajaxSec();
              addSecurity.reset();
              var image = document.querySelector("#output");
              image.src = "https://static.thenounproject.com/png/571343-200.png";
            });
          const storage = fire.storage;
          const storageRef = fire.myStorageRef(storage, `secruity/${cred.user.uid}/profilepic.jpg`);
          var file = document.querySelector("#imgInput").files[0];
          var name = file.name;
          var metadata = {
            contentType: file.type,
          };
          fire.myUploadBytes(storageRef, file).then((snapshot) => {
            console.log("UPLOADED");
          });
        }); //end of createUserWithEmailAndPassword
      }); //end adding data

      //creating the table data
      let id;
      const sectable = document.querySelector(".tbody-security");
      const renderSecurity = (docu) => {
        console.log(docu.id);
        var tableTr = t.row
          .add([
            docu.id,
            `${docu.data().firstname} ${docu.data().middlename} ${docu.data().lastname}`,
            docu.data().position,
            `${docu.data().barangay}, ${docu.data().street}, ${docu.data().municipality}, ${docu.data().province}`,
            docu.data().email,
            docu.data().phone,
            `<div class="drop-container">
              <button class="drop-btn">ACTIONS
              <iconify-icon icon="bxs:down-arrow" style="color: black;" width="12" height="12"></iconify-icon>
              </button>
              <div class="drop-content" id="dropSec">
  
                <a href="#viewSec" rel="modal:open" class="view-button"><iconify-icon
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
  
                <a href="#editAccInfo" rel="modal:open" class = "editSecAccBtn">
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
          `,
          ])
          .draw(false)
          .node();
        $(tableTr).attr("data-id", `${docu.id}`);
        // const tr = `<tr data-id='${docu.id}'>
        //   <td>${docu.id}</td>
        //   <td>${docu.data().firstname} ${docu.data().middlename} ${docu.data().lastname}</td>
        //   <td>${docu.data().position}</td>
        //   <td>${docu.data().barangay}, ${docu.data().street}, ${docu.data().municipality}, ${docu.data().province}</td>
        //   <td>${docu.data().email}</td>
        //   <td>${docu.data().phone}</td>
        //   <td>
        // sectable.insertAdjacentHTML("beforeend", tr);
        //deleting data
        const secDelete = document.querySelector(`[data-id='${docu.id}'] .delete-button`);
        secDelete.addEventListener("click", () => {
          const docRef = fire.myDoc(fire.db, "security", docu.id);
          fire.myDeleteDoc(docRef).then(() => {
            console.log("deleted successfully");
          });
        }); //end of deleting data

        //editing data -- edit useer information only
        const editSecForm = document.querySelector("#editSecForm");
        const editSecBtn = document.querySelector(`[data-id='${docu.id}'] .edit-button`);

        editSecBtn.addEventListener("click", () => {
          id = docu.id;
          editSecForm.secBrgy.value = docu.data().barangay;
          editSecForm.position.value = docu.data().position;
          // editSecForm.secEmail.value = docu.data().email;
          editSecForm.secFname.value = docu.data().firstname;
          editSecForm.secLname.value = docu.data().lastname;
          editSecForm.secMname.value = docu.data().middlename;
          editSecForm.secMunicip.value = docu.data().municipality;
          // editSecForm.secPassword.value = docu.data().password;
          editSecForm.secPhone.value = docu.data().phone;
          editSecForm.secProvince.value = docu.data().province;
          editSecForm.secStreet.value = docu.data().street;
        });

        //for edit submit
        editSecForm.addEventListener("submit", (e) => {
          e.preventDefault();
          const docRef = fire.myDoc(fire.db, "security", id);

          fire
            .myUpdateDoc(docRef, {
              firstname: editSecForm.secFname.value,
              middlename: editSecForm.secMname.value,
              lastname: editSecForm.secLname.value,
              position: editSecForm.position.value,
              phone: editSecForm.secPhone.value,
              province: editSecForm.secProvince.value,
              street: editSecForm.secStreet.value,
              municipality: editSecForm.secMunicip.value,
              barangay: editSecForm.secBrgy.value,
            })
            .then(() => {
              ajaxSec();
            });
        });

        const dropSec = document.querySelector(`[data-id='${docu.id}'] .drop-btn`);
        const dropSecContent = document.querySelector(`[data-id='${docu.id}'] #dropSec`);
        dropSec.addEventListener("click", () => {
          dropSecContent.classList.toggle("show");
        });
        //dropdown - if user clicks outside of the dropdown
        window.onclick = function (event) {
          if (!event.target.matches(".drop-btn")) {
            var dropdowns = document.getElementsByClassName("drop-content");
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
        const editSecAccInfo = document.querySelector("#editSecAccForm");
        const editSeccAccBtn = document.querySelector(`[data-id='${docu.id}'] .editSecAccBtn`);
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
          editSecAccInfo.secEmail.value = docu.data().email;
          editSecAccInfo.secPassword.value = docu.data().password;
        });
        //for updating edit
        editSecAccInfo.addEventListener("submit", (e) => {
          e.preventDefault();
          const docRef2 = fire.myDoc(fire.db, "security", id);
          updateDoc(docRef2, {
            email: editSecAccInfo.secEmail.value,
            password: editSecAccInfo.secPassword.value,
          }).then(() => {});
        });

        //viewing the security information
        const secViewPic = document.querySelector("#secViewPic");
        const viewName = document.querySelector(".viewName");
        const viewPos = document.querySelector(".viewPos");
        const viewAddress = document.querySelector(".viewAddress");
        const viewPhone = document.querySelector(".viewPhone");
        const viewEmail = document.querySelector(".viewEmail");
        const viewButton = document.querySelector(`[data-id='${docu.id}'] .view-button`);
        const fullName = `${docu.data().firstname} ${docu.data().middlename} ${docu.data().lastname}`;
        const fullAddress = `${docu.data().barangay}, ${docu.data().street}, ${docu.data().municipality}, ${
          docu.data().province
        }`;

        viewButton.addEventListener("click", () => {
          //retrieivng the photo
          const storagePic = fire.storage;
          const storageRef = fire.myStorageRef(storagePic, `secruity/${docu.id}/profilepic.jpg`);
          fire.myGetDownloadUrl(storageRef).then((url) => {
            console.log(url);
            secViewPic.src = url;
          });

          viewName.textContent = fullName;
          viewPos.textContent = docu.data().position;
          viewAddress.textContent = fullAddress;
          viewPhone.textContent = docu.data().phone;
          viewEmail.textContent = docu.data().email;
        });
        //end view

        // end edit account email and password
      }; //end of render sec

      //getting the collection data
      //real time collection of data
      fire.myOnSnapshot(fire.secColRef, (snapshot) => {
        snapshot.docChanges().forEach((change) => {
          if (change.type === "added") {
            renderSecurity(change.doc);
          }
          if (change.type === "removed") {
            let row = document.querySelector(`[data-id="${change.doc.id}"]`);
            // let tbody = row.parentElement;
            sectable.removeChild(row);
          }
          if (change.type === "modified") {
            let row = document.querySelector(`[data-id="${change.doc.id}"]`);
            sectable.removeChild(row);
            renderSecurity(change.doc);
          }
        });
      });
    } //end if ready state
  };
  xhttp.open("GET", "../sidebar/user-security.html", true);
  xhttp.send();
}
//AJAX END FOR SECURITY

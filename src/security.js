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
  xhttp.onreadystatechange = async function () {
    if (this.readyState == 4 && this.status == 200) {
      document.getElementById("content").innerHTML = this.responseText;
      secLink.classList.add("active");
      archiveLink.classList.remove("active");
      persLink.classList.remove("active");
      resiLink.classList.remove("active");
      visiLink.classList.remove("active");
      logsLink.classList.remove("active");
      napLink.classList.remove("active");
      vehiLink.classList.remove("active");

      //data tables
      var t = $("#sectable").DataTable({
        responsive: true,
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
              $(win.document.body).css("font-size", "12pt").prepend(`<div class="header-container">
              <img
                src="https://lh6.bkpk9msm1TjRHhU-RYmsdtvaRjxmY9XJCzYcTnfmNWLc-WcylYSiGyRHPdGJ6VgTPdyCv65j76HgtfrymqFjdv7nZNdYx-kML0ryA6whkuWzwx-mpCg-s0vgFtMxBb4s3AhrRuv6Iv0lXY5IhgKLJlJYud06NpP6YJWMT82XubNKEGo1=w1280"
                alt=""
              />
              <br />
              <br />
              <div class="print-type-holder">
                <div class="title-print">SECURITY OFFICERS</div>
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
              columns: [0, 1, 2, 3, 4, 5],
            },
          },
          "colvis",
        ],
      });

      // });
      const buttonsColvis = document.querySelector(".buttons-colvis");
      buttonsColvis.textContent = "Filter By Category";

      // preview of uploaded photo
      const imgInput = document.querySelector("#imgInput");
      imgInput.addEventListener("change", (e) => {
        var image = document.querySelector("#output");
        image.src = URL.createObjectURL(e.target.files[0]);
      });

      const imgInputUpdate = document.querySelector("#imgInputUpdate");
      imgInputUpdate.addEventListener("change", (e) => {
        var image = document.querySelector("#outputUpdate");
        image.src = URL.createObjectURL(e.target.files[0]);
      });

      //adding data

      const addSecurity = document.querySelector("#addSecForm");
      addSecurity.addEventListener("submit", (e) => {
        const secCpassword = document.querySelector("#secCpassword").value;
        const secPassword = document.querySelector("#secPassword").value;
        const errorPassword = document.querySelector(".errorPassword");
        const passValidate = document.querySelectorAll(".passValidate");

        if (secPassword != secCpassword) {
          e.preventDefault();
          errorPassword.textContent = "Passwords do not match!";
          passValidate.forEach((input) => {
            input.style.border = "2px solid red";
          });
        } else {
          e.preventDefault();
          // authenticate
          const email = addSecurity.secEmail.value;
          const password = addSecurity.secPassword.value;
          fire
            .doAuth(fire.auth, email, password)
            .then((cred) => {
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
                  // password: addSecurity.secPassword.value,
                  phone: addSecurity.secPhone.value,
                  province: addSecurity.secProvince.value,
                  street: addSecurity.secStreet.value,
                })
                .then(() => {
                  // alert("Security Created: ", cred.user);

                  addSecurity.reset();
                  var image = document.querySelector("#output");
                  image.src = "https://static.thenounproject.com/png/571343-200.png";
                  Swal.fire({
                    title: "SECURITY",
                    text: "SUCCESSFULLY CREATED!",
                    icon: "success",
                  });
                  // end
                  window.onclick = function (event) {
                    if (event.target == modal) {
                      modal.style.display = "none";
                    }
                  };
                });
              const storage = fire.storage;
              const storageRef = fire.myStorageRef(storage, `secruity/${cred.user.uid}/profilepic.jpg`);
              var file = document.querySelector("#imgInput").files[0];
              fire.myUploadBytes(storageRef, file).then((snapshot) => {
                console.log("UPLOADED");
              });
            })
            .catch((error) => {
              const errorEmail = document.querySelector(".errorEmail");
              const errorPassword = document.querySelector(".errorPassword");
              const secEmailAdd = document.querySelector("#secEmailAdd");
              const errorPass = document.querySelector(".errorPass");
              switch (error.code) {
                case "auth/weak-password":
                  errorEmail.textContent = "";
                  errorPassword.textContent = "atleast 6 characters";
                  secEmailAdd.style.border = "2px solid black";
                  errorPass.style.border = "2px solid red";
                  break;
                case "auth/invalid-email":
                  errorPassword.textContent = "";
                  errorPass.style.border = "2px solid black";
                  secEmailAdd.style.border = "2px solid red";
                  errorEmail.textContent = "Invalid email!";

                  break;
                case "auth/email-already-exists":
                  secEmailAdd.style.border = "2px solid black";
                  alert("Email already exists");
                  break;

                default:
                  errorEmail.textContent = "Invalid email!";
                  break;
              }
            }); //end of createUserWithEmailAndPassword
        }
      }); //end adding data
      document.onkeyup = function () {
        const errorEmail = document.querySelector(".errorEmail");
        const errorPassword = document.querySelector(".errorPassword");
        const secEmailAdd = document.querySelector("#secEmailAdd");
        const errorPass = document.querySelector(".errorPass");
        const passValidate = document.querySelectorAll(".passValidate");

        secEmailAdd.style.border = "2px solid black";
        errorEmail.textContent = "";
        errorPassword.textContent = "";
        errorPass.style.border = "2px solid black";
        errorPassword.textContent = "";
        passValidate.forEach((input) => {
          input.style.border = "2px solid black";
        });
      };
      //creating the table data
      let id;
      const sectable = document.querySelector(".tbody-security");
      const secmainTable = document.querySelector(".secmainTable");
      const renderSecurity = (docu) => {
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
              <iconify-icon icon="bxs:down-arrow"  width="12" height="12" class="iconifys"></iconify-icon>
              </button>
              <div class="drop-content" id="dropSec">
  
                <a href="#viewSec" rel="modal:open" class="view-button"><iconify-icon
                class="view-icon"
                icon="bi:eye-fill"
      
                width="16"
                height="16"
                class="iconifys"
              ></iconify-icon>View</a>
  
                  <a href="#editmodal" rel="modal:open" class = 'edit-button'>
                  <iconify-icon
                  class="view-icon"
                  icon="bxs:user-circle" " width="16" height="16" class="iconifys"></iconify-icon>Edit Info</a>
  
                <a href="#editAccInfo" rel="modal:open" class = "editSecAccBtn">
                <iconify-icon
                  class="view-icon"
                  icon="fa6-solid:key"  width="16" height="16" class="iconifys"></iconify-icon>Edit Account</a>
  
                  <a href="#" class="delete-button">
                  <iconify-icon
                    class="view-icon"
                    icon="material-symbols:archive"
                    width="16"
                    height="16"
                    class="iconifys"
                  ></iconify-icon>
                  Archive</a>
  
              </div>
            </div>
          </td>
          `,
          ])
          .draw(false)
          .node();
        $(tableTr).attr("data-id", `${docu.id}`);

        //deleting data
        const secDelete = document.querySelector(`[data-id='${docu.id}'] .delete-button`);
        secDelete.addEventListener("click", () => {
          Swal.fire({
            title: "Are you sure you want to archive?",
            text: `Security: ${docu.data().firstname} ${docu.data().lastname}`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes",
          }).then((result) => {
            if (result.isConfirmed) {
              Swal.fire("Archived!", "Security Officer has been archived.", "success");
              const docRef = fire.myDoc(fire.db, "security", docu.id);
              fire.myDeleteDoc(docRef).then(() => {
                fire
                  .myAddDoc(fire.archivesColRef, {
                    barangay: docu.data().barangay,
                    position: docu.data().position,
                    email: docu.data().email,
                    firstname: docu.data().firstname,
                    lastname: docu.data().lastname,
                    middlename: docu.data().middlename,
                    municipality: docu.data().municipality,
                    phone: docu.data().phone,
                    province: docu.data().province,
                    street: docu.data().street,
                  })
                  .then(() => {});
              });
            }
          }); //end of deleting data
        });
        //editing data -- edit useer information only
        const editSecForm = document.querySelector("#editSecForm");
        const editSecBtn = document.querySelector(`[data-id='${docu.id}'] .edit-button`);
        const secUpdateiew = document.querySelector("#outputUpdate");
        editSecBtn.addEventListener("click", () => {
          $("#editmodal").fadeIn();
          id = docu.id;
          editSecForm.secBrgy.value = docu.data().barangay;
          editSecForm.position.value = docu.data().position;
          editSecForm.secFname.value = docu.data().firstname;
          editSecForm.secLname.value = docu.data().lastname;
          editSecForm.secMname.value = docu.data().middlename;
          editSecForm.secMunicip.value = docu.data().municipality;
          editSecForm.secPhone.value = docu.data().phone;
          editSecForm.secProvince.value = docu.data().province;
          editSecForm.secStreet.value = docu.data().street;

          const storagePic = fire.storage;
          const storageRef = fire.myStorageRef(storagePic, `secruity/${docu.id}/profilepic.jpg`);
          fire.myGetDownloadUrl(storageRef).then((url) => {
            console.log(url);
            secUpdateiew.src = url;
          });
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
              // email: editSecForm.secEmailNew.value,
            })
            .then(() => {
              Swal.fire({
                text: "SUCCESSFULLY UPDATED!",
                icon: "success",
              });
              ajaxSec();
            });
        });
        // Edit Account -- email and password
        const editSecAccForm = document.querySelector("#editSecAccForm");
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
          $("#editAccInfo").fadeIn();
          passBox.classList.add("hide-change");
          changeEmailBtn.classList.add("title-bg");
          editSecAccForm.secEmail.value = docu.data().email;
          editSecAccForm.secPassword.value = docu.data().password;
        });
        //for updating edit
        editSecAccForm.addEventListener("submit", (e) => {
          e.preventDefault();
          const docRef = fire.myDoc(fire.db, "security", id);
          console.log("updated successfully");
          fire
            .myUpdateDoc(docRef, {
              email: editSecAccForm.secEmailNew.value,
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
          $("#viewSec").fadeIn();
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
            console.log(change.type);
          }
          if (change.type === "modified") {
            let row2 = document.querySelector(`[data-id="${change.doc.id}"]`);
            sectable.removeChild(row2);
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

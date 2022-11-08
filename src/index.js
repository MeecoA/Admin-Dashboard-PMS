import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  onSnapshot,
  addDoc,
  deleteDoc,
  doc,
  query,
  where,
  orderBy,
  serverTimestamp,
  getDoc,
  updateDoc,
  getDocs,
  setDoc,
  collectionGroup,
  arrayUnion,
  arrayRemove,
  increment,
} from "firebase/firestore";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import { getAuth, createUserWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
//this config connects the backend and frontend
//after this, intall firebase in node.js
const firebaseConfig = {
  apiKey: "AIzaSyBFzmDkFR_ZIi5aSc1ATfXykOcowRTx8oA",
  authDomain: "bulsu---pms.firebaseapp.com",
  projectId: "bulsu---pms",
  storageBucket: "bulsu---pms.appspot.com",
  messagingSenderId: "36091561292",
  appId: "1:36091561292:web:85d41dea4e7c7b80f8fbe9",
};
// const firebaseConfig = {
//   apiKey: "AIzaSyBY3hnXsQuXX_RIJ0VZSWbIYFmOxYe94SQ",
//   authDomain: "sample-capstone-project-ba941.firebaseapp.com",
//   projectId: "sample-capstone-project-ba941",
//   storageBucket: "sample-capstone-project-ba941.appspot.com",
//   messagingSenderId: "619482030443",
//   appId: "1:619482030443:web:f0d4435fed137c16902c2e",
//   measurementId: "G-VNRXHHQSRB",
// };
//for initializing app
initializeApp(firebaseConfig);

// EXPORTS
// init service, Firestore is more concerned in Collections than JSON.
export const database = getFirestore(); //anything we do in our DB, we use this
export const storage = getStorage(); //get the firebase storage
export const auth = getAuth();

//exports
// Firestore
export const myGetDownloadUrl = getDownloadURL;
export const myUploadBytes = uploadBytes;
export const myStorageRef = ref;
export const myGetFirestore = getFirestore;
export const myCollection = collection;
export const myOnSnapshot = onSnapshot;
export const myGetDocs = getDocs;
export const myGetDoc = getDoc;
export const myAddDoc = addDoc;
export const myDeleteDoc = deleteDoc;
export const myDoc = doc;
export const myUpdateDoc = updateDoc;
export const doSetDoc = setDoc;
export const doQuery = query;
export const doWhere = where;
export const doOrderBy = orderBy;
export const doArrayUnion = arrayUnion;
export const doArrayRemove = arrayRemove;
export const doIncrement = increment;
export const doAuth = createUserWithEmailAndPassword;
// initializing services
export const db = getFirestore();

//collection reference
export const secColRef = collection(db, "security");
export const accColRef = collection(db, "account-information");
export const announceColRef = collection(db, "announcements");
export const councilColRef = collection(db, "admin-council");
// for storage

//queries
const secQuery = query(secColRef, orderBy("createdAt"));
const accQuery = query(accColRef, orderBy("createdAt"));
// const announceQuery = query(announceColRef, orderBy("createdAt"));
// Side bar links
const loadSec = document.querySelector("#secLink");
const loadFaculty = document.querySelector("#resiLink");

// dashboard scripts
const userCount = document.querySelector("#userCount");

onSnapshot(accQuery, (snapshot) => {
  userCount.textContent = snapshot.size;
});

//AJAX START FOR SECURITY
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
        createUserWithEmailAndPassword(auth, email, password).then((cred) => {
          const userSec = doc(collection(db, "security"), cred.user.uid);
          setDoc(userSec, {
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
          }).then(() => {
            // alert("Security Created: ", cred.user);
            ajaxSec();
            addSecurity.reset();
            var image = document.querySelector("#output");
            image.src = "https://static.thenounproject.com/png/571343-200.png";
          });
          const storage = getStorage();
          const storageRef = ref(storage, `secruity/${cred.user.uid}/profilepic.jpg`);
          var file = document.querySelector("#imgInput").files[0];
          var name = file.name;
          var metadata = {
            contentType: file.type,
          };
          uploadBytes(storageRef, file).then((snapshot) => {
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
          const docRef = doc(db, "security", docu.id);
          deleteDoc(docRef).then(() => {
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
          const docRef = doc(db, "security", id);

          updateDoc(docRef, {
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
            // password: editSecForm.secPassword.value,\
          }).then(() => {
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
          const docRef2 = doc(db, "security", id);
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
          const storagePic = getStorage();
          const storageRef = ref(storagePic, `secruity/${docu.id}/profilepic.jpg`);
          getDownloadURL(storageRef).then((url) => {
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
      onSnapshot(secColRef, (snapshot) => {
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

// AJAX START FOR ADMIN COUNCIL

// AJAX END FOR ADMIN COUNCIL

//AJAX START FOR FACULTY
loadFaculty.addEventListener("click", () => {
  headerTitle.textContent = "Users";
  let xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      document.getElementById("content").innerHTML = this.responseText;
      secLink.classList.remove("active");
      persLink.classList.remove("active");
      resiLink.classList.add("active");
      visiLink.classList.remove("active");
      // generateTable();

      // rendering the data
      var t = $("table.display").DataTable({
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

      $(".facultyTbody").on("click", "tr", function (e) {
        var data = t.row(this).data();
        alert("you clicked on " + data[1] + "'s row");
      });
      const renderFaculty = (doc) => {
        var temp = t.row
          .add([
            doc.id,
            `${doc.data().first_name} ${doc.data().last_name}`,
            doc.data().id_number,
            doc.data().is_active,
            doc.data().phone_num,
          ])
          .draw(false)
          .node();
        $(temp).attr("data-id", `${doc.id}`);
      }; //end of render sec

      onSnapshot(accQuery, (snapshot) => {
        snapshot.docChanges().forEach((change) => {
          let accs = [];
          if (change.type === "added") {
            renderFaculty(change.doc);
            accs.push({ ...change.doc.data(), id: change.doc.id });
          }
        });
      });
    } //end if ready state
  };
  xhttp.open("GET", "../sidebar/user-resident.html", true);
  xhttp.send();
});
//AJAX END FOR FACULTY

// AJAX FOR ANNOUNCEMENTS
const announceLink = document.querySelector("#announceLink");

announceLink.addEventListener("click", () => {
  headerTitle.textContent = "Announcements";
  let xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      document.getElementById("content").innerHTML = this.responseText;
      secLink.classList.remove("active");
      persLink.classList.remove("active");
      resiLink.classList.remove("active");
      visiLink.classList.remove("active");

      dropdownContent.style.display = "none";
      dropDown.classList.remove("active");
      vehiLink.classList.remove("active");
      logLink.classList.remove("active");
      annoLink.classList.add("active");

      var t = $("#announceTable").DataTable({
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
      const addAnnounceForm = document.querySelector("#announceForm");
      addAnnounceForm.addEventListener("submit", (e) => {
        e.preventDefault();
        addDoc(announceColRef, {
          id: addAnnounceForm.title.value,
          title: addAnnounceForm.title.value,
          date: addAnnounceForm.date.value,
          posted_by: addAnnounceForm.postedBy.value,
          priority: addAnnounceForm.priority.value,
          message: addAnnounceForm.message.value,
          sources: addAnnounceForm.sources.value,
          files: addAnnounceForm.files.value,
          thumbnail: addAnnounceForm.thumbnail.value,
        }).then(() => {
          console.log(addAnnounceForm.title.value);
          const storage = getStorage();
          const imageRef = ref(storage, `announcements/thumbnail/${addAnnounceForm.title.value}/profilepic.jpg`);
          const fileRef = ref(storage, `announcements/files/${addAnnounceForm.title.value}/file`);
          var thumbnail = document.querySelector("#thumbnail").files[0];
          var file = document.querySelector("#filesAttached").files[0];

          var metadata = {
            contentType: file.type,
          };
          uploadBytes(imageRef, thumbnail).then((snapshot) => {
            console.log("UPLOADED");
          });
          uploadBytes(fileRef, file, metadata).then((snapshot) => {
            console.log("UPLOADED file2");
          });
          addAnnounceForm.reset();
        });
        //adding council
      });
      const announceTBody = document.querySelector(".table-body-announce");
      const renderAnnounce = (docu) => {
        var tableTr = t.row
          .add([
            docu.id,
            docu.data().title,
            docu.data().date,
            docu.data().posted_by,
            docu.data().priority,
            `<div class="drop-container-announce">
            <button class="drop-btn-announce">ACTIONS
            <iconify-icon icon="bxs:down-arrow" style="color: black;" width="12" height="12"></iconify-icon>
            </button>
            <div class="drop-content-announce" id="dropAnnounce">
              <a href="#viewAnnounce" rel="modal:open" class="view-announce-button"><iconify-icon
              class="view-icon"
              icon="bi:eye-fill"
              style="color: black"
              width="16"
              height="16"
            ></iconify-icon>View</a>

                <a href="#editmodal" rel="modal:open" class = 'edit-button'>
                <iconify-icon
                class="view-icon"
                icon="bxs:user-circle" style="color: black;" width="16" height="16"></iconify-icon>Edit</a>

          

                <a href="#" class="delete-button">
                <iconify-icon
                  class="view-icon"
                  icon="ep:delete-filled"
                  style="color: black"
                  width="16"
                  height="16"
                ></iconify-icon>
                Delete</a>
            </div>
          </div>
        `,
          ])
          .draw(false)
          .node();
        $(tableTr).attr("data-id", `${docu.id}`);

        const dropAnnounce = document.querySelector(`[data-id='${docu.id}'] .drop-btn-announce`);
        const dropContent = document.querySelector(`[data-id='${docu.id}'] #dropAnnounce`);
        dropAnnounce.addEventListener("click", () => {
          dropContent.classList.toggle("show");
        });
        //dropdown - if user clicks outside of the dropdown
        window.onclick = function (event) {
          if (!event.target.matches(".drop-btn-announce")) {
            var dropdowns = document.getElementsByClassName("drop-content-announce");
            var i;
            for (i = 0; i < dropdowns.length; i++) {
              var openDropdown = dropdowns[i];
              if (openDropdown.classList.contains("show")) {
                openDropdown.classList.remove("show");
              }
            }
          }
        };
        //deleting data
        const AnnounceDelete = document.querySelector(`[data-id='${docu.id}'] .delete-button`);
        AnnounceDelete.addEventListener("click", () => {
          const docRef = doc(db, "announcements", docu.id);
          deleteDoc(docRef).then(() => {
            console.log("deleted successfully");
          });
        }); //end of deleting data
        //viewing announcement
        const announceViewPic = document.querySelector("#announceViewPic");
        const viewPrio = document.querySelector(".viewPrio");
        const viewAnnounceTitle = document.querySelector(".viewAnnounceTitle");
        const viewPostedOn = document.querySelector(".viewPostedOn");
        const viewPostedBy = document.querySelector(".viewPostedBy");
        const viewMessage = document.querySelector(".viewMessage");
        const viewSources = document.querySelector(".viewSources");
        const viewFiles = document.querySelector(".viewFiles");
        const viewAnnounceBtn = document.querySelector(`[data-id='${docu.id}'] .view-announce-button`);

        viewAnnounceBtn.addEventListener("click", () => {
          viewAnnounceTitle.textContent = docu.data().title;
          viewMessage.textContent = docu.data().message;
          viewPrio.textContent = docu.data().priority;
          viewPostedOn.textContent = docu.data().date;
          viewPostedBy.textContent = docu.data().posted_by;
          viewSources.textContent = "Source: " + docu.data().sources;
          //retreiving files

          const storage = getStorage();
          const imageRef = ref(storage, `announcements/thumbnail/${docu.data().title}/profilepic.jpg`);
          const fileRef = ref(storage, `announcements/files/${docu.data().title}/file`);
          getDownloadURL(imageRef).then((url) => {
            console.log(url);
            announceViewPic.src = url;
          });
          getDownloadURL(fileRef).then((url) => {
            console.log(url);
            viewFiles.innerHTML = `<a href="${url}">Click to Open ${docu.data().title} file.</a>`;
          });
        });
      }; //end of rendering announcement

      onSnapshot(announceColRef, (snapshot) => {
        snapshot.docChanges().forEach((change) => {
          if (change.type === "added") {
            renderAnnounce(change.doc);
          }
          if (change.type === "removed") {
            let row = document.querySelector(`[data-id="${change.doc.id}"]`);
            // let tbody = row.parentElement;
            announceTBody.removeChild(row);
          }
          if (change.type === "modified") {
            let row = document.querySelector(`[data-id="${change.doc.id}"]`);
            announceTBody.removeChild(row);
            renderAnnounce(change.doc);
          }
        });
      });
    } //end if ready state
  };
  xhttp.open("GET", "../sidebar/announce.html", true);
  xhttp.send();
});

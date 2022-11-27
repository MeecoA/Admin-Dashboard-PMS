import { doc } from "firebase/firestore";
import * as fire from "../src/index.js";
console.log("database: ", fire.database);

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
      archiveLink.classList.remove("active");
      dropdownContent.style.display = "none";
      dropDown.classList.remove("active");
      dropDownLogs.classList.remove("active");
      dropdownContentLogs.style.display = "none";
      vehiLink.classList.remove("active");
      logLink.classList.remove("active");
      annoLink.classList.add("active");
      napLink.classList.remove("active");
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
        const storage = fire.storage;
        const imageRef = fire.myStorageRef(
          storage,
          `announcements/thumbnail/${addAnnounceForm.title.value}/profilepic.jpg`
        );
        const fileRef1 = fire.myStorageRef(storage, `announcements/files/${addAnnounceForm.title.value}/file1`);
        const fileRef2 = fire.myStorageRef(storage, `announcements/files/${addAnnounceForm.title.value}/file2`);
        const fileRef3 = fire.myStorageRef(storage, `announcements/files/${addAnnounceForm.title.value}/file3`);
        const thumbnail = document.querySelector("#thumbnail").files[0];
        const first_file = document.querySelector("#filesAttached1").files[0];
        const second_file = document.querySelector("#filesAttached2").files[0];
        const third_file = document.querySelector("#filesAttached3").files[0];

        var fileUrl1 = "";
        fire.myGetDownloadUrl(fileRef1).then((url) => {
          fileUrl1 = url;
        });
        console.log("this is file url: " + fileUrl1);
        fire
          .myAddDoc(fire.announceColRef, {
            id: addAnnounceForm.title.value,
            title: addAnnounceForm.title.value,
            posted_on: addAnnounceForm.postedOn.value,
            posted_by: addAnnounceForm.postedBy.value,
            priority: addAnnounceForm.priority.value,
            message: addAnnounceForm.message.value,
            sources: addAnnounceForm.sources.value,
            files: [addAnnounceForm.file1.value, addAnnounceForm.file2.value, addAnnounceForm.file3.value],
            thumbnail: addAnnounceForm.thumbnail.value,
          })
          .then(() => {
            var metadata = {
              contentType: first_file.type,
            };
            var metadata2 = {
              contentType: second_file.type,
            };
            var metadata3 = {
              contentType: third_file.type,
            };
            fire.myUploadBytes(fileRef1, first_file, metadata).then((snapshot) => {
              console.log("UPLOADED file1");
            });
            fire.myUploadBytes(fileRef2, second_file, metadata2).then((snapshot) => {
              console.log("UPLOADED file2");
            });

            fire.myUploadBytes(fileRef3, third_file, metadata3).then((snapshot) => {
              console.log("UPLOADED file3");
            });
            fire.myUploadBytes(imageRef, thumbnail).then((snapshot) => {
              console.log("UPLOADED");
            });

            addAnnounceForm.reset();
          });
      });

      const announceTBody = document.querySelector(".table-body-announce");
      const renderAnnounce = (docu) => {
        var tableTr = t.row
          .add([
            docu.id,
            docu.data().title,
            docu.data().posted_on,
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
              class="iconifys"
              width="16"
              height="16"
            ></iconify-icon>View</a>

                <a href="#editmodal" rel="modal:open" class = 'edit-button-announce'>
                <iconify-icon
                class="view-icon"
                icon="bxs:user-circle"  class="iconifys" width="16" height="16"></iconify-icon>Edit</a>

          

                <a href="#" class="delete-button">
                <iconify-icon
                  class="view-icon"
                  icon="ep:delete-filled"
                  class="iconifys"
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
          const docRef = fire.myDoc(fire.db, "announcements", docu.id);
          fire.myDeleteDoc(docRef).then(() => {
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
        const viewFiles1 = document.querySelector(".viewFiles1");
        const viewFiles2 = document.querySelector(".viewFiles2");
        const viewFiles3 = document.querySelector(".viewFiles3");
        const viewAnnounceBtn = document.querySelector(`[data-id='${docu.id}'] .view-announce-button`);

        viewAnnounceBtn.addEventListener("click", () => {
          $("#viewAnnounce").fadeIn();
          viewAnnounceTitle.textContent = docu.data().title;
          viewMessage.textContent = docu.data().message;
          viewPrio.textContent = docu.data().priority;
          viewPostedOn.textContent = docu.data().posted_on;
          viewPostedBy.textContent = docu.data().posted_by;
          viewSources.textContent = "Source: " + docu.data().sources;
          //retreiving files

          const storage = fire.storage;
          const imageRef = fire.myStorageRef(storage, `announcements/thumbnail/${docu.data().title}/profilepic.jpg`);
          const fileRef1 = fire.myStorageRef(storage, `announcements/files/${docu.data().title}/file1`);
          const fileRef2 = fire.myStorageRef(storage, `announcements/files/${docu.data().title}/file2`);
          const fileRef3 = fire.myStorageRef(storage, `announcements/files/${docu.data().title}/file3`);
          fire.myGetDownloadUrl(imageRef).then((url) => {
            console.log(url);
            announceViewPic.src = url;
          });
          fire.myGetDownloadUrl(fileRef1).then((url) => {
            console.log(url);
            viewFiles1.innerHTML = `<a href="${url}">Click to Open ${docu.data().title} first file.</a>`;
          });
          fire.myGetDownloadUrl(fileRef2).then((url) => {
            console.log(url);
            viewFiles2.innerHTML = `<a href="${url}">Click to Open ${docu.data().title} second file.</a>`;
          });
          fire.myGetDownloadUrl(fileRef3).then((url) => {
            console.log(url);
            viewFiles3.innerHTML = `<a href="${url}">Click to Open ${docu.data().title} third file.</a>`;
          });
        });
      }; //end of rendering announcement

      // editing announcement
      const editAnnounceForm = document.querySelector("#editAnnounceForm");
      const editAnnounceBtn = document.querySelector(`[data-id='${doc.id}'] .edit-button-announce`);

      editAnnounceBtn;

      fire.myOnSnapshot(fire.announceColRef, (snapshot) => {
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

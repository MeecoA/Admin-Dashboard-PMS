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
        fire
          .myAddDoc(fire.announceColRef, {
            id: addAnnounceForm.title.value,
            title: addAnnounceForm.title.value,
            posted_on: addAnnounceForm.postedOn.value,
            posted_by: addAnnounceForm.postedBy.value,
            priority: addAnnounceForm.priority.value,
            message: addAnnounceForm.message.value,
            sources: addAnnounceForm.sources.value,
            files: [addAnnounceForm.files.value],
            thumbnail: addAnnounceForm.thumbnail.value,
          })
          .then(() => {
            console.log(addAnnounceForm.title.value);
            const storage = fire.storage;
            const imageRef = fire.myStorageRef(
              storage,
              `announcements/thumbnail/${addAnnounceForm.title.value}/profilepic.jpg`
            );
            const fileRef = fire.myStorageRef(storage, `announcements/files/${addAnnounceForm.title.value}/file`);
            const thumbnail = document.querySelector("#thumbnail").files[0];
            const file = document.querySelector("#filesAttached").files[0];
            console.log(file.type);
            var metadata = {
              contentType: file.type,
            };

            fire.myUploadBytes(fileRef, file, metadata).then((snapshot) => {
              console.log("UPLOADED file2");
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
        const viewFiles = document.querySelector(".viewFiles");
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
          const fileRef = fire.myStorageRef(storage, `announcements/files/${docu.data().title}/file`);
          fire.myGetDownloadUrl(imageRef).then((url) => {
            console.log(url);
            announceViewPic.src = url;
          });
          fire.myGetDownloadUrl(fileRef).then((url) => {
            console.log(url);
            viewFiles.innerHTML = `<a href="${url}">Click to Open ${docu.data().title} file.</a>`;
          });
        });
      }; //end of rendering announcement

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

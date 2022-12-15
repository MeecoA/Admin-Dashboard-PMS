import { doc } from "firebase/firestore";
import * as fire from "../src/index.js";
console.log("database: ", fire.database);

// AJAX FOR ANNOUNCEMENTS
const announceLink = document.querySelector("#announceLink");

announceLink.addEventListener("click", () => {
  ajaxAnnounce();
});

function ajaxAnnounce() {
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
      veriLink.classList.remove("active");

      var t = $("#announceTable").DataTable({
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
            title: "Announcements Report - Administrator",
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
                <div class="title-print">ANNOUNCEMENTS</div>
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
              columns: [1, 2, 3, 4],
            },
          },
          "colvis",
        ],
      });
      const buttonsColvis = document.querySelector(".buttons-colvis");
      buttonsColvis.textContent = "Filter By Category";
      const addAnnounceForm = document.querySelector("#announceForm");
      addAnnounceForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const storage = fire.storage;
        const imageRef = fire.myStorageRef(
          storage,
          `announcements/thumbnail/${addAnnounceForm.title.value}/profilepic.jpg`
        );
        // const fileRef1 = fire.myStorageRef(storage, `announcements/files/${addAnnounceForm.title.value}/file1`);
        // const fileRef2 = fire.myStorageRef(storage, `announcements/files/${addAnnounceForm.title.value}/file2`);
        // const fileRef3 = fire.myStorageRef(storage, `announcements/files/${addAnnounceForm.title.value}/file3`);
        const thumbnail = document.querySelector("#thumbnail").files[0];
        // const filesAttached1 = document.querySelector("#filesAttached1");
        // const first_file = document.querySelector("#filesAttached1").files[0];
        // const second_file = document.querySelector("#filesAttached2").files[0];
        // const third_file = document.querySelector("#filesAttached3").files[0];
        fire
          .myAddDoc(fire.announceColRef, {
            to: "+639052354473",
            from: "+18658003391",
            body: addAnnounceForm.message.value,
            id: addAnnounceForm.title.value,
            title: addAnnounceForm.title.value,
            posted_by: addAnnounceForm.postedBy.value,
            priority: addAnnounceForm.priority.value,
            message: addAnnounceForm.message.value,
            sources: addAnnounceForm.sources.value,
            files: [],
            thumbnail: addAnnounceForm.thumbnail.value,
            createdAt: fire.myServerTimestamp,
          })
          .then(() => {
            Swal.fire({
              title: "Announcement",
              text: "SUCCESSFULLY CREATED!",
              icon: "success",
            });

            addAnnounceForm.reset();
            fire.myUploadBytes(imageRef, thumbnail).then((snapshot) => {
              console.log("UPLOADED");
            });
            // var metadata = {
            //   contentType: first_file.type,
            // };
            // var metadata2 = {
            //   contentType: second_file.type,
            // };
            // var metadata3 = {
            //   contentType: third_file.type,
            // };

            // fire.myUploadBytes(fileRef1, first_file, metadata).then((snapshot) => {
            //   console.log("UPLOADED file2");
            // });

            // fire.myUploadBytes(fileRef2, second_file, metadata2).then((snapshot) => {
            //   console.log("UPLOADED file2");
            // });

            // fire.myUploadBytes(fileRef3, third_file, metadata3).then((snapshot) => {
            //   console.log("UPLOADED file3");
            // });
          });
      });

      const announceTBody = document.querySelector(".table-body-announce");
      let title;
      let id;
      const renderAnnounce = (docu) => {
        var tableTr = t.row
          .add([
            docu.id,
            docu.data().title,
            docu.data().createdAt.toDate().toLocaleString(),
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
                icon="bxs:user-circle"  class="iconifys" width="16" height="16"></iconify-icon>Edit Details</a>

                <a href="#editmodalPhotoAnnounce" rel="modal:open" class = 'edit-button-announce-photo'>
                <iconify-icon
                class="view-icon"
                icon="bxs:user-circle"  class="iconifys" width="16" height="16"></iconify-icon>Edit Photo</a>

          

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

        // editing photo
        const editmodalPhotoAnnounce = document.querySelector(`[data-id="${docu.id}"] .edit-button-announce-photo`);
        const editAnnouncePhotoForm = document.querySelector("#editAnnouncePhotoForm");
        const announceViewUpdate = document.querySelector("#outputUpdateAnnounce");

        editmodalPhotoAnnounce.addEventListener("click", () => {
          title = docu.data().title;
          console.log(docu.id);
          const imgInputUpdate = document.querySelector("#imgInputUpdateAnnounce");
          imgInputUpdate.addEventListener("change", (e) => {
            var image = document.querySelector("#outputUpdateAnnounce");
            image.src = URL.createObjectURL(e.target.files[0]);
          });

          const storagePic = fire.storage;
          const imageRef = fire.myStorageRef(storagePic, `announcements/thumbnail/${docu.data().title}/profilepic.jpg`);
          fire.myGetDownloadUrl(imageRef).then((url) => {
            console.log(url);
            announceViewUpdate.src = url;
          });
        });

        editAnnouncePhotoForm.addEventListener("submit", (e) => {
          e.preventDefault();
          console.log(docu.id);
          const storage = fire.storage;
          const storageRef = fire.myStorageRef(storage, `announcements/thumbnail/${title}/profilepic.jpg`);
          var file = document.querySelector("#imgInputUpdateAnnounce").files[0];
          fire.myUploadBytes(storageRef, file).then((snapshot) => {
            console.log("UPLOADED");
          });
          Swal.fire({
            text: "SUCCESSFULLY UPDATED!",
            icon: "success",
          });
        });

        //deleting data
        const AnnounceDelete = document.querySelector(`[data-id='${docu.id}'] .delete-button`);
        AnnounceDelete.addEventListener("click", () => {
          const docRef = fire.myDoc(fire.db, "announcements", docu.id);

          Swal.fire({
            title: "Are you sure you want to Delete?",
            text: `Announcement: ${docu.data().title}`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes",
          }).then((result) => {
            if (result.isConfirmed) {
              Swal.fire("Deleted!", "Announcement has been deleted", "success");
              fire.myDeleteDoc(docRef).then(() => {
                console.log("deleted successfully");
              });
            }
          });
        }); //end of deleting data
        // editing announcement

        const ediBtnAnnounce = document.querySelector(`[data-id='${docu.id}'] .edit-button-announce`);
        const announceEditForm = document.querySelector("#announceEditForm");
        ediBtnAnnounce.addEventListener("click", () => {
          id = docu.id;
          announceEditForm.title.value = docu.data().title;
          announceEditForm.postedBy.value = docu.data().posted_by;
          announceEditForm.priority.value = docu.data().priority;
          announceEditForm.message.value = docu.data().message;
          announceEditForm.sources.value = docu.data().sources;
        });

        announceEditForm.addEventListener("submit", (e) => {
          e.preventDefault();
          const docRef = fire.myDoc(fire.db, "announcements", id);

          fire
            .myUpdateDoc(docRef, {
              title: announceEditForm.title.value,
              postedBy: announceEditForm.postedBy.value,
              priority: announceEditForm.priority.value,
              message: announceEditForm.message.value,
              sources: announceEditForm.sources.value,
            })
            .then(() => {
              // const storage = fire.storage;
              // const storageRef = fire.myStorageRef(storage, `secruity/${id}/profilepic.jpg`);
              // var file = document.querySelector("#imgInputUpdate").files[0];
              // fire.myUploadBytes(storageRef, file).then((snapshot) => {
              //   console.log("UPLOADED");
              // });

              Swal.fire({
                text: "SUCCESSFULLY UPDATED!",
                icon: "success",
              });
              ajaxAnnounce();
            });
        });
        //end editing announcement
        //viewing announcement
        const announceViewPic = document.querySelector("#announceViewPic");
        const viewPrio = document.querySelector(".viewPrio");
        const viewAnnounceTitle = document.querySelector(".viewAnnounceTitle");
        const viewPostedOn = document.querySelector(".viewPostedOn");
        const viewPostedBy = document.querySelector(".viewPostedBy");
        const viewMessage = document.querySelector(".viewMessage");
        const viewSources = document.querySelector(".viewSources");
        // const viewFiles1 = document.querySelector(".viewFiles1");
        // const viewFiles2 = document.querySelector(".viewFiles2");
        // const viewFiles3 = document.querySelector(".viewFiles3");
        const viewAnnounceBtn = document.querySelector(`[data-id='${docu.id}'] .view-announce-button`);

        viewAnnounceBtn.addEventListener("click", () => {
          $("#viewAnnounce").fadeIn();
          viewAnnounceTitle.textContent = docu.data().title;
          viewMessage.textContent = docu.data().message;
          if (docu.data().priority === "Importance: High") {
            viewPrio.classList.add("high-important");
            viewPrio.classList.remove("normal-important");
            viewPrio.classList.remove("low-important");
            viewPrio.textContent = docu.data().priority;
          }
          if (docu.data().priority === "Importance: Normal") {
            viewPrio.classList.remove("high-important");
            viewPrio.classList.add("normal-important");
            viewPrio.classList.remove("low-important");
            viewPrio.textContent = docu.data().priority;
          }
          if (docu.data().priority === "Importance: Low") {
            viewPrio.classList.remove("high-important");
            viewPrio.classList.remove("normal-important");
            viewPrio.classList.add("low-important");
            viewPrio.textContent = docu.data().priority;
          }

          viewPostedOn.textContent = docu.data().createdAt.toDate().toLocaleString();
          viewPostedBy.textContent = docu.data().posted_by;
          viewSources.textContent = "Source: " + docu.data().sources;
          //retreiving files

          const storage = fire.storage;
          const imageRef = fire.myStorageRef(storage, `announcements/thumbnail/${docu.data().title}/profilepic.jpg`);
          // const fileRef1 = fire.myStorageRef(storage, `announcements/files/${docu.data().title}/file1`);
          // const fileRef2 = fire.myStorageRef(storage, `announcements/files/${docu.data().title}/file2`);
          // const fileRef3 = fire.myStorageRef(storage, `announcements/files/${docu.data().title}/file3`);
          fire.myGetDownloadUrl(imageRef).then((url) => {
            console.log(url);
            announceViewPic.src = url;
          });
          // fire.myGetDownloadUrl(fileRef1).then((url) => {
          //   console.log(url);
          //   viewFiles1.innerHTML = `<a href="${url}">Click to Open ${docu.data().title} first file.</a>`;
          // });
          // fire.myGetDownloadUrl(fileRef2).then((url) => {
          //   console.log(url);
          //   viewFiles2.innerHTML = `<a href="${url}">Click to Open ${docu.data().title} second file.</a>`;
          // });
          // fire.myGetDownloadUrl(fileRef3).then((url) => {
          //   console.log(url);
          //   viewFiles3.innerHTML = `<a href="${url}">Click to Open ${docu.data().title} third file.</a>`;
          // });
        });
      }; //end of rendering announcement

      fire.myOnSnapshot(fire.announceQuery, (snapshot) => {
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
            // let row = document.querySelector(`[data-id="${change.doc.id}"]`);
            // announceTBody.removeChild(row);
            renderAnnounce(change.doc);
          }

          console.log(change.type);
        });
      });
    } //end if ready state
  };
  xhttp.open("GET", "../sidebar/announce.html", true);
  xhttp.send();
}

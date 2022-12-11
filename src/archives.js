import { doc } from "firebase/firestore";
import * as fire from "../src/index";

//AJAX START FOR FACULTY
const loadArchives = document.querySelector("#archiveLink");

loadArchives.addEventListener("click", () => {
  headerTitle.textContent = "Users";
  let xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = async function () {
    if (this.readyState == 4 && this.status == 200) {
      document.getElementById("content").innerHTML = this.responseText;
      secLink.classList.remove("active");
      persLink.classList.remove("active");
      resiLink.classList.remove("active");
      visiLink.classList.remove("active");
      annoLink.classList.remove("active");
      vehiLink.classList.remove("active");
      archiveLink.classList.add("active");
      napLink.classList.remove("active");
      dropdownContent.style.display = "none";
      dropDown.classList.remove("active");
      dropDownLogs.classList.remove("active");
      veriLink.classList.remove("active");

      dropdownContentLogs.style.display = "none";

      var t = $("#archtable").DataTable({
        dom: "Bfrtip",
        buttons: [
          {
            extend: "copyHtml5",
            exportOptions: {
              columns: [1, 2, 3, 4, 5],
            },
          },
          {
            extend: "print",
            header: true,
            title: "Archives Report - Administrator",
            exportOptions: {
              columns: [1, 2, 3, 4, 5],
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
                <div class="title-print">ARCHIVES</div>
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
      const buttonsColvis = document.querySelector(".buttons-colvis");
      buttonsColvis.textContent = "Filter By Category";

      let id;
      const archtable = document.querySelector(".tbody-arch");
      const secmainTable = document.querySelector(".secmainTable");
      const renderArchive = (docu) => {
        var tableTr = t.row
          .add([
            docu.id,
            `${docu.data().firstname} ${docu.data().middlename} ${docu.data().lastname}`,
            docu.data().position,
            `${docu.data().barangay}, ${docu.data().street}, ${docu.data().municipality}, ${docu.data().province}`,
            docu.data().email,
            docu.data().phone,
            `<a href="#" rel="modal:open">
            <div class="drop-container">
              <button class="drop-btn retrieve-btn">
              <iconify-icon icon="material-symbols:unarchive" style="color: black;" width="20" height="20" class="unarchive-icon"></iconify-icon>
              <div>RECOVER</div>
              </button>
              </a>
              </div>
            </div>
          </td>
          `,
          ])
          .draw(false)
          .node();
        $(tableTr).attr("data-id", `${docu.id}`);

        const retrieveBtn = document.querySelector(`[data-id='${docu.id}'] .retrieve-btn`);
        retrieveBtn.addEventListener("click", () => {
          Swal.fire({
            title: "Recover?",
            text: `Security: ${docu.data().firstname} ${docu.data().lastname}`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes",
          }).then((result) => {
            if (result.isConfirmed) {
              Swal.fire("Recovered!", "Security Officer has been recovered.", "success");
              const docRef = fire.myDoc(fire.db, "archives", docu.id);
              fire.myDeleteDoc(docRef).then(() => {
                console.log("deleted successfully");
                fire
                  .doSetDoc(fire.myDoc(fire.db, "security", docu.id), {
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
                    isDisable: false,
                  })
                  .then(() => {});
              });
            }
          });
        });
      }; //end of render archive

      fire.myOnSnapshot(fire.archivesColRef, (snapshot) => {
        snapshot.docChanges().forEach((change) => {
          if (change.type === "added") {
            renderArchive(change.doc);
          }
          if (change.type === "removed") {
            let row = document.querySelector(`[data-id="${change.doc.id}"]`);
            // let tbody = row.parentElement;
            archtable.removeChild(row);
            console.log(change.type);
          }
          if (change.type === "modified") {
            let row2 = document.querySelector(`[data-id="${change.doc.id}"]`);
            archtable.removeChild(row2);
            renderArchive(change.doc);
          }
        });
      });
    } //end if ready state
  };
  xhttp.open("GET", "../sidebar/archives.html", true);
  xhttp.send();
});
//AJAX END FOR FACULTY

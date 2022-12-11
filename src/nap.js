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
      archiveLink.classList.remove("active");
      veriLink.classList.remove("active");
      loadNap.classList.add("active");
      var t = $("#napTable").DataTable({
        dom: "Bfrtip",

        buttons: [
          {
            extend: "copyHtml5",
            exportOptions: {
              columns: [1, 2, 3, 5],
            },
          },
          {
            extend: "print",
            header: true,
            title: "NAP Report - Administrator",
            exportOptions: {
              columns: [1, 2, 3, 5],
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
                <div class="title-print">NON ACADEMIC PERSONNEL</div>
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
              columns: [1, 2, 3, 5],
            },
          },
          "colvis",
        ],
      });
      const buttonsColvis = document.querySelector(".buttons-colvis");
      buttonsColvis.textContent = "Filter By Category";

      const renderNap = (doc) => {
        var temp = t.row
          .add([
            doc.id,
            `${doc.data().first_name} ${doc.data().last_name}`,
            doc.data().id_number,
            doc.data().college,
            doc.data().is_activated,
            doc.data().phone_num,
            `<button class="button-vehicles">
                  <a href="#viewFaculty" rel="modal:open" class="view-faculty-button"><iconify-icon
                  class="view-icon"
                  icon="bi:eye-fill"
                  class="iconifys"
                  width="16"
                  height="16"
                ></iconify-icon>
                <div>View</div>
                </a></button>
            `,
          ])
          .draw(false)
          .node();
        $(temp).attr("data-id", `${doc.id}`);
        const viewFacultyBtn = document.querySelector(`[data-id='${doc.id}'] .view-faculty-button`);

        viewFacultyBtn.addEventListener("click", () => {
          $("#viewFaculty").fadeIn();
          const viewFacultyName = document.querySelector(".viewFacultyName");
          const viewCollege = document.querySelector(".view-college");
          const viewIdNum = document.querySelector(".viewIdNum");
          const viewPhoneNum = document.querySelector(".viewPhoneNum");

          viewFacultyName.textContent = `${doc.data().first_name} ${doc.data().last_name}`;
          viewCollege.textContent = doc.data().college;
          viewIdNum.textContent = doc.data().id_number;
          viewPhoneNum.textContent = doc.data().phone_num;
        });
      }; //en

      fire.myOnSnapshot(fire.napQuery, (snapshot) => {
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

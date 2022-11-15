import * as fire from "../src/index.js";
console.log("database: ", fire.database);

//AJAX START FOR FACULTY
const loadFaculty = document.querySelector("#resiLink");

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
      napLink.classList.remove("active");
      vehiLink.classList.remove("active");

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

      fire.myOnSnapshot(fire.accColRef, (snapshot) => {
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

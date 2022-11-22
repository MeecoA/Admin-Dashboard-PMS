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
      dropdownContentLogs.style.display = "none";
    } //end if ready state
  };
  xhttp.open("GET", "../sidebar/archives.html", true);
  xhttp.send();
});
//AJAX END FOR FACULTY

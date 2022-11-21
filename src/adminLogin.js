// import * as fire from "../src/index.js";
// console.log("database: ", fire.database);

// // Prevent going on to the others
// // For instance: User is not logged but there is an attempt on going to the Admin Dashboard and vice versa
// fire.doAutState(fire.auth, (user) => {
//   console.log("user: ", user);
//   if (user) {
//     if (windowLocation.indexOf("admin-login.html") > -1) {
//       if (auth.currentUser !== null && user.uid === "BHwQ87dDgaYla9IC2MhoLVWwEsC3") {
//         window.location = "admin-dashboard.html";
//       }
//     }
//     console.log("user logged in: " + auth.currentUser);
//   } else {
//     // User is signed out
//     if (windowLocation.indexOf("admin-dashboard.html") > -1) {
//       window.location = "admin-login.html";
//     }
//     console.log("user logged out: " + auth.currentUser);
//   }
// });

// // dashboard scripts
// const userCount = document.querySelector("#userCount");

// fire.myOnSnapshot(accQuery, (snapshot) => {
//   userCount.textContent = snapshot.size;
// });

// // Administrator Login
// let windowLocation = window.location.pathname;
// window.addEventListener("DOMContentLoaded", () => {
//   // Prevent going back on login page.
//   // if (windowLocation.indexOf("admin-login.html") > -1) {
//   //   onAuthStateChanged(auth, (user) => {
//   //     if (user) {
//   //       // User is signed in, see docs for a list of available properties
//   //       // https://firebase.google.com/docs/reference/js/firebase.User
//   //       console.log("admin-login.html");
//   //       console.log("currentUser: ", auth.currentUser);
//   //       if (auth.currentUser !== null) {
//   //         window.location = "admin-dashboard.html";
//   //       }
//   //     } else {
//   //       // User is signed out
//   //     }
//   //   });
//   // }

//   // checked signin
//   if (windowLocation.indexOf("admin-login.html") > -1) {
//     function getDateTime() {
//       var today = new Date();
//       var date = today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate();
//       var time = today.getHours() + ":" + today.getMinutes();
//       console.log(time);
//       const adminTime = document.querySelector(".admin-time");
//       adminTime.textContent = time;
//       const adminDate = document.querySelector(".admin-date");
//       adminDate.textContent = date;
//     }
//     getDateTime();

//     function signInAdmin() {
//       const adminForm = document.querySelector(".admin-form");

//       const adminEmail = adminForm.adminemail.value;
//       const adminPassword = adminForm.adminpassword.value;

//       const auth = getAuth();
//       fire.doSignIn(fire.auth, adminEmail, adminPassword).then((userCredential) => {
//         // Signed in
//         // window.location.href = "admin-dashboard.html";
//         const user = userCredential.user;
//         if (fire.auth.currentUser.uid !== "BHwQ87dDgaYla9IC2MhoLVWwEsC3") {
//           fire.doSignOut(fire.auth).then((success) => {
//             console.log(success);
//           });
//           alert("Administrator only.");
//         }
//         // ...
//       });

//       fire.doAutState(fire.auth, (user) => {
//         if (user) {
//           // User is signed in, see docs for a list of available properties
//           // https://firebase.google.com/docs/reference/js/firebase.User
//           const uid = user.uid;

//           console.log(user.uid, "BHwQ87dDgaYla9IC2MhoLVWwEsC3");
//           // Check if the logged in user id matched on the Authentication
//           if (user.uid === "BHwQ87dDgaYla9IC2MhoLVWwEsC3") {
//             window.location = "admin-dashboard.html";
//             console.log(user.uid, "is signed in");
//             const dashboardBody = (document.querySelector("#dashboardBody").style.visibility = "visible");
//           }
//         } else {
//           // User is signed out
//           const dashboardBody = (document.querySelector("#dashboardBody").style.visibility = "hidden");
//           alert("Please login first.");
//         }
//       });
//     }
//     const adminForm = document.querySelector(".admin-form");

//     const adminEmail = adminForm.adminemail.value;
//     console.log(adminEmail);
//     function login() {
//       const adminForm = document.querySelector(".admin-form");

//       const adminEmail = adminForm.adminemail.value;
//       const adminPassword = adminForm.adminpassword.value;

//       adminForm.addEventListener("submit", (e) => {
//         e.preventDefault();
//         signInAdmin();
//       });
//     }
//     login();
//   }
// });
// const adminLogout = document.querySelector("#adminLogout");
// adminLogout.addEventListener("click", () => {
//   fire
//     .doSignOut(fire.auth)
//     .then(() => {
//       window.location = "admin-login.html";
//     })
//     .catch(() => {});
//   console.log("loggg");
// });

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
  limit,
} from "firebase/firestore";
import { getDownloadURL, getStorage, ref, uploadBytes, uploadBytesResumable } from "firebase/storage";
import {
  getAuth,
  updateUser,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  updateEmail,
  signInWithEmailAndPassword,
  signOut,
  updatePassword,
} from "firebase/auth";

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

//for initializing app
initializeApp(firebaseConfig);

// EXPORTS
// init service, Firestore is more concerned in Collections than JSON.
export const database = getFirestore(); //anything we do in our DB, we use this
export const storage = getStorage(); //get the firebase storage
export const auth = getAuth();

//exports
// Firestore
export const myServerTimestamp = serverTimestamp();
export const myUploadBytesResumable = uploadBytesResumable;
export const myUpdatePassowrd = updatePassword;
export const myUpdateEmail = updateEmail;
export const doLimit = limit;
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
export const napColRef = collection(db, "nonacademic");
export const archivesColRef = collection(db, "archives");
// for storage

//queries
const secQuery = query(secColRef, orderBy("createdAt"));
export const accQuery = query(accColRef, where("category", "==", "FACULTY"));
export const napQuery = query(accColRef, where("category", "==", "NAP"));

export const announceQuery = query(announceColRef, orderBy("createdAt"));
// const announceQuery = query(announceColRef, orderBy("createdAt"));
// Side bar links
let countVehicle = 1;
// // Prevent going on to the others
// // For instance: User is not logged but there is an attempt on going to the Admin Dashboard and vice versa

onAuthStateChanged(auth, (user) => {
  console.log("user: ", user);
  if (user) {
    if (windowLocation.indexOf("admin-login.html") > -1) {
      if (auth.currentUser !== null && user.uid === "BHwQ87dDgaYla9IC2MhoLVWwEsC3") {
        window.location = "admin-dashboard.html";
      }
    }
    console.log("user logged in: " + auth.currentUser);
  } else {
    // User is signed out
    if (windowLocation.indexOf("admin-dashboard.html") > -1) {
      window.location = "admin-login.html";
    }
    console.log("user logged out: " + auth.currentUser);
  }
});

// dashboard scripts

// Administrator Login
let windowLocation = window.location.pathname;
window.addEventListener("DOMContentLoaded", () => {
  // Prevent going back on login page.
  // if (windowLocation.indexOf("admin-login.html") > -1) {
  //   onAuthStateChanged(auth, (user) => {
  //     if (user) {
  //       // User is signed in, see docs for a list of available properties
  //       // https://firebase.google.com/docs/reference/js/firebase.User
  //       console.log("admin-login.html");
  //       console.log("currentUser: ", auth.currentUser);
  //       if (auth.currentUser !== null) {
  //         window.location = "admin-dashboard.html";
  //       }
  //     } else {
  //       // User is signed out
  //     }
  //   });
  // }

  // checked signin
  if (windowLocation.indexOf("admin-login.html") > -1) {
    function getDateTime() {
      var today = new Date();
      var date = today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate();
      var time = today.getHours() + ":" + today.getMinutes();
      console.log(time);
      const adminTime = document.querySelector(".admin-time");
      adminTime.textContent = time;
      const adminDate = document.querySelector(".admin-date");
      adminDate.textContent = date;
    }
    getDateTime();

    function signInAdmin() {
      const adminForm = document.querySelector(".admin-form");

      const adminEmail = adminForm.adminemail.value;
      const adminPassword = adminForm.adminpassword.value;

      const auth = getAuth();
      signInWithEmailAndPassword(auth, adminEmail, adminPassword)
        .then((userCredential) => {
          // Signed in
          // window.location.href = "admin-dashboard.html";
          const user = userCredential.user;
          if (auth.currentUser.uid !== "BHwQ87dDgaYla9IC2MhoLVWwEsC3") {
            signOut(auth).then((success) => {
              console.log(success);
            });
            // alert("Administrator onlys.");
            Swal.fire({
              icon: "error",
              title: "Oops...",
              text: "Administrator Account Only!",
            });
          }
          // ...
        })
        .catch((error) => {
          const adminPassError = document.querySelector(".admin-pass-error");
          const adminPassword = document.querySelector("#adminPassword");
          switch (error.code) {
            case "auth/wrong-password":
              adminPassError.textContent = "Wrong Password!";
              adminPassword.style.border = "2px solid red";
              break;
            case "auth/too-many-requests":
              Swal.fire("Too many attempts, try again later");
              break;
            default:
              break;
          }
        });
      onAuthStateChanged(auth, (user) => {
        if (user) {
          // User is signed in, see docs for a list of available properties
          // https://firebase.google.com/docs/reference/js/firebase.User
          const uid = user.uid;

          console.log(user.uid, "BHwQ87dDgaYla9IC2MhoLVWwEsC3");
          // Check if the logged in user id matched on the Authentication
          if (user.uid === "BHwQ87dDgaYla9IC2MhoLVWwEsC3") {
            window.location = "admin-dashboard.html";
            console.log(user.uid, "is signed in");
            const dashboardBody = (document.querySelector("#dashboardBody").style.visibility = "visible");
          }
        } else {
          // User is signed out
          const dashboardBody = (document.querySelector("#dashboardBody").style.visibility = "hidden");
          alert("Please login first.");
        }
      });
    }
    const adminForm = document.querySelector(".admin-form");

    const adminEmail = adminForm.adminemail.value;
    console.log(adminEmail);
    function login() {
      const adminForm = document.querySelector(".admin-form");

      const adminEmail = adminForm.adminemail.value;
      const adminPassword = adminForm.adminpassword.value;

      adminForm.addEventListener("submit", (e) => {
        e.preventDefault();
        signInAdmin();
      });
    }
    login();
  }
});
const adminLogout = document.querySelector("#adminLogout");
adminLogout.addEventListener("click", () => {
  Swal.fire({
    title: "Are you sure you want to log out?",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, log out.",
  }).then((result) => {
    if (result.isConfirmed) {
      signOut(auth)
        .then(() => {
          window.location = "admin-login.html";
        })
        .catch(() => {});
      console.log("loggg");
    }
  });
});

async function displayLogs() {
  const myQuery = query(collection(db, "logs"));
  onSnapshot(myQuery, (snapshot) => {
    //based on the query, //change this back!
    const unsubCollection = onSnapshot(myQuery, (snapshot) => {
      //based on the query
      let logs = [];
      let index = 0;
      let checkLengthTimeIn = 0;
      let checkLengthTimeOut = 0;

      snapshot.docs.forEach((doc) => {
        let unpackData = { ...doc.data() };
        let objSize = Object.keys(unpackData).length;

        // alert("Number of time in: ", objSize);
        /** Change date formatting. */
        Object.entries(unpackData).map((element, index) => {
          if (objSize - 1 !== index) {
            // ********************************
            // element[1]['time_in']['timestamp'] = element[1]['time_in']['timestamp'] === '' ? '' : new Date(element[1]['time_in']['timestamp']).toLocaleString('en-GB',{timeZone:'UTC'})
            // element[1]['time_out']['timestamp'] = element[1]['time_out']['timestamp'] === '' ? '' : new Date(element[1]['time_out']['timestamp']).toLocaleString('en-GB',{timeZone:'UTC'})
            // element[1]['time_in']['timestamp'] = ""

            checkLengthTimeIn += 1;
            if (element[1]["time_out"]["timestamp"] !== null) {
              checkLengthTimeOut += 1;
            }

            element[1]["time_out"]["timestamp"] =
              element[1]["time_out"]["timestamp"] === null
                ? "-"
                : element[1]["time_out"]["timestamp"].toDate().toLocaleString();
            element[1]["time_out"]["gate_number"] =
              element[1]["time_out"]["gate_number"] === null ? "-" : element[1]["time_out"]["gate_number"];
            element[1]["time_out"]["officer_uid"] =
              element[1]["time_out"]["officer_uid"] === null ? "-" : element[1]["time_out"]["officer_uid"];

            // element[1]['time_out']['timestamp'] = element[1]['time_out']['timestamp'] === null ? '' : element[1]['time_out']['timestamp'];
            // ********************************

            index += 1; //increment

            logs.push(element[1]);
          }
        });
      });
      const timeIn = document.querySelector(".time-in-holder");
      const timeOut = document.querySelector(".time-out-holder");
      console.log(logs);
      console.log("Number of length (TIME IN): ", checkLengthTimeIn);
      console.log("Number of length (TIME OUT): ", checkLengthTimeOut);
      timeIn.textContent = checkLengthTimeIn - checkLengthTimeOut;
      timeOut.textContent = checkLengthTimeOut;
      const userCount = document.querySelector("#userCount");

      onSnapshot(accColRef, (snapshot) => {
        userCount.textContent = snapshot.size;

        const data = {
          labels: ["Timed In", "Timed Out", "Registered Users", "Registered Vehicles"],
          datasets: [
            {
              label: "My First Dataset",
              data: [checkLengthTimeIn, checkLengthTimeOut, snapshot.size, countVehicle],
              backgroundColor: ["rgb(255, 99, 132)", "rgb(54, 162, 235)", "rgb(255, 205, 86)", "rgb(255, 100, 86)"],
              hoverOffset: 4,
            },
          ],
        };

        const config = {
          type: "doughnut",
          data: data,
          options: {},
        };

        const myChart = new Chart(document.getElementById("myChart"), config);
      });
      // Sort the data by time_scanned
      // logs.sort(function(a, b) {
      //     return new Date(a.time_scanned) - new Date(b.time_scanned);
      // });

      // logs.sort(function(a, b) {
      //     return new Date(a.time_in.time_scanned) - new Date(b.time_in.time_scanned);
      // });
      // console.log('sorted:', logs);   //print the result

      /** Display User DataTable */
    }); //end of function
  }); //end of snapshot function
}
displayLogs();

let dataVehicle = [];
const colRef = collection(db, "vehicle-information");
const vehicleQuery = query(colRef);

let currentIndex = 0;

const docsSnap = await getDocs(vehicleQuery);
docsSnap.forEach(async (doc) => {
  let vehicleData = { ...doc.data() };
  let appendData = { a: "" };

  const vehicle = Object.keys(vehicleData)
    .filter((key) => key !== "vehicle_length")
    // .filter((key) => key.includes("Name"))
    .reduce((obj, key) => {
      return Object.assign(obj, {
        [key]: vehicleData[key],
      });
    }, {});

  let ownerFullName = "";
  let ownerProfilePic = "";

  await getAccountInformationOwner(doc.id).then((evt) => {
    // console.log('event: ', evt)
    // If middle name is undefined
    if (typeof evt["middle_name"] === "undefined" || evt["middle_name"].trim() === "") {
      console.log(true);
      evt["middle_name"] = " ";
    }

    // appendData['vehicle_owner'] = `${evt['last_name']} ${evt['first_name']} ${evt['middle_name'][0]}`;
    ownerFullName = `${evt["last_name"]} ${evt["first_name"]} ${evt["middle_name"][0]}`;

    // Check the profile picture.
    if (typeof evt["profile_pic"] === "undefined" || evt["profile_pic"] === null) {
      // appendData['profile_pic'] = 'https://firebasestorage.googleapis.com/v0/b/bulsu---pms.appspot.com/o/placeholders%2Fprofile-circled.svg?alt=media&token=5d172c80-6cc4-4ddd-841b-8877a6813010';
      ownerProfilePic =
        "https://firebasestorage.googleapis.com/v0/b/bulsu---pms.appspot.com/o/placeholders%2Fprofile-circled.svg?alt=media&token=5d172c80-6cc4-4ddd-841b-8877a6813010";
    } else {
      // appendData['profile_pic'] = evt['profile_pic'];
      ownerProfilePic = evt["profile_pic"];
    }
  });

  const vehicleKeys = Object.keys(vehicleData);
  console.log("vehicleKeys", vehicleKeys);
  vehicleKeys.forEach((data, index) => {
    if (data !== "vehicle_length") {
      const entry = vehicle[data];
      console.log("this is the", entry);
      // console.log('current entry: ', entry, ownerFullName);
      console.log("current entry: ", ownerFullName);
      // Id, Plate, Vehicle Owner, Vehicle(Images), Model, QR Code, Use Types

      if (typeof entry.qrCode === "object") {
        entry.qrCode = entry.qrCode.toString();
      }

      appendData = {
        index: index,
        uid: doc.id,
        vehicle_owner: ownerFullName,
        profile_pic: ownerProfilePic,
        plate_number: data,
        model: entry.model[0],
        qrCode: entry.qrCode,
        entry: entry.use_types,
        registration_date: entry.createdAt.toDate().toDateString(),
      };

      // Check the vehicle image
      if (typeof entry.images[1] === "undefined" || entry.images[1] === null) {
        appendData["image"] =
          "https://firebasestorage.googleapis.com/v0/b/bulsu---pms.appspot.com/o/placeholders%2Fvehicle-car-16-filled.svg?alt=media&token=8bb41423-816c-4de8-8a4c-22f597fd2b04";
      } else {
        appendData["image"] = entry.images[1];
      }
      console.log("appendData", appendData);

      appendData["action"] = "";
      appendData["index"] = countVehicle;
      countVehicle += 1;

      dataVehicle.push(appendData);
      console.log("This is the count ", countVehicle);

      const vehicleCount = document.querySelector("#vehicleCount");
      vehicleCount.textContent = countVehicle - 1;
    }
  });
  appendData = null; //delete from memory

  // Display the table after all the neccessary are ready.
  currentIndex = currentIndex + 1;
  // console.log('::', currentIndex, docsSnap.docs);
  if (currentIndex === docsSnap.docs.length) {
    // console.log('HAHAHA');
    // console.log('final vehicleInformation: ', dataVehicle);
  } else {
    // console.log('currentIndex: ' + currentIndex)
    // console.log('currentIndex: ' + currentIndex)
  }

  // console.log(doc.id, Object.keys(vehicleData).toString(), vehicle);
}); //end of docSnap

async function getAccountInformationOwner(userUID) {
  let vehicle = undefined;
  const docVehicleActivity = doc(db, "account-information", userUID);
  const docVSnap = await getDoc(docVehicleActivity);
  if (docVSnap.exists()) {
    // vehicle = Object.keys(docVSnap.data()).filter((e) => {
    //     if(e !== 'vehicle_length') {
    //         return e;
    //     }
    // }).toString();
    return { ...docVSnap.data() };
  } else {
    vehicle = "N/A";
  }
  return vehicle;
}

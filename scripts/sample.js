let button = document.getElementById("increment");
let counter = document.getElementById("score");

let currentCounter = 0;
button.addEventListener("click", (e) => {
  console.log(e); //Display the target

  counter.innerText = ++currentCounter;
});

//factory function.
const user = (name) => {
  // const sayName = ()=> {
  //     console.log(name);
  // }
  return { name };
};

//module pattern.
const create = (() => {
  let users = [];
  let userName = document.querySelector("#name");
  // let lastName = document.querySelector("#lastName");

  const render = () => {
    generateQr();
  };

  function generateQr() {
    const qrContaier = document.querySelector("#qrcode");
    const qrcode = new QRCode(document.querySelector("#qrcode"));
    let data = userName.value;
    const meeco = user(data);
    const regcountContainer = document.querySelector(".regcount");
    let regcount = 0;
    if (data === "") {
      alert("Please enter something!");
    } else {
      qrcode.makeCode(meeco.name);
      regcount++;
    }
    users.push(meeco.name);
    regcountContainer.textContent = users.length;
    console.log(users);
    const info = document.createElement("div");
    qrContaier.appendChild(info);
    info.classList.add("info");
    info.textContent = data;
  }
  return { render };
})();

let = scanner = new Instascan.Scanner({ video: document.querySelector("#preview") });

Instascan.Camera.getCameras()
  .then((cameras) => {
    if (cameras.length > 0) {
      scanner.start(cameras[0]);
    } else {
      alert("no cameras found");
    }
  })
  .catch(function (e) {
    console.error(e);
  });

scanner.addListener("scan", function (c) {
  document.querySelector("#text").value = c;
});
// create.render()

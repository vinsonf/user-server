const baseUrl = "http://localhost:3000";

let base = "/Users";
let filterDate = "2021-06-01";

getFiles();
function getFiles() {
  document.body.innerHTML = `
    <ul></ul>
    <video width="500" src="" ></video>
    <img src="" alt="">
    `;

  const backButton = document.createElement("button");
  backButton.innerText = "Back";
  backButton.addEventListener("click", () => {
    base = base.split("/").slice(0, -1).join("/");
    getFiles();
  });
  document.body.prepend(backButton);
  const ul = document.querySelector("ul");

  const video = document.querySelector("video");
  const img = document.querySelector("img");
  fetch(baseUrl + "/list-files", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      base,
      filterDate,
    }),
  })
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log(data);
      data.dirs.forEach((dir) => {
        const li = document.createElement("li");
        li.innerHTML = dir;
        ul.appendChild(li);
        li.addEventListener("click", () => {
          base = base + "/" + dir;
          getFiles();
        });
      });
      const hr = document.createElement("hr");
      ul.appendChild(hr);
      data.files.forEach(function (file) {
        console.log(file);
        const li = document.createElement("li");
        li.innerHTML = file.file;
        ul.appendChild(li);
        const run = document.createElement("button");
        run.innerHTML = "Run";
        const button = document.createElement("button");
        button.innerHTML = "unlink";
        li.style.display = "flex";
        li.style.justifyContent = "space-between";
        button.addEventListener("click", function () {
          fetch(baseUrl + "/unlink/" + btoa(file.pathToFIle)).then(function (
            response
          ) {
            console.log("unlinked", response);
          });
        });

        li.appendChild(run);
        li.appendChild(button);
        run.addEventListener("click", function (e) {
          console.log(file);
          console.log(btoa(file.pathToFIle));
          video.src = baseUrl + "/stream/" + btoa(file.pathToFIle);
          video.controls = true;
          img.src = baseUrl + "/stream/" + btoa(file.pathToFIle);
        });

        const dButton = document.createElement("button");
        dButton.innerHTML = "download";
        dButton.addEventListener("click", function () {
          fetch(baseUrl + "/send/" + btoa(file.pathToFIle)).then(function (
            response
          ) {
            console.log("sent", response);
            // save file to disk in browser
            const link = document.createElement("a");
            link.href = response.url;
            link.download = response.filename;
            link.click();
          });
        });
        li.appendChild(dButton);
      });
    });
}

import api from "./unplashApi.js";

let result = document.querySelector("#result");
let input = document.getElementById("search");
let form = document.getElementById("form-search");
let tendencias = document.querySelector(".content-tendencias");
let deleteReciente = document.getElementById("delete-reciente");
let openImg = document.querySelector(".openImg");

class inputAcciones {
  createLocal(e) {
    e.preventDefault();

    let exist = localStorage.getItem("busquedaReciente");
    let value = input.value;

    if (value === "") return;

    if (exist) {
      let converted = JSON.parse(localStorage.getItem("busquedaReciente"));
      converted.push(value);
      let convertedText = JSON.stringify(converted);

      localStorage.setItem("busquedaReciente", convertedText);
    } else {
      localStorage.setItem("busquedaReciente", JSON.stringify([value]));
    }
  }

  cargarReciente() {
    let exist = localStorage.getItem("busquedaReciente");

    if (exist) {
      let converted = JSON.parse(localStorage.getItem("busquedaReciente"));

      if (converted.length > 4) {
        converted.shift();

        localStorage.setItem("busquedaReciente", JSON.stringify(converted));

        converted.map((value) => this.imprimirReciente(value));
      } else {
        converted.map((value) => this.imprimirReciente(value));
      }
    }
  }

  imprimirReciente(value) {
    document.querySelector("#busqueda-reciente").dataset.status = true;
    let contentReciente = document.querySelector(".recientes-flex");
    let reciente = document.createElement("span");
    reciente.className = "reciente";

    reciente.innerHTML = `${value} <span class="iconify" data-icon="ant-design:search-outlined"></span>`;
    contentReciente.appendChild(reciente);
  }

  deleteReciente() {
    let parent = document.querySelector("#busqueda-reciente");
    tendencias.removeChild(parent);
  }

  buscarReciente({ target }) {
    if (target.classList.contains("reciente")) {
      input.value = target.textContent;

      let imprimir = new api(target.textContent);
      imprimir.buscar();
    }
  }

  imprimirBusqueda(e) {
    e.preventDefault();

    let value = input.value;

    if (value === "") {
      createError("vacio");
    } else {
      let imprimir = new api(value);
      imprimir.buscar();
    }
  }
}

let inputAccion = new inputAcciones();

const abrirImg = ({ target }) => {
  let imgContent = openImg.querySelector(".imgContent");
  let downloadImg = openImg.querySelector("a");
  if (target.classList.contains("details", "resultImg")) {
    openImg.classList.add("activeOpenImg");
    imgContent.style.background = `url(${target.dataset.url})  no-repeat center/cover`;
    downloadImg.href = `${target.dataset.url}&force=true`;
    document.querySelector("body").dataset.scroll = true;
  }
};

const closeImg = ({ target }) => {
  let pielTrasera = document.querySelector(".back");
  let imgContent = openImg.querySelector(".imgContent");

  if (target.id === "closeImg" || target === pielTrasera) {
    openImg.classList.remove("activeOpenImg");
    imgContent.style.background = "";
    document.querySelector("body").dataset.scroll = false;
  }
};

const closeTendencias = ({ target }) => {
  let click = target;
  let dataId = click.dataset.id;
  if (
    tendencias.classList.contains("active") &&
    click !== input &&
    dataId !== "tendencias"
  ) {
    tendencias.classList.remove("active");
  }
};

export const createError = (tipo) => {
  let contentBuscador = document.querySelector("#content-search");
  let contentError = document.createElement("div");
  let error = document.createElement("p");
  error.style = "padding: 1em;font-size: 0.9em;color: #f16a6a;";

  switch (tipo) {
    case "vacio":
      error.textContent = "Por favor escribe tu busqueda";
      break;
    case "termino":
      error.textContent = "No se encuenta su busqueda";
      break;
  }

  contentError.appendChild(error);
  contentBuscador.appendChild(contentError);

  setTimeout(() => contentError.remove(), 2000);
};

form.addEventListener("submit", (e) => {
  inputAccion.createLocal(e);
  inputAccion.imprimirBusqueda(e);
});
document.addEventListener(
  "click",
  (e) => {
    closeTendencias(e);
    closeImg(e);
  },
  false
);

tendencias.addEventListener("click", (e) => inputAccion.buscarReciente(e));
deleteReciente.addEventListener("click", () => inputAccion.deleteReciente());
document.addEventListener("DOMContentLoaded", inputAccion.cargarReciente());
input.addEventListener("focus", () => tendencias.classList.add("active"));
result.addEventListener("click", (e) => abrirImg(e));

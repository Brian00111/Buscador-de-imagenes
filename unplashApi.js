import { createError } from "./main.js";

let pagina = 1;
let contentResult = document.createElement("div");
contentResult.className = "result-content";

let ultimaPelicula;

let observable = new IntersectionObserver(
  (entradas, observe) => {
    entradas.forEach((entrada) => {
      if (entrada.isIntersecting) {
        pagina++;

        let converted = JSON.parse(localStorage.getItem("busquedaReciente"));
        ultimaPelicula = converted[converted.length - 2];

        let imprimir = new api(ultimaPelicula, pagina);
        imprimir.buscar();
        observe.unobserve(entrada.target);
      }
    });
  },
  {
    rootMargin: "0px 0px 200px 0px",
    threshold: 1.0,
  }
);

export default class api {
  constructor(param, pagina) {
    this.key = `yrMFM7rIhQCG1HmhVRu7XaEl35vWIerw1XrhIquUoIU`;
    this.url = `https://api.unsplash.com/search/photos?query=${param}&page=${pagina}&client_id=${this.key}`;
  }
  async buscar() {
    let result = document.querySelector("#result");
    let contentSearch = document.querySelector("#content-search");
    let request = await fetch(this.url);
    let response = await request.json();

    if (response.total === 0) {
      createError("termino");
      return;
    }

    if (contentResult.dataset.status === "true") {
      [...contentResult.children].map((element) =>
        contentResult.removeChild(element)
      );
    }

    response.results.map((item) => this.pintar(item, result));

    contentSearch.dataset.status = true;

    this.seguir();
  }

  pintar({ urls, user, links, likes }, contenedor) {
    const { name, profile_image } = user;

    let details = document.createElement("div");
    details.className = "details";
    details.dataset.url = links.download;

    let createImg = document.createElement("div");
    createImg.className = "resultImg";

    let authorImg = document.createElement("img");
    authorImg.className = "authorImg";
    authorImg.src = profile_image.medium;

    let authorName = document.createElement("span");
    authorName.className = "authorName";
    authorName.innerHTML = name;

    let imageLikes = document.createElement("span");
    imageLikes.className = "imageLikes";
    imageLikes.innerHTML = `<span class="iconify" data-icon="fxemoji:beating-heart" style="color: red;"></span> ${likes}`;

    createImg.style.background = `url(${urls.regular})  no-repeat center/cover`;

    details.appendChild(authorImg);
    details.appendChild(authorName);
    details.appendChild(imageLikes);
    createImg.appendChild(details);
    contentResult.appendChild(createImg);

    contenedor.appendChild(contentResult);
  }

  seguir() {
    let ultimo =
      document.querySelectorAll(".resultImg")[
        document.querySelectorAll(".resultImg").length - 1
      ];

    observable.observe(ultimo);
  }
}

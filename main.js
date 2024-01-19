//SECTION UTILITIES
const just = (selector) => document.querySelector(selector);
const all = (selector) => document.querySelectorAll(selector);

//SECTION GLOBAL FUNCTIONS
let ts = `ts=1`;
const publicKey = "apikey=d3abb539098557030e53849b9dc73d81";
const hash = "hash=56d3e07a1a8a5d3e0602e841365c58f5";
const privateKey = "338e6aeedb37d02e56329d2837e6679586d0c53f";
let lowerCaseSearchValue = ""


//SECTION global functions for pagination
const itemsPerPage = 20
let offsetCounter = 0;
let limitCounter = 20;
let pageCounter = 1
let totalItems


//TRASH
//addEventListener(captura valor) ⮕ buildURL(crea c/parametros el url) ⮕ getMarvelData(devuelve la info bajo ese URL personalizado) ⮕ renderComicsCharacters(muestra lo que se trajo del url)

//funcion que me construlla la url //ASK
//funcion que me haga validacion del url
//funcion que me haga el renderHTML
//funcion que me traiga la info de api
//funcion initialize app





//le llegan parametros con los que vamos a estar personalizando el url
const buildURL = (typeSelected, nameSearched, orderSelected, offset, limit, pageNum) => {
    let buildingURL = `http://gateway.marvel.com/v1/public/`
    if (typeSelected === "comics") {
        if (nameSearched || typeSelected || orderSelected) {
            buildingURL += `${typeSelected}?${ts}&${publicKey}&${hash}&offset=${offset}&limit=${limit}&`
            if (typeSelected === "comics") {
                buildingURL += `formatType=${typeSelected}&`
            }
            if (nameSearched) {
                buildingURL += `titleStartsWith=${nameSearched}&`
            }
            if (orderSelected === "a-z") {
                buildingURL += `orderBy=title&`
            }
            if (orderSelected === "z-a") {
                buildingURL += `orderBy=-title&`
            }
            if (orderSelected === "newest") {
                buildingURL += `orderBy=-focDate&`
            }
            if (orderSelected === "oldest") {
                buildingURL += `orderBy=focDate&`
            }
        }
    } else if (typeSelected === "characters") {
        if (nameSearched || typeSelected || orderSelected) {
            buildingURL += `${typeSelected}?${ts}&${publicKey}&${hash}&offset=${offset}&limit=${limit}&`
            if (nameSearched) {
                buildingURL += `nameStartsWith=${nameSearched}&`
            }
            if (orderSelected === "a-z") {
                buildingURL += `orderBy=name&`
            }
            if (orderSelected === "z-a") {
                buildingURL += `orderBy=-name&`
            }
            if (orderSelected === "newest") {
                buildingURL += `orderBy=-focDate&`
            }
            if (orderSelected === "oldest") {
                buildingURL += `orderBy=focDate&`
            }
        }
    }
}



//le llega la inicializacion de una funcion que devuelve un url personalizado
// const getMarvelData = async (URLPersonalizada) => {
//     const url = ``
//     const response = await fetch(url)
//     const data = await response.json()
//     console.log(data);
//     return data
// }
// getMarvelData()





//funcion que se encarga de la primera vista que muestra todos los comics o todos los personajes
const renderComicsCharacters = (typeSelected) => {
    just(".results-cards-comics-characters").innerHTML = ``;

    just(".results-cards-comics-characters").innerHTML += `
    <div class="div-cards text-center" id="${comic.id}">
    <div class="div-img overflow-hidden">
    <img src="${pathImgComic}" class="w-full h-full object-contain">
    </div>
    <p class="titleComic-NameCharacter font-semibold mt-6">${comic.title}</p>
    </div>
    `;
    if(typeSelected === "comics"){
        div-cards.classList.add('card-comics')
        div-img.classList.add('cover-magazine')
        titleComic-NameCharacter.classList.add('text-black')
        
    }else if(typeSelected === "characters"){
        div-cards.classList.add('card-characters')
        div-cards.classList.add('bg-black')
        div-cards.classList.add('m-4')
        div-cards.classList.add('overflow-hidden')

        div-img.classList.add('character')
        div-img.classList.add('border-b-4')
        div-img.classList.add('border-red-600')

        titleComic-NameCharacter.classList.add('text-white')
    }
}

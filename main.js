//TRASH
//addEventListener(captura valor) ⮕ buildURL(crea c/parametros el url) ⮕ getMarvelData(devuelve la info bajo ese URL personalizado) ⮕ renderComicsCharacters(muestra lo que se trajo del url)

//SECTION UTILITIES
const just = (selector) => document.querySelector(selector);
const all = (selector) => document.querySelectorAll(selector);

//SECTION GLOBAL FUNCTIONS
let ts = `ts=1`;
const publicKey = "apikey=d3abb539098557030e53849b9dc73d81";
const hash = "hash=56d3e07a1a8a5d3e0602e841365c58f5";
const privateKey = "338e6aeedb37d02e56329d2837e6679586d0c53f";
let totalItems

const shapeDate = (stringDate) => {
    const date = new Date(stringDate);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear().toString().slice(-2);
    const dateShape = `${day}/${month}/${year}`;
    return dateShape
}

const getImage = (data) => {
    return data.thumbnail.path + "/portrait_incredible.jpg";
}

//le llega la inicializacion de una funcion que devuelve un url personalizado
const getMarvelData = async (URLPersonalizada) => {
    const url = `${URLPersonalizada}`
    const response = await fetch(url)
    const data = await response.json()
    totalItems = data.data.total
    return data
}

//le llegan parametros con los que vamos a estar personalizando el url
const buildURL = (typeSelected, nameSearched, orderSelected, offset, limit, pageNum, id, section) => {
    let urlConstruction = `https://gateway.marvel.com/v1/public/`
    if (id || section) {
        if (section === "comics") {
            urlConstruction += `${section}/${id}/characters?${ts}&${publicKey}&${hash}`
        }
        if (section === "characters") {
            urlConstruction += `${section}/${id}/comics?${ts}&${publicKey}&${hash}`
        }
        return urlConstruction
    }

    if (!orderSelected) {
        orderSelected = "a-z"
    }

    if (typeSelected || nameSearched || orderSelected) {
        if (typeSelected === "comics") {
            urlConstruction += `${typeSelected}?${ts}&${publicKey}&${hash}&offset=${offset}&limit=${limit}&`
            if (typeSelected === "comics") {
                urlConstruction += `formatType=${typeSelected}&`
            }
            if (nameSearched) {
                urlConstruction += `titleStartsWith=${nameSearched}&`
            }
            if (orderSelected === "a-z") {
                urlConstruction += `orderBy=title&`
            }
            if (orderSelected === "z-a") {
                urlConstruction += `orderBy=-title&`
            }
            if (orderSelected === "newest") {
                urlConstruction += `orderBy=-focDate&`
            }
            if (orderSelected === "oldest") {
                urlConstruction += `orderBy=focDate&`
            }
        } else if (typeSelected === "characters") {
            urlConstruction += `${typeSelected}?${ts}&${publicKey}&${hash}&offset=${offset}&limit=${limit}&`
            const newestToRemove = just('option[value="newest"]')
            const oldestToRemove = just('option[value="oldest"]')
            if (newestToRemove) just(".order-filter").removeChild(newestToRemove)
            if (oldestToRemove) just(".order-filter").removeChild(oldestToRemove)

            if (nameSearched) {
                urlConstruction += `nameStartsWith=${nameSearched}&`
            }
            if (orderSelected === "a-z") {
                urlConstruction += `orderBy=name&`
            }
            if (orderSelected === "z-a") {
                urlConstruction += `orderBy=-name&`
            }

            //*esto sirve y a mi particularmente me gusta el filtro, pero como no lo pide lo voy a solamente comentar
            // if (orderSelected === "newest") {
            //     urlConstruction += `orderBy=-modified&`
            // }
            // if (orderSelected === "oldest") {
            //     urlConstruction += `orderBy=modified&`
            // }
        }
        return urlConstruction
    }
}

//!PRIMERA VISTA---------------------------------------------------------------------------------------------------------------------------------

//(1)PRIMER VISUAL q muestra todos los comics o personajes
const renderComicsCharacters = async (url, typeSelected) => {
    const cardsData = await getMarvelData(url)
    console.log("estoy dentro de renderComicsCharacters");


    just(".results-cards-comics-characters").innerHTML = ``;

    just(".total-finded").innerText = `${cardsData.data.total} RESULTS`;
    just(".current-page-num").innerText = `page ${pageCounter}`


    for (const card of cardsData.data.results) {
        if (typeSelected === "comics") {
            just(".results-cards-comics-characters").innerHTML += `
            <div class="div-cards card-comics text-center" id="${card.id}">
            <div class="div-img cover-magazine overflow-hidden">
            <img src="${getImage(card)}" class="w-full h-full object-contain">
            </div>
                <p class="titleComic-NameCharacter text-black font-semibold mt-6">${card.title}</p>
            </div>
            `;

        } else if (typeSelected === "characters") {
            just(".results-cards-comics-characters").innerHTML += `
            <div class="div-cards card-characters bg-black text-center m-4 overflow-hidden" id="${card.id}">
            <div class="div-img character border-b-4 border-red-600 overflow-hidden">
            <img src="${getImage(card)}" class="w-full h-full object-contain">
            </div>
            <p class="titleComic-NameCharacter text-white font-semibold mt-6">${card.name}</p>
            </div>
            `;
        }
    }
    clickOnChoosenCard(cardsData.data.results)
}


//!SEGUNDA VISTA---------------------------------------------------------------------------------------------------------------------------------

let arrComicsFromCharacter = []

//(4)
const renderRelatedCards = async (url, length, resultPosition, toShow, arrCardsRelated) => {
    const cardsData = await getMarvelData(url)
    console.log("estoy dentro de renderRelatedCards");
    if (toShow === "showcharacters") {
        arrComicsFromCharacter.push(cardsData.data.results[0])
        just(".character-comic-results").innerText = `${length} Results`
        just(".cards-in-selectedOption-grid").innerHTML += `
        <div class="div-card-second-selection character-card" id="${cardsData.data.results[0].id}">
        <div class="img-character-card border-b-4 border-red-600 overflow-hidden">
                <img src="${getImage(cardsData.data.results[0])}" class="w-full h-full object-contain">
            </div>
            <div class="bg-black flex items-center justify-center h-[18vh]">
                <p class="character-name text-white text-center">${cardsData.data.results[0].name}</p>
            </div>
        </div>
        `
        clickOnChoosenCardThirdView(arrComicsFromCharacter)

    } else if (toShow === "showComics") {
        //ASK FALTA PAGINACION PARA LOS QUE MUESTRAN +20 COMICS
        just(".character-comic-results").innerText = `${cardsData.data.total} Results`
        just(".cards-in-selectedOption-grid").innerHTML += `
        <div class="div-card-second-selection comic-card" id="${cardsData.data.results[resultPosition].id}">
        <div class="img-comic-card border-b-4 border-red-600 overflow-hidden">
        <img src="${getImage(cardsData.data.results[resultPosition])}" class="w-full h-full object-contain">
        </div>
        <div class="bg-black flex items-center justify-center h-[18vh]">
        <p class="character-name text-white text-center">${cardsData.data.results[resultPosition].title}</p>
        </div>
        </div>
        `
        clickOnChoosenCardThirdView(cardsData)
    }

}

//(3) muestra la info de la carta elegida (nombre del personaje o titulo del comic etc) mas los comics-personjaes que esten relacionados a lo seleccionado
const renderChoosenCard = (cards, choosenCardId) => {
    console.log("estoy en renderChoosenCard");
    for (const card of cards) {
        if ('title' in card && card.id === Number(choosenCardId)) {
            just(".results-cards-comics-characters").classList.add("hidden")
            just(".total-finded").classList.add("hidden")
            just(".section-choosen-card").classList.remove("hidden")
            just(".show-characters").classList.remove("hidden")
            just(".show-comics").classList.add("hidden")




            just(".choosen-card-img").innerHTML =
                `<img class="chosen-magazine-img w-full h-full object-contain" src="${getImage(card)}" alt="magazine cover">`
            just(".name-title").innerText = `${card.title}`
            just(".info-comic").innerHTML = `
              <p class="text-2xl font-semibold mb-2">Published</p>
              <p class="mb-8">${shapeDate(card.dates[0].date)}</p>
              <p class="text-2xl font-semibold mb-2">Screenwriter</p>
              <p class="mb-8">${card.creators.items[0] ? card.creators.items[0].name : ''}</p>
              `
            just(".description-text").innerText = `${card.description}`


            if (card.characters.items.length > 0) { //esto devuelve 6 
                for (const character of card.characters.items) {
                    const characterUrl = `${character.resourceURI}?${publicKey}&${hash}&${ts}`;
                    renderRelatedCards(characterUrl, card.characters.items.length, null, "showcharacters", card.characters.items);
                }
            } else if (card.characters.items.length === 0) {
                just(".character-comic-results").innerText = `0 Results`
                just(".cards-in-selectedOption-grid").innerHTML = `
                    <p class="text-3xl font-semibold w-max">No results found</p>
                    `
            }
        } if ('name' in card && card.id === Number(choosenCardId)) {
            just(".results-cards-comics-characters").classList.add("hidden")
            just(".total-finded").classList.add("hidden")
            just(".show-characters").classList.toggle("hidden")
            just(".show-comics").classList.toggle("hidden")
            just(".section-choosen-card").classList.remove("hidden")

            just(".choosen-card-img").innerHTML =
                `<img class="chosen-magazine-img w-full h-full object-contain" src="${getImage(card)}" alt="magazine cover">`
            just(".name-title").innerText = `${card.name}`
            just(".description-text").innerText = `${card.description}`
            console.log("entre aca estoy");


            if (card.comics.items.length > 0) { //esto devuelve 6 
                let thumbnailCounter = 0
                for (const comic of card.comics.items) {
                    const characterUrl = `${card.comics.collectionURI}?${publicKey}&${hash}&${ts}`;
                    renderRelatedCards(characterUrl, card.comics.items.length, thumbnailCounter, "showComics");
                    thumbnailCounter += 1
                }
            } else if (card.characters.items.length === 0) {
                just(".character-comic-results").innerText = `0 Results`
                just(".cards-in-selectedOption-grid").innerHTML = `
                    <p class="text-3xl font-semibold w-max">No results found</p>
                    `
            }
        }
    }
}

//(2)escucha los clicks a la carta seleccionada (Dentro de todas las cartas de personajes o comics)
const clickOnChoosenCard = (allCards) => { //trae arr de objetos -cda obj es una carta- 
    all(".div-cards").forEach((card) => {
        card.addEventListener("click", (e) => {
            console.log("estoy en clickOnChoosenCard");
            const clickedCardId = e.target.closest('.div-cards').id;
            renderChoosenCard(allCards, clickedCardId)
        })
    })
}


//!TERCERA VISTA---------------------------------------------------------------------------------------------------------------------------------


const renderChoosenCardForThirdView = (arrOfCards, clickedId, toShow) => {
    console.log("estoy en renderChoosenCardForThirdView");
    if (toShow === "characters") {
        just(".character-comic-results").innerText = ``
        just(".cards-in-selectedOption-grid").innerHTML = ``

        renderChoosenCard(arrOfCards, clickedId)
    }if(toShow === "comic"){
        just(".character-comic-results").innerText = ``
        just(".cards-in-selectedOption-grid").innerHTML = ``
        renderChoosenCard(arrOfCards, clickedId)
    }
}

const clickOnChoosenCardThirdView = (arrCardsRelated) => {
    console.log("estoy en clickOnChoosenCardThirdView");
    all(".div-card-second-selection").forEach((card) => {
        card.addEventListener("click", (e) => {
            if (card.classList.contains('comic-card')) {
                const clickedCardId = e.target.closest('.div-card-second-selection').id;
                renderChoosenCardForThirdView(arrCardsRelated.data.results, clickedCardId, "characters")
            }            
            else if (card.classList.contains('character-card')) {
                const clickedCardId = e.target.closest('.div-card-second-selection').id;
                renderChoosenCardForThirdView(arrCardsRelated, clickedCardId, "comic")
            }
        })
    })
}



//!BOTONES Y FILTROS ---------------------------------------------------------------------------------------------------------------------------------

//SECTION functionality for filters
let typeValue = "comics"
let inputValue = ""
let orderValue = ""

//* BY TYPE (COMIC - CHARACTER)
const getTypeChosen = (eventType) => {
    typeValue = eventType.target.value;
    renderComicsCharacters(
        buildURL(
            typeValue,
            inputValue,
            orderValue,
            offsetCounter,
            limitCounter,
            pageCounter
        ),
        typeValue
    )
}

//*BY INPUT
const getInputSearched = (eventInput) => {
    inputValue = eventInput.target.value.toLowerCase()
    renderComicsCharacters(
        buildURL(
            typeValue,
            inputValue,
            orderValue,
            offsetCounter,
            limitCounter,
            pageCounter
        ),
        typeValue
    )
}

//*BY ORDER (ABC - NEWEST - OLDEST)
const getOrderSelected = (eventOrder) => {
    orderValue = eventOrder.target.value
    renderComicsCharacters(
        buildURL(
            typeValue,
            inputValue,
            orderValue,
            offsetCounter,
            limitCounter,
            pageCounter
        ),
        typeValue
    )
}

//SECTION global functions for pagination
const itemsPerPage = 20
let offsetCounter = 0;
let limitCounter = 20;
let pageCounter = 1


//SECTION for functionality for the pagination
//*FIRST PAGE
const getFirstPage = () => {
    offsetCounter = 0
    limitCounter = 20
    pageCounter = 1
    just(".btns-first-page").classList.toggle("disabled")
    just(".btns-prev-pag").classList.toggle("disabled")
    just(".btns-next-page").classList.toggle("disabled")
    just(".btns-last-page").classList.toggle("disabled")
    renderComicsCharacters(
        buildURL(
            typeValue,
            inputValue,
            orderValue,
            offsetCounter,
            limitCounter,
            pageCounter
        ),
        typeValue
    )

}

//*PREVIOUS PAGE
const getPreviousPage = () => {
    if (offsetCounter >= itemsPerPage) {
        offsetCounter -= itemsPerPage;
        limitCounter = Math.min(itemsPerPage, totalItems - offsetCounter);
        pageCounter -= 1;
        if (offsetCounter === 0 && limitCounter === 20) {
            just(".btns-first-page").classList.add("disabled")
            just(".btns-prev-pag").classList.add("disabled")
        }
    }
    renderComicsCharacters(
        buildURL(
            typeValue,
            inputValue,
            orderValue,
            offsetCounter,
            limitCounter,
            pageCounter
        ),
        typeValue
    )
}

//*NEXT PAGE
const getNextPage = () => {
    if (offsetCounter + itemsPerPage < totalItems) {
        offsetCounter += itemsPerPage;
        limitCounter = Math.min(itemsPerPage, totalItems - offsetCounter);
        pageCounter += 1
        if (offsetCounter >= 20 && limitCounter >= 20) {
            just(".btns-first-page").classList.toggle("disabled")
            just(".btns-prev-pag").classList.toggle("disabled")
        }
    }
    renderComicsCharacters(
        buildURL(
            typeValue,
            inputValue,
            orderValue,
            offsetCounter,
            limitCounter,
            pageCounter
        ),
        typeValue
    )
}

// //*LAST PAGE
const getLastPage = () => {
    pageCounter = Math.ceil(totalItems / itemsPerPage);
    const startOffset = Math.max(0, (pageCounter - 1) * itemsPerPage);
    const endOffset = totalItems;
    offsetCounter = startOffset;
    limitCounter = endOffset - startOffset;
    just(".btns-first-page").classList.remove("disabled")
    just(".btns-prev-pag").classList.remove("disabled")
    just(".btns-next-page").classList.toggle("disabled")
    just(".btns-last-page").classList.toggle("disabled")
    renderComicsCharacters(
        buildURL(
            typeValue,
            inputValue,
            orderValue,
            offsetCounter,
            limitCounter,
            pageCounter
        ),
        typeValue
    )
}

const initializeApp = () => {
    //start my app with this values and when the user use the filters will change
    renderComicsCharacters(buildURL("comics", null, "a-z", offsetCounter, limitCounter, pageCounter), typeValue)

    //capture of title/comic searched
    just(".search-input").addEventListener("input", (e) => getInputSearched(e))

    //capture of type search selected if comic or character
    just(".type-filter").addEventListener("change", (e) => getTypeChosen(e))

    //capture of order for show the results selected
    just(".order-filter").addEventListener("change", (e) => getOrderSelected(e))

    //execute the order to show the first page
    just(".btns-first-page").addEventListener("click", () => getFirstPage())

    //execute the order to show the previous page
    just(".btns-prev-pag").addEventListener("click", () => getPreviousPage())

    //execute the order to show next page
    just(".btns-next-page").addEventListener("click", () => getNextPage())

    //execute the order to show the last page
    just(".btns-last-page").addEventListener("click", () => getLastPage())


}
window.addEventListener("load", initializeApp);
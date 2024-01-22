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


//le llegan parametros con los que vamos a estar personalizando el url
const buildURL = (typeSelected, nameSearched, orderSelected, offset, limit, pageNum) => {
    let urlConstruction = `http://gateway.marvel.com/v1/public/`
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
    }
    return urlConstruction
}

//le llega la inicializacion de una funcion que devuelve un url personalizado
const getMarvelData = async (URLPersonalizada) => {
    const url = `${URLPersonalizada}`
    const response = await fetch(url)
    const data = await response.json()
    totalItems = data.data.total
    return data
}

const getImage = (data) => {
    return data.thumbnail.path + "/portrait_incredible.jpg";
}

//funcion que se encarga de la primera vista que muestra todos los comics o todos los personajes
const renderComicsCharacters = async (url, typeSelected) => {
    const cardsData = await getMarvelData(url)

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
}

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









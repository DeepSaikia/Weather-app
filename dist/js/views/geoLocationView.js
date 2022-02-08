import { DOMStrings } from "../DOMStrings.js"

export const renderGeoLocationModal = () => {
    const geoLocation = document.querySelector(DOMStrings.geoLocation)
    geoLocation.classList.add('active')
    geoLocation.querySelector(DOMStrings.geoLocationIcon).innerHTML = `<div class="loader"></div>`;
}

export const shrinkGeoLocationModal = () => {
    const geoLocation = document.querySelector(DOMStrings.geoLocation)
    geoLocation.classList.remove('active')
}

export const renderErrorGeoLocation = (errMsg) => {
    const geoLocation = document.querySelector(DOMStrings.geoLocation)
    let errIcon = `<img class='error-icon' src='./pics/error.svg' alt='error-icon'/>`
    geoLocation.querySelector(DOMStrings.geoLocationIcon).innerHTML = '';
    geoLocation.querySelector(DOMStrings.geoLocationIcon).innerHTML = errIcon;
    geoLocation.querySelector(DOMStrings.loaderText).innerHTML = errMsg;
}
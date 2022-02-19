import { DOMStrings } from "../DOMStrings.js";

export const currentMainTempRender = (temp) => {
    document.querySelector(DOMStrings.currentMainTemp).innerHTML = `${temp}&#176;`;  //why semicolon
}

export const currentMainIconRender = (icon) => {
    document.querySelector(DOMStrings.currentWeatherIcon).innerHTML = `<i class="wi wi-${icon} wi-fw"></i>`
}

export const mainWeatherDescriptionRender = (description) => {
    document.querySelector(DOMStrings.description).innerHTML = description;
}

export const mainRenderUpdateTime = () => {
    let time = new Date();
    let hours = time.getHours() > 9 ? time.getHours() : `0${time.getHours()}`;
    let minutes = time.getMinutes() > 9 ? time.getMinutes() : `0${time.getMinutes()}`
    const updateTime = `${hours}:${minutes}`;
    document.querySelector(DOMStrings.updateTime).innerHTML = `Updated as of ${updateTime}`;
}

export const selectedLocationRender = (location) => {
    // location = `${window.innerWidth}x${window.innerHeight}`;
    document.querySelector(DOMStrings.location).innerHTML = location;
}

export const unitTogglerRender = (isDay) => {
    console.log(isDay)
    let unitCheckBox = document.querySelector(DOMStrings.unitSwitch);
    let unitLabel = document.querySelector(DOMStrings.unitLabel);
    if(isDay) {
        unitCheckBox.classList.remove('bg-dark')
        unitLabel.classList.remove('bg-dark')
        unitCheckBox.classList.add('bg-light')
        unitLabel.classList.add('bg-light')
    }
    else {
        unitCheckBox.classList.remove('bg-light')
        unitLabel.classList.remove('bg-light')
        unitCheckBox.classList.add('bg-dark')
        unitLabel.classList.add('bg-dark')
    }
}

export const renderRootOverlay = () => {
    document.querySelector(DOMStrings.rootOverlay).classList.add('active');
}

export const removeRootOverlay = () => {
    document.querySelector(DOMStrings.rootOverlay).classList.remove('active');
}

export const opaqueRootOverlay = () => {
    document.querySelector(DOMStrings.rootOverlay).style.opacity = 1;
}

export const removeOpaqueRootOverlay = () => {
    document.querySelector(DOMStrings.rootOverlay).removeAttribute("style");
}

export const renderMainTransform = () => {
    document.querySelector(DOMStrings.main).classList.toggle('active')
}

export const addTransformMain3D = () => {
    document.querySelector(DOMStrings.main).classList.add('active');
}

export const removeTransformMain3D = () => {
    document.querySelector(DOMStrings.main).classList.remove('active');
}

export const removePointerEventsNone = () => {
    document.querySelector(DOMStrings.root).classList.remove('pointer-events-none');
}

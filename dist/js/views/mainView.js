import { DOMStrings } from "../DOMStrings.js";

export const currentMainTempRender = (temp) => {
    document.querySelector(DOMStrings.currentMainTemp).innerHTML = `${temp}&#176;`;
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
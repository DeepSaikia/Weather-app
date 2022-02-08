import { DOMStrings } from "../DOMStrings.js";
import { renderLoader, clearLoader } from "./loaderView.js";

export const clearForecastsFromDOM = () => {
    document.querySelector(DOMStrings.bgTransition).classList.remove('active'); //seperate method
    const tempForecastList = document.querySelectorAll(DOMStrings.tempForecast);
    tempForecastList.forEach(el => el.classList.remove('active'));
    let containerList = document.querySelectorAll(DOMStrings.forecastContainer);
    containerList.forEach(el => el.classList.remove('active'));
}

export const renderHourlyLoader = () => {
    const loaderContainer = document.querySelector(`${DOMStrings.hourlyWrapper} > ${DOMStrings.loader}`)
    renderLoader(loaderContainer);
}

export const clearHourlyLoader = () => {
    const loaderContainer = document.querySelector(`${DOMStrings.hourlyWrapper} > ${DOMStrings.loader}`)
    clearLoader(loaderContainer)
}

export const renderLightOrDarkBackground = (isDay, backgroundNum) => {
    
    document.querySelector(DOMStrings.bgTransition).classList.add('active'); //seperate method
    if(isDay) {
        
        document.querySelector(DOMStrings.main).style.background = `linear-gradient(
                                                                to right bottom,
                                                                rgba(63, 140, 212, 0.7),
                                                                rgba(50, 119, 209, 0.9))`;

        document.querySelector(DOMStrings.bgTransition).style.background = `url('../pics/${backgroundNum}.jpg') no-repeat center center/cover`;
    }
    else {
       
        document.querySelector(DOMStrings.main).style.background = `linear-gradient(
                    to right bottom,
                    rgba(12, 55, 95, 0.8),
                    rgba(7, 35, 71, 0.8))`;
        document.querySelector(DOMStrings.bgTransition).style.background = `url('../pics/${backgroundNum}.jpg') no-repeat center center/cover`;
    }
}

const renderAnimatedForecasts = () => {
    const section = document.querySelector(DOMStrings.hourlySection);
    const tempForecast = section.querySelector(DOMStrings.tempForecast);

    tempForecast.classList.add('active');
    let container = section.querySelector(DOMStrings.forecastContainer);
    container.classList.add('active');
}

export const hourlyForecastRender = (items) => {
    let html = ''
    document.querySelector(DOMStrings.hourlyTemp).innerHTML = '';
    items.forEach((el, i) => {
      
    html += `<div class="hourly-forecast forecast-card">
                <p class="date">${el.timeOfForecast}</p>
                <div class="weather-icon">
                    <i class="wi wi-${el.icon} wi-fw""></i>
                </div>
                <h1 class="max-temp">${el.temp}<span>&#176;</span></h1>
                <p class="description">${el.description}</p>
            </div>`
    });
    document.querySelector(DOMStrings.hourlyTemp).innerHTML = html;
    renderAnimatedForecasts();
}

export const gethourlyItemClientWidth = () => {                                 //check name
    let items = document.querySelectorAll(DOMStrings.hourlyForecastCard)
    items = Array.from(items)
    return items[0].clientWidth;
}

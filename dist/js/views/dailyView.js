import { DOMStrings } from "../DOMStrings.js";
import { renderLoader, clearLoader } from "./loaderView.js";

const renderAnimatedForecasts = (isDay) => {
    const section = document.querySelector(DOMStrings.dailySection);
    const tempForecast = section.querySelector(DOMStrings.tempForecast);
    // tempForecast.querySelector(DOMStrings.hrLine).style.backgroundColor = isDay ? '#014668' : '#03A9F4';
    tempForecast.classList.add('active');
    let container = section.querySelector(DOMStrings.forecastContainer);
    container.classList.add('active');
}

export const dailyForecastsRender = (items, isDay) => {
    let html = '';
    document.querySelector(DOMStrings.dailyTemp).innerHTML = '';
    
    items.forEach((el, i) => {
    html +=  `<div class="daily-forecast forecast-card ${i===0?'forecast-card-today':''}">
                <p class="date">${el.date}</p>
                <div class="weather-icon">
                    <i class="wi wi-${el.icon} wi-fw""></i>
                </div>
                <div class="daily-temp min-max min-max">
                    <h1 class="max-temp">${el.max}<span>&#176;</span></h1>
                    <h4 class="min-temp">${el.min}<span>&#176;</span></h4>
                </div>
                <p class="description">${el.description}</p>
            </div>`
    });
    document.querySelector(DOMStrings.dailyTemp).innerHTML = html;
    renderAnimatedForecasts(isDay);
}

export const getDailyItemClientWidth = () => {
    let items = document.querySelectorAll(DOMStrings.dailyForecastCard)
    return items[0].clientWidth;
}

export const renderDailyLoader = () => {
    const loaderContainer = document.querySelector(`${DOMStrings.dailyWrapper} > ${DOMStrings.loader}`)
    renderLoader(loaderContainer);
}

export const clearDailyLoader = () => {
    const loaderContainer = document.querySelector(`${DOMStrings.dailyWrapper} > ${DOMStrings.loader}`)
    clearLoader(loaderContainer)
}
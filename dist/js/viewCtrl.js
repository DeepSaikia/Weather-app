import { DOMStrings } from './DOMStrings.js';

export const autoCompListRender = (loc, inputBoxType) => {
    let html = '';
    if(inputBoxType === 'large-view') {
        let list = document.querySelector(DOMStrings.locationList);
        loc.forEach(el => {
            html += `<li class=location-item id=${el.getLocID()}><p>${el.getLocName()}, ${el.getCountryName()}</p></li>`;
        });
        list.classList.add('active');
        list.innerHTML = html;
        // console.log(loc)
    }
    else {
        loc.forEach(el => {
            html += `<li class="location-item" id=${el.getLocID()}><i class="fas fa-map-marker-alt"></i><p>${el.getLocName()}, ${el.getCountryName()}</p></li>`
        });
        document.querySelector(DOMStrings.mobileLocationList).innerHTML = html;
    }
}

export const shrinkInputBox = () => {
    document.querySelector(DOMStrings.form).classList.remove('expand');
}

export const autoCompListClear = () => {
    let list = document.querySelector(DOMStrings.locationList);
    list.innerHTML = '';
    list.classList.remove('active');
}

export const currentMainTempRender = (temp) => {
    document.querySelector(DOMStrings.currentMainTemp).innerHTML = `${temp}&#176;`;
}

export const currentLocationRender = (location) => {
    console.log(location)
    location = `${window.innerWidth}x${window.innerHeight}`;
    document.querySelector(DOMStrings.location).innerHTML = location;
}

export const weatherDescriptionRender = (description) => {
    document.querySelector(DOMStrings.description).innerHTML = description;
}

export const clearInputBox = () => {
    document.querySelector(DOMStrings.input).value = '';
}

export const toggleActiveUnit = (unitID) => {
    let unit = unitID === 1 ? 'celsius' : 'fahrenheit'
    document.querySelector(DOMStrings[unit]).classList.toggle('active'); 
}

export const clearActiveUnit = () => {
    document.querySelector(DOMStrings.celsius).classList.remove('active');
    document.querySelector(DOMStrings.fahrenheit).classList.remove('active');
}

export const renderUpdateTime = () => {
    let time = new Date();
    let hours = time.getHours() > 9 ? time.getHours() : `0${time.getHours()}`;
    let minutes = time.getMinutes() > 9 ? time.getMinutes() : `0${time.getMinutes()}`
    const updateTime = `${hours}:${minutes}`;
    document.querySelector(DOMStrings.updateTime).innerHTML = `Updated as of ${updateTime}`;
}

export const renderLightOrDarkBackground = (isDay, backgroundNum) => {
    
    document.querySelector(DOMStrings.bgTransition).classList.add('active'); //seperate method
    if(isDay) {
        console.log(isDay + ' ' + backgroundNum);
        document.querySelector(DOMStrings.main).style.background = `linear-gradient(
                                                                to right bottom,
                                                                rgba(63, 140, 212, 0.7),
                                                                rgba(50, 119, 209, 0.7))`;

        document.querySelector(DOMStrings.bgTransition).style.background = `url('../pics/${backgroundNum}.jpg') no-repeat center center/cover`;
    }
    else {
        console.log(isDay + ' ' + backgroundNum);
        document.querySelector(DOMStrings.main).style.background = `linear-gradient(
                    to right bottom,
                    rgba(12, 55, 95, 0.8),
                    rgba(7, 35, 71, 0.8))`;
        document.querySelector(DOMStrings.bgTransition).style.background = `url('../pics/${backgroundNum}.jpg') no-repeat center center/cover`;
    }
}

export const dailyForecastsRender = (items) => {
    let html = '';
    document.querySelector(DOMStrings.dailyTemp).innerHTML = '';
    items.forEach(el => {
    html +=  `<div class="daily forecast-card">
                <p class="date">${el.getDate()}</p>
                <div class="weather-icon">
                    <i class="fas fa-cloud-moon-rain fa-2x"></i>
                </div>
                <div class="daily-temp min-max min-max">
                    <h1 class="max-temp">${el.getMax()}<span>&#176;</span></h1>
                    <h4 class="min-temp">${el.getMin()}<span>&#176;</span></h4>
                </div>
                <p class="description">${el.getDescription()}</p>
            </div>`
    });
    document.querySelector(DOMStrings.dailyTemp).innerHTML = html;
    renderAnimatedForecasts();
}

export const hourlyForecastRender = (items) => {
    let html = ''
    document.querySelector(DOMStrings.hourlyTemp).innerHTML = '';
    items.forEach((el, i) => {
        console.log(i)
    html += `<div class="hourly forecast-card">
                <p class="date">${el.getCurrTimeOfForecast()}</p>
                <div class="weather-icon">
                    <i class="fas fa-cloud-moon-rain fa-2x"></i>
                </div>
                <h1 class="max-temp">${el.getCurrHourlyTemp()}<span>&#176;</span></h1>
                <p class="description">${el.getDescription()}</p>
            </div>`
    });
    document.querySelector(DOMStrings.hourlyTemp).innerHTML = html;
    renderAnimatedForecasts();
}


const renderAnimatedForecasts = () => {
    const tempForecastList = document.querySelectorAll(DOMStrings.tempForecast);
    tempForecastList.forEach(el => el.classList.add('active'));
    let containerList = document.querySelectorAll(DOMStrings.forecastContainer);
    containerList.forEach(el => el.classList.add('active'));
}

export const clearForecastsFromDOM = () => {
    document.querySelector(DOMStrings.bgTransition).classList.remove('active'); //seperate method
    const tempForecastList = document.querySelectorAll(DOMStrings.tempForecast);
    tempForecastList.forEach(el => el.classList.remove('active'));
    let containerList = document.querySelectorAll(DOMStrings.forecastContainer);
    containerList.forEach(el => el.classList.remove('active'));
}

export const renderDailyScrollBtns = (render) => {
    if(render)
        document.querySelector(DOMStrings.dailyScrollBtns).classList.add('active');
    else {
        document.querySelector(DOMStrings.dailyScrollBtns).classList.remove('active');
        document.querySelector(DOMStrings.dailyScrollBtns).classList.add('inactive');
    }
}

export const expandInput = () => {
    let windowWidth = window.innerWidth;
    if(windowWidth <= 1200)
        displaySideMenu(windowWidth);
    else {
        displaySideMenu(windowWidth)
        document.querySelector(DOMStrings.form).classList.add('expand');
        document.querySelector(DOMStrings.input).focus();
        clearInputBox();
    }
}

export const hideSideMenu = () => {
    let sideMenu = document.querySelector(DOMStrings.sideMenu);
    document.querySelector(DOMStrings.mobileLocationList).innerHTML = '';
    document.querySelector(DOMStrings.mobileViewInput).value = '';
    sideMenu.classList.remove('active');
}

export const displaySideMenu = (windowWidth) => {
    let sideMenu = document.querySelector(DOMStrings.sideMenu);
    if(windowWidth <= 1200) {
        sideMenu.classList.add('active');
        // sideMenu.style.display = 'block';
    }
    else {
        hideSideMenu();
        // sideMenu.style.display = 'none';
    }
}


/**************************************************/

// document.querySelector('body').addEventListener('click', autoCompListClear);

// const search = document.querySelector('.search');
// const searchBtn = document.querySelector('.search-btn');
// const closeBtn = document.querySelector('.close-btn');
// const searchInput = document.querySelector('.search-location');




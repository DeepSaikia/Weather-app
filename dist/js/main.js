import { DOMStrings } from './DOMStrings.js';
import Search from './models/Search.js';
import HourlyForecast from './models/HourlyForecast.js';
import DailyForecast from './models/DailyForecast.js';
import geoLocation from './models/GeoLocation.js'
import config from './Config.js';
import * as searchView from './views/searchView.js';
import * as hourlyView from './views/hourlyView.js';
import * as dailyView from './views/dailyView.js';
import * as mainView from './views/mainView.js';
import * as geoLocationView from './views/geoLocationView.js';
import * as scrollView from './views/scrollView.js';

let state = {  
    dailyForecasts : [], 
    hourlyForecasts : [],
    geoLocation: {},
    location : '',
    unitType : '', 
    isDay : true,
    currWeatherForBackground : 0,
    hourlyHorizontalScroll : {
        scrollCount : 0,
        itemClientWidth : 0
    },
    dailyHorizontalScroll : {
        scrollCount : 0,
        itemClientWidth : 0
    },
    getScrollCount : function(sectionID) {
        return this[`${sectionID}HorizontalScroll`].scrollCount;
    },
    setScrollCount : function(sectionID, value) {
        this[`${sectionID}HorizontalScroll`].scrollCount = value;
    },
    resetScrollCount : function() {
        console.log('from state reset')
        this.hourlyHorizontalScroll.scrollCount = 0;
        this.dailyHorizontalScroll.scrollCount = 0;
    },
    touchMoveX : 0,
    getTouchMoveX : function() {
        return this.touchMoveX;
    },
    setTouchMoveX : function(value) {
        this.touchMoveX = value;
    }
}

const geoLocationControl = async () => {
    geoLocationView.renderGeoLocationLoader();
    state.geoLocation = new geoLocation()
    try{
        await state.geoLocation.getWeatherForecast();
        mainView.selectedLocationRender(state.geoLocation.location)
        fetchHourlyForecast(state.geoLocation.locKey)
        console.log(state.geoLocation.errorMsg)
        if(state.geoLocation.errorMsg.message){
            geoLocationView.renderErrorGeoLocation(state.geoLocation.errorMsg.message)
            return setTimeout(() => {
                geoLocationView.clearGeoLocationLoader();
            }, 3000);
        }
        geoLocationView.clearGeoLocationLoader();
    }
    catch(err){
        console.log(err)
    }
}

/**
 * Input Controller 
 */

const autoComplete = async (ev) => {
    let inputBoxType = ev.target.id;
    const inputValue = document.querySelector(`#${inputBoxType}`).value; //delegate this to viewCtrl
    
    if(inputValue) {
        state.locAutoComplete = new Search(inputValue);
        try {
            await state.locAutoComplete.getResults();
            searchView.autoCompListRender(state.locAutoComplete.result, inputBoxType);
        }
        catch(err) {
            console.error(err);
        }
    }
    else 
        searchView.autoCompListClear();
}

//Think about creating a main function

const fetchSelectedLocationFromDOM = (e) => {
    const li = e.target.closest(DOMStrings.locationListItem);
    if(li){                                     //better implmentation for in-between list click
        const key = li.id;
        state.location = e.target.textContent;
        searchView.autoCompListClear();
        searchView.clearInputBox();
        searchView.shrinkInputBox();
        searchView.hideSideMenu();
        mainView.selectedLocationRender(state.location);  //Delegate to hourly Forecast
        fetchHourlyForecast(key);
    }
}

//Input event listener 
document.querySelectorAll(DOMStrings.input).forEach(el => el.addEventListener('keyup', autoComplete))

//On place selection from the list 
document.querySelectorAll(DOMStrings.locationList).forEach(el => el.addEventListener('click', fetchSelectedLocationFromDOM));



/**
 * Daily Forecast Controller 
 */

const fetchDailyForecast = async(locKey) => {
    
    if(locKey) {
        state.dailyForecasts = new DailyForecast(locKey);

        try {
            await state.dailyForecasts.getForecasts();
            
            dailyView.clearDailyLoader();
            dailyView.dailyForecastsRender(state.dailyForecasts.result);
            state.dailyHorizontalScroll.itemClientWidth = dailyView.getDailyItemClientWidth()
            
        }
        catch(err) {
            console.log(err);
        }
    }
}



/**
 * Hourly Forecast Controller 
 */

const fetchHourlyForecast = async(locKey) => {
    
    if(locKey) {
        state.hourlyForecasts = new HourlyForecast(locKey);
        hourlyView.clearForecastsFromDOM();
        hourlyView.renderHourlyLoader();
        dailyView.renderDailyLoader();
        state.resetScrollCount();
        scrollView.disableScrollbtn('daily', 'left')
        scrollView.disableScrollbtn('hourly', 'left')

                
        try {
            await state.hourlyForecasts.getForecasts();
            // hourlyView.renderLoader();
            // state.unitType = result[0].Temperature.UnitType === 17 ? 'celsius' : 'fahrenheit';
            // console.log(state.isDay);
            hourlyView.renderLightOrDarkBackground(state.hourlyForecasts.isDay, state.hourlyForecasts.currWeatherForBackground);
        
            mainView.currentMainTempRender(state.hourlyForecasts.currentTemp);
            mainView.currentMainIconRender(state.hourlyForecasts.currentIcon);
            mainView.mainWeatherDescriptionRender(state.hourlyForecasts.currDescription);
            mainView.mainRenderUpdateTime();
            scrollView.resetForecastScrollLeft();
            fetchDailyForecast(locKey);
            console.log('from hourly')
            hourlyView.clearHourlyLoader()
            hourlyView.hourlyForecastRender(state.hourlyForecasts.result);
            viewCtrl.unitTogglerRender(state.isDay)  //wth is this????
            state.hourlyHorizontalScroll.itemClientWidth = hourlyView.gethourlyItemClientWidth()
        }
        catch(err){
            console.log(err) //implement proper error handling
        }
    }
            
}
        

/**
 * Temperature Convert Controller
 */

const tempConvert = (e) => {
    const unit = e.target.checked ? 1 : 2;
    const isMetric = unit === 1 ?  true : false;
    config.setHourlyMetric(isMetric);
    config.setDailyMetric(isMetric);
    fetchHourlyForecast(config.getLocationKey());
}

/**
 * Scroll Controller
 */

const scroller = (buttonDirection, scrollSectionID) => {
    console.log(scrollSectionID)
    let sectionSpeed = scrollSectionID === 'hourly' ? 32 : 96
    let speed = -(state[`${scrollSectionID}HorizontalScroll`].itemClientWidth + sectionSpeed)
    let maxScroll = parseInt(scrollView[`get${scrollSectionID}ForecastContainerWidth`]() - scrollView[`get${scrollSectionID}ForecastWrapperClientWidth`]());

    console.log('maxScroll ' + maxScroll)

    if(buttonDirection === "right") {
        if(state.getScrollCount(scrollSectionID) < maxScroll) {
            state.setScrollCount(scrollSectionID, state.getScrollCount(scrollSectionID) - speed)
            scrollView.scrollForecastContainer(scrollSectionID, speed, 'subtract')
            scrollView.disableScrollbtn(scrollSectionID, buttonDirection, maxScroll, state.getScrollCount(scrollSectionID)) 
        }
    }
    else if(buttonDirection === 'left') {
        if(state.getScrollCount(scrollSectionID) > 0) {
            state.setScrollCount(scrollSectionID, state.getScrollCount(scrollSectionID) + speed)
            scrollView.scrollForecastContainer(scrollSectionID, speed, 'add')
            scrollView.disableScrollbtn(scrollSectionID, buttonDirection, maxScroll, state.getScrollCount(scrollSectionID)) 
        }
    }
}


const scrollClickControl = (ev) => {
    let spanBtn = ev.target.closest('span')
    if(spanBtn) {
        let btnDirection = spanBtn.id;
        if(btnDirection === 'left' || btnDirection === 'right') {
            let sectionTitle = ev.target.closest('section').id
            let scrollSection = sectionTitle.split('-')[0];
            scroller(btnDirection, scrollSection)
        }
    }
}
  
document.querySelectorAll(DOMStrings.tempForecast).forEach(el => {
    el.addEventListener('click', scrollClickControl)
})


/**
 * Window Resize Control
 */

const resizeController = () => {
    scrollView.scrollBtnOnResize(window.innerWidth);
    state.resetScrollCount()
    searchView.shrinkInputBox();
    mainView.selectedLocationRender(state.location)  //is it required here?
}

window.addEventListener('resize', resizeController);


/**
 * Touch Scroll Control 
 */

const touchStart = (ev) => {
    state.setTouchMoveX(ev.changedTouches[0].clientX)
}


const touchEnd = (ev) => {
    const tempTouchMoveX = ev.changedTouches[0].clientX;
    const sectionTitle = ev.target.closest('section').id
    const scrollSection = sectionTitle.split('-')[0];
    if(tempTouchMoveX < state.getTouchMoveX()) 
        scroller('right', scrollSection)
    else 
        scroller('left', scrollSection)
}

document.querySelectorAll(DOMStrings.forecastContainer).forEach(el => {
    el.addEventListener('touchstart', touchStart)
})

document.querySelectorAll(DOMStrings.forecastContainer).forEach(el => {
    el.addEventListener('touchend', touchEnd)
})



const shrinkInputBoxOffFocus = (ev) => {
    let parentInput = ev.target.closest('.expand');
    if(!parentInput)
        searchView.shrinkInputBox();
}

const init = () => {

    geoLocationControl()

    //Input box expand on click listener

    document.querySelector(DOMStrings.form).addEventListener('click', (ev) => {
        ev.preventDefault();
        searchView.expandInput();
    })

    scrollView.scrollBtnOnResize(window.innerWidth);

    //Hide side/search list on body click listener 

    document.addEventListener('click', (ev) => {
        searchView.autoCompListClear();
        searchView.hideSideMenuOnBodyClick(ev);
    });

    document.querySelector(DOMStrings.bgTransition).classList.add('active');
    
    //Convert temperature units on checkbox change listener

    document.querySelector(DOMStrings.unitSwitch).addEventListener('change', tempConvert);


    document.addEventListener('click', shrinkInputBoxOffFocus);
   
}

window.addEventListener('DOMContentLoaded', init);

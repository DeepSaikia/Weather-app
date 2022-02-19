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
    dailyForecasts : {}, 
    hourlyForecasts : {},
    geoLocation: {},
    location : '',
    unitType : '', 
    isDay : true,
    isModalOnScreen: true,
    searchTimerID : 0,
    currWeatherForBackground : 0,
    hourlyHorizontalScroll : {
        scrollCount : 0,
        itemClientWidth : 0
    },
    dailyHorizontalScroll : {
        scrollCount : 0,
        itemClientWidth : 0
    },
    setLocation: function(location) {
        this.location = location;
    },
    getLocation: function() {
        return this.location;
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
    },
    getSearchTimerID : function() {
        return this.searchTimerID
    },
    setSearchTimerID : function(ID) {
        this.searchTimerID = ID;
    },
    getIsModalOnScreen: function() {
        return this.isModalOnScreen;
    },
    setIsModalOnScreen: function(bool) {
        this.isModalOnScreen = bool;
    }
}

/**
 * GeoLocation Ctrl 
 */

const geoLocationControl = async () => {

    mainView.renderRootOverlay();
    geoLocationView.renderGeoLocationModal();
    state.geoLocation = new geoLocation();
    try {
        await state.geoLocation.getWeatherForecast();
        if(state.geoLocation.errorMsg) {
            throw new Error()
        }
        state.setLocation(state.geoLocation.location)
        mainView.selectedLocationRender(state.getLocation());

        fetchHourlyForecast(state.geoLocation.locKey);
        geoLocationView.shrinkGeoLocationModal();
        state.setIsModalOnScreen(false);
        mainView.removeRootOverlay();
        mainView.removeTransformMain3D();
        searchView.addSearchZindex();
    }
    catch(err){
        console.log(err)
        // mainView.removeTransformMain3D();
        geoLocationView.renderErrorGeoLocation(state.geoLocation.errorMsg.message);
        geoLocationView.renderModalBtn();
    }

}

const  onClickGeolocationBtn = (ev) => {

    if(ev.target.className === 'modal-btn') {
        state.setIsModalOnScreen(false);
        mainView.removePointerEventsNone();
        const windowWidth = window.innerWidth; 
        geoLocationView.shrinkGeoLocationModal();
        searchView.addSearchZindex();
        if(windowWidth > 1200 ) {
            mainView.opaqueRootOverlay();
            searchView.expandInput();
        }
        else if(windowWidth <= 1200) {
            searchView.showSideMenu()
        }
    }
}

document.querySelector(DOMStrings.geoLocation).addEventListener('click', onClickGeolocationBtn);


/**
 * Search Location Controller 
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
    console.log(li)
    if(li){                                     //better implmentation for in-between list click
        const key = li.id;
        state.setLocation(e.target.textContent);
        searchView.autoCompListClear();
        searchView.clearInputBox();
        searchView.shrinkInputBox();
        searchView.hideSideMenu();
        mainView.selectedLocationRender(state.location);  //Delegate to hourly Forecast
        fetchHourlyForecast(key);
        mainView.removeOpaqueRootOverlay();
        mainView.removeRootOverlay();
        mainView.removeTransformMain3D();
    }
}

//Input event listener 
document.querySelectorAll(DOMStrings.input).forEach(el => el.addEventListener('keyup', (ev) => {
    clearTimeout(state.getSearchTimerID())
    const searchTimerID = setTimeout(() => {
        autoComplete(ev)
    }, 1000);    
    state.setSearchTimerID(searchTimerID);
}))

//On place selection from the list 
document.querySelectorAll(DOMStrings.locationList).forEach(el => el.addEventListener('click', fetchSelectedLocationFromDOM));



/**
 * Daily Forecast Controller 
 */

const fetchDailyForecast = async(locKey, isDay) => {
    
    if(locKey) {
        state.dailyForecasts = new DailyForecast(locKey);

        try {
            await state.dailyForecasts.getForecasts();
            
            dailyView.clearDailyLoader();
            dailyView.dailyForecastsRender(state.dailyForecasts.result, isDay);
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
        scrollView.disableScrollbtn('daily', 'left');
        scrollView.disableScrollbtn('hourly', 'left');

                
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
            fetchDailyForecast(locKey, state.hourlyForecasts.isDay);
            hourlyView.clearHourlyLoader()
            hourlyView.hourlyForecastRender(state.hourlyForecasts.result, state.hourlyForecasts.isDay);
            mainView.unitTogglerRender(state.hourlyForecasts.isDay)  
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

    const windowWidth = window.innerWidth;
    searchView.hideSideMenu();
    searchView.shrinkInputBox();
    state.resetScrollCount();
    scrollView.scrollBtnOnResize(windowWidth);  

    if(windowWidth > 1200) {
        searchView.viewInputBox();
        
        //On regular search after geolocation
        if(state.getLocation().length > 0) {
            mainView.removeRootOverlay();
            mainView.removeTransformMain3D();
        }
        //On initial search and geolocation
        else if(!state.getIsModalOnScreen() && state.getLocation().length === 0) {
            mainView.opaqueRootOverlay()
            searchView.expandInput();
        }

        mainView.selectedLocationRender(state.location)  //is it required here?
    }
    else if(windowWidth <= 1200){
        searchView.hideInputBox();

       //On initial search and geolocation 
       
        if(!state.getIsModalOnScreen() && state.getLocation().length === 0) {
            mainView.removeOpaqueRootOverlay()
            searchView.showSideMenu()

        }
    }
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


/**
 * Search Box Controller
*/

//On body click Controller to display input box with alert on initial state OR hide input box on regular state 

const onBodyClickShowOrHideSearchInput = (ev) => {

    const parentInput = ev.target.closest('.expand');
    let isTargetSideMenu = ev.target.closest(DOMStrings.sideMenu);
    let isTargetSearchBtn = ev.target.closest(DOMStrings.form);
    const geolocation = ev.target.closest(DOMStrings.geoLocation);
    let windowWidth = window.innerWidth;

    if(!parentInput && (windowWidth > 1200)) {

        //Expand/Show input box after alert on initial state when geolocation modal is off screen and state.location.length < 0 and when clicked outside geolocation modal and parent of search input

        if(!geolocation && !state.getLocation().length > 0 && !state.getIsModalOnScreen()) {
            alert('Type and select a location to continue..')
            searchView.expandInput();
        }

        //Shrink/Hide input box on regular state on body click after fetching geolocation 
        else if(state.getLocation().length > 0)
            searchView.shrinkInputBox();
            
    }

    else if(!(isTargetSearchBtn || isTargetSideMenu) && (windowWidth <= 1200)) {

        //Show side menu with alert on initial state when geolocation modal is off screen 

        if(!geolocation && !state.getLocation().length > 0 && !state.getIsModalOnScreen()) {
            alert('Type and select a location to continue..')
            return searchView.showSideMenu()
        }

        //Hide side menu on regular state after fetching geolocation when state.location.length is always greater than 0

        else if(state.getLocation().length > 0) {
            mainView.removeRootOverlay();
            mainView.removeTransformMain3D()
            searchView.hideSideMenu()
        }
    }
}

const onClickDisplaySearch = (ev) => {
    ev.preventDefault();
    let windowWidth = window.innerWidth;

    //Show side search when windowidth <= 1200 on regular state after fetching geolocation

    if(windowWidth <= 1200) {
        mainView.renderMainTransform();
        mainView.renderRootOverlay();
        searchView.showSideMenu(windowWidth);
    }

    //Expand input & hide side search when windowidth > 1200 on regular state after fetching geolocation

    else {
        searchView.hideSideMenu()
        searchView.expandInput();
    }
}

/**
 * App Initializer
 */

const init = () => {
    mainView.renderMainTransform()   

    geoLocationControl()

    //Input box expand on click listener

    document.querySelector(DOMStrings.form).addEventListener('click', onClickDisplaySearch)

    scrollView.scrollBtnOnResize(window.innerWidth);

    //Hide side/search list on body click listener 

    // document.addEventListener('click', (ev) => {
    //     console.log('from 1')
    //     searchView.autoCompListClear();
    //     searchView.hideSideMenuOnBodyClick(ev);
    // });

    document.querySelector(DOMStrings.bgTransition).classList.add('active');
    
    //Convert temperature units on checkbox change listener

    document.querySelector(DOMStrings.unitSwitch).addEventListener('change', tempConvert);


    document.addEventListener('click', onBodyClickShowOrHideSearchInput);
   
}

window.addEventListener('DOMContentLoaded', init);

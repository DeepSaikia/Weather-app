// import { init } from './viewCtrl.js';
import { DOMStrings } from './DOMStrings.js';
import { AutoComplete, DailyForecast, HourlyForecast } from './dataCtrl.js';
import * as viewCtrl from './viewCtrl.js';


let state = { 
    locAutoComplete : [], 
    dailyForecasts : [], 
    hourlyForecasts : [],
    location : '',
    unitType : '',
    isDay : true,
    currWeatherForBackground : 0,
    hourlyHorizontalScroll : {
        scrollCount : 0,
        maxScroll : 500,
        minScroll : -1200,
        scroll : 215
    },
    dailyHorizontalScroll : {
        scrollCount : 0,
        maxScroll : 500,
        minScroll : -400,
        scroll : 107
    }
}

let urlData = {
    
    autoComp : {
        url : 'http://dataservice.accuweather.com/locations/v1/cities/autocomplete',
        q : ''
    },

    dailyForecast : {
        url : 'http://dataservice.accuweather.com/forecasts/v1/daily/5day/',
        key : '',
        metric : true
    },

    hourlyForecast : {
        url : 'http://dataservice.accuweather.com/forecasts/v1/hourly/12hour/',
        key : '',
        metric : true
    }
}

const autoComplete = async (ev) => {
    let inputBoxType = ev.target.id;
    const inputValue = document.querySelector(`#${inputBoxType}`).value; //delegate this to viewCtrl
    urlData.autoComp.q = inputValue;

    if(inputValue) {
        try {
            let response = await fetch(`./.netlify/functions/get_autoComp`, {
                method: "POST",
                body: JSON.stringify(urlData.autoComp)
            });
            let result = await response.json();
            // result = result.splice(0, 4);
            state.locAutoComplete = [];
            if(Array.isArray(result)){   //seperate method
                result.forEach(el => {
                    const name = el.LocalizedName;
                    const country = el.Country.LocalizedName;
                    const key = el.Key;
                    state.locAutoComplete.push(new AutoComplete(name, country, key));
                });
                viewCtrl.autoCompListRender(state.locAutoComplete, inputBoxType);
            }
            else {
                alert('Maximum no. of api calls exceeded')
            }
        }
        catch(err) {
            console.error(err);
        }
    }
    else 
        viewCtrl.autoCompListClear();
}

const today = new Date();    //make a dedicated function

const fetchDailyForecast = async(locKey) => {
    
    if(locKey) {
        // viewCtrl.clearForecastsFromDOM();
        
        //let day = today.getDay();    //make a dedicated function
        
        urlData.dailyForecast.key = locKey;
        try {
            let response = await fetch('./.netlify/functions/get_dailyForecasts', {
                method: "POST",
                body: JSON.stringify(urlData.dailyForecast)
            });
            let { DailyForecasts } = await response.json();
            console.log(DailyForecasts);
            state.dailyForecasts = [];
            DailyForecasts.forEach(el => {        //make a dedicated function for instantiation
                const min = Math.round(el.Temperature.Minimum.Value);
                const max = Math.round(el.Temperature.Maximum.Value);
                const date = dateOrTimeFormatting('date', el.Date);
                const icon = el.Day.Icon;
                const desc = el.Day.IconPhrase;
                state.dailyForecasts.push(new DailyForecast(date, min, max, icon, desc));
            });
            // console.log(state.dailyForecasts)
            viewCtrl.dailyForecastsRender(state.dailyForecasts);
        }
        catch(err) {
            console.log(err);
        }
    }
}

const dateOrTimeFormatting = (dateOrTime, date) => {

    date = date.split('T');

    if(dateOrTime === 'date') {
        const daysArray = ['Sun', 'Mon', 'Tue', 'Wed', 'Thurs', 'Fri', 'Sat'];
        let month, year, day;
        date = date[0];
        date = date.split('-');
        [year, month, day] = date;
        date = new Date(`${year}, ${month}, ${day}`);
        return `${daysArray[date.getDay()]} ${date.getDate()}`;
    }
    else {
        return `${date[1].slice(0, 5)}`;  //can be a seperate function
    }
}

const fetchHourlyForecast = async(locKey) => {
    if(locKey) {
        viewCtrl.clearForecastsFromDOM();
        urlData.hourlyForecast.key = locKey;
        try {
            let response = await fetch('./.netlify/functions/get_hourlyForecast', {
                method: "POST",
                body: JSON.stringify(urlData.hourlyForecast)
            });

            state.hourlyForecasts = [];
            let result = await response.json();
            console.log(result)
            // result = result.splice(0, 5);
            result.forEach((el, i) => {      //make a dedicated function for instantiation
                let temp = Math.round(el.Temperature.Value);
                const timeOfForecast = dateOrTimeFormatting('time', el.DateTime);
                let description = el.IconPhrase;
                let icon = el.WeatherIcon;
                if(i === 0) {
                    state.isDay = el.IsDaylight;
                    state.currWeatherForBackground = icon;
                }
                state.hourlyForecasts.push(new HourlyForecast(timeOfForecast, temp, icon, description));
            });
            state.unitType = result[0].Temperature.UnitType === 17 ? 'celsius' : 'fahrenheit';
            await fetchDailyForecast(locKey);
            // console.log(state.isDay);
            state.hourlyHorizontalScroll.scrollCount = 0;
            viewCtrl.renderLightOrDarkBackground(state.isDay, state.currWeatherForBackground);
            viewCtrl.currentMainTempRender(state.hourlyForecasts[0].getCurrHourlyTemp())
            viewCtrl.weatherDescriptionRender(state.hourlyForecasts[0].getDescription());
            viewCtrl.hourlyForecastRender(state.hourlyForecasts);
            viewCtrl.renderUpdateTime();
            // resetScrollCounters();
            blurScrollBtn('daily');
            blurScrollBtn('hourly');
        }
        catch(err) {
            console.log(err);
        }
    }
}

//Think about creating a main function

const fetchSelectedLocationFromDOM = (e) => {
    const li = e.target.closest(DOMStrings.locationListItem);
    const key = li.id;
    console.log(e.target);
    console.log(e.target.textContent);
    state.location = e.target.textContent;
    viewCtrl.autoCompListClear();
    fetchHourlyForecast(key);
    viewCtrl.clearInputBox();
    viewCtrl.shrinkInputBox();
    viewCtrl.hideSideMenu();
    viewCtrl.currentLocationRender(state.location);
}


const tempConvert = (e) => {
    viewCtrl.clearActiveUnit();
    let unit = e.target.id;
    let unitID = unit.split('-');
    console.log(unitID);
    unitID = parseInt(unitID[1]);
    viewCtrl.toggleActiveUnit(unitID);
    urlData.hourlyForecast.metric = unitID === 1 ?  true : false;
    urlData.dailyForecast.metric = unitID === 1 ?  true : false;
    fetchHourlyForecast(urlData.hourlyForecast.key);
}



const scroller = (buttonDirection, scrollSectionID) => {
    console.log(scrollSectionID)
    if(buttonDirection === "right") {
        if(state[`${scrollSectionID}HorizontalScroll`].scrollCount <= 0 && state[`${scrollSectionID}HorizontalScroll`].scrollCount > state[`${scrollSectionID}HorizontalScroll`].minScroll) {
            let forecastCards = document.querySelectorAll(DOMStrings[`${scrollSectionID}ForecastCard`]);
            state[`${scrollSectionID}HorizontalScroll`].scrollCount -= state[`${scrollSectionID}HorizontalScroll`].scroll;
            console.log(state[`${scrollSectionID}HorizontalScroll`].scrollCount)
            forecastCards.forEach(el => el.style.left = `${state[`${scrollSectionID}HorizontalScroll`].scrollCount}px`)
        }
        // else if (state[`${scrollSectionID}HorizontalScroll`].scrollCount <= state[`${scrollSectionID}HorizontalScroll`].minScroll) {
            //     state[`${scrollSectionID}HorizontalScroll`].scrollCount = 0;
            // }
    }
    else {
        if(state[`${scrollSectionID}HorizontalScroll`].scrollCount <= state[`${scrollSectionID}HorizontalScroll`].maxScroll && state[`${scrollSectionID}HorizontalScroll`].scrollCount < 0) {
            console.log('a')
            let forecastCards = document.querySelectorAll(DOMStrings[`${scrollSectionID}ForecastCard`]);
            state[`${scrollSectionID}HorizontalScroll`].scrollCount += state[`${scrollSectionID}HorizontalScroll`].scroll;
            console.log(state[`${scrollSectionID}HorizontalScroll`].scrollCount)
            forecastCards.forEach(el => el.style.left = `${state[`${scrollSectionID}HorizontalScroll`].scrollCount}px`)
        }
    }
    blurScrollBtn(scrollSectionID); 

}

// const resetScrollCounters = () => {
//     state.hourlyHorizontalScroll.scrollCount = 0;
//     state.dailyHorizontalScroll.scrollCount = 0;

// }

const blurScrollBtn = (scrollSectionID) => {
    let scrollBtnsID = DOMStrings[`${scrollSectionID}ScrollBtns`];
    // console.log(scrollBtns);
    let scrollLeft = document.querySelector(`${scrollBtnsID} > ${DOMStrings.scrollLeft}`);
    let scrollRight = document.querySelector(`${scrollBtnsID} > ${DOMStrings.scrollRight}`);
    state[`${scrollSectionID}HorizontalScroll`].scrollCount === 0 ? scrollLeft.classList.add('endOfLine') : scrollLeft.classList.remove('endOfLine');
    state[`${scrollSectionID}HorizontalScroll`].scrollCount <= state[`${scrollSectionID}HorizontalScroll`].minScroll ? scrollRight.classList.add('endOfLine') : scrollRight.classList.remove('endOfLine');
}

const scrollBtnOnResize = () => {
    let resizedWidth = window.innerWidth;
    console.log(resizedWidth);
    if(resizedWidth <= 1300) {
        viewCtrl.renderDailyScrollBtns(true);
        blurScrollBtn('daily');
    }
    else 
        viewCtrl.renderDailyScrollBtns(false);
}

const scrollCtrl = (e) => {
    const buttonClassName = e.target.parentNode.id;
    let getScrollSectionID = e.target.closest('.scroll-btns');
    let scrollSectionID = getScrollSectionID.id.split('-'); //seperate method
    scrollSectionID = scrollSectionID[0];
    scroller(buttonClassName, scrollSectionID);
}

// const displaySideMenu = () => {
//     viewCtrl.displaySideMenu();
// }

const hideSideMenuOnBodyClick = (ev) => {
    let isTargetSideMenu = ev.target.closest(DOMStrings.sideMenu) === null;
    let isTargetSearchBtn = ev.target.closest(DOMStrings.form) === null;
    if(isTargetSearchBtn && isTargetSideMenu) {
        viewCtrl.hideSideMenu()
    }
}

const init = () => {

    document.querySelector(DOMStrings.form).addEventListener('click', (ev) => {
        ev.preventDefault();
        viewCtrl.expandInput();
    })

    blurScrollBtn('hourly');

    scrollBtnOnResize();

    document.addEventListener('click', (ev) => {
        viewCtrl.autoCompListClear();
        hideSideMenuOnBodyClick(ev);
    });

    document.querySelector(DOMStrings.bgTransition).classList.add('active');
    
    //Input event listener 
    document.querySelectorAll(DOMStrings.input).forEach(el => el.addEventListener('keyup', autoComplete))

    //On place selection from the list 
    document.querySelectorAll(DOMStrings.locationList).forEach(el => el.addEventListener('click', fetchSelectedLocationFromDOM));

    document.querySelector(DOMStrings.tempUnit).addEventListener('click', tempConvert);

    document.querySelector(DOMStrings.hourlyScrollBtns).addEventListener('click', scrollCtrl)

    document.querySelector(DOMStrings.dailyScrollBtns).addEventListener('click', scrollCtrl)

    // document.querySelector(DOMStrings.scrollRight).addEventListener('click', scrollLeft)

    window.addEventListener('resize', () => {
        scrollBtnOnResize();
        viewCtrl.shrinkInputBox();
        // viewCtrl.hideSideMenu();
    });

    // window.addEventListener('resize', displaySideMenu);

}



window.addEventListener('DOMContentLoaded', init);

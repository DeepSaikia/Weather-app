import { DOMStrings } from "../DOMStrings.js";

export const getdailyForecastContainerWidth = () => {
    let container = document.querySelector(DOMStrings.forecastContainer);
    return container.scrollWidth;
}

export const getdailyForecastWrapperClientWidth = () => {
    let wrapper = document.querySelector(DOMStrings.forecastWrapper);
    return wrapper.scrollWidth;
}

export const gethourlyForecastContainerWidth = () => {
    let container = document.querySelector(DOMStrings.hourlyForecastContainer);
    return container.scrollWidth;
}

export const gethourlyForecastWrapperClientWidth = () => {
    let wrapper = document.querySelector(DOMStrings.hourlyForecastWrapper);
    return wrapper.clientWidth;
}

export const scrollForecastContainer = (forecastSection, speed, operation) => {
    let forecastContainer = document.querySelector(DOMStrings[`${forecastSection}ForecastContainer`]);
    if(operation === 'subtract')
        forecastContainer.scrollLeft -= speed;
    else 
        forecastContainer.scrollLeft += speed;
}

export const renderDailyScrollBtns = (render) => {

    document.querySelectorAll(`${DOMStrings.dailyScrollBtns} > span`).forEach(el => {
        if(render) {
            el.classList.remove('inactive');
            el.classList.add('active');
        }
        else {
            el.classList.remove('active');
            el.classList.add('inactive');
        }
    })
}

export const resetForecastScrollLeft = () => {
  
    document.querySelectorAll(DOMStrings.forecastContainer).forEach(el => {
        el.scrollLeft = 0;
    })
}

export const resetScrollBtns = () => {
    document.querySelectorAll(`${DOMStrings.allScrollBtns} > span`).forEach(el => {
        el.classList.remove('endOfLine');
    })
}

const scrollBtnObj = {
    section: '',
    leftBtn: '',
    rightBtn: '',
    setSection(scrollSectionID) {
        this.section = document.querySelector(DOMStrings[`${scrollSectionID}Section`])
    },
    setBtns() {
        this.leftBtn = this.section.querySelector(DOMStrings.scrollLeft)
        this.rightBtn = this.section.querySelector(DOMStrings.scrollRight)
    },
    display(btnDirection) {
        this[`${btnDirection}Btn`].classList.remove('endOfLine')
    },
    hide(btnDirection) {
        this[`${btnDirection}Btn`].classList.add('endOfLine')
    }

}

export const disableScrollbtn = (scrollSectionID, btnDirection, maxScroll=0, scrollCount=0) => {

    scrollBtnObj.setSection(scrollSectionID);
    scrollBtnObj.setBtns();

    if(btnDirection === 'right') {
        if(scrollCount >= maxScroll){
            scrollBtnObj.hide('right')
            scrollBtnObj.display('left');          
        }
        else {
            scrollBtnObj.display('left');
        }
    }
    else if(btnDirection === 'left') {
        if(scrollCount <= 0) {
            scrollBtnObj.hide('left') 
            scrollBtnObj.display('right');
        }
        else {
            scrollBtnObj.display('right');
        }
    }

}

export const scrollBtnOnResize = (windowWidth) => {

    if(windowWidth <= 1210) {
        renderDailyScrollBtns(true);
    }
    else {
        renderDailyScrollBtns(false);
    }
    resetForecastScrollLeft();
    resetScrollBtns();
    disableScrollbtn('hourly', 'left')
    disableScrollbtn('daily', 'left')
    
}


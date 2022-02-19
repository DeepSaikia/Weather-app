import { DOMStrings } from '../DOMStrings.js';

export const autoCompListRender = (loc, inputBoxType) => {
    let html = '';
    if(inputBoxType === 'large-view') {
        let list = document.querySelector(DOMStrings.locationList);
        loc.forEach(el => {
            html += `<li class=location-item id=${el.key}><p>${el.name}, ${el.country}</p></li>`;
        });
        list.classList.add('active');
        list.innerHTML = html;
        
    }
    else {
        loc.forEach(el => {
            html += `<li class="location-item" id=${el.key}><i class="fas fa-map-marker-alt"></i><p>${el.name}, ${el.country}</p></li>`
        });
        document.querySelector(DOMStrings.mobileLocationList).innerHTML = html;
    }
}

export const shrinkInputBox = () => {
    document.querySelector(DOMStrings.form).classList.remove('expand');
    clearInputBox();
    autoCompListClear();
}

export const autoCompListClear = () => {
    let list = document.querySelector(DOMStrings.locationList);
    list.innerHTML = '';
    list.classList.remove('active');
}

export const clearInputBox = () => {
    document.querySelector(DOMStrings.input).value = '';
}

export const expandInput = () => {
    document.querySelector(DOMStrings.form).classList.add('expand');
    document.querySelector(DOMStrings.input).focus();
    clearInputBox();
}

/**
 * Side Menu Functions
 */

export const showSideMenu = () => {
    let sideMenu = document.querySelector(DOMStrings.sideMenu);
    sideMenu.classList.add('active');
    document.querySelector(DOMStrings.mobileViewInput).focus();
}

export const hideSideMenu = () => {
    let sideMenu = document.querySelector(DOMStrings.sideMenu);
    document.querySelector(DOMStrings.mobileLocationList).innerHTML = '';
    document.querySelector(DOMStrings.mobileViewInput).value = '';
    sideMenu.classList.remove('active');
}

export const addSearchZindex = () => {
    document.querySelector(DOMStrings.locationSearch).style.zIndex = '999';
}

export const hideInputBox = () => {
    document.querySelector(DOMStrings.input).classList.add('hide-input')
}

export const viewInputBox = () => {
    document.querySelector(DOMStrings.input).classList.remove('hide-input')
}
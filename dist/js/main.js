import { init } from './viewCtrl.js';
import { DOMStrings } from './DOMStrings.js';
import { AutoComplete } from './dataCtrl.js';
import { autoCompListRender } from './viewCtrl.js';

let state = { locAutoComplete : [] }

// let key = 'i1G2ZaaeVIVDziiEEDwAMQSjcIBC9iTs';//${url}?apikey=${key}&q=${inputValue}

const urlData = {
    url : 'http://dataservice.accuweather.com/locations/v1/cities/autocomplete',
    q : ''
}

const autoComplete = async () => {
    const inputValue = document.querySelector(DOMStrings.input).value;
    urlData.q = inputValue;
    if(inputValue) {
        let response = await fetch(`./.netlify/functions/get_autoComp`, {
            method: "POST",
            body: JSON.stringify(urlData)
        });
        let result = await response.json();
        console.log(result);
        state.locAutoComplete = [];
        result.forEach(el => {
            const name = el.LocalizedName;
            const country = el.Country.LocalizedName;
            state.locAutoComplete.push(new AutoComplete(name, country));
        });
        autoCompListRender(state.locAutoComplete);
    }
}

document.addEventListener('keyup', autoComplete);

window.addEventListener('DOMContentLoaded', init);
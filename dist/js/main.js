import { init } from './viewCtrl.js';
import { DOMStrings } from './DOMStrings.js';
import { AutoComplete } from './dataCtrl.js';

let state = { locAutoComplete : [] }

let key = 'i1G2ZaaeVIVDziiEEDwAMQSjcIBC9iTs';
const url = 'http://dataservice.accuweather.com/locations/v1/cities/autocomplete';

const autoComplete = async () => {
    const inputValue = document.querySelector(DOMStrings.input).value;
    if(inputValue) {
        let response = await fetch(`${url}?apikey=${key}&q=${inputValue}`)
        let result = await response.json();
        console.log(result);
        state.locAutoComplete = [];
        result.forEach(el => {
            const name = el.LocalizedName;
            const country = el.Country.LocalizedName;
            state.locAutoComplete.push(new AutoComplete(name, country));
        });
    }
}

document.addEventListener('keyup', autoComplete);

window.addEventListener('DOMContentLoaded', init);
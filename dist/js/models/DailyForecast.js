import config from '../Config.js';
import DateOrTimeFormat from '../DateOrTimeFormat.js';

export default class DailyForecast {

    constructor(locKey) {
        this.locationKey = locKey;
        this.result = [];
    }

    async getForecasts() {
        
        config.setDailyForecastKey(this.locationKey);
       
        try {
            let response = await fetch('./.netlify/functions/get_dailyForecasts', {
                method: "POST",
                body: JSON.stringify(config.getDailyForecastConfig())
            });
            let { DailyForecasts } = await response.json();
            DailyForecasts.forEach(el => {        
                const min = Math.round(el.Temperature.Minimum.Value);
                const max = Math.round(el.Temperature.Maximum.Value);
                const date = DateOrTimeFormat('date', el.Date);
                const icon = el.Day.Icon;
                const description = el.Day.IconPhrase;
                this.result.push({date, min, max, icon, description});
            });
            
        }
        //Implement proper error handling
        catch(err) {
            console.log(err);
        }
    }
}
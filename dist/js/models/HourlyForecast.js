import config from '../Config.js';
import DateOrTimeFormat from '../DateOrTimeFormat.js';

export default class HourlyForecast {

    constructor(locKey) {
        this.locationKey = locKey;
        this.isDay = true;
        this.currWeather = 0;
        this.result = [];
    }

    async getForecasts() {
        
        config.setHourlyForecastKey(this.locationKey);
        try {
            let response = await fetch('./.netlify/functions/get_hourlyForecast', {
                method: "POST",
                body: JSON.stringify(config.getHourlyForecastConfig())
            });

            // state.hourlyForecasts = [];
            let result = await response.json();
        
            result.forEach((el, i) => {      //make a dedicated function for instantiation
                let temp = Math.round(el.Temperature.Value);
                let timeOfForecast = DateOrTimeFormat('time', el.DateTime);
                let description = el.IconPhrase;
                let icon = el.WeatherIcon;
                if(i === 0) {
                    this.isDay = el.IsDaylight;
                    this.currWeatherForBackground = icon;
                    this.currentTemp = temp;
                    this.currentIcon = icon;
                    this.currDescription = description;
                }
                this.result.push({timeOfForecast, temp, icon, description});
            });
            
        }
        //Implement proper error handling
        catch(err) {
            console.log(err);
        }
    }
}
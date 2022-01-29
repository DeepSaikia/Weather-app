import config from '../Config.js'

export default class geoLocation {

    constructor() {
        this.locKey = 0;
        this.errorMsg = '';
        this.location = ''
    }

    getPosition() {
        return new Promise(function (resolve, reject) {
            navigator.geolocation.getCurrentPosition(resolve, reject); //explore
        });
    }

    async getWeatherForecast() {

        try {

            let position = await this.getPosition()
            const lat = position.coords.latitude
            const lon = position.coords.longitude
            config.setGeoLocationQuery(`${lat},${lon}`)

            
            let response = await fetch('./.netlify/functions/get_locationKey', {
                method : "POST",
                body: JSON.stringify(config.getGeoLocationConfig())
            });
            let result = await response.json()
            this.location = `${result.EnglishName}, ${result.AdministrativeArea.EnglishName}, ${result.Country.EnglishName}`
            this.locKey = result.Key    

        }
        catch(err) {
            this.errorMsg = err;
        }
    }
}


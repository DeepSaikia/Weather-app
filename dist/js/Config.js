const urlData = {
    
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
    },

    geoLocation : {
        url : 'http://dataservice.accuweather.com/locations/v1/cities/geoposition/search',
        q : ''
    },

    setSearchQuery(q) {
        this.autoComp.q = q;
    },

    getSearchConfig() {
        return this.autoComp;
    },

    setHourlyForecastKey(key){
        this.hourlyForecast.key = key
    },

    setDailyForecastKey(key){
        this.dailyForecast.key = key
    },

    getLocationKey() {
        return this.hourlyForecast.key;
    },

    setHourlyMetric(isMetric){
        this.hourlyForecast.metric = isMetric;
    },

    setDailyMetric(isMetric){
        this.dailyForecast.metric = isMetric;
    },

    getDailyForecastConfig() {
        return this.dailyForecast
    },

    getHourlyForecastConfig() {
        return this.hourlyForecast
    },

    setGeoLocationQuery(str) {
        this.geoLocation.q = str;
    },

    getGeoLocationConfig() {
        return this.geoLocation;
    }
}

export default urlData;
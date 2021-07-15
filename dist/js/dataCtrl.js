export class AutoComplete {
    constructor(name, country, id) {
        this.name = name;
        this.country = country;
        this.id = id;
    }

    getLocName() {
        return this.name;
    }

    getCountryName() {
        return this.country;
    }

    getLocID() {
        return this.id;
    }
}

export class DailyForecast {
    constructor(date, min, max, icon, description) {
        this.date = date;
        this.min = min;
        this.max = max;
        this.icon = icon;
        this.description = description;
    }

    getDate() {
        return this.date;
    }
    
    getMin() {
        return this.min;
    }

    getMax() {
        return this.max;
    }

    getIcon() {
        return this.icon;
    }

    getDescription() {
        return this.description;
    }
}

export class HourlyForecast {
    
    constructor(timeOfForecast, temp, icon, description) {
        this.timeOfForecast = timeOfForecast;
        this.curr_temp = temp;
        this.icon = icon;
        this.description = description;
    }

    getCurrTimeOfForecast() {
        return this.timeOfForecast;
    }

    getCurrHourlyTemp() {
        return this.curr_temp;
    }

    getDescription() {
        return this.description;
    }

}
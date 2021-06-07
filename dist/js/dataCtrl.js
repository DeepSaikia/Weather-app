export class AutoComplete {
    constructor(name, country) {
        this.name = name;
        this.country = country;
    }

    getLocName() {
        return this.name;
    }

    getCountryName() {
        return this.country;
    }
}
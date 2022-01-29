import config from '../Config.js'

export default class Search {
    constructor(query) {
        this.query = query;
        this.result = [];
    }

    async getResults() {
        config.setSearchQuery(this.query);
        try {
            let response = await fetch(`./.netlify/functions/get_autoComp`, {
                method: "POST",
                body: JSON.stringify(config.getSearchConfig())
            });
            let result = await response.json();
            if(Array.isArray(result)){   
                result.forEach(el => {
                    const name = el.LocalizedName;
                    const country = el.Country.LocalizedName;
                    const key = el.Key;
                    this.result.push({
                        name,
                        country,
                        key
                    });
                });
            }
        }
        catch(err) {
            console.error(err);
        }
    }

}
const fetch = require("node-fetch");

const { WEATHER_API_KEY3 } = process.env;



exports.handler = async(event, context) => {
    const params = JSON.parse(event.body)
    const { url, key, metric } = params;
    const api = `${url}${key}?apikey=${WEATHER_API_KEY3}&metric=${metric}`;
    try {
        const response = await fetch(api);
        const result = await response.json();
        return {
            statusCode: 200,
            body: JSON.stringify(result)
        };
    }    
    catch(err) {
        return {
            statusCode: 422,
            body: err.stack
        };
    }
}
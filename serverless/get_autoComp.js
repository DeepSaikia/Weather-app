const { WEATHER_API_KEY } = process.env;

exports.handler = async(event, context) => {
    const params = JSON.parse(event.body);
    const { url, q } = params;
    const url = `${url}?apikey=${WEATHER_API_KEY}&q=${q}`;
    try {
        const response = await fetch(url);
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
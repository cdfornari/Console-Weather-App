const fs = require('fs');

const axios = require("axios");


class Busquedas {


    historial = [];
    dbPath = './db/database.json'

    constructor(){
        this.leerDB();
    }

    get mapboxParams(){
        return{
            'access_token': process.env.MAPBOX_KEY,
            'limit': 5,
            'language': 'es'
        }
    }

    get weatherParams(){
        return{
            'appid': process.env.OPENWEATHER_KEY,
            'lat': '',
            'lon': '',
            'units': 'metric',
            'lang': 'es'
        }
    }

    async ciudad(lugar=''){
        try {
            //const resp = await axios.get('https://api.mapbox.com/geocoding/v5/mapbox.places/Caracas%2C%20Distrito%20Capital%2C%20Venezuela.json?access_token=pk.eyJ1IjoiY2Zvcm5hIiwiYSI6ImNrc3dyODd3ODBtZjEybm55dm4wZWtoYmMifQ.3M6lJ4YM-wkbKj_8MkF1Xg&limit=5&language=es');
            const instance = axios.create({
                baseURL: `https://api.mapbox.com/geocoding/v5/mapbox.places/${lugar}.json`,
                params: this.mapboxParams
            })
            const resp = await instance.get();

            return resp.data.features.map(lugar => ({
                id: lugar.id,
                nombre: lugar.place_name,
                longitud: lugar.center[0],
                latitud: lugar.center[1]
            }));
            
        } catch (error) {
            return error;
        }
        
    }

    async clima(lat,lon){

        try {
            const params = this.weatherParams;
            params.lat = lat;
            params.lon = lon;
            const instance = axios.create({
                baseURL: 'https://api.openweathermap.org/data/2.5/weather',
                params
            })

            const resp = await instance.get();

            return{
                desc: resp.data.weather[0].description,
                min: resp.data.main.temp_min,
                max: resp.data.main.temp_max,
                temp: resp.data.main.temp,
                feelsLike: resp.data.main.feels_like
            }
            
        } catch (error) {
            console.log(error);
        }
    }

    addToHistorial(lugar = ''){

        if (this.historial.includes(lugar)){
            return;
        }

        this.historial = this.historial.splice(0,4)

        this.historial.unshift(lugar);

        this.guardarDB();
    }

    guardarDB(){

        const payload = {
            historial: this.historial
        }
        fs.writeFileSync(this.dbPath, JSON.stringify(payload));
    }

    leerDB(){
        if (!fs.existsSync(this.dbPath)) return;

        const info = fs.readFileSync(this.dbPath, 'utf-8');

        const {historial} = JSON.parse(info);
        
        this.historial = historial;
    }


}

module.exports = Busquedas;
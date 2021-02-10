const fs = require('fs');
const axios = require('axios')

class Busquedas {
    constructor() {
        this.dbPath = './db/database.json'
        this.historial = [];
        this.leerDB();
    }

    get ParamsMapbox() {
        return {
            'access_token': process.env.MAPBOX_KEY,
            'limit': 5,
            'language': 'es'
        }

    }

    capitalizeWord(str) {
        return (
            str.split(' ')
            .map(w => w[0].toUpperCase() + w.substr(1).toLowerCase())
            .join(' '));
    }



    get historialCapitalizado() {

        const newArray = this.historial.map(el => this.capitalizeWord(el));

        return (newArray);
    }

    async buscarCiudades(lugar = '') {

        try {
            // Peticion http

            const instance = axios.create({
                baseURL: `https://api.mapbox.com/geocoding/v5/mapbox.places/${lugar}.json`,
                params: this.ParamsMapbox

            })
            const resp = await instance.get();

            // retorna los lugares según la busqueda
            return resp.data.features.map(lugar => ({
                id: lugar.id,
                nombre: lugar.place_name,
                lng: lugar.center[0],
                lat: lugar.center[1]

            }))
        } catch (error) {
            console.log(error);
            return []
        }
    }

    paramsOpenWeather(lat, lon) {
        return {
            'appid': process.env.OPENWEATHER_KEY,
            'units': 'metric',
            'lat': lat,
            'lon': lon,
            'lang': 'es'
        }

    }

    async climaLugar(lat, lon) {
        try {
            // Peticion http

            const instance = axios.create({
                baseURL: `https://api.openweathermap.org/data/2.5/weather`,
                params: this.paramsOpenWeather(lat, lon)

            })
            const resp = await instance.get();

            const clima = resp.data

            // retorna los lugares según la busqueda
            return {
                desc: clima.weather[0].description,
                min: clima.main.temp_min,
                max: clima.main.temp_max,
                temp: clima.main.temp,
                wind: clima.wind.speed * 1.94384,
                gust: clima.wind.gust * 1.95384,
                deg: clima.wind.deg
            };

        } catch (error) {
            console.log(error);
            return {}
        }

    }


    agregarHistorial(lugar = '') {

        if (this.historial.includes(lugar.toLocaleLowerCase())) {
            return;
        }
        this.historial.unshift(lugar.toLocaleLowerCase());
        this.guardarDB();
    }

    guardarDB() {
        const payLoad = {
            historial: this.historial
        }
        fs.writeFileSync(this.dbPath, JSON.stringify(payLoad));
    }

    leerDB() {
        if (!fs.existsSync(this.dbPath)) {
            return null;
        }
        const info = fs.readFileSync(this.dbPath, { encoding: 'utf-8' });

        this.historial = JSON.parse(info).historial;

    }
}

module.exports = Busquedas;
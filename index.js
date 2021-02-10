const { inquirerMenu, pausa, leerInput, listarLugares } = require('./helpers/inquirer');
const Busquedas = require('./models/busquedas')
require('dotenv').config()

console.clear();

const main = async() => {

    const busquedas = new Busquedas()

    do {
        opt = await inquirerMenu();

        switch (opt) {
            case 1:

                // Mostrar mensaje para que escriba tecto a buscar
                const termino = await leerInput('Ciudad: ')

                // Buscar los lugares y mostrar
                const lugares = await busquedas.buscarCiudades(termino);

                // Seleccionar el lugar
                const idSel = await listarLugares(lugares);
                if (idSel === '0') continue;

                // Buscar el seleccionado en la lista
                const lugarSel = lugares.find(l => l.id = idSel)

                // Guardar en historico
                busquedas.agregarHistorial(lugarSel.nombre)

                // Buscar el clima
                const datosClima = await busquedas.climaLugar(lugarSel.lat, lugarSel.lng);

                //console.log(datosClima);

                // Mostrar resultados
                console.log('\nInformación de la ciudad\n'.green);
                console.log('Lat: ', lugarSel.lat);
                console.log("Lng: ", lugarSel.lng);
                console.log("Temperatura: ", datosClima.temp);
                console.log("Min: ", datosClima.min);
                console.log("Max: ", datosClima.max);
                console.log('Cómo está el clima: ', datosClima.desc);
                console.log("Wind".red);
                console.log("knots: ", datosClima.wind);
                console.log("Racha: ", datosClima.gust);
                console.log("Dir: ", datosClima.deg);

                break;
            case 2:
                busquedas.historialCapitalizado.forEach((lugar, i) => {
                    const idx = `${i+1}.`.green
                    console.log(`${idx} ${lugar}`);

                });
                break;
            case 0:
                break;
        }

        if (opt !== 0) await pausa();

    } while (opt !== 0);

}


main();
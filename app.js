require('dotenv').config();

const {inquirerMenu,
    pausa,
    leerInput,
    seleccionarLugar,
    confirmar,
    seleccionarTareaCompletar
} = require('./helpers/inquirer');
const Busquedas = require('./models/busquedas');

const main = async()=>{
    console.clear();

    const busquedas = new Busquedas();
    let op;

    do {
        op = await inquirerMenu();

        switch (op) {
            case 1:

                const lugar = await leerInput('Ciudad a buscar: ');
                const lugares = await busquedas.ciudad(lugar);

                const id = await seleccionarLugar(lugares);
                if(id === '0') continue; //Saltar iteración

                const lugarSeleccionado = lugares.find(l => l.id ===id);

                busquedas.addToHistorial(lugarSeleccionado.nombre);

                const clima = await busquedas.clima(lugarSeleccionado.latitud,lugarSeleccionado.longitud);

                console.clear();

                console.log('\nInformación de la ciudad:\n'.green);
                console.log('Ciudad:', lugarSeleccionado.nombre);
                console.log('Latitud:', lugarSeleccionado.latitud);
                console.log('Longitud:', lugarSeleccionado.longitud);
                console.log('Temperatura:', clima.temp,'°C');
                console.log('Se siente como:', clima.feelsLike,'°C');
                console.log('Mínima:', clima.min,'°C');
                console.log('Máxima:', clima.max,'°C');
                console.log('Descripción:', clima.desc);
                
            break;

            case 2:
                busquedas.historial.forEach((lugar,i)=>{
                    const idx = `${i+1}.`.green;
                    console.log(`${idx} ${lugar}`);
                })
            break;

        }

        await pausa();
    } while (op !== 3);
}

main();


const inquirer = require('inquirer');
require('colors');

const preguntas = [{
    type: 'list',
    name: 'opcion',
    message: '¿Qué desea hacer?',
    choices: [{
            value: 1,
            name: `${ '1.'.green } Buscar ciudad`
        },
        {
            value: 2,
            name: `${ '2.'.green } Historial`
        },
        {
            value: 0,
            name: `${ '0.'.green } Salir`
        },

    ]
}];

const inquirerMenu = async() => {
    console.clear();

    console.log("==============================".green);
    console.log("   Seleccione una opción".white);
    console.log("==============================\n".green);

    const { opcion } = await inquirer.prompt(preguntas);


    return opcion;


}

const pausa = async() => {
    const question = {
        type: 'input',
        name: 'enter',
        message: `Presione ${ 'ENTER'.green} para continuar`
    }

    await inquirer.prompt(question);

}

const leerInput = async(message) => {
    const question = {
        type: 'input',
        name: 'desc',
        message,
        validate: async(value) => {
            if (value.length === 0) {
                return ('Por favor ingresa un valor')
            }
            return (true)
        }
    }

    const { desc } = await inquirer.prompt(question);

    return desc;

}

const listarLugares = async(lugares = []) => {

    let choices = [];

    lugares.forEach((lugar, index) => {
        const idx = `${index + 1}.`.green
        const newChoice = {
            value: lugar.id,
            name: `${idx} ${lugar.nombre}`
        }
        choices.push(newChoice);
    })

    choices.unshift({
        value: '0',
        name: '0. '.green + 'Cancelar'

    })

    const preguntas = [{
        type: 'list',
        name: 'opcion',
        message: 'Seleccione lugar',
        choices: choices
    }]

    const { opcion } = await inquirer.prompt(preguntas);
    return opcion;

}

const mostrarListadoCheckList = async(tareas) => {

    let choices = [];

    tareas.listadoArr.forEach((tarea, index) => {
        const idx = `${index + 1}.`.green
        const newChoice = {
            value: tarea.id,
            name: `${idx} ${tarea.desc}`,
            checked: (tarea.completadoEn) ? true : false
        }
        choices.push(newChoice);
    })


    const tareasBorrar = [{
        type: 'checkbox',
        name: 'ids',
        message: 'Seleccione',
        choices: choices
    }]

    const { ids } = await inquirer.prompt(tareasBorrar);
    return ids;

}


const confirmar = async(message) => {
    const question = [{
        type: 'confirm',
        name: 'ok',
        message
    }]
    const { ok } = await inquirer.prompt(question);
    return ok;
}

module.exports = {
    inquirerMenu,
    pausa,
    leerInput,
    listarLugares,
    confirmar,
    mostrarListadoCheckList
}
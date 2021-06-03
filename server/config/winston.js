// importando winston
import winston, {format} from 'winston';
// ruta raiz
import appRoot from 'app-root-path';

// componentes para crear el formato personalizado 
const {combine, timestamp, printf, uncolorize, json, colorize } = format;
// creando el  perfil de color para el log
const colors = {
    error: 'red',
    warn: 'yellow',
    info: 'green',
    http: 'magenta',
    debug: 'green',
};
// agregando el perfil a winston
winston.addColors(colors);
// formato de consola
const myformat = format.combine(
    colorize({all: true}),
    timestamp(),
    printf((info) => `${info.timestamp} ${info.level}: ${info.message}`)
);
// formato para la salida de los archivos de log
const myfileformat = combine(
    uncolorize(),
    timestamp(),
    json()
);

// creando objetos de configuracion
const options = {
    infoFile:{
        level: 'info',
        filename: `${appRoot}/server/logs/infos.log`,
        hadleExceptions: true,
        maxsize: 5242880,  // 5 mb
        maxFiles: 5,
        format: myfileformat,
    },
    warnFile:{
        level: 'warn',
        filename: `${appRoot}/server/logs/warns.log`,
        hadleExceptions: true,
        maxsize: 5242880,  // 5 mb
        maxFiles: 5,
        format: myfileformat,
    },
    errorFile:{
        level: 'error',
        filename: `${appRoot}/server/logs/errors.log`,
        hadleExceptions: true,
        maxsize: 5242880,  // 5 mb
        maxFiles: 5,
        format: myfileformat,
    },
    console: {
        level: 'debug',
        hadleExceptions: true,
        format: myformat,

    },
};

// Creando la instancia del logger
const logger = winston.createLogger({
    transports: [
        new winston.transports.File(options.infoFile),
        new winston.transports.File(options.warnFile),
        new winston.transports.File(options.errorFile),
        new winston.transports.Console(options.console),
    ],
    exitOnError: false, // No finaliza en excepciones manejadas 
});

// Manejo de un stream de entrada
logger.stream = {
    write(message) {
        logger.info(message);
    },
};

export default logger; 

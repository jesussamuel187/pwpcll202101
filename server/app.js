/* eslint-disable no-console */
import createError from 'http-errors';
import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import winston from '@server/config/winston';

// Importando el router principal 
import router from '@server/routes/index';

// Importing configurations
import configTemplateEngine from '@s-config/template-engine.js';
// Webpack Modules
import webpack from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
import webpackDevConfig from '../webpack.dev.config';
// Consultar el modo en que se esta ejecutando la aplicacion 
const env = process.env.NODE_ENV || 'developement';
// Se crea la aplicacion express
const app = express();
// Verificando el modo de ejecucion de la aplicacion 
if (env === 'development'){
  console.log('> Excecuting in Development Mode: Webpack Hot Reloading');
  // Paso 1. Agregando la ruta del HMR
  // reload=true: Habilita la recarga del frontend cuando hay cambios en el codigo fuente del frontend
  // timeout=1000: Tiempo de espera entre recarga  y recarga de la pagina 

  webpackDevConfig.entry = [
    'webpack-hot-middleware/client?reload=true&timeout=1000',
    webpackDevConfig.entry,
  ];
  // Paso 2. Agregamos el Plugin
  webpackDevConfig.plugins.push(new webpack.HotModuleReplacementPlugin());

  // Paso 3. Crear el compilador de webpack 
  const compiler = webpack(webpackDevConfig);
  
  // Paso 4. Agregando el middleware a la cadena de middlewares de nuestra aplicacion
  app.use(
    webpackDevMiddleware(compiler, {
      publicPath: webpackDevConfig.output.publicPath,
    })
  );

  // Paso 5. Agregando el Webpack Hot Middleware
  app.use(webpackHotMiddleware(compiler));
} else {
  console.log('> Excecuting in Production Mode...');
}

// view engine setup
configTemplateEngine(app);

app.use(morgan('dev', { stream: winston.stream }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '..', 'public')));

// Instalando el enrutador principal a la aplicacion express
router.addRoutes(app);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  // Log
  winston.error(
    `Code: 404, Message: Page Not Found, URL: ${req.originalUrl}, Method: ${req.method}`,
  );
  next(createError(404));
});

// error handler
app.use((err, req, res) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // Logeando con Winston
  winston.error(
    `status: ${err.status || 500}, Message: ${err.message}, Method: ${
      req.method
    }, IP: ${req.ip}`,
  );

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;

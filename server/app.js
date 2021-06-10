/* eslint-disable no-console */
import createError from 'http-errors';
import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import winston from '@server/config/winston';

import indexRouter from '@s-routes/index';
import usersRouter from '@s-routes/users';

// importing configurations
import configTemplateEngine from '@s-config/template-engine'



// webpack modules
import webpack from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMidddleware from 'webpack-hot-middleware';
import webpackDevConfig from '../webpack.dev.config';
// consultar el modo en que se este ejecutando la aplicacion.
const env = process.env.NODE_ENV || 'developement';
// se crea la aplicacion express
const app = express();
// verificando el modo de ejecucion de la aplicacion
if (env === 'development') {
  console.log('> Excecuting int Development Mode : Webpack Hot Reloading');
  // paso 1 agregando la ruta del HMR
  // reload = true: habilita la recarga del front end cuando hay cambios en el codigo fuente del front end
  // timeout = mil: tiempo de espera entre recarga y recarga de la paguina
  webpackDevConfig.entry = [
    'webpack-hot-middleware/client?reload=true&timeout=mil',
    webpackDevConfig.entry,
  ];

  // paso 2 agregamos el plugin
  webpackDevConfig.plugins.push(new webpack.HotModuleReplacementPlugin());
  // paso 3 crear el compilador de webpack
  const compiler = webpack(webpackDevConfig);
  // paso 4 agregando el middleware ala cadena de middlewares de nuestra aplicacion
  app.use(
    webpackDevMiddleware(compiler, {
      publicPath: webpackDevConfig.output.publicPath,
    }),
  );
  // paso 5 agregando el webpack hot middleware
  app.use(webpackHotMidddleware(compiler));
} else {
  console.log('> Excecuting int Production Mode...');
}

// view engine setup       //(hbs= halderbals)
configTemplateEngine(app);

app.use(morgan('dev',{stream : winston.stream})); // es para que nos muestren las peticiones que hacen.
app.use(express.json()); // comvierte el http a formato json.(es un conversor )
app.use(express.urlencoded({ extended: false })); // para todas las peticiones de url.
app.use(cookieParser()); // manejo de cookies
app.use(express.static(path.join(__dirname, '..', 'public'))); // este es uno de los mas importates

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use( (req, res, next) => {
  // log
  winston.error(
    `Code: 404, Message: Page Nod Found, URL: ${req.originalUrl}, Method: ${req.method}`,
  );
  next(createError(404));
});

// error handler
app.use( (err, req, res) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // logeando con winston
  winston.error(
    `estatus: ${err.status || 500} Message: ${err.message} Method: ${
      req.method
    }, IP: ${req.ip}`
  );

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;

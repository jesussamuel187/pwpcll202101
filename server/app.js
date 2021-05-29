import createError from 'http-errors';
import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';

import indexRouter from '@s-routes/index';
import usersRouter from '@s-routes/users';

// Webpack Modules

import webpack from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
import webpackDevConfig from '../webpack.dev.config';

// Consultar el modo en que se esta ejecutando el programa
const env = process.env.NODE_ENV || 'development';

// se crea la aplicacion express
const app = express();

// verificando el modo de ejecucion de la aplicacion
if (env === "development") {
  // eslint-disable-next-line no-console
  console.log('> Excecuting in Development Mode: Webpack Hot Reloading');
  // Agrega la ruta del HMR
  // reload=true: Habilita la recarga del frontend cuando hay cambios en el código
  // 'fuente del fronten
  // timeout=1000: Tiempo de espera entre recarga y recarga de la pagina.
  webpackDevConfig.entry = [
    "webpack-hot-middleware/client?reload=true&timeout=1000",
    webpackDevConfig.entry,
  ];
  // Agregamos el plugin
  webpackDevConfig.plugins.push(new webpack.HotModuleReplacementPlugin());
  // crer el compilador de webpack
  const compiler = webpack(webpackDevConfig);
  // agregamos el middleware a la cadena de middlewares
  // de nuestra aplicacion
  app.use(
    webpackDevMiddleware(compiler, {
      publicPath: webpackDevConfig.output.publicPath,
    })
  );

  // agrega el webpack hot middleware
  app.use(webpackHotMiddleware(compiler));
} else {
  // eslint-disable-next-line no-console
  console.log('> Excecuting in Production Mode......');
}
// view engine setup       //(hbs= halderbals)
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev')); // es para que nos muestren las peticiones que hacen.
app.use(express.json()); // comvierte el http a formato json.(es un conversor )
app.use(express.urlencoded({ extended: false })); // para todas las peticiones de url.
app.use(cookieParser()); // manejo de cookies
app.use(express.static(path.join(__dirname, '..', 'public'))); // este es uno de los mas importates

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use((err, req, res) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
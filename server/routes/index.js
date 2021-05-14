var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express', autor: 'jesus samuel vazquez',jesus: 'jesus',  compañia: 'Awsome software'});
});

/* codigo nuevo. */
router.get('/jesus', function(req, res, next) {
res.send('hola campion como estas?') 
})

/* codigo profe*/
router.get('/greeting', function(req, res, next){
res.status(200).json({message: 'hola campion de la  fullstack web'})
})

module.exports = router;

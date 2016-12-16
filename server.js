var express = require('express');
var bodyParser = require('body-parser');

//SCHEMAS
var mdrSchema = require('./schemas/mdrSchema.js');
var mdr = new mdrSchema();

var actSchema = require('./schemas/activitySchema.js');
var act = new actSchema();

//Base configuration
var app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//MDR ROUTES
var mdrRoutes = express.Router();
mdrRoutes.post('/cl/:acronym', function(req, res){
    var data;
    switch (req.params.acronym) {
        case 'flux_gp_purposecode':
            data = mdr.getPurposeCodes(); 
            break;
        default:
            break;
    }
    res.json(data);
});

//ACTIVITY ROUTES
var actRoutes = express.Router();
actRoutes.get('/comchannels', function(req, res){
    res.json(act.getComChannels());
});
actRoutes.get('/catchdetails/:id', function(req, res){
    res.json(act.getTripCatchDetail());
});

//APP ROUTES
app.use('/mock/mdr', mdrRoutes);
app.use('/mock/activity', actRoutes);

var port = 8081;
app.listen(port);

console.log('MockServer is up and running at: http://localhost:' + port + '/mock');

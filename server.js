/*
Developed with the contribution of the European Commission - Directorate General for Maritime Affairs and Fisheries
© European Union, 2015-2016.

This file is part of the Integrated Fisheries Data Management (IFDM) Suite. The IFDM Suite is free software: you can
redistribute it and/or modify it under the terms of the GNU General Public License as published by the
Free Software Foundation, either version 3 of the License, or any later version. The IFDM Suite is distributed in
the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or
FITNESS FOR A PARTICULAR PURPOSE.  See the GNU General Public License for more details. You should have received a
copy of the GNU General Public License along with the IFDM Suite. If not, see <http://www.gnu.org/licenses/>.
*/
var express = require('express');
var bodyParser = require('body-parser');

//SCHEMAS
var mdrSchema = require('./schemas/mdrSchema.js');
var mdr = new mdrSchema();

var actSchema = require('./schemas/activitySchema.js');
var act = new actSchema();

var exchangeSchema = require('./schemas/exchangeSchema.js');
var exc = new exchangeSchema();

var subscriptionsSchema = require('./schemas/subscriptionsSchema.js');
var sub = new subscriptionsSchema();

//Base configuration
var app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//MDR ROUTES
var mdrRoutes = express.Router();
mdrRoutes.post('/cl/:acronym', function (req, res) {
    var data;
    switch (req.params.acronym) {
        case 'flux_gp_purposecode':
            data = mdr.getPurposeCodes();
            break;
        case 'flux_fa_report_type':
            data = mdr.getReportTypes();
            break;
        case 'gear_type':
            data = mdr.getGearTypes();
            break;
        case 'flux_fa_type':
            data = mdr.getActivityTypes();
            break;
        case 'weight_means':
            data = mdr.getWeightMeans();
            break;
        case 'fa_catch_type':
            data = mdr.getCatchTypes();
            break;
        case 'fish_presentation':
            data = mdr.getPresentationCodes();
            break;
        case 'fish_preservation':
            data = mdr.getPreservationCodes();
            break;
        case 'fish_packaging':
            data = mdr.getFishPackaging();
            break;
        case 'fa_gear_problem':
            data = mdr.getGearProblems();
            break;
        case 'fa_gear_recovery':
            data = mdr.getGearRecovery();
            break;
        case 'vessel_role':
            data = mdr.getVesselRole();
            break;
        default:
            break;
    }
    res.json(data);
});

//ACTIVITY ROUTES
var actRoutes = express.Router();
actRoutes.get('/comchannels', function (req, res) {
    res.json(act.getComChannels());
});
actRoutes.get('/catchdetails/:id', function (req, res) {
    res.json(act.getTripCatchDetail());
});
actRoutes.get('/triplandingdetails/:id', function (req, res) {
    res.json(act.getTripCatchesLandingDetails());
});
actRoutes.get('/tripcatchevolution/:id', function (req, res) {
    res.json(act.getTripCatchesEvolution());
});
actRoutes.get('/fadetails/:fatype', function (req, res) {
    var data;
    switch (req.params.fatype) {
        case 'departure':
            data = act.getDeparture();
            break;
        case 'fishing_operation':
            data = act.getFishingOperation();
            break;
        case 'arrival_notification':
            data = act.getArrivalNotification();
            break;
        case 'arrival_declaration':
            data = act.getArrival();
            break;
        case 'landing':
            data = act.getLanding();
            break;
        case 'area_exit':
        case 'area_entry':
            data = act.getAreaEntry();
            break;
        case 'discard':
        case 'transhipment':
        case 'relocation':
        case 'joint_fishing_operation':
            data = act.jointfishingoperation();
            break;
        default:
            break;
    }
    res.json(data);
});
  
//EXCHANGE ROUTES
var exchangeRoutes = express.Router();
exchangeRoutes.post('/list', function(req, res){
    res.json(exc.getLogList(req.body.pagination.page));
});

exchangeRoutes.get('/message/:guid', function(req, res){
    res.json(exc.getRawMessage(req.params.guid));
});

exchangeRoutes.get('/validation/:guid', function(req, res){
    res.json(exc.getValidation(req.params.guid));
});

exchangeRoutes.get('/log/:guid', function(req, res){
    res.json(exc.getLogItem(req.params.guid));
});

//SUBSCRIPTIONS ROUTES

var subscriptionsRoutes = express.Router();
subscriptionsRoutes.get('/newSubscription/:guid', function(req, res){
    res.json(sub.subscriptionForm(req.params.guid));
});

subscriptionsRoutes.get('/formComboData/:guid', function(req, res){
    res.json(sub.getFormComboData(req.params.guid));
});

//APP ROUTES
app.use('/mock/mdr', mdrRoutes);
app.use('/mock/activity', actRoutes);
app.use('/mock/exchange', exchangeRoutes)
app.use('/mock/subscriptions', subscriptionsRoutes)

var port = 8081;
app.listen(port);

console.log('MockServer is up and running at: http://localhost:' + port + '/mock');

var jsf = require('json-schema-faker');
var globSchema = require('./genericSchema.js');
var genSchema = new globSchema();

var activitySchema = function(){
    this.getComChannels = function(){
        var data = {
            code: 'FLUX',
            description: 'FLUX'
        };

        return genSchema.getSimpleSchema([data]);
    };
    
    this.getTripCatchDetail = function(){
        var schema = {
            type: 'object',
            properties: {
                tripId: {
                    type: 'string',
                    chance: 'guid'
                },
                vesselName: {
                    type: 'string',
                    faker: 'name.findName'
                },
                departure: {
                    type: 'string',
                    faker: 'date.future'
                }
            },
            required: ['tripId', 'vesselName', 'departure']
        };
        var data = jsf(schema);
        return genSchema.getSimpleSchema(data);
        
//        var data = {
//            tripId: 'BEL-TRP-O16-2016_0021',
//            vesselName: 'Beagle(BEL123456789)',
//            departure: '2016-10-21T08:28:21',
//            departureAt: ['BEZEE'],
//            arrival: '2016-10-21T08:28:21',
//            arrivalAt: ['BEOST'],
//            landing: '2016-10-21T08:28:21',
//            landingAt: ['BEOST']
//        };
//        
//        return genSchema.getSimpleSchema(data);
    }
};

module.exports = activitySchema;
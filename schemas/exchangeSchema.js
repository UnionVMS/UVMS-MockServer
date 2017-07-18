var jsf = require('json-schema-faker');
var faker = require('faker');
var Chance = require('chance');
var moment = require('moment');
var globSchema = require('./genericSchema.js');
var genSchema = new globSchema();

jsf.format('fakeDateServer', function (gen, schema) {
    var random = gen.faker.date.between(gen.faker.date.past(2), gen.faker.date.future(2));
    return moment(random).format('YYYY-MM-DD HH:mm:ss +0000');
});


var exchangeSchema = function(){
    this.getLogList =  function(page){
        var schema = {
            type: 'array',
            minItems: 5,
            maxItems: 25,
            items: {
                type: 'object',
                properties: {
                    dateFwd: {
                        type: 'string',
                        format: 'fakeDateServer'
                    },
                    dateRecieved: {
                        type: 'string',
                        format: 'fakeDateServer'
                    },
                    id: {
                        type: 'string',
                        chance: 'guid'
                    },
                    incoming: {
                        type: 'boolean'
                    },
                    senderRecipient: {
                        type: 'string',
                        faker: 'internet.email'
                    },
                    status: {
                        type: 'string',
                        pattern: 'SUCCESSFUL|FAILED|ISSUED'
                    },
                    type: {
                        type: 'string',
                        pattern: 'RECEIVED MOVEMENT|SENT MOVEMENT|SENT POLL|SENT EMAIL'
                    },
                    recipient: {
                        type: 'string',
                        pattern: 'TESTDATA'
                    },
                    rule: {
                        type: 'string',
                        pattern: 'TESTDATA-RULE'
                    }
                },
                required: ['dateFwd', 'dateRecieved', 'id', 'incoming', 'senderRecipient','status', 'type']
            }
        };
        
        var data = jsf(schema);
        
        var listObj = {
            currentPage: page,
            totalNumberOfPages: 4,
            logList: data
        };
        
        return genSchema.getSimpleSchema(listObj);
    }
};

module.exports = exchangeSchema;
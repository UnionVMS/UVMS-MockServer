var jsf = require('json-schema-faker');
var faker = require('faker');
var Chance = require('chance');
var moment = require('moment');

var globSchema = require('./genericSchema.js');
var genSchema = new globSchema();


var subscriptionsSchema = function () {

    this.subscriptionForm = function () {
        var schema = {
            type: 'object',
            properties: {
                name: "meera",
                isActive: true,
                organization: "organization1",
                subscriptionType: "Tx-Push",
                endPoint: "end Point4",
                commChannel: "Flux",
                messageType: "Message type",
                accessibility: "accessibility",
                retryDelay: "Retry Delay",
                description: "I need subscription",
                queryParams: {
                    vesselId: "vessel ID 1",
                    includeCorrectionHist: true, 
                    time: 5,
                    timeUnit: "hours"
                }
            },
            required: ['name', 'organization', 'subscriptionType', 'endPoint', 'commChannel', 'messageType', 'description', 'accessibility','retryDelay','queryParams']
        };
        var data = jsf(schema);

        return genSchema.getSimpleSchema(data);
    }

    this.getFormComboData = function () {
        var schema = {
            type: 'object',
            properties: {
                organization: [{
                    "text": "organization1",
                    "code": "organization1"
                }, {
                    "text": "organization2",
                    "code": "organization2"
                },
                {
                    "text": "organization3",
                    "code": "organization3"
                },
                {
                    "text": "organization4",
                    "code": "organization4"
                }
                ],
                subscriptionType: [{
                    "text": "Tx-Push",
                    "code": "Tx-Push"
                }, {
                    "text": "Tx-Pull",
                    "code": "Tx-Pull"
                }
                ],
                endPoint: [{
                    "text": "end Point1",
                    "code": "end Point1"
                }, {
                    "text": "end Point2",
                    "code": "end Point2"
                }, {
                    "text": "end Point3",
                    "code": "end Point3"
                }, {
                    "text": "end Point4",
                    "code": "end Point4"
                }],
                accessibility: [{
                    "text": "accessibility",
                    "code": "accessibility"
                }, {
                    "text": "accessibility1",
                    "code": "accessibility1"
                }, {
                    "text": "accessibility2",
                    "code": "accessibility2"
                }, {
                    "text": "accessibility3",
                    "code": "accessibility3"
                }],
                commChannel: [{
                    "text": "Manual",
                    "code": "Manual"
                }, {
                    "text": "Flux",
                    "code": "Flux"
                }],
                messageType: [{
                    "text": "Message type",
                    "code": "Message type"
                }, {
                    "text": "Message type1",
                    "code": "Message type1"
                }]


            },

            required: ['organization', 'subscriptionType', 'endPoint', 'accessibility', 'commChannel', 'messageType']
        };
        var data = jsf(schema);

        return genSchema.getSimpleSchema(data);
    }
};
module.exports = subscriptionsSchema;

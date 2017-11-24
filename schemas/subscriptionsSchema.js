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
                name: "Donald",
                organization: " ",
                subscriptionType: " ",
                endPoint: " ",
                commChannel: "Flux",
                messageType: " ",
                accessibility: " ",
                retryDelay: "Retry Delay",
                description: "I need subscription"
            },
            required: ['name', 'organization', 'subscriptionType', 'endPoint', 'commChannel', 'messageType', 'description', 'accessibility','retryDelay']
        };
        var data = jsf(schema);

        return genSchema.getSimpleSchema(data);
    }

    this.getOrganizationData = function () {
        var schema = {
            type: 'object',
            properties: {
                organization: [{
                    "text": "organization1",
                    "code": "org1"
                }, {
                    "text": "organization2",
                    "code": "org1"
                },
                {
                    "text": "organization3",
                    "code": "org1"
                },
                {
                    "text": "organization4",
                    "code": "org1"
                }
                ],
                subscriptionType: [{
                    "text": "Tx-Push",
                    "code": "TX"
                }, {
                    "text": "Tx-Push1",
                    "code": "TX1"
                },
                {
                    "text": "Tx-Push2",
                    "code": "TX2"
                },
                {
                    "text": "Tx-Push3",
                    "code": "TX3"
                }
                ],
                endPoint: [{
                    "text": "end Point1",
                    "code": "EP1"
                }, {
                    "text": "end Point2",
                    "code": "TX1"
                }, {
                    "text": "end Point3",
                    "code": "TX2"
                }, {
                    "text": "end Point4",
                    "code": "TX3"
                }],
                accessibility: [{
                    "text": "accessibility",
                    "code": "acc1"
                }, {
                    "text": "accessibility1",
                    "code": "acc1"
                }, {
                    "text": "accessibility2",
                    "code": "acc2"
                }, {
                    "text": "accessibility3",
                    "code": "acc3"
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
                    "code": "MT1"
                }, {
                    "text": "Message type",
                    "code": "MT2"
                }]


            },

            required: ['organization', 'subscriptionType', 'endPoint', 'accessibility', 'commChannel', 'messageType']
        };
        var data = jsf(schema);

        return genSchema.getSimpleSchema(data);
    }
};
module.exports = subscriptionsSchema;

var jsf = require('json-schema-faker');
var globSchema = require('./genericSchema.js');
var genSchema = new globSchema();
var moment = require('moment');
var species = [];

function initSpecies(){
    species = ['BEAGLE', 'SEAFOOD', 'GADUS', 'CODFISH', 'HADDOCK'];
}

function randomNumber(min, max){
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getFishData(start, end, includeDiff){
    var fishSpecies = ['cod', 'sol', 'lem', 'tur'];
    var speciesToUse = fishSpecies.slice(start, end);
    
    var schema = {
        type: 'object',
        properties: {},
        required: speciesToUse
    };
    
    for (var i = 0; i < speciesToUse.length; i++){
        if (typeof includeDiff === 'undefined' || includeDiff === false){
            schema.properties[speciesToUse[i]] = {
                type: 'string',
                format: 'fakeWeight'
            }
        } else {
            schema.properties[speciesToUse[i]] = {
                type: 'string',
                format: 'fakeWeightAndDiff'
            }
        }
    }
    
    var finalData = jsf(schema);
    return finalData;
    
}

function getEvolutionData(){
    initSpecies();
    var schema = {
        type: 'object',
        properties: {
            speciesList: {
                type: 'array',
                minItems: 1,
                maxItems: 5,
                items: {
                    type: 'object',
                    properties: {
                        speciesCode: {
                            type: 'string',
                            format: 'fishSpeciesCode'
                        },
                        weight: {
                            type: 'integer',
                            minimum: 1,
                            maximum: 3000
                        }
                    },
                    required: ['speciesCode','weight']
                }
            }
        },
        required: ['speciesList']
    };
    
    return jsf(schema);
}

function calculateEvolutionTotals(data){
    
    for (var obj in data){
        if (data[obj] instanceof Array){
            for (var i = 0; i < data[obj].length; i++){
                data[obj][i] = calculateTotal(data[obj][i]); 
            }
        } else {
            data[obj] = calculateTotal(data[obj]);
        }
        
    }
    
    return data;
}

function calculateTotal(data){
    var keys = ['landed', 'cumulated', 'onboard'];
    for (var i = 0; i < keys.length ; i++){
        var sum = 0;
        if (keys[i] in data){
            for (var j = 0; j < data[keys[i]]['speciesList'].length; j++){
                sum += data[keys[i]]['speciesList'][j]['weight'];
            }
            data[keys[i]].total = sum;
        }
    }
    
    return data;
}

jsf.format('fakeDateServer', function(gen, schema) {
    var random = gen.faker.date.between(gen.faker.date.past(2), gen.faker.date.future(2));
    return moment(random).format('YYYY-MM-DDTHH:mm:ss');
});

jsf.format('fakeDateStandard', function(gen, schema) {
    //FIXME this should be removed and use the standard date format from server
    var random = gen.faker.date.between(gen.faker.date.past(2), gen.faker.date.future(2));
    return moment(random).format('YYYY-MM-DD');
});

jsf.format('fakeWeight', function(gen, schema){
    return randomNumber(0, 3000).toString();
});

jsf.format('fakeWeightAndDiff', function(gen, schema){
    var signal = ['+','-'];
    var sigToUse = signal[Math.floor(Math.random()*2)];
    return randomNumber(0, 3000).toString() + '(' + sigToUse + randomNumber(1, 20) + ')';
});

jsf.format('fishSpeciesCode', function(gen, schema){
    var idx = Math.floor(Math.random()*species.length);
    var spToUse = species.splice(idx, 1);
    return spToUse[0];
});

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
                    format: 'fakeDateServer'
                },
                departureAt: {
                    type: 'array',
                    maxItems: 1,
                    items: {
                        type: 'string',
                        chance: 'city'
                    }
                },
                arrival: {
                    type: 'string',
                    format: 'fakeDateServer'
                },
                arrivalAt: {
                    type: 'array',
                    maxItems: 1,
                    items: {
                        type: 'string',
                        chance: 'city'
                    }
                },
                landing: {
                    type: 'string',
                    format: 'fakeDateServer'
                },
                landingAt: {
                    type: 'array',
                    maxItems: 4,
                    items: {
                        type: 'string',
                        chance: 'city'
                    }
                }
            },
            required: ['tripId', 'vesselName', 'departure', 'departureAt', 'arrival', 'arrivalAt', 'landing', 'landingAt']
        };
        var data = jsf(schema);
        return genSchema.getSimpleSchema(data);
    }
    
    this.getTripCatchesLandingDetails = function(){
        var schema = {
            type: 'object',
            properties: {
                difference: {
                    type: 'object',
                    properties: {
                        items: {
                            type: 'object',
                            properties: {
                                catches: {
                                    type: 'object',
                                    properties: {
                                        lsc: getFishData(0,4),
                                        bms: getFishData(0,2) 
                                    },
                                    required: ['lsc','bms']
                                },
                                landed: {
                                    type: 'object',
                                    properties: {
                                        lsc: getFishData(0,4),
                                        bms: getFishData(0,2) 
                                    },
                                    required: ['lsc','bms']
                                },
                                difference: {
                                    type: 'object',
                                    properties: {
                                        lsc: getFishData(0,4, true),
                                        bms: getFishData(0,2, true) 
                                    },
                                    required: ['lsc','bms']
                                }
                            },
                            required: ['catches','landed','difference']
                        }
                    },
                    required: ['items']
                },
                catches: {
                    type: 'object',
                    properties: {
                        total: {
                            type: 'object',
                            properties: {
                                lsc: getFishData(0,4),
                                bms: getFishData(0,2),
                                dis: getFishData(1,3),
                                dim: getFishData(0,1)
                            },
                            required: ['lsc','bms','dis','dim']
                        },
                        items: {
                            type: 'array',
                            minItems: 1,
                            maxItems: 4,
                            items: {
                                type: 'object',
                                properties: {
                                    date: {
                                        type: 'string',
                                        format: 'fakeDateStandard'
                                    },
                                    area: {
                                        type: 'string',
                                        chance: 'postal'
                                    },
                                    lsc: getFishData(0,4),
                                    bms: getFishData(0,2),
                                    dis: getFishData(1,3),
                                    dim: getFishData(0,1)
                                },
                                required: ['date','area','lsc','bms','dis','dim']
                            }
                        }
                    },
                    required: ['total', 'items']
                },
                landing: {
                    type: 'object',
                    properties: {
                        total: {
                            type: 'object',
                            properties: {
                                lsc: getFishData(0,4),
                                bms: getFishData(0,2),
                                dis: getFishData(1,3),
                                dim: getFishData(0,1)
                            },
                            required: ['lsc','bms','dis','dim']
                        },
                        items: {
                            type: 'array',
                            minItems: 1,
                            maxItems: 4,
                            items: {
                                type: 'object',
                                properties: {
                                    area: {
                                        type: 'string',
                                        chance: 'postal'
                                    },
                                    lsc: getFishData(0,4),
                                    bms: getFishData(0,2),
                                    dis: getFishData(1,3),
                                    dim: getFishData(0,1)
                                },
                                required: ['area','lsc','bms','dis','dim']
                            }
                        }
                    },
                    required: ['total', 'items']
                }
            },
            required: ['difference','catches','landing']
        };
        
        var data = jsf(schema);
        return genSchema.getSimpleSchema(data);
    };
    
    this.getTripCatchesEvolution = function(){
        
        var schema = {
            type: 'object',
            properties: {
                finalCatch: {
                    type: 'object',
                    properties: {
                        landed: getEvolutionData(),
                        cumulated: getEvolutionData()
                    },
                    required: ['landed','cumulated']
                },
                catchProgress: {
                    type: 'array',
                    minItems: 5,
                    maxItems: 10,
                    items: {
                        type: 'object',
                        properties: {
                            onboard: getEvolutionData(),
                            cumulated: getEvolutionData()
                        },
                        required: ['onboard','cumulated']
                    }
                }
            },
            required: ['finalCatch','catchProgress']
        };
        
        var data = jsf(schema);
        data = calculateEvolutionTotals(data);
        
        return genSchema.getSimpleSchema(data);
    };
};

module.exports = activitySchema;
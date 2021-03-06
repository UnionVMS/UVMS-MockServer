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
var jsf = require('json-schema-faker');
var faker = require('faker');
var Chance = require('chance');
var u = require('underscore');

var globSchema = require('./genericSchema.js');
var genSchema = new globSchema();
var moment = require('moment');
var species, speciesCodes, gears, weightMeans, catchTypes, presentation, preservation, freshness, packaging, activityType;

function initSpecies() {
    species = ['BEAGLE', 'SEAFOOD', 'GADUS', 'CODFISH', 'HADDOCK'];
}

function initSpeciesCode() {
    speciesCodes = ['COD', 'SOL', 'LEM', 'TUR', 'SAL'];
}

function initGears() {
    gears = ['TBB', 'GND', 'SSC', 'GTR', 'LHM'];
}

function initWeights() {
    weightMeans = ['ONBOARD', 'WEIGHED', 'ESTIMATED', 'SAMPLING', 'STEREOSCOPIC'];
}

function initActivityType() {
    activityType = ['DEPARTURE', 'AREA_ENTRY', 'AREA_EXIT', 'FISHING_OPERATION', 'JOINT_FISHING_OPERATION','DISCARD','RELOCATION','TRANSHIPMENT','ARRIVAL','LANDING'];
}

function initCatchTypes() {
    catchTypes = ['ONBOARD', 'KEPT_IN_NET', 'TAKEN_ONBOARD', 'DISCARDED', 'LOADED', 'UNLOADED'];
}

function initPresentation() {
    presentation = ['FIL', 'GHT', 'GUL', 'GUT', 'HEA', 'JAP', 'SAL'];
}

function initPreservation() {
    preservation = ['ALI', 'BOI', 'DRI', 'FRE', 'FRO', 'SAL', 'SMO'];
}

function initFreshness() {
    freshness = ['A', 'B', 'E', 'V', 'SO'];
}

function initPackaging() {
    packaging = ['CRT', 'BOX', 'BGS', 'BLC', 'BUL', 'CNT'];
}

function getFishData(start, end, includeDiff) {
    var fishSpecies = ['cod', 'sol', 'lem', 'tur'];
    var speciesToUse = fishSpecies.slice(start, end);

    var schema = {
        type: 'object',
        properties: {},
        required: speciesToUse
    };

    for (var i = 0; i < speciesToUse.length; i++) {
        if (typeof includeDiff === 'undefined' || includeDiff === false) {
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

    return jsf(schema);
}

function getEvolutionData() {
    initSpeciesCode();
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
                    required: ['speciesCode', 'weight']
                }
            }
        },
        required: ['speciesList']
    };

    return jsf(schema);
}

function calculateEvolutionTotals(data) {

    for (var obj in data) {
        if (data[obj] instanceof Array) {
            for (var i = 0; i < data[obj].length; i++) {
                data[obj][i] = calculateTotal(data[obj][i]);
            }
        } else {
            data[obj] = calculateTotal(data[obj]);
        }

    }

    return data;
}

function calculateTotal(data) {
    var keys = ['landed', 'cumulated', 'onboard'];
    for (var i = 0; i < keys.length; i++) {
        var sum = 0;
        if (keys[i] in data) {
            for (var j = 0; j < data[keys[i]]['speciesList'].length; j++) {
                sum += data[keys[i]]['speciesList'][j]['weight'];
            }
            data[keys[i]].total = sum;
        }
    }

    return data;
}

function getCatchLandingData() {
    initSpeciesCode();
    initWeights();
    initSpecies();
    initCatchTypes();
    initGears();
    var schema = {
        type: 'array',
        minItems: 1,
        maxItems: 5,
        items: {
            type: 'object',
            properties: {
                species: {
                    type: 'string',
                    format: 'fishSpeciesCode'
                },
                speciesName: {
                    type: 'string',
                    format: 'fishSpecies'
                },
                lsc: {
                    type: 'integer',
                    minimum: 800,
                    maximum: 2000
                },
                bms: {
                    type: 'integer',
                    minimum: 100,
                    maximum: 800
                },
                catchType: {
                    type: 'string',
                    format: 'catchType'
                },
                units: {
                    type: 'integer',
                    minimum: 10,
                    maximum: 500
                },
                totalWeight: {
                    type: 'integer',
                    minimum: 1000,
                    maximum: 2000
                },
                catches: {
                    type: 'array',
                    minItems: 1,
                    maxItems: 5,
                    items: {
                        type: 'object',
                        properties: {
                            area: {
                                type: 'string',
                                chance: 'city'
                            },
                            productWeight: {
                                type: 'integer',
                                minimum: 1000,
                                maximum: 2000
                            },
                            size: {
                                type: 'string',
                                format: 'fishSpeciesSize'
                            },
                            presentatior: {
                                type: 'string',
                                format: 'fishSpeciesPresentatior'
                            },
                            preservation: {
                                type: 'string',
                                format: 'fishSpeciesPreservation'
                            },
                            gearUsed: {
                                type: 'string',
                                format: 'gearUsed'
                            },
                            locations: {
                                type: 'array',
                                minimum: 1,
                                maximum: 5,
                                items: getLocation()
                            }
                        },
                        required: ['area', 'productWeight', 'size', 'presentatior', 'preservation', 'gearUsed', 'locations']
                    }
                }
            },
            required: ['species', 'speciesName', 'lsc', 'bms', 'catchType', 'units', 'totalWeight', 'catches']
        }
    };
    var data = jsf(schema);

    for (var i = 0; i < data.length; i++) {
        for (var j = 0; j < data[i].catches.length; j++) {
            data[i].catches[j].gears = getGears();
        }
    }


    return data;

}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getLocationAreas() {
    var areaTypes = ['territory', 'fao_area', 'ices_stat_rectangle', 'effort_zone', 'rfmo', 'gfcm_gsa', 'gfcm_stat_rectangle'];
    var chance = new Chance();
    var num = getRandomInt(1, 6);
    var sampledAreas = u.sample(areaTypes, num);
    var locations = {};
    for (var i = 0; i < sampledAreas.length; i++) {
        locations[sampledAreas[i]] = chance.city();
    }

    return locations;
}

function getUniqueGearTypeCode() {
    initGears();
    return u.sample(gears, 1)[0];
}

function getTripDetails(){
    var schema = {
        type: 'object',
        properties: {
            trips: {
                type: 'array',
                minItems: 1,
                maxItems: 3,
                items: {
                    type: 'object',
                    properties: {
                        tripId: {
                            type: 'object',
                            properties: {
                                id: {
                                    type: 'string',
                                    chance: 'guid'
                                },
                                schemeId: {
                                    type: 'string',
                                    chance: 'bb_pin'
                                }
                            },
                            required: ['id', 'schemeId']
                        },
                        departureTime: {
                            type: 'string',
                            format: 'fakeDateServer'
                        },
                        arrivalTime: {
                            type: 'string',
                            format: 'fakeDateServer'
                        },
                        landingTime: {
                            type: 'string',
                            format: 'fakeDateServer'
                        }
                    },
                    required: ['tripId', 'departureTime', 'arrivalTime', 'landingTime']
                }
            }
        },
        required: ['trips']
    };
    
    var data = jsf(schema);
    data.vesselDetails = getVesselDetails('Master')
    return data;
}

function getStructuredAddress(){
    return {
        type: 'array',
        minItems: 1,
        maxItems: 3,
        items: {
            type: 'object',
            properties: {
                streetName: {
                    type: 'string',
                    chance: 'street'
                },
                plotId: {
                    type: 'string',
                    chance: 'bb_pin'
                },
                postCode: {
                    type: 'string',
                    chance: 'postal'
                },
                cityName: {
                    type: 'string',
                    chance: 'city'
                },
                countryCode: {
                    type: 'string',
                    chance: 'country'
                },
                countryName: {
                    type: 'string',
                    chance: {
                        country: {
                            full: true
                        }
                    }
                },
                characteristics: {
                    type: 'object',
                    properties: {
                        key1: 'value1',
                        key2: 'value2'
                    },
                    required: ['key1', 'key2']
                }
            },
            required: ['streetName', 'plotId', 'postCode', 'cityName', 'countryCode', 'countryName', 'characteristics']
        }
    }
}

function getVesselDetails(definedRole){
    var schema = {
        type: 'object',
        properties: {
            role: definedRole,
            name: {
                type: 'string',
                faker: 'name.findName'
            },
            country: {
                type: 'string',
                chance: 'country'
            },
            storage: {
                type: 'object',
                properties: {
                    type: {
                        type: 'string',
                        chance: 'word'
                    },
                    identifiers: {
                        type: 'array',
                        minItems: 1,
                        maxItems: 5,
                        items: {
                            type: 'object',
                            properties: {
                                id: {
                                    type: 'string',
                                    chance: 'guid'
                                },
                                schemeId: {
                                    type: 'string',
                                    chance: 'bb_pin'
                                },
                            },
                            required: ['id', 'schemeId']
                        }
                    }
                },
                required: ['type', 'identifiers']
            },
            authorizations: {
                type: 'array',
                minItems: 1,
                maxItems: 5,
                items: {
                    type: 'object',
                    properties: {
                        id: {
                            type: 'string',
                            chance: 'guid'
                        },
                        schemeId: {
                            type: 'string',
                            chance: 'bb_pin'
                        },
                    },
                    required: ['id', 'schemeId']
                }
            },
            contactParties: {
                type: 'array',
                minItems: 1,
                maxItems: 5,
                items: {
                    type: 'object',
                    properties: {
                        role: definedRole,
                        contactPerson: {
                            type: 'object',
                            properties: {
                                firstName: {
                                    type: 'string',
                                    chance: 'first'
                                },
                                lastName: {
                                    type: 'string',
                                    chance: 'last'
                                },
                                alias: {
                                    type: 'string',
                                    chance: 'name'
                                },
                                characteristics: {
                                    type: 'object',
                                    properties: {
                                        key1: 'value1',
                                        key2: 'value2'
                                    },
                                    required: ['key1', 'key2']
                                }
                            },
                            required: ['firstName', 'lastName', 'alias', 'characteristics']
                        },
                        structuredAddress: getStructuredAddress()
                    },
                    required: ['role', 'contactPerson', 'structuredAddress']
                }
            }
        },
        required: ['role', 'name', 'country', 'storage', 'authorizations', 'contactParties']
    };
    
    var data = jsf(schema);

    data.vesselIds = [
        {
            id: 'EXT_MARK_desc',
            schemeId: 'EXT_MARK'
        },
        {
            id: 'IRCS_desc',
            schemeId: 'IRCS'
        },
        {
            id: 'CFR_desc',
            schemeId: 'CFR'
        },
        {
            id: 'UVI_desc',
            schemeId: 'UVI'
        },
        {
            id: 'ICCAT_desc',
            schemeId: 'ICCAT'
        },
        {
            id: 'GFCM_desc',
            schemeId: 'GFCM'
        }
    ];

    return data;
}

function getProcessedProducts(){
    initCatchTypes();
    initSpeciesCode();
    initGears();
    initPresentation();
    initPreservation();
    initFreshness();
    initPackaging();

    var schema = {
        type: 'array',
        minItems: 1,
        maxItems: 5,
        items: {
            type: 'object',
            properties: {
                type: {
                    type: 'string',
                    format: 'catchType'
                },
                species: {
                    type: 'string',
                    format: 'fishSpeciesCode'
                },
                presentation: {
                    type: 'string',
                    format: 'presentation'
                },
                preservation: {
                    type: 'string',
                    format: 'preservation'
                },
                freshness: {
                    type: 'string',
                    format: 'freshness'
                },
                conversionFactor: {
                    type: 'number',
                    chance: {
                        'floating': {
                            'min': 1,
                            'max': 2,
                            'fixed': 1
                        }
                    }
                },
                weight: {
                    type: 'integer',
                    minimum: 25,
                    maximum: 3500
                },
                quantity: {
                    type: 'integer',
                    minimum: 1,
                    maximum: 90
                },
                packageWeight: {
                    type: 'integer',
                    minimum: 1,
                    maximum: 50
                },
                packageQuantity: {
                    type: 'integer',
                    minimum: 1,
                    maximum: 200
                },
                packagingType: {
                    type: 'string',
                    format: 'packaging'
                }
            },
            required: ['type', 'species', 'presentation', 'preservation', 'freshness', 'conversionFactor', 'weight', 'quantity', 'packageWeight', 'packageQuantity', 'packagingType']
        }
    };
    var data = jsf(schema);

    for (var i = 0; i < data.length; i++) {
        data[i].gear = getUniqueGearTypeCode();
        data[i].locations = getLocationAreas();
    }

    return data;
}

function getGearShotRetrieval(){
    var schema = {
        type: 'array',
        minItems: 5,
        maxItems: 10,
        items: {
            type: 'object',
            properties: {
                type: {
                    type: 'string',
                    format: 'gearShotRetrieval'
                },
                occurrence: {
                    type: 'string',
                    format: 'fakeDateServer'
                },
                id: {
                    type: 'object',
                    properties: {
                        id: {
                            type: 'string',
                            chance: 'guid'
                        },
                        schemeId: {
                            type: 'string',
                            chance: 'bb_pin'
                        }
                    },
                    required: ['id', 'schemeId']
                },
                duration: {
                    type: 'integer',
                    minimum: 1000,
                    maximum: 200000 
                },
                characteristics: {
                    type: 'object',
                    properties: {
                        key1: 'value1',
                        key2: 'value2'
                    },
                    required: ['key1', 'key2']
                }
            },
            required: ['type', 'occurrence', 'id', 'duration', 'characteristics']
        }
    };
    
    var data = jsf(schema);
    for(var i = 0; i < data.length; i++){
        var gears = getGears();
        var locations = jsf(getLocation());
        
        data[i].gear = gears[0]; 
        data[i].location = locations[0];
        data[i].gearProblems = getGearProblems();
    }
    
    return data;
}

function getGearProblems(){
    var schema = {
        type: 'array',
        minItems: 1,
        maxItems: 5,
        items: {
            type: 'object',
            properties: {
                type: {
                    type: 'string',
                    format: 'gearProblem'
                },
                nrOfGears: {
                    type: 'integer',
                    minimum: 1,
                    maximum: 4
                },
                recoveryMeasure: {
                    type: 'string',
                    format: 'gearRecovery'
                },
                locations: getLocation()
            },
            required: ['type', 'nrOfGears', 'recoveryMeasure', 'locations']
        }
    };
    
    var data = jsf(schema);
    return data;
}

function getFishingData() {
    initSpeciesCode();
    initWeights();
    initSpecies();
    initCatchTypes();

    var schema = {
        type: 'array',
        minItems: 1,
        maxItems: 5,
        items: {
            type: 'object',
            properties: {
                species: {
                    type: 'string',
                    format: 'fishSpeciesCode'
                },
                speciesName: {
                    type: 'string',
                    format: 'fishSpecies'
                },
                lsc: {
                    type: 'integer',
                    minimum: 800,
                    maximum: 2000
                },
                bms: {
                    type: 'integer',
                    minimum: 100,
                    maximum: 800
                },
                locations: {
                    type: 'array',
                    minimum: 1,
                    maximum: 5,
                    items: getLocation()
                },
                details: {
                    type: 'object',
                    properties: {
                        catchType: {
                            type: 'string',
                            format: 'catchType'
                        },
                        units: {
                            type: 'integer',
                            minimum: 10,
                            maximum: 500
                        },
                        weightMeans: {
                            type: 'string',
                            format: 'weightMeans'
                        }
                    },
                    required: ['catchType', 'units', 'weightMeans']
                }
            },
            required: ['lsc', 'bms', 'locations', 'details', 'species', 'speciesName']
        }
    };
    var data = jsf(schema);
    return data;
}

function getClassProperties() {
    initCatchTypes();
    initWeights();

    schema = {
        type: 'object',
        properties: {
            unit: {
                type: 'integer',
                minimum: 1,
                maximum: 2000
            },
            weight: {
                type: 'integer',
                minimum: 1,
                maximum: 2000
            },
            weightingMeans: {
                type: 'string',
                format: 'weightMeans'
            },
            stockId: {
                type: 'string',
                chance: 'bb_pin'
            },
            size: {
                type: 'string',
                chance: 'word'
            },
            tripId: {
                type: 'string',
                chance: 'guid'
            },
            usage: {
                type: 'string',
                chance: 'word'
            },
            destinationLocation: {
                type: 'array',
                minItems: 1,
                maxItems: 5,
                items: {
                    type: 'object',
                    properties: {
                        id: {
                            type: 'string',
                            chance: 'areacode'
                        },
                        name: {
                            type: 'string',
                            chance: 'city'
                        },
                        countryId: {
                            type: 'string',
                            chance: 'country'
                        }
                    },
                    required: ['id', 'name', 'countryId']
                }
            },
            specifiedFluxLocations: {
                type: 'array',
                minItems: 1,
                maxItems: 5,
                items: getLocation()
            },
            characteristics: {
                type: 'array',
                minItems: 1,
                maxItems: 3,
                items: {
                    type: 'object',
                    properties: {
                        typeCode: {
                            type: 'string',
                            chance: 'word'
                        },
                        typeCodeListId: {
                            type: 'string',
                            chance: 'guid'
                        },
                        valueMeasure: {
                            type: 'integer',
                            minimum: 100,
                            maximum: 1000
                        },
                        valueMeasureUnitCode: {
                            type: 'string',
                            chance: 'word'
                        },
                        calculatedValueMeasure: {
                            type: 'integer',
                            minimum: 100,
                            maximum: 1000
                        },
                        valueDateTime: {
                            type: 'string',
                            chance: 'timestamp'
                        },
                        valueIndicator: {
                            type: 'string',
                            chance: 'word'
                        },
                        valueCode: {
                            type: 'string',
                            chance: 'word'
                        },
                        valueText: {
                            type: 'string',
                            chance: 'sentence'
                        },
                        valueQuantity: {
                            type: 'integer',
                            minimum: 100,
                            maximum: 1000
                        },
                        valueQuantityCode: {
                            type: 'string',
                            chance: 'word'
                        },
                        calculatedValueQuantity: {
                            type: 'integer',
                            minimum: 100,
                            maximum: 1000
                        },
                        description: {
                            type: 'string',
                            chance: 'sentence'
                        }
                    },
                    required: ['typeCode', 'typeCodeListId', 'valueMeasure', 'valueMeasureUnitCode', 'calculatedValueMeasure', 'valueDateTime','valueIndicator',
                            'valueCode', 'valueText', 'valueQuantity', 'valueQuantityCode', 'calculatedValueQuantity', 'description']
                }
            }
        },
        required: ['unit', 'weight', 'weightingMeans', 'stockId', 'size', 'tripId', 'usage', 'destinationLocation', 'specifiedFluxLocations']
    };

    var data = jsf(schema);

    data.gears = getGears();

    return data;
}

function getGears(){
	initGears();
	var schema = {
			type: 'array',
			minItems: 1,
			maxItems: 4,
			items: {
				type: 'object',
				properties: {
					type: {
						type: 'string',
						format: 'gearsCode'
					},
					role: {
						type: 'string',
						format: 'gearsRole'
					},
					meshSize: {
                        type: 'string',
                        format: 'meshSize'
                    },
                    lengthWidth: {
                        type: 'string',
                        format: 'beamLength'
                    },
                    numberOfGears: {
                        type: 'integer',
                        minimum: 1,
                        maximum: 5
                    },
                    height: {
                        type: 'integer',
                        minimum: 50,
                        maximum: 300
                    },
                    nrOfLines: {
                        type: 'integer',
                        minimum: 50,
                        maximum: 300
                    },
                    nrOfNets: {
                        type: 'integer',
                        minimum: 1,
                        maximum: 10
                    },
                    nominalLengthOfNet: {
                        type: 'integer',
                        minimum: 100,
                        maximum: 1000
                    },
                    quantity: {
                        type: 'integer',
                        minimum: 1,
                        maximum: 100
                    },
                    description: {
                        type: 'string',
                        chance: 'sentence'
                    }
				},
				required: ['type','role','meshSize','lengthWidth','numberOfGears','height','nrOfLines','nrOfNets','nominalLengthOfNet','quantity','description']
			}
		};
		
		var data = jsf(schema);
		
		return data;
}

function getFaDoc() {
    return {
        type: 'object',
        properties: {
            type: {
                type: 'string',
                format: 'reportType'
            },
            acceptedDate: {
                type: 'string',
                format: 'fakeDateServer'
            },
            id: {
                type: 'string',
                chance: 'guid'
            },
            refId: {
                type: 'string',
                chance: 'guid'
            },
            creationDate: {
                type: 'string',
                format: 'fakeDateServer'
            },
            purposeCode: {
                type: 'string',
                format: 'purposeCode'
            },
            purpose: {
                type: 'string',
                chance: 'sentence'
            },
            relatedReports: {
                type: 'array',
                minItems: 1,
                maxItems: 5,
                items: {
                    type: 'object',
                    properties: {
                        id: {
                            type: 'string',
                            chance: 'guid'
                        },
                        schemeId: {
                            type: 'string',
                            chance: 'bb_pin'
                        },
                    },
                    required: ['id', 'schemeId']
                }
            }
        },
        required: ['type', 'acceptedDate', 'id', 'refId', 'creationDate', 'purposeCode', 'purpose', 'relatedReports']
    }
}

function getArea() {
    return {
        type: 'object',
        properties: {
            occurence: {
                type: 'string',
                format: 'fakeDateServer'
            },
            geometry: {
                type: 'string',
                format: 'wktPoint'
            }
        },
        required: ['occurence', 'geometry']
    };
}

function getLocation(){
	return {
            type: 'array',
            minItems: 2,
            maxItems: 5,
            items: {
                type: 'object',
                properties: {
                    country: {
                        type: 'string',
                        chance: 'country'
                    },
                    rfmoCode: {
                        type: 'string',
                        faker: 'address.county'
                    },
                    geometry: {
                        type: 'string',
                        format: 'wktPoint'
                    },
                    identifier: {
                        type: 'object',
                        properties: {
                            id: {
                                type: 'string',
                                chance: 'guid'
                            },
                            schemeId: {
                                type: 'string',
                                chance: 'bb_pin'
                            }
                        },
                        required: ['id', 'schemeId']
                    },
                    structuredAddress: getStructuredAddress()
                },
                required: ['country', 'rfmoCode', 'geometry', 'structuredAddress']
            }
        };
}

function getFishOperFishingData(){
    initCatchTypes();
    initSpeciesCode();
    initSpecies();
    initGears();

    var schema = {
        type: 'array',
        minItems: 1,
        maxItems: 5,
        items: {
            type: 'object',
            properties: {
                type:{
                    type: 'string',
                    format: 'catchType'
                },
                species: {
                    type: 'string',
                    format: 'fishSpeciesCode'
                },
                calculatedWeight: {
                    type: 'integer',
                    minimum: 25,
                    maximum: 3500
                }
            },
            required: ['type', 'species', 'calculatedWeight']
        }
    };

    var data = jsf(schema);

    for (var i = 0; i < data.length; i++) {
        data[i].lsc = getClassProperties();
        data[i].bms = getClassProperties();
        data[i].locations = getLocationAreas();
    }

    return data;
}



jsf.format('fakeDateServer', function (gen, schema) {
    var random = gen.faker.date.between(gen.faker.date.past(2), gen.faker.date.future(2));
    return moment(random).format('YYYY-MM-DDTHH:mm:ss');
});

jsf.format('fakeDateStandard', function (gen, schema) {
    //FIXME this should be removed and use the standard date format from server
    var random = gen.faker.date.between(gen.faker.date.past(2), gen.faker.date.future(2));
    return moment(random).format('YYYY-MM-DD');
});

jsf.format('fakeWeight', function (gen, schema) {
    return gen.chance.integer({ min: 0, max: 3000 }).toString();
});

jsf.format('fakeWeightAndDiff', function (gen, schema) {
    var signal = ['+', '-'];
    var sigToUse = signal[Math.floor(Math.random() * 2)];
    return gen.chance.integer({ min: 0, max: 3000 }).toString() + '(' + sigToUse + gen.chance.integer({ min: 1, max: 20 }).toString() + ')';
});

jsf.format('fishSpecies', function (gen, schema) {
    var idx = Math.floor(Math.random() * species.length);
    var spToUse = species.splice(idx, 1);
    return spToUse[0];
});

jsf.format('fishSpeciesCode', function (gen, schema) {
    var idx = Math.floor(Math.random() * speciesCodes.length);
    var spToUse = speciesCodes.splice(idx, 1);
    return spToUse[0];
});

jsf.format('gearsCode', function (gen, schema) {
    var idx = Math.floor(Math.random() * gears.length);
    var gear = gears.splice(idx, 1);
    return gear[0];
});

jsf.format('weightMeans', function (gen, schema) {
    var idx = Math.floor(Math.random() * weightMeans.length);
    var weightToUse = weightMeans.splice(idx, 1);
    return weightToUse[0];
});

jsf.format('activityTypeName', function (gen, schema) {
    var idx = Math.floor(Math.random() * activityType.length);
    var activityToUse = activityType.splice(idx, 1);
    return activityToUse[0];
});

jsf.format('catchType', function (gen, schema) {
    var idx = Math.floor(Math.random() * catchTypes.length);
    var type = catchTypes.splice(idx, 1);
    return type[0];
});

jsf.format('presentation', function (gen, schema) {
    var idx = Math.floor(Math.random() * presentation.length);
    var pres = presentation.splice(idx, 1);
    return pres[0];
});

jsf.format('preservation', function (gen, schema) {
    var idx = Math.floor(Math.random() * preservation.length);
    var pres = preservation.splice(idx, 1);
    return pres[0];
});

jsf.format('freshness', function (gen, schema) {
    var idx = Math.floor(Math.random() * freshness.length);
    var fresh = freshness.splice(idx, 1);
    return fresh[0];
});

jsf.format('packaging', function (gen, schema) {
    var idx = Math.floor(Math.random() * packaging.length);
    var pack = packaging.splice(idx, 1);
    return pack[0];
});

jsf.format('gearsRole', function (gen, schema) {
    var roles = ['On board', 'Deployed'];
    return roles[Math.floor(Math.random() * roles.length)];
});

jsf.format('wktPoint', function (gen, schema) {
    return 'POINT(' + gen.chance.longitude() + ' ' + gen.chance.latitude() + ')';
});

jsf.format('wktMultiPoint', function (gen, schema) {
    return 'MULTIPOINT((' + gen.chance.longitude() + ' ' + gen.chance.latitude() + '), (' + gen.chance.longitude() + ' ' + gen.chance.latitude() + '))';
});

jsf.format('meshSize', function (gen, schema) {
    return gen.chance.integer({ min: 50, max: 250 }).toString() + 'mm';
});

jsf.format('beamLength', function (gen, schema) {
    return gen.chance.integer({ min: 1, max: 100 }).toString() + 'm';
});

jsf.format('reportType', function (gen, schema) {
    var types = ['DECLARATION', 'NOTIFICATION'];
    return types[Math.floor(Math.random() * types.length)];
});

jsf.format('gearUsed', function (gen, schema) {
    var types = ['TBB', 'GND', 'SSC', 'GTR', 'LHM'];
    return types[Math.floor(Math.random() * types.length)];
});

jsf.format('fishSpeciesSize', function (gen, schema) {
    var types = ['LSC', 'BMS'];
    return types[Math.floor(Math.random() * types.length)];
});

jsf.format('fishSpeciesPresentatior', function (gen, schema) {
    var types = ['WHL', 'GUT'];
    return types[Math.floor(Math.random() * types.length)];
});

jsf.format('fishSpeciesPreservation', function (gen, schema) {
    var types = ['FRE'];
    return types[Math.floor(Math.random() * types.length)];
});

jsf.format('reason', function (gen, schema) {
    var types = 'LAND';
    return types;
});

jsf.format('purposeCode', function (gen, schema) {
    var types = [1, 3, 5, 9];
    return types[Math.floor(Math.random() * types.length)];
});

jsf.format('gearShotRetrieval', function (gen, schema) {
    var activity = ['GEAR_SHOT', 'GEAR_RETRIEVAL'];
    return activity[Math.floor(Math.random() * activity.length)];
});

jsf.format('gearProblem', function (gen, schema) {
    var problem = ['GEAR_LOSS', 'EMPTY_SET', 'NET_BURST', 'SPLIT', 'BROKEN_MESH', 'FOUND', 'OTHER'];
    return problem[Math.floor(Math.random() * problem.length)];
});

jsf.format('gearRecovery', function (gen, schema) {
    var rec = ['DREG_SWEEP', 'TRAWL_SWEEP', 'OCULAR', 'SONAR', 'POSITION_REPORT', 'OTHER'];
    return rec[Math.floor(Math.random() * rec.length)];
});

jsf.format('vesselIds', function (gen, schema) {
    var vesselIds = ['CFR', 'ICCAT'];
    return vesselIds[Math.floor(Math.random() * vesselIds.length)];
});

jsf.format('vesselRoles', function (gen, schema) {
    var vesselRoles = ['CATCHING_VESSEL', 'PARTICIPATING_VESSEL', 'PAIR_FISHING_PARTNER', 'AUXILIARY', 'DONOR', 'RECEIVER'];
    return vesselRoles[Math.floor(Math.random() * vesselRoles.length)];
});


var activitySchema = function () {
    this.getComChannels = function () {
        var data = {
            code: 'FLUX',
            description: 'FLUX'
        };

        return genSchema.getSimpleSchema([data]);
    };

    this.getTripCatchDetail = function () {
        var schema = {
            type: 'object',
            properties: {
                tripId: {
                    type: 'string',
                    chance: 'guid'
                },
                schemeId: {
                    type: 'string',
                    chance: 'bb_pin'
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
            required: ['tripId', 'schemeId', 'vesselName', 'departure', 'departureAt', 'arrival', 'arrivalAt', 'landing', 'landingAt']
        };
        var data = jsf(schema);
        return genSchema.getSimpleSchema(data);
    }

    this.getTripCatchesLandingDetails = function () {
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
                                        lsc: getFishData(0, 4),
                                        bms: getFishData(0, 2)
                                    },
                                    required: ['lsc', 'bms']
                                },
                                landed: {
                                    type: 'object',
                                    properties: {
                                        lsc: getFishData(0, 4),
                                        bms: getFishData(0, 2)
                                    },
                                    required: ['lsc', 'bms']
                                },
                                difference: {
                                    type: 'object',
                                    properties: {
                                        lsc: getFishData(0, 4, true),
                                        bms: getFishData(0, 2, true)
                                    },
                                    required: ['lsc', 'bms']
                                }
                            },
                            required: ['catches', 'landed', 'difference']
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
                                lsc: getFishData(0, 4),
                                bms: getFishData(0, 2),
                                dis: getFishData(1, 3),
                                dim: getFishData(0, 1)
                            },
                            required: ['lsc', 'bms', 'dis', 'dim']
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
                                    lsc: getFishData(0, 4),
                                    bms: getFishData(0, 2),
                                    dis: getFishData(1, 3),
                                    dim: getFishData(0, 1)
                                },
                                required: ['date', 'area', 'lsc', 'bms', 'dis', 'dim']
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
                                lsc: getFishData(0, 4),
                                bms: getFishData(0, 2),
                                dis: getFishData(1, 3),
                                dim: getFishData(0, 1)
                            },
                            required: ['lsc', 'bms', 'dis', 'dim']
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
                                    lsc: getFishData(0, 4),
                                    bms: getFishData(0, 2),
                                    dis: getFishData(1, 3),
                                    dim: getFishData(0, 1)
                                },
                                required: ['area', 'lsc', 'bms', 'dis', 'dim']
                            }
                        }
                    },
                    required: ['total', 'items']
                }
            },
            required: ['difference', 'catches', 'landing']
        };

        var data = jsf(schema);
        return genSchema.getSimpleSchema(data);
    };

    this.getTripCatchesEvolution = function () {
        initActivityType();
        var schema = {
            type: 'object',
            properties: {
                finalCatch: {
                    type: 'object',
                    properties: {
                        landed: getEvolutionData(),
                        cumulated: getEvolutionData()
                    },
                    required: ['landed', 'cumulated']
                },
                catchProgress: {
                    type: 'array',
                    minItems: 10,
                    maxItems: 10,
                    items: {
                        type: 'object',
                        properties: {
                            onboard: getEvolutionData(),
                            cumulated: getEvolutionData(),
                            activityType: {
                                type: 'string',
                                format: 'activityTypeName'
                            }
                        },
                        required: ['onboard', 'cumulated', 'activityType']
                    }
                },
                tripDetails: {
                    vesselDetails: {
                        name: 'Echo',
                        country: 'SVN',
                        contactParties: [{
                            role: 'MASTER',
                            contactPerson: {
                                alias: 'Master E',
                                firstName: 'Jake',
                                lastName: 'E'
                            },
                            structuredAddress: [{
                                cityName: 'City L',
                                streetName: 'Street K',
                                countryCode: 'SVN'
                            }]
                        }],
                        vesselIds: [{
                            id: 2543,
                            schemeId: "ICCAT"
                        }, {
                            id: 87879,
                            schemeId: "IRCS"
                        }, {
                            id: 74334,
                            schemeId: "EXT_MARK"
                        }, {
                            id: 34434,
                            schemeId: "CFR"
                        }],
                        authorizations: []
                    },
                    trips: [{
                        tripId: [{
                            id: 344,
                            schemeId: "EU_TRIP_ID"
                        }],
                        departureTime: "2017-06-22T07:30:00",
                        arrivalTime: "2017-06-27T22:45:00"
                    }]
                }
            },
            required: ['finalCatch', 'catchProgress','tripDetails']
        };

        var data = jsf(schema);
        data = calculateEvolutionTotals(data);

        return genSchema.getSimpleSchema(data);
    };

    this.getDeparture = function () {
        var fishingData = getFishingData();
        initSpecies();
        initSpeciesCode();
        var schema = {
            type: 'object',
            properties: {
                activityDetails: {
                    type: 'object',
                    properties: {
                        occurence: {
                            type: 'string',
                            format: 'fakeDateServer'
                        },
                        reason: 'Fishing',
                        fisheryType: 'Demersal',
                        targetedSpecies: {
                            type: 'array',
                            minItems: 1,
                            maxItems: 5,
                            items: {
                                type: 'string',
                                format: 'fishSpeciesCode'
                            }
                        },
                        characteristics: {
                            type: 'object',
                            properties: {
                                key1: 'value1',
                                key2: 'value2'
                            },
                            required: ['key1', 'key2']
                        },
                        geometry: {
                            type: 'string',
                            format: 'wktMultiPoint'
                        }
                    },
                    required: ['occurence', 'reason', 'fisheryType', 'targetedSpecies', 'characteristics', 'geometry']
                },
                locations: getLocation(),
                reportDetails: getFaDoc(),
                catches: fishingData
            },
            required: ['activityDetails', 'locations', 'reportDetails', 'catches']
        };
        var data = jsf(schema);
		data.gears = getGears();
		data.processingProducts = getProcessedProducts();
		data.tripDetails = getTripDetails();		

        return genSchema.getSimpleSchema(data);
    }

    this.getFishingOperation = function () {
        initSpecies();

        var schema = {
            type: 'object',
            properties: {
                activityDetails: {
                    type: 'object',
                    properties: {
                        occurence: {
                            type: 'string',
                            format: 'fakeDateServer'
                        },
                        vessel_activity: 'FSH - Fishing',
                        no_operations: {
                            "type": "integer",
                            "minimum": 0,
                            "maximum": 200,
                        },
                        fisheryType: 'Demersal',
                        targetedSpecies: {
                            type: 'array',
                            minItems: 1,
                            maxItems: 5,
                            items: {
                                type: 'string',
                                format: 'fishSpecies'
                            }
                        },
                        fishing_time: {
                            type: 'object',
                            properties: {
                                duration: '10d 11h 20m'
                            },
                            required: ['duration']
                        }
                    },
                    required: ['occurence', 'vessel_activity', 'no_operations', 'fisheryType', 'targetedSpecies', 'fishing_time']
                },
                locations: getLocation(),
                reportDetails: getFaDoc()
            },
            required: ['activityDetails', 'locations', 'reportDetails']
        };
        var data = jsf(schema);

        data.catches = getFishOperFishingData();
        data.gears = getGears();

        return genSchema.getSimpleSchema(data);
    }

    this.getArrivalNotification = function () {
        var arrivalData = getFishingData();
        var schema = {
            type: 'object',
            properties: {
                activityDetails: {
                    type: 'object',
                    properties: {
                        estimatedArrival: {
                            type: 'string',
                            format: 'fakeDateServer'
                        },
                        reason: {
                            type: 'string',
                            format: 'reason'
                        }
                    },
                    required: ['estimatedArrival', 'reason']
                },
                locations: getLocation(),
                reportDetails: getFaDoc(),
                catches: arrivalData
            },
            required: ['activityDetails', 'locations', 'reportDetails', 'catches']
        };
        var data = jsf(schema);

        return genSchema.getSimpleSchema(data);

    }

    this.getArrival = function () {
        initGears();
        var schema = {
            type: 'object',
            properties: {
                activityDetails: {
                    type: 'object',
                    properties: {
                        arrivalTime: {
                            type: 'string',
                            format: 'fakeDateServer'
                        },
                        reason: {
                            type: 'string',
                            format: 'reason'
                        },
                        intendedLandingTime: {
                            type: 'string',
                            format: 'fakeDateServer'
                        }
                    },
                    required: ['arrivalTime', 'reason', 'intendedLandingTime']
                },
                locations: getLocation(),
                reportDetails: getFaDoc()
            },
            required: ['activityDetails', 'locations', 'reportDetails']
        };
        var data = jsf(schema);

        data.gears = getGears();

        return genSchema.getSimpleSchema(data);
    }

    this.getLanding = function () {
        var schema = {
            type: 'object',
            properties: {
                activityDetails: {
                    type: 'object',
                    properties: {
                        occurence: {
                            type: 'string',
                            format: 'fakeDateServer'
                        },
                        landingTime: {
                            type: 'object',
                            properties: {
                                startOfLanding: {
                                    type: 'string',
                                    format: 'fakeDateServer'
                                },
                                endOfLanding: {
                                    type: 'string',
                                    format: 'fakeDateServer'
                                }
                            },
                            required: ['startOfLanding', 'endOfLanding']
                        }

                    },
                    required: ['occurence', 'landingTime']
                },
                locations: getLocation(),
                reportDetails: getFaDoc()
            },
            required: ['activityDetails', 'locations', 'reportDetails']
        };

        var data = jsf(schema);

        data.catches = getFishOperFishingData();

        return genSchema.getSimpleSchema(data);
    }

    this.jointfishingoperation = function () {
        initSpeciesCode();
        initCatchTypes();

        var schema = {
            type: 'object',
            properties: {
                activityDetails: {
                    type: 'object',
                    properties: {
                        occurence: {
                            type: 'string',
                            format: 'fakeDateServer'
                        },
                        landingTime: {
                            type: 'object',
                            properties: {
                                startOfLanding: {
                                    type: 'string',
                                    format: 'fakeDateServer'
                                },
                                endOfLanding: {
                                    type: 'string',
                                    format: 'fakeDateServer'
                                }
                            },
                            required: ['startOfLanding', 'endOfLanding']
                        }

                    },
                    required: ['occurence', 'landingTime']
                },
                locations: {
                    type: 'array',
                    minimum: 1,
                    maximum: 5,
                    items: getLocation()
                },
                reportDetails: getFaDoc(),
                relocation: {
                    type: 'array',
                    minItems: 1,
                    maxItems: 5,
                    items: {
                        type: 'object',
                        properties: {
                            role: {
                                type: 'string',
                                format: 'vesselRoles'
                            },
                            country: {
                                type: 'string',
                                chance: 'country'
                            },
                            vesselIdentifiers: {
                                type: 'array',
                                minItems: 1,
                                maxItems: 1,
                                items: {
                                    type: 'object',
                                    properties: {
                                        id: {
                                            type: 'string',
                                            chance: 'guid'
                                        },
                                        schemeId: {
                                            type: 'string',
                                            format: 'vesselIds'
                                        }
                                    },
                                    required: ['id', 'schemeId']
                                }
                            },
                            name: {
                                type: 'string',
                                chance: 'word'
                            },
                            speciesCode: {
                                type: 'string',
                                format: 'fishSpeciesCode'
                            },
                            type: {
                                type: 'string',
                                format: 'catchType'
                            },
                            weight: {
                                type: 'integer',
                                minimum: 1,
                                maximum: 3000
                            },
                            unit: {
                                type: 'integer',
                                minimum: 10,
                                maximum: 500
                            },
                            characteristics: {
                                type: 'array',
                                minItems: 1,
                                maxItems: 1,
                                items: {
                                    type: 'object',
                                    properties: {
                                        key1: {
                                            type: 'string',
                                            chance: 'word'
                                        },
                                        key2: {
                                            type: 'string',
                                            chance: 'word'
                                        }
                                    },
                                    required: ['key1', 'key2']
                                }
                            }
                        },
                        required: ['role', 'country', 'vesselIdentifiers', 'name', 'speciesCode', 'type', 'weight', 'unit', 'characteristics']
                    }
                }
            },
            required: ['activityDetails', 'locations', 'reportDetails', 'relocation']
        };

        var data = jsf(schema);
        data.gears = getGears();

        for(var i=0;i<data.relocation.length;i++){
            data.relocation[i].vesselIdentifiers.push({
                id: 'IRCS_desc',
                schemeId: 'IRCS'
            })
        }

        return genSchema.getSimpleSchema(data);
    }
    this.getAreaEntry = function () {
        var schema = {
            type: 'object',
            properties: {
                activityDetails: {
                    type: 'object',
                    properties: {
                        occurence: {
                            type: 'string',
                            format: 'fakeDateServer'
                        },
                        landingTime: {
                            type: 'object',
                            properties: {
                                startOfLanding: {
                                    type: 'string',
                                    format: 'fakeDateServer'
                                },
                                endOfLanding: {
                                    type: 'string',
                                    format: 'fakeDateServer'
                                }
                            },
                            required: ['startOfLanding', 'endOfLanding']
                        }

                    },
                    required: ['occurence', 'landingTime']
                },
                areas: {
                    type: 'object',
                    properties: {
                        transmission: getArea(),
                        crossing: getArea(),
                        startActivity: getArea(),
                        startFishing: getArea()
                    },
                    required: ['transmission', 'crossing']
                },
                reportDetails: getFaDoc()
            },
            required: ['activityDetails', 'areas', 'reportDetails']
        };

        var data = jsf(schema);

        return genSchema.getSimpleSchema(data);
    }
    
};

module.exports = activitySchema;
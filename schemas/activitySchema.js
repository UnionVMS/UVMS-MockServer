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
var globSchema = require('./genericSchema.js');
var genSchema = new globSchema();
var moment = require('moment');
var species, speciesCodes, gears, weightMeans, catchTypes;

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

function initCatchTypes() {
    catchTypes = ['ONBOARD', 'KEPT_IN_NET', 'TAKEN_ONBOARD', 'DISCARDED', 'LOADED', 'UNLOADED'];
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
                catchDetails: {
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
                                items: {
                                    type: 'object',
                                    properties: {
                                        name: {
                                            type: 'string',
                                            chance: 'city'
                                        },
                                        geometry: {
                                            type: 'string',
                                            format: 'wktPoint'
                                        }
                                    },
                                    required: ['name', 'geometry']
                                }
                            }
                        },
                        required: ['area', 'productWeight', 'size', 'presentatior', 'preservation', 'gearUsed', 'locations']
                    }
                }
            },
            required: ['species', 'speciesName', 'lsc', 'bms', 'catchType', 'units', 'totalWeight', 'catchDetails']
        }
    };
    var data = jsf(schema);
    
    for(var i=0;i<data.length;i++){
		for(var j=0;j<data[i].catchDetails.length;j++){
            data[i].catchDetails[j].gears = getGears();
        }
	}
    

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
                    items: {
                        type: 'object',
                        properties: {
                            name: {
                                type: 'string',
                                chance: 'city'
                            },
                            geometry: {
                                type: 'string',
                                format: 'wktPoint'
                            }
                        },
                        required: ['name', 'geometry']
                    }
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

function getClassProperties(){
	initCatchTypes();
	initWeights();
	
	schema = {
		type: 'object',
		properties: {
			type: {
				type: 'string',
				format: 'catchType'
			},
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
			weight_mean: {
				type: 'string',
				format: 'weightMeans'
			}
		 },
		 required: ['type','unit','weight','weight_mean']
	};
		
	var data = jsf(schema);
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
					characteristics: {
						type: 'object',
						properties: {
							meshSize: {
								type: 'string',
								format: 'meshSize'
							},
							beamLength: {
								type: 'string',
								format: 'beamLength'
							},
							numBeams: {
								type: 'integer',
								minimum: 1,
								maximum: 5
							}
						},
						required: ['meshSize','beamLength','numBeams']
					}
				},
				required: ['type','role','characteristics']
			}
		};
		
		var data = jsf(schema);
		
		return data;
}

function getFaDoc(){
	return {
		type: 'object',
		properties: {
			type: {
				type: 'string',
				format: 'reportType'
			},
			dateAccepted: {
				type: 'string',
				format: 'fakeDateServer'
			},
			flux_caractheristics: {
				type: 'object',
				properties: {
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
					}
				},
				required: ['id','refId','creationDate','purposeCode','purpose']
			}
		},
		required: ['type','dateAccepted','flux_caractheristics']
	}
}

function getFishOperFishingData(){
    initSpeciesCode();
    initSpecies();
	initWeights();
    initCatchTypes();
    
    var schema = {
        type: 'array',
        minItems: 2,
        maxItems: 5,
        items: {
            type: 'object',
            properties: {
				locations: {
                    type: 'array',
                    minimum: 1,
                    maximum: 1,
                    items: {
                        type: 'object',
                        properties: {
                            name: {
                                type: 'string',
                                chance: 'city'
                            },
                            geometry: {
                                type: 'string',
                                format: 'wktPoint'
                            }
                        },
                        required: ['name','geometry']
                    }
                },
                species: {
                    type: 'string',
                    format: 'fishSpeciesCode'
                },
				speciesName: {
                    type: 'string',
                    format: 'fishSpecies'
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
                    required: ['catchType','units','weightMeans']
                }
            },
            required: ['locations', 'species', 'speciesName', 'details']
        }
    };
	
    var data = jsf(schema);
	
	for(var i=0;i<data.length;i++){
		data[i].gears = getGears();
        data[i].lsc = getClassProperties();
        data[i].bms = getClassProperties();
		data[i].dis = getClassProperties();
		data[i].dim = getClassProperties();
	}
	
    return data;
}



jsf.format('fakeDateServer', function(gen, schema) {
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

jsf.format('catchType', function (gen, schema) {
    var idx = Math.floor(Math.random() * catchTypes.length);
    var type = catchTypes.splice(idx, 1);
    return type[0];
});

jsf.format('gearsRole', function (gen, schema) {
    var roles = ['On board', 'Deployed'];
    return roles[Math.floor(Math.random() * roles.length)];
});

jsf.format('wktPoint', function (gen, schema) {
    return 'POINT(' + gen.chance.longitude() + ' ' + gen.chance.latitude() + ')';
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
                    minItems: 5,
                    maxItems: 10,
                    items: {
                        type: 'object',
                        properties: {
                            onboard: getEvolutionData(),
                            cumulated: getEvolutionData()
                        },
                        required: ['onboard', 'cumulated']
                    }
                }
            },
            required: ['finalCatch', 'catchProgress']
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
                summary: {
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
                        }
                    },
                    required: ['occurence', 'reason', 'fisheryType', 'targetedSpecies']
                },
                port: {
                    type: 'object',
                    properties: {
                        name: {
                            type: 'string',
                            chance: 'city'
                        },
                        geometry: {
                            type: 'string',
                            format: 'wktPoint'
                        }
                    },
                    required: ['name', 'geometry']
                },
                reportDoc: getFaDoc(),
                fishingData: fishingData
            },
            required: ['summary','port','gears','reportDoc','fishingData']
        };
        var data = jsf(schema);
		
		data.gears = getGears();
        
        return genSchema.getSimpleSchema(data);
    }
	
	this.getFishingOperation = function(){
		initSpecies();
		
        var schema = {
            type: 'object',
            properties: {
                summary: {
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
                    required: ['occurence','vessel_activity','no_operations','fisheryType','targetedSpecies','fishing_time']
                },
                port: {
                    type: 'object',
                    properties: {
                        name: {
                            type: 'string',
                            chance: 'city'
                        },
                        geometry: {
                            type: 'string',
                            format: 'wktPoint'
                        }
                    },
                    required: ['name','geometry']
                },
                reportDoc: getFaDoc()
            },
            required: ['summary', 'port', 'gears', 'reportDoc', 'fishingData']
        };
        var data = jsf(schema);

        data.fishingData = getFishOperFishingData();
		data.gears = getGears();

        return genSchema.getSimpleSchema(data);
    }

    this.getArrivalNotification = function () {
        var arrivalData = getFishingData();
        var schema = {
            type: 'object',
            properties: {
                arrival: {
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
                port: {
                    type: 'object',
                    properties: {
                        name: {
                            type: 'string',
                            chance: 'city'
                        },
                        geometry: {
                            type: 'string',
                            format: 'wktPoint'
                        }
                    },
                    required: ['name', 'geometry']
                },
                reportDoc: getFaDoc(),
                arrivalCatchData: arrivalData
            },
            required: ['arrival', 'port', 'reportDoc', 'arrivalCatchData']
        };
        var data = jsf(schema);

        return genSchema.getSimpleSchema(data);

    }

    this.getArrival = function () {
        initGears();
        var schema = {
            type: 'object',
            properties: {
                arrival: {
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
                port: {
                    type: 'object',
                    properties: {
                        name: {
                            type: 'string',
                            chance: 'city'
                        },
                        geometry: {
                            type: 'string',
                            format: 'wktPoint'
                        }
                    },
                    required: ['name', 'geometry']
                },
                gears: {
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
                            beamLength: {
                                type: 'string',
                                format: 'beamLength'
                            },
                            numBeams: {
                                type: 'integer',
                                minimum: 1,
                                maximum: 5
                            }
                        },
                        required: ['type', 'role', 'meshSize', 'beamLength', 'numBeams']
                    }
                },
                reportDoc: getFaDoc()
            },
            required: ['arrival', 'port', 'gears', 'reportDoc']
        };
        var data = jsf(schema);

        return genSchema.getSimpleSchema(data);
    }

    this.getLanding = function () {
        var schema = {
            type: 'object',
            properties: {
                landingSummary: {
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
                    required: ['occurence','landingTime']
                },
                port: {
                    type: 'object',
                    properties: {
                        name: {
                            type: 'string',
                            chance: 'city'
                        },
                        geometry: {
                            type: 'string',
                            format: 'wktPoint'
                        }
                    },
                    required: ['name', 'geometry']
                },
                reportDoc: getFaDoc()
            },
            required: ['landingSummary', 'port', 'reportDoc']
        };
		
        var data = jsf(schema);

        data.landingCatchData = getCatchLandingData();

        return genSchema.getSimpleSchema(data);
    }
};

module.exports = activitySchema;
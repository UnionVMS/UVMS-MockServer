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
var globSchema = require('./genericSchema.js');
var genSchema = new globSchema();

var mdrSchema = function(){
    this.getPurposeCodes = function(){
        var codeList = [{
            code: '1', description: 'Cancellation'
        },{
            code: '3', description: 'Delete'
        },{
            code: '5', description: 'Replacement (correction)'
        },{
            code: '9', description: 'Original report'
        }];  
        
        return genSchema.getPaginationSchema(codeList);
    };
    
    this.getReportTypes = function(){
        var codeList = [{
            code: 'NOTIFICATION', description: 'Notification'
        },{
            code: 'DECLARATION', description: 'Declaration'
        }];
        
        return genSchema.getPaginationSchema(codeList);
    };
    
    this.getGearTypes = function(){
        var codeList = [{
            code: 'PS', description: 'With purse lines (purse seines)'
        },{
            code: 'PS1', description: 'one boat operated purse seines'
        },{
            code: 'PS2', description: 'two boats operated purse seines'
        },{
            code: 'LA', description: 'Without purse lines (lampara)'
        },{
            code: 'SV', description: 'Boat or vessel seines'
        },{
            code: 'SDN', description: 'Danish seines'
        },{
            code: 'SSC', description: 'Scottish seines'
        },{
            code: 'SPR', description: 'pair seines'
        },{
            code: 'SX', description: 'Seine nets (not specified)'
        },{
            code: 'TBB', description: 'beam trawls'
        },{
            code: 'OTB', description: 'otter trawls'
        },{
            code: 'PTB', description: 'pair trawls'
        },{
            code: 'TBN', description: 'nephrops trawls'
        },{
            code: 'TBS', description: 'shrimp trawls'
        },{
            code: 'TB', description: 'bottom trawls (not specified)'
        },{
            code: 'OTM', description: 'otter trawls'
        },{
            code: 'PTM', description: 'pair trawls'
        },{
            code: 'OTT', description: 'Otter twin trawls'
        },{
            code: 'DRB', description: 'Boat dredges'
        },{
            code: 'GNS', description: 'Set gillnets (anchored)'
        },{
            code: 'GND', description: 'Driftnets'
        },{
            code: 'GNC', description: 'Encircling gillnets'
        },{
            code: 'GTR', description: 'Trammel nets'
        },{
            code: 'GTN', description: 'Combined gillnets-trammel nets'
        },{
            code: 'GN', description: 'Gillnets (not specified)'
        },{
            code: 'FPO', description: 'Pots'
        },{
            code: 'FIX', description: 'Traps (not specified)'
        },{
            code: 'LHP', description: 'Handlines and pole-lines (hand-operated)'
        },{
            code: 'LHM', description: 'Handlines and pole-lines (mechanized)'
        },{
            code: 'LLS', description: 'Set longlines'
        },{
            code: 'LLD', description: 'Drifting longlines'
        },{
            code: 'LL', description: 'Longlines (not specified)'
        },{
            code: 'LTL', description: 'Trolling lines'
        },{
            code: 'LX', description: 'Hooks and lines (not specified)'
        },{
            code: 'HMD', description: 'Mechanized dredges'
        },{
            code: 'MIS', description: 'MISCELLANEOUS GEAR'
        },{
            code: 'RG', description: 'RECREATIONAL FISHING GEAR'
        },{
            code: 'NK', description: 'GEAR NOT KNOW OR NOT SPECIFIED '
        }];
        
        return genSchema.getPaginationSchema(codeList);
    };
    
    this.getActivityTypes = function(){
        var codeList = [{
            code: 'DEPARTURE', description: 'Departure from a location'
        },{
            code: 'ARRIVAL', description: 'Arrival in a location'
        },{
            code: 'AREA_ENTRY', description: 'Entry into an area'
        },{
            code: 'AREA_EXIT', description: 'Exit from an area'
        },{
            code: 'FISHING_OPERATION', description: 'Activity in connection with searching for fish, the shooting, towing and hauling of active gears, setting, soaking, removing or resetting of passive gears and the removal of any catch from the gear, keep nets, or from a transport cage to fattening and farming cages'
        },{
            code: 'LANDING', description: 'The unloading of catches or part thereof in a port or landing place on land'
        },{
            code: 'DISCARD', description: 'The unloading of catches or part thereof while at sea'
        },{
            code: 'TRANSHIPMENT', description: 'The unloading of catches or part thereof from onboard the vessel to another vessel or the loading of catches on board from another vessel'
        },{
            code: 'RELOCATION', description: 'Operation where the catch or part thereof is transferred or moved from shared fishing gear to a vessel or from a vessel’s hold or its fishing gear to a keep net, container or cage outside the vessel in which the live catch is kept until landing'
        },{
            code: 'GEAR_SHOT', description: 'Setting the gear, deploying'
        },{
            code: 'GEAR_RETRIEVAL', description: 'Retrieving the gear'
        },{
            code: 'START_FISHING', description: 'The starting of a fishing operation'
        },{
            code: 'JOINED_FISHING_OPERATION', description: 'A fishing operation with more than one vessel involved'
        }];
        
        return genSchema.getPaginationSchema(codeList);
    };
    
    this.getWeightMeans = function(){
        var codeList = [{
            code: 'ONBOARD', description: 'Onboard weighing system'
        },{
            code: 'WEIGHED', description: 'Weighed'
        },{
            code: 'ESTIMATED', description: 'Estimated live weight'
        },{
            code: 'COUNTED', description: 'Counted number of units'
        },{
            code: 'SAMPLING', description: 'Estimated live weight based on sampling'
        },{
            code: 'STEREOSCOPIC', description: 'Weight estimations based on stereoscopic devices'
        }];
        
        return genSchema.getPaginationSchema(codeList);
    };
    
    this.getCatchTypes = function(){
        var codeList = [{
            code: 'ONBOARD', description: 'Catch on board at the time of the activity'
        },{
            code: 'KEPT_IN_NET', description: 'Catch kept in the net at the time of the activity'
        },{
            code: 'TAKEN_ONBOARD', description: 'Catch taken on board during the fishing activity'
        },{
            code: 'RELEASED', description: 'Catch or marine animals released during the activity (catch is released if the net was never closed beyond the point of retrieval as defined in the regional discard plans)'
        },{
            code: 'DISCARDED', description: 'Catch discarded during the activity (catch was on board)'
        },{
            code: 'DEMINIMIS', description: 'Discarded catch to which specifically de minimis exemptions apply'
        },{
            code: 'UNLOADED', description: 'Catches unloaded (for declarations) or to be unloaded (for notifications) from the vessel or its gear during the operation (eg. landing, transhipment, relocation, discard at sea)'
        },{
            code: 'LOADED', description: 'Catches loaded (for declarations) or to be loaded (for notifications) onto the vessel during the operation (eg. transhipments, relocation).'
        },{
            code: 'BY_CATCH', description: 'Incidental catches of aquatic animals'
        },{
            code: 'ALLOCATED_TO_QUOTA', description: 'Catch allocated to quota'
        },{
            code: 'SAMPLE', description: 'Catch taken as a sample to estimate the catch composition'
        }];
        
        return genSchema.getPaginationSchema(codeList);
    };
};

module.exports = mdrSchema;
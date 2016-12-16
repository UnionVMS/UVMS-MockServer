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
    }
};

module.exports = mdrSchema;
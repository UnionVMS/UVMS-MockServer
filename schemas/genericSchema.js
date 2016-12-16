var genericSchema = function(){
    this.getPaginationSchema = function (list){
        var schema =  {
            code: '200',
            totalItemsCount: list.length,
            resultList: list
        }
        
        return schema;
    };
    
    this.getSimpleSchema = function(data){
        var schema = {
            code: '200',
            data: data
        };
        
        return schema;
    };
};

module.exports = genericSchema;
var mysql=require('mysql');
var Logger = require('../log/logger');
var logger = new Logger();

module.exports=SqlHelper;

function SqlHelper(dbConnection){
    //this.connection=mysql.createConnection(dbConnection);
    this.pool=mysql.createPool(dbConnection);
}
var data = {
    result:"",
    error:""
}
SqlHelper.prototype.query=function(sqlText,callBack){
    this.pool.getConnection(function(err,connection){
        if(err){
            console.log(err);
            logger.error("连接数据库失败, sql语句:"+sqlText+"\n ERROR:"+err);
        }
        function query(){
            connection.query(sqlText,function(err,result){
                if(err){
                    data.error = err;
                }
                data.result = result;
                if(data.error.length !== 0){
                    logger.error("连接数据库失败, sql语句:"+sqlText+"\n ERROR:"+JSON.stringify(data));
                }else{
                    logger.info("连接数据库成功, sql语句:"+sqlText);
                }
                
                callBack(data);
                connection.release();
            });
        },
        query();
        setInterval(query, 5000);
        
    });
}



var log4js=require('log4js');
var fs = require('fs');

if(!fs.existsSync('/var/log/greenlord-server')){
        fs.mkdirSync('/var/log/greenlord-server');
    }
log4js.configure({
    appenders:[
            {
		      "type": "dateFile",
		      "filename": "/var/log/greenlord-server/greenlord-server.log",
		      "pattern": "-yyyy-MM-dd",
		      "alwaysIncludePattern": true
		    }
    ]
})

module.exports=LogHelper;

function LogHelper(){
    this.errorLogger=log4js.getLogger('greenlord-server');
    this.errorLogger.setLevel('ERROR');
    this.infoLogger=log4js.getLogger('greenlord-server');
    this.infoLogger.setLevel('INFO');
}

LogHelper.prototype.error=function(error){
    this.errorLogger.error(error);
}

LogHelper.prototype.info=function(info){
    this.infoLogger.info(info);
}

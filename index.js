var https = require('https');
var fs = require('fs');
var DataManager = require('./db/dataManager/DataManager');
var datamanager = new DataManager();
var zlib = require('zlib');
var queryString = require('querystring');
var url = require("url");
var async = require('async');
var path = require('path');
var Logger = require('./log/logger');

var logger = new Logger();

var options = {
	key: fs.readFileSync('./cert/privatekey.pem'),
	cert: fs.readFileSync('./cert/certificate.pem')
};

https.createServer(options,function(req,res){
	//console.log(req);
	var clientIp = getClientIp(req);
	//console.log(clientIp);

	var headers = req.headers;
	var queryData = headers['query-data'];
	//console.log(headers['query-data']);
	var finalData = queryString.parse(queryData);

	var os = finalData.os.toLowerCase();
	var filename = finalData.filename;
	filename = path.basename("/etc/issue");
	//console.log(filename);
	// console.log(queryString.parse(queryData)['md5']);
	datamanager.Exists(os,filename,function(data){
		console.log("Index:");
		console.log(data);
		// status 404 file not found
		// status 200 file found
		if(data === 1){
			async.parallel([
				//
				function(cb){
					datamanager.GetFileText(os,filename,function(content){
						if(content.error.length !== 0){
							cb(content.error,null);
						}else{
							//console.log(content.result[0].File);
							cb(null,content.result[0].File);
							//cb(null,content.result[0]);
						}
					})
				},
				
				function(cb){
					datamanager.GetFilePath(os,filename,function(content){
						if(content.error.length !== 0){
							cb(content.error,null);
						}else{
							cb(null,content.result[0].Filepath);
						}
						
					})
				}
				
				],function(err,results){
					if(err !== undefined){
						logger.error(err);
						throw err;
					}else{
						//将文件内容进行压缩
						if((headers['accept-encoding'] || '').indexOf('gzip') !== -1){
							zlib.gzip(results[0],function(err,zipdata){
								res.writeHead(200,{"Content-Type":"text/data",
													"Content-path": results[1],
													"Content-Status":200,
													"content-encoding":"gzip"});
								res.write(zipdata);
								logger.info(clientIp+":请求网络");
								res.end();
							})
						}
					}
			})
			// datamanager.GetFileText(os,filename,function(content){

			// 	
				
			// })
		}else if(data == -1){
			console.log("服务器中没有相应操作系统的数据");
			logger.error(clientIp+":请求网络,服务器中没有相应操作系统的数据");
			res.writeHead(200,{"Content-Type":"text/data","Content-Status":404});
			res.end();
		}else if(data == 0){
			console.log("没有找到匹配的文件");
			logger.error(clientIp+":请求网络,服务器中没有找到匹配的文件");
			res.writeHead(200,{"Content-Type":"text/data","Content-Status":404});
			res.end();
		}else{
			console.log("未知错误");
			logger.error(clientIp+":未知错误");
			res.writeHead(200,{"Content-Type":"text/data","Content-Status":data});
			res.end();
		}
	})
	
}).listen(8000);


function getClientIp(req) {
        return req.headers['x-forwarded-for'] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress;
    };
console.log("https start on port 8000");

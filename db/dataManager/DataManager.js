var BackupManager = require('./backupManager');
var dbConfig=require('../../config/dbConfig');
var SqlHelper=require('../../db/sqlHelper');
var async = require('async');
var fs = require('fs');

var sqlHelper=new SqlHelper(dbConfig.local);

var backupManager = new BackupManager(sqlHelper);

var DataManager = function(){
	this.Exists = Exists;
}

function Exists(ostype,filename,callback){
	backupManager.exists(ostype,filename,function(data){
		// console.log("exists:");
		// console.log(data.result.length);
		var status;
		// -1 means no such table
		// 0 means no such file
		// 1 means ok
		// 2 means something is wrong
		if(data.length === 0){
			status = 3;
		}else{
			if(data.error.code == "ER_NO_SUCH_TABLE"){
				status = -1;
			}else if(data.error.length == 0 && data.result.length === 0){
				status = 0;
			}else if(data.error.length == 0 && data.result.length !== 0){
				status = 1;
			}else{
				status = 2;
			}
		}
		callback(status);
	});
}

DataManager.prototype.Upload = function(data,callback){
	var stat = fs.statSync(data.filepath);
	var result = {
					detail:"",
					code:0 //默认为0,-1表示有错误，
						   //1表示表原来不存在，新建了并导入了数据
						   //2表示表存在，没有相同名称的数据文件，新建数据并导入
						   //3表示表存在，有相同名称的数据文件，更新数据并导入
				 }
	data.filesize = stat.size;
	if(!fs.existsSync(data.filepath)){
		result.detail = "路径不存在";
		result.code = -1;
		callback(result);
	}else{
		var content = fs.readFileSync(data.filepath,"utf-8");
		var size = fs.statSync(data.filepath).size;
		content = content.replace(/"/g,"@0@");
		content = content.replace(/'/g,"@1@");
		content = content.replace(/`/g,"@2@");
		data.filetext = content;
		data.filesize = size;
		
		Exists(data.ostype,data.filename,function(status){
			if(status === 1){
				backupManager.update(data,function(data3){
					result.detail = JSON.stringify(data3);
					result.code = 3;
					callback(result);
				})
			}else if(status === 0){
				backupManager.upload(data,function(data2){
					result.detail = JSON.stringify(data2);
					result.code = 2;
					callback(result);
				})
			}else if(status === -1){
				backupManager.createtable(data.ostype,function(data0){
					console.log("create:");
					//console.log(data0);
				});
				backupManager.upload(data,function(data1){
					result.detail = JSON.stringify(data1);
					result.code = 1;
					callback(result);
				})
			}
		})
		/*
		backupManager.check(data,function(subdata){
			if(subdata.length == 0){
				//console.log(data.length);
				backupManager.upload(data,function(data2){
					result.detail = JSON.stringify(data2);
					result.code = 2;
					callback(result);
				})
			}else{
				//console.log(data.length);
				backupManager.update(data,function(data3){
					result.detail = JSON.stringify(data3);
					result.code = 3;
					callback(result);
				})
			}
			//subdata = subdata.result;
			console.log(subdata);
			//var error = subdata.error;
			//console.log("subdata:============>"+subdata.result);
			// if(error !== undefined){
			// 	if(error.code == "ER_NO_SUCH_TABLE"){
			// 		console.log("create");
			// 		var ostype = data.ostype.toLowerCase();
			// 		backupManager.createtable(ostype,function(data0){
			// 			console.log("create:");
			// 			console.log(data0);
			// 		});
			// 		backupManager.upload(data,function(data1){
			// 			result.detail = JSON.stringify(data1);
			// 			result.code = 1;
			// 			callback(result);
			// 		})
			// 	}
			// }else{

			// }
			

		});*/
	}
}

DataManager.prototype.UploadMultiple = function(datalist,callback){
	async.map(datalist,this.Upload,function(err,results){
		callback(results);
	})
}

DataManager.prototype.GetAllData = function(ostype,callback){
	backupManager.getAllData(ostype,function(data){
		callback(data);
	});
}


DataManager.prototype.GetFilePath = function(ostype,filename,callback){
	backupManager.getFilepath(ostype,filename,function(data){
		callback(data);
	});
}

DataManager.prototype.GetFileSize = function(ostype,filename,callback){
	backupManager.getFilesize(ostype,filename,function(data){
		callback(data[0].Filesize);
	});
}


DataManager.prototype.GetFileText = function(ostype,filename,callback){
	backupManager.getFiletext(ostype,filename,function(data){
		console.log(data);
		// var filetext = data.result[0].File.toString();
		// filetext = filetext.replace(/@0@/g,"\"");
		// filetext = filetext.toString().replace(/@1@/g,"'");
		// filetext = filetext.toString().replace(/@2@/g,"`");
		// data.result[0].File = filetext;
		callback(data);
	});
}


module.exports = DataManager;

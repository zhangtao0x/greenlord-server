var DataManager = require('../DataManager');
var fs = require('fs');
var zlib = require('zlib');

var datamanager = new DataManager();
var data = {
	filename:"inetd.conf",
	filepath:"/etc/inetd.conf",
	filesize:0,
	filetext:"",
	filemd5:"",
	ostype:"cdos"
}

datamanager.Upload(data,function(result){
	console.log(result);
})
// datamanager.Exists("cdos","aaa",function(result){
// 	//console.log(result);
// })
// console.log(data.filetext);
// datamanager.Upload(data,function(result){
// 	console.log(result);
// })
var datalist = [
	{
		filename:"issue",
		filepath:"/etc/issue",
		filesize:0,
		filetext:"",
		filemd5:"",
		ostype:"cdos"
	},
	{
		filename:"motd",
		filepath:"/etc/motd",
		filesize:0,
		filetext:"",
		filemd5:"",
		ostype:"cdos"
	},
	{
		filename:"issue.net",
		filepath:"/etc/issue.net",
		filesize:0,
		filetext:"",
		filemd5:"",
		ostype:"cdos"
	}
]

datamanager.UploadMultiple(datalist,function(result){
	console.log(result);
})
// datamanager.GetAllData("cdos",function(data){
// 	console.log(data);
// })

// datamanager.GetFileSize("cdos","syslog",function(data){
// 	console.log(data);
// })

// datamanager.GetFilePath("cdos","syslog-ng",function(data){
// 	console.log(data);
// })

// datamanager.GetFileText("cdos","syslog-ng.conf",function(data){
// 	console.log(data);
// })

// var string = "@1@ @0@ @3@ @1@,222222222222222222222222222";
// string = string.replace(/@1@/g,"'");
// console.log(string);

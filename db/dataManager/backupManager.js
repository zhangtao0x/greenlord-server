/**
 * Created by liutuo on 14-9-16.
 */
var SqlHelper=require('../sqlHelper');
// var DateTime=require('../../Utility/dateTime');
// var dateTime=new DateTime();

module.exports=BackupManager;

function BackupManager(helper){
    this.sqlHelper=helper;
}


BackupManager.prototype.createtable=function(ostype,callback){
    var sqlText = "create table greenlord_repair.@ostype(\n"+
                    "Id int(4) NOT NULL PRIMARY KEY AUTO_INCREMENT,\n"+
                    "Filename varchar(128) NOT NULL UNIQUE,\n"+
                    "Filepath varchar(255) NOT NULL,\n"+
                    "Filesize int NOT NULL,\n"+
                    "File mediumtext Not NULL,\n"+
                    "Filemd5 varchar(255) NOT NULL,\n"+
                    "Ostype varchar(128) NOT NULL,\n"+
                    "Date DATETIME NOT NULL\n"+
                    ");";
    sqlText = sqlText.replace('@ostype',ostype);
    this.sqlHelper.query(sqlText,callback);
}


BackupManager.prototype.exists=function(ostype,filename,callback){
    var findText = "select * from greenlord_repair.@ostype where Filename='@filename'";
    findText = findText.replace('@ostype',ostype);
    findText = findText.replace('@filename',filename);
    this.sqlHelper.query(findText,callback);
    // var sqlText="insert into greenlord_repair.@table values(\"\",\""+ filename+"\",\""+filepath+"\",\""+filesize+"\",\""+filetext+"\",\""+filemd5+"\",\""+Ostype+"\",now())";
    // console.log(sqlText);
    // this.sqlHelper.query(sqlText,callback);
}

// BackupManager.prototype.check=function(data,callback){
//     var findText = "select * from greenlord_repair.@ostype where Filename=@filename";
//     findText = findText.replace('@ostype',data.ostype);
//     findText = findText.replace('@filename',data.filename);
//     this.sqlHelper.query(findText,callback);
//     // var sqlText="insert into greenlord_repair.@table values(\"\",\""+ filename+"\",\""+filepath+"\",\""+filesize+"\",\""+filetext+"\",\""+filemd5+"\",\""+Ostype+"\",now())";
//     // console.log(sqlText);
//     // this.sqlHelper.query(sqlText,callback);
// }

BackupManager.prototype.upload=function(data,callback){
    var sqlText="insert into greenlord_repair.@ostype values(\"\",\""+ data.filename+"\",\""+data.filepath+"\",\""+data.filesize+"\",\""+data.filetext+"\",\""+data.filemd5+"\",\""+data.ostype+"\",now())";
   // console.log(sqlText);
    sqlText = sqlText.replace('@ostype',data.ostype.toLowerCase());
    this.sqlHelper.query(sqlText,callback);
}

BackupManager.prototype.update= function(data,callback){
    var sqlText="update greenlord_repair.@ostype set Filepath='@filepath',Filesize=@filesize,File='@filetext',Filemd5='@filemd5',Ostype='@ostype',Date=now() where Filename='@filename'";
    sqlText = sqlText.replace('@filename',data.filename);
    sqlText = sqlText.replace('@filepath',data.filepath);
    sqlText = sqlText.replace('@filesize',data.filesize);
    sqlText = sqlText.replace('@filetext',data.filetext);
    sqlText = sqlText.replace('@filemd5',data.filemd5);
    sqlText = sqlText.replace(/@ostype/g,data.ostype.toLowerCase());
    //console.log(sqlText);
    this.sqlHelper.query(sqlText,callback);
}

BackupManager.prototype.getAllData=function(ostype,callback){
    var sqlText='select * from greenlord_repair.@ostype';
    sqlText = sqlText.replace('@ostype',ostype.toLowerCase());
    this.sqlHelper.query(sqlText,callback);
}

BackupManager.prototype.getFilepath=function(ostype,filename,callback){
    var sqlText='select Filepath from greenlord_repair.@ostype where Filename="@filename" AND Ostype="@ostype"';
    sqlText = sqlText.replace('@filename',filename);
    sqlText = sqlText.replace(/@ostype/g,ostype.toLowerCase());
    this.sqlHelper.query(sqlText,callback);
}


BackupManager.prototype.getFilesize=function(ostype,filename,callback){
    var sqlText='select Filesize from greenlord_repair.@ostype where Filename="@filename"';
    sqlText = sqlText.replace('@filename',filename);
    sqlText = sqlText.replace('@ostype',ostype.toLowerCase());
    this.sqlHelper.query(sqlText,callback);
}

BackupManager.prototype.getFiletext = function(ostype,filename,callback){
    var sqlText='select File from greenlord_repair.@ostype where Filename="@filename"';
    sqlText = sqlText.replace('@filename',filename);
    sqlText = sqlText.replace('@ostype',ostype.toLowerCase());
    this.sqlHelper.query(sqlText,callback);
}

BackupManager.prototype.getFilemd5=function(ostype,filename,callback){
    var sqlText='select Filemd5 from manage.greenlord_repair where Filename="@filename"';
    sqlText = sqlText.replace('@filename',filename);
    sqlText = sqlText.replace('@ostype',ostype.toLowerCase());
    this.sqlHelper.query(sqlText,callback);
}


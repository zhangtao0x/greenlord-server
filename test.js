var https = require( 'https' ); 
var fs = require('fs');
var zlib = require('zlib');
var queryString = require('querystring');

var queryData = queryString.stringify({
        'filename':"syslog",
        'os':"cdos",
        'md5':""
});

var  options = { 
    hostname:  '172.29.10.108' , 
    port: 8000, 
    path:  '/' , 
    method:  'GET' , 
    rejectUnauthorized: false,
    headers:{
          'Accept-Encoding': 'gzip, deflate',
          'Query-Data':queryData
    }  
}; 

var  req = https.request(options,  function (res) { 
    var body = [];
    var filepath = res.headers['content-path'];
    //console.log(filepath);
    res.on('data', function (chunk) {
        body.push(chunk);
    });

    res.on('end', function () {
        body = Buffer.concat(body);
        //console.log(body.toString());
        if (res.headers['content-encoding'] == 'gzip') {
            zlib.gunzip(body, function (err, data) {
                if(fs.existsSync(filepath)){
                    fs.renameSync(filepath,filepath+".backup");
                    fs.writeFile(filepath,data.toString(),"utf-8",function(error){
                        if(error){
                            console.log(error);
                        }else{
                            console.log("complete");
                        }
                    });
                }else{

                }
            });
        }else {
            //console.log(body.toString());
        }
    });
}); 
req.end(); 

req.on( 'error' ,  function (e) { 
    console.error(e); 
}); 


    
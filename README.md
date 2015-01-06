greenlord-server
================

Greenlord服务端
将数据存储在mysql的数据库中，在服务端建立https服务器，客户端发送https请求，根据请求头的数据访问mysql服务器，取出相应值，压缩后发送回客户端，客户端解压并写入文件。

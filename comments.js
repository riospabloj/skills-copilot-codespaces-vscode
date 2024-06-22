// Create web server
var http = require('http');
var fs = require('fs');
var path = require('path');
var mime = require('mime');
var comments = [];
var server = http.createServer(function (request, response) {
    var url = request.url;
    if (url === '/') {
        fs.readFile('./index.html', function (err, data) {
            if (err) {
                response.writeHead(404, {
                    'Content-Type': 'text/plain'
                });
                response.end('Not Found');
            } else {
                response.writeHead(200, {
                    'Content-Type': 'text/html'
                });
                response.end(data);
            }
        });
    } else if (url === '/comments') {
        response.writeHead(200, {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        });
        response.end(JSON.stringify(comments));
    } else if (url === '/post') {
        var str = '';
        request.on('data', function (data) {
            str += data;
        });
        request.on('end', function () {
            var comment = JSON.parse(str);
            comments.push(comment);
            response.end(JSON.stringify(comment));
        });
    } else {
        fs.readFile('.' + url, function (err, data) {
            if (err) {
                response.writeHead(404, {
                    'Content-Type': 'text/plain'
                });
                response.end('Not Found');
            } else {
                response.writeHead(200, {
                    'Content-Type': mime.lookup(url)
                });
                response.end(data);
            }
        });
    }
});
server.listen(3000);
console.log('Server is running at http://localhost:3000');

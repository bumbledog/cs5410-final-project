var express = require('express'),
    http = require('http'),
    path = require('path'),
    scores = require('.public/routes/scores'),
    app = express();


app.set('port', process.env.PORT || 3000);

app.use(express.static(path.join(__dirname, 'public')));
app.use('/scripts', express.static(__dirname + '/scripts'));

app.get('/', function(request, response){
    response.render('index.html')
});

app.get('/v1/scores', scores.all);
app.post('/v1/scores', scores.add);

app.all('/v1/*', function(request, response){
    response.writeHead(501);
    response.end();
})

http.createServer(returnScore).listen(app.get('port'), function() {
    console.log('listening on port ' + app.get('port'));
})
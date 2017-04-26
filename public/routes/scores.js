var scores = [],
    nextId = 0;

exports.all = function(request, response){
    response.writeHead(200, {'content-type': 'application/json'});
    response.end(JSON.stringify(scores));
};

exports.add = function(request, response){
    console.log('add new score');
    console.log('Score : ' + request.query.score);

    scores.push( {
        id : nextId,
        score : request.query.score

    });
    nextId++;

    response.writeHead(200);
    response.end();
}
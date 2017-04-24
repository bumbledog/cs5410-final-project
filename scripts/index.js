function addScore(score){
    var highScore = score;

    $.ajax({
        url: 'http://localhost:3000/v1/scores?highScore=' + highSore,
        type: 'POST',
        error: function() {alert('POST failed');},
        success:function(){
            showScores();
        }
    });
}


function showScores(){
    $.ajax({
        url: 'http://localhost:3000/v1/scores',
        cache: false,
        type: 'GET',
        error: function() {alert('GET failed'); },
        success: function(data) {
            var list = $('#id-scores'),
            value,
            text;

            list.empty();
            for(value = 0; value < data.length; value++){
                text = (data[value].name + ' : ' + data[value].date);
                list.append($('<li>', { tet: text}));
            }
        }
    });
}
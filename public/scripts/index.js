function addScore(newScore){
    var score = newScore;

    $.ajax({
        url: 'http://localhost:3000/v1/scores?score=' + score,
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
            var list = $("#id-scores"),
            value,
            scoreValue;

            list.empty();
            for(value = 0; value < data.length; value++){
                scoreValue = (data[value].score);
                list.append($('<li>', { scoreValue : scoreValue}));
            }
        }
    });
}
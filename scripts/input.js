var input = (function(){
    function Keyboard(){
        var that = {
                keys : {},
                handlers : []
            },
            key;

        function keyPress(e){
            that.keys[e.keyCode] = e.timeStamp;
        }

        function keyRelease(e){
            delete that.keys[e.keyCode];
        }

        that.registerCommand = function(key, handler){
            that.handlers.push({key: key, handler:handler});
        };

        that.update = function(elapsedTime){
            for(key = 0; key < that.handlers.length; key++){
                if(typeof that.keys[that.handlers[key].key] !== 'undefined'){
                    that.handlers[key].handler(elapsedTime);
                }
            }
        };

        window.addEventListener('keydown', keyPress);
        window.addEventListener('keyup', keyRelease);

        return that;
    }
    return {
        Keyboard : Keyboard,
    };
});

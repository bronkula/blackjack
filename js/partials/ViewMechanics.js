define(function(){

    VM = {};

    VM.writeMsg = function(msg) {
        $(".db-message").html(msg);
    };
    VM.addMsg = function(msg) {
        $(".db-message").append(msg);
    };

    return VM;
});
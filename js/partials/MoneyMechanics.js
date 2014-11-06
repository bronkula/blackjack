define(['GameValues','GameMechanics'],function(GV,GM){

    var MM = {};

    MM.changeMoney = function(type) {
        if(type==0){
            GM.player().money -= GM.player().currentbet;
        }
        if(type==1){
            GM.player().money += GM.player().currentbet;
        }
        if(type==2){
            GM.player().money += Math.ceil(GM.player().currentbet * 1.5);
        }
    };

    MM.makeMoney = function(){
        GM.player().money = 100;
        GM.player().currentbet = 10;
        GM.player().basebet = 10;
    };
    MM.resetBet = function() {
        GM.player().currentbet = GM.player().basebet;
    };

    MM.doubleDown = function(){
        GM.player().currentbet *= 2;
    }
    MM.drawMoney = function(){
        $(".db-money .db-value").html(GM.player().money);
        $(".db-bet .db-value").html(GM.player().currentbet);
    };

    return MM;
});
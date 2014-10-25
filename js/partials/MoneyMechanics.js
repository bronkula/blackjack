define(['GameValues','GameMechanics'],function(GV,GM){

    var MM = {};

    MM.changeMoney = function(type) {
        if(type==0){
            GM.player().money -= GM.player().bet;
        }
        if(type==1){
            GM.player().money += GM.player().bet;
        }
        if(type==2){
            GM.player().money += Math.ceil(GM.player().bet * 1.5);
        }
    };

    MM.makeMoney = function(){
        GM.player().money = 100;
        GM.player().bet = 10;
    };
    MM.resetBet = function() {
        GM.player().bet = 10;
    };

    MM.doubleDown = function(){
        GM.player().bet *= 2;
    }
    MM.drawMoney = function(){
        $(".db-money .db-value").html(GM.player().money);
        $(".db-bet .db-value").html(GM.player().bet);
    };

    return MM;
});
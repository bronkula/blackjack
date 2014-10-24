define(function(){
// DATABASE
    // Random important heights lengths widths shits
    BJ = {};
    BJ.stackModulo = 5;
    BJ.cardFontSize = 30;
    BJ.cardWidth = BJ.cardFontSize*1.6666;
    BJ.cardHeight = BJ.cardFontSize*2.3333;

    BJ.rowGap = 30;
    BJ.cardGap = 5;

    BJ.deckTop = BJ.rowGap;
    BJ.deckLeft = BJ.rowGap;

    BJ.dealerTop = BJ.deckTop + BJ.cardHeight + BJ.rowGap;
    BJ.dealerLeft = BJ.deckLeft/2;

    BJ.playerTop = BJ.dealerTop + BJ.cardHeight + BJ.rowGap;
    BJ.playerLeft = BJ.deckLeft/2;

    BJ.discardTop = BJ.playerTop + BJ.cardHeight + BJ.rowGap;
    BJ.discardLeft = 0;



    BJ.playerMoney = 100;
    BJ.playerBet = 10;



    BJ.deck = function(){
        return BJ.stacks[0];
    }
    BJ.dealer = function(){
        return BJ.stacks[1];
    }
    BJ.player = function(){
        return BJ.stacks[2];
    }
    BJ.discard = function(){
        return BJ.stacks[3];
    }


    
    return BJ;
});
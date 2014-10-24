define(['Dealer','Deck','Player','Discard'],
    function(Dealer,Deck,Player,Discard){
// DATABASE
    // Random important heights lengths widths shits
    GV = {};
    GV.stackModulo = 5;
    GV.cardFontSize = 30;
    GV.cardWidth = GV.cardFontSize*1.6666;
    GV.cardHeight = GV.cardFontSize*2.3333;

    GV.rowGap = 30;
    GV.cardGap = 5;

    GV.deckTop = GV.rowGap;
    GV.deckLeft = GV.rowGap;

    GV.dealerTop = GV.deckTop + GV.cardHeight + GV.rowGap;
    GV.dealerLeft = GV.deckLeft/2;

    GV.playerTop = GV.dealerTop + GV.cardHeight + GV.rowGap;
    GV.playerLeft = GV.deckLeft/2;

    GV.discardTop = GV.playerTop + GV.cardHeight + GV.rowGap;
    GV.discardLeft = 0;



    GV.playerMoney = 100;
    GV.playerBet = 10;




    GV.entities = [];

    GV.makeEntities = function(){ 
        GV.entities = [];
        GV.entities[0] = new Deck(0,"Deck",GV.deckLeft,GV.deckTop);
        GV.entities[1] = new Dealer(1,"Dealer",GV.dealerLeft,GV.dealerTop);
        GV.entities[2] = new Player(2,"Player",GV.playerLeft,GV.playerTop);
        GV.entities[3] = new Discard(3,"Discard",GV.discardLeft,GV.discardTop);

        GV.deck().makeStacks(1).cards().freshDeck().shuffle().shuffle();
        GV.dealer().makeStacks(1);
        GV.player().makeStacks(4);
        GV.discard().makeStacks(1);
    };
    GV.deck = function(){
        return GV.entities[0];
    };
    GV.dealer = function(){
        return GV.entities[1];
    };
    GV.player = function(){
        return GV.entities[2];
    };
    GV.discard = function(){
        return GV.entities[3];
    };

    
    return GV;
});
define(['Dealer','Deck','Player','Discard','GameValues'],
    function(Dealer,Deck,Player,Discard,GV){

    return function(){ return [
        new Deck(0,"Deck",GV.deckLeft,GV.deckTop),
        new Dealer(1,"Dealer",GV.dealerLeft,GV.dealerTop),
        new Player(2,"Player",GV.playerLeft,GV.playerTop),
        new Discard(3,"Discard",GV.discardLeft,GV.discardTop)
    ]};
});
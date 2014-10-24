define(['Dealer','Deck','Player','Discard','GameValues'],
    function(Dealer,Deck,Player,Discard,GV){

    var entities = [];

    return {
        entities:entities,
        makeEntities : function(){ 
            entities = [
                new Deck(0,"Deck",GV.deckLeft,GV.deckTop),
                new Dealer(1,"Dealer",GV.dealerLeft,GV.dealerTop),
                new Player(2,"Player",GV.playerLeft,GV.playerTop),
                new Discard(3,"Discard",GV.discardLeft,GV.discardTop)
            ]
        },

        deck : function(){
            return entities[0];
        },
        dealer : function(){
            return entities[1];
        },
        player : function(){
            return entities[2];
        },
        discard : function(){
            return entities[3];
        }
    };
});
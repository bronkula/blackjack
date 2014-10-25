define(['GameValues','BlackJackMechanics'],function(GV,BM){

    GM = {};

    GM.makeEntities = function(arr){
        GV.entities = [];
        while(arr.length) {
            GV.entities.push(arr.shift());
        }
    };



    GM.getEntity = function(e,c){
        if(c===undefined) return GV.entities[e];
        else return GV.entities[e].stacks[c];
    };

    // Each of these can be passed a number to return a stack of theirs, instead of themselves.
    GM.deck = function(){
        return GM.getEntity(0,arguments[0]);
    };
    GM.dealer = function(){
        return GM.getEntity(1,arguments[0]);
    };
    GM.player = function(){
        return GM.getEntity(2,arguments[0]);
    };
    GM.discard = function(){
        return GM.getEntity(3,arguments[0]);
    };






    // This function should be modified for each new game
    // Containing the way in which each stack will orient its cards
    GM.setStackPosition = function(card,position) {
        position = position===undefined ? card.stack.cards.length-1 : position;

        card.pos.z = (60 * (card.entity().id)) + card.stack.cards.length;
        if(card.entity().name=="Deck") 
        {
            card.setPos(
                card.stack.pos.x + Math.floor(position/GV.stackModulo)*2, 
                card.stack.pos.y - Math.floor(position/GV.stackModulo)*2
                );
            card.pos.z = position;
        }
        else if(card.entity().name=="Discard")
        {
            card.setPos(
                card.stack.pos.x + ((card.stack.cards.length-1) * ((GV.cardWidth/10) + GV.cardGap)),
                card.stack.pos.y
                );
        }
        else
        {
            card.setPos(
                card.stack.pos.x + ((card.stack.cards.length-1) * ((GV.cardWidth) + GV.cardGap)),
                card.stack.pos.y
                );
        }
        card.drawPos();
        return card;
    };


    for(var i in BM) {
        GM[i] = BM[i];
    }

    return GM;
});
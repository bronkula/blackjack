define(['Entity'],function(Entity){
    
    Deck = function(id,name,x,y){
        Entity.apply(this,arguments);
        this.id = id;
        this.name = name;
        this.stacks = [];
        this.pos = { x:x,y:y };
    };

    Deck.prototype = Entity.prototype;
    Deck.prototype.constructor = Deck;

    return Deck;
});
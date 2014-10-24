define(['Entity'],function(Entity){

    Dealer = function(id,name,x,y){
        Entity.apply(this,arguments);
        this.id = id;
        this.name = name;
        this.stacks = [];
        this.pos = { x:x,y:y };
    };

    Dealer.prototype = Entity.prototype;
    Dealer.prototype.constructor = Dealer;

    return Dealer;
});
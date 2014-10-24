define(['Entity'],function(Entity){

    Player = function(id,name,x,y){
        Entity.apply(this,arguments);
        this.id = id;
        this.name = name;
        this.stacks = [];
        this.pos = { x:x,y:y };
        this.money = 100;
        this.bet = 10;
    };

    Player.prototype = Entity.prototype;
    Player.prototype.constructor = Player;

    return Player;
});
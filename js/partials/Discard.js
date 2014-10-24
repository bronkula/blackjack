define(['Entity'],function(Entity){

console.log(Entity)
    Discard = function(id,name,x,y){
        Entity.apply(this,arguments);
        this.id = id;
        this.name = name;
        this.stacks = [];
        this.pos.x = x;
        this.pos.y = y;
    };

    // Discard.prototype = Entity.prototype;
    // Discard.prototype.constructor = Discard;

    return Discard;
});
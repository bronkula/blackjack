define(['Entity'],function(Entity){

    Discard = function(id,name,x,y){
        Entity.apply(this,arguments);
        this.id = id;
        this.name = name;
        this.stacks = [];
        this.pos = { x:x,y:y };
    };

    Discard.prototype = Entity.prototype;
    Discard.prototype.constructor = Discard;

    return Discard;
});
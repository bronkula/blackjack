define(['CardStack'],function(){

    Entity = function(id,name,x,y){
        this.id = id;
        this.name = name;
        this.stacks = [];
        this.pos.x = x;
        this.pos.y = t;
    };
    Player.prototype.makeStacks = function(num,x,y){
        this.stacks = [];
        for(var i = 0; i<num; i++) {
            this.stacks[i] = new Stack(this,i,x,y);
        }
    };

    return {Entity:Entity};
});
define(['CardStack'],function(){

    Entity = function(id,name,x,y){
        this.id = id;
        this.name = name;
        this.stacks = [];
        this.pos = { x:x, y:y };
    };
    Entity.prototype.makeStacks = function(num){
        this.stacks = [];
        for(var i = 0; i<num; i++) {
            this.stacks[i] = new CardStack(this,i,this.pos.x,this.pos.y);
        }
        return this;
    };
    Entity.prototype.cards = function(){
        return this.stacks[0];
    }

    return Entity;
});
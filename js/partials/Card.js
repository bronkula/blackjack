define(['jquery','underscore'],
    function(j,u){
// CARD CLASS

    // Card Constructor
    Card = function(suit,face,stack){
        this.id = +face.value + (suit.value * 13);
        this.suit = suit;
        this.face = face;
        this.view = $(
            "<span class='card facedown' style='color:"+this.suit.color+"'>"+
                "<span class='card-icon-top'>"+this.suit.icon+"<br>"+this.face.icon+"</span>"+
                "<span class='card-icon-bottom'>"+this.face.icon+"<br>"+this.suit.icon+"</span>"+
            "</span>"
        );
        this.view.data({"card":this});
        this.stack = stack;
        this.pos = { x:0,y:0 };
        // this.ondeck = true;
        this.facedown = true;
        // console.log(this.view);
    };
    Card.prototype.viewUpdate = function(){
        return this;
    };
    Card.prototype.setPos = function(x,y) {
        if(this.pos.x!=x || this.pos.y!=y) {
            this.pos.x = x;
            this.pos.y = y;
        }
        return this;
    };
    Card.prototype.drawPos = function() {
        this.view.css({
            left:this.pos.x+"px",
            top:this.pos.y+"px",
            "z-index":this.pos.z
        });
    }
    Card.prototype.entity = function(){
        return this.stack.entity;
    }
    Card.prototype.addFaceDown = function(){
        if(!this.facedown){
            this.facedown = true;
            this.view.addClass("facedown");
        }
        return this;
    };
    Card.prototype.removeFaceDown = function(){
        if(this.facedown){
            this.facedown = false;
            this.view.removeClass("facedown");
        }
        return this;
    };
    
    return Card;
});
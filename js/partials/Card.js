define(['jquery','underscore','GameValues'],
    function(j,u,GV){
// CARD CLASS

    // Card Constructor
    Card = function(suit,face,stack){
        this.id = +face.value + (suit.value * 13);
        this.suit = suit;
        this.face = face;
        console.log(this)
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
    Card.prototype.player = function(){
        return this.stack.player;
    }

    // This function should be modified for each new game
    // Containing the way in which each stack will orient its cards
    Card.prototype.setStackPosition = function(position) {
        // console.log(deckposition)
        position = position===undefined ? this.stack.cards.length-1 : position;
        // console.log(this);
        this.pos.z = (60 * (this.stack.id)) + this.stack.cards.length;
        if(this.player().name=="Deck") 
        {
            this.setPos(
                this.stack.pos.x + Math.floor(position/GV.stackModulo)*2, 
                this.stack.pos.y - Math.floor(position/GV.stackModulo)*2
                );
            this.pos.z = position;
        }
        else if(this.player().name=="Discard")
        {
            this.setPos(
                this.stack.pos.x + ((this.stack.cards.length-1) * ((GV.cardWidth/10) + GV.cardGap)),
                this.stack.pos.y
                );
        }
        else
        {
            this.setPos(
                this.stack.pos.x + ((this.stack.cards.length-1) * ((GV.cardWidth) + GV.cardGap)),
                this.stack.pos.y
                );
        }
        this.drawPos();
        return this;
    };
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
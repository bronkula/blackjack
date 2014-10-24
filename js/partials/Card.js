define(['jquery','underscore','SuitFace'],function(){
// CARD CLASS

    // Card Constructor
    Card = function(suit,face,stack){
        this.id = +face + (suit.value * 13);
        this.suit = suit;
        this.face = face;
        this.view = $(_.template(
            "<span class='card facedown' style='color:<%=color%>'>"+
                "<span class='card-icon-top'><%=suit%><br><%=face%></span>"+
                "<span class='card-icon-bottom'><%=face%><br><%=suit%></span>"+
            "</span>",
            {color:this.suit.color,suit:this.suit.icon,face:this.face.icon}
            )
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
            this.view.css({left:this.pos.x+"px",top:this.pos.y+"px"});
        }
        return this;
    };
    Card.prototype.player = function(){
        return this.stack.player;
    }

    // This function should be modified for each new game
    // Containing the way in which each stack will orient its cards
    Card.prototype.setStackPosition = function(position) {
        // console.log(deckposition)
        position = position===undefined ? this.stack.cards.length-1 : position;
        // console.log(this);
        this.view.css({"z-index":(60 * (this.stack.id)) + this.stack.cards.length});
        if(this.player().name=="Deck") 
        {
            this.setPos(
                this.stack.pos.x + Math.floor(position/BJ.stackModulo)*2, 
                this.stack.pos.y - Math.floor(position/BJ.stackModulo)*2
                );
            this.view.css({"z-index":position});
        }
        else if(this.player().name=="Discard")
        {
            this.setPos(
                this.stack.pos.x + ((this.stack.cards.length-1) * ((BJ.cardWidth/10) + BJ.cardGap)),
                this.stack.pos.y
                );
        }
        else
        {
            this.setPos(
                this.stack.pos.x + ((this.stack.cards.length-1) * ((BJ.cardWidth) + BJ.cardGap)),
                this.stack.pos.y
                );
        }
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
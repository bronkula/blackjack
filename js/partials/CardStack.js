define(['Card','SuitFace','GameValues','GameMechanics'],
    function(Card,SF,GV,GM){

// STACK CLASS
    //Stack Constructor
    CardStack = function(entity,id,x,y){
        this.cards = [];
        this.id = id;
        this.entity = entity;
        this.pos = {
            x:x,
            y:y
        };
        this.points = 0;
        this.soft = false;
    };
    // Shuffle the current stack
    CardStack.prototype.shuffle = function() {
        var temp = [],card;
        while(this.cards.length) {
            card = this.cards.splice(Math.floor(Math.random()*this.cards.length),1)[0];
            if(!this.id) {
                GM.setStackPosition(card,temp.length);
            }
            temp.push(card);
        }
        this.cards = temp;
        return this;
    };
    // Create a new straight deck onto a stack
    CardStack.prototype.freshDeck = function(){
        this.cards = [];
        for(var s in SF.suits) {
            for(var f in SF.faces) {
                this.cards.push(new Card(SF.suits[s],SF.faces[f],this));
            }
        }
        return this;
    };
    CardStack.prototype.drawDeck = function(){
        for(var i in this.cards) {
            GV.viewCards.append(this.cards[i].view);
        }
        return this;
    }
    // Sort cards by either suit or face
    CardStack.prototype.orderBy = function(ord){
        this.cards = _.sortBy(this.cards,function(card){ return card[ord].value; });
        return this;
    };
    // Sort all cards in stack by face and suit
    CardStack.prototype.reOrder = function(){
        this.orderBy("face").orderBy("suit");
        return this;
    };
    // Trade all cards to another stack face down
    CardStack.prototype.gatherCards = function(stack){
        while(this.cards.length) {
            GM.setStackPosition(
                this.tradeCard(stack,0).addFaceDown()
                );
        }
        return this;
    }
    // Send all cards to another stack face up
    CardStack.prototype.discardCards = function(stack){
        while(this.cards.length) {
            GM.setStackPosition(
                this.tradeCard(stack,0).removeFaceDown()
                );
        }
        return this;
    }

    // Remove a card from this stack and add to top of other stack
    CardStack.prototype.tradeCard = function(stack,card){
        // console.log(stack1,stack2,card)
        var card = this.cards.splice(card,1)[0];
        stack.cards.push(card);
        card.stack = stack;
        return card;
    };
    // Remove a card from this stack and add to bottom of other stack
    CardStack.prototype.sneakCard = function(stack,card){
        var card = this.cards.splice(card,1)[0];
        stack.cards.unshift(card);
        card.stack = stack;
        return card;
    };
    // Trade top card from this stack
    CardStack.prototype.dealTo = function(stack){
        return this.tradeCard(stack,this.cards.length-1);
    };

    // Redraw the current stack's positions
    CardStack.prototype.drawStack = function(){
        for(var i=0,l=this.cards.length; i<l; i++) {
            this.cards[i].setStackPosition(i);
        }
    };

    // Select the last card and return a pointer
    CardStack.prototype.lastCard = function(){
        return this.cards[this.cards.length-1];
    };
    // Select the first card and return a pointer
    CardStack.prototype.firstCard = function(){
        return this.cards[0];
    };
    
    return CardStack;
});

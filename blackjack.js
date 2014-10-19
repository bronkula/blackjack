
(function(){
    var BJ = {};




// DATABASE
    BJ.suits = [
        { name:"Spades", value:0, color:"black", icon:"&spades;" },
        { name:"Hearts", value:1, color:"red", icon:"&spades;" },
        { name:"Clubs", value:2, color:"black", icon:"&clubs;" },
        { name:"Diamonds", value:3, color:"red", icon:"&diams;" }
        ];
    BJ.faces = [
        { name:"Ace", value:0, icon:"A" },
        { name:"Two", value:1, icon:"2" },
        { name:"Three", value:2, icon:"3" },
        { name:"Four", value:3, icon:"4" },
        { name:"Five", value:4, icon:"5" },
        { name:"Six", value:5, icon:"6" },
        { name:"Seven", value:6, icon:"7" },
        { name:"Eight", value:7, icon:"8" },
        { name:"Nine", value:8, icon:"9" },
        { name:"Ten", value:9, icon:"10" },
        { name:"Jack", value:10, icon:"J" },
        { name:"Queen", value:11, icon:"Q" },
        { name:"King", value:12, icon:"K" },
    ];
    // Random important heights lengths widths shits
    BJ.stackModulo = 5;
    BJ.cardWidth = 40;
    BJ.cardHeight = 70;

    BJ.rowGap = 10;
    BJ.cardGap = 5;

    BJ.deckTop = 20;
    BJ.deckLeft = 20;

    BJ.dealerTop = BJ.deckTop + BJ.cardHeight + BJ.rowGap;
    BJ.dealerLeft = BJ.deckLeft;

    BJ.playerTop = BJ.dealerTop + BJ.cardHeight + BJ.rowGap;
    BJ.playerLeft = BJ.deckLeft;

    BJ.discardTop = BJ.playerTop + BJ.cardHeight + BJ.rowGap;
    BJ.discardLeft = BJ.deckLeft;

    BJ.deck = function(){
        return BJ.stacks[0];
    }
    BJ.dealer = function(){
        return BJ.stacks[1];
    }
    BJ.discard = function(){
        return BJ.stacks[2];
    }
    BJ.player = function(){
        return BJ.stacks[3];
    }



$(".card").on("click",function(){
            console.log("hello");
        });

// INITIALIZER
    BJ.init = function(){
        BJ.resetStacks();

        BJ.makeGameDB();

        BJ.cardTemplate = _.template($("#Card").html());

        BJ.viewGame = $(".view-game");
        BJ.viewCards = $(".view-cards");
        BJ.viewControls = $(".view-controls");
        BJ.viewStats = $(".view-stats");

        $("h1").on("click",BJ.startGame);
        $(".js-dealcards").on("click",function(){
            BJ.deck().freshDeck().shuffle();
        });
        $(".js-newgame").on("click",function(){
            BJ.resetStacks();
            $(".view-cards").empty();
            BJ.deck().freshDeck().shuffle();
        });
        $(".js-gathercards").on("click",function(){
            BJ.gatherCards();
            // BJ.deck().reOrder().shuffle();
        });
        $(".js-discardhands").on("click",function(){
            BJ.discardHands();
            // BJ.deck().reOrder().shuffle();
        });
        $(".js-shuffledeck").on("click",function(){
            BJ.deck().shuffle();
            // BJ.drawTable();
        });
        $(".js-dealplayer").on("click",function(){
            if(BJ.deck().cards.length) {
                BJ.dealTo("player")
                    .removeFaceDown()
                    .setHandPos();
                BJ.dealTo("player")
                    .removeFaceDown()
                    .setHandPos();
            }
        });
        $(".js-dealdealer").on("click",function(){
            if(BJ.deck().cards.length) {
                BJ.dealTo("dealer")
                    // .removeFaceDown()
                    .setHandPos();
                BJ.dealTo("dealer")
                    .removeFaceDown()
                    .setHandPos();
            }
        });




        $("body").on("click",".card",function(){
            console.log($(this).data("card"));
        });
    };



// BASIC GAME FUNCTIONS
    BJ.resetStacks = function(){
        BJ.stacks = [
            new BJ.Stack(0,"Deck",[],BJ.deckLeft,BJ.deckTop),
            new BJ.Stack(1,"Dealer",[],BJ.dealerLeft,BJ.dealerTop),
            new BJ.Stack(2,"Discard",[],BJ.discardLeft,BJ.discardTop),
            new BJ.Stack(3,"Player",[],BJ.playerLeft,BJ.playerTop)
        ];
    };
    BJ.startGame = function(){
        BJ.deck().freshDeck().shuffle();
        // BJ.drawDeckInStats();
        // BJ.deck().shuffle();
        // BJ.drawDeckInStats();
        // BJ.deck().reOrder();
        // BJ.drawDeckInStats();
    };
    BJ.makeGameDB = function(){
        BJ.money = 100;
        BJ.bet = 10;

    }

    BJ.drawDeckInStats = function(){
        // $(".view-stats").empty();
        // console.log(BJ.deck,BJ.deck.shuffle(),BJ.deck);
        var $div = $("<div class='row'>");
        for(var i in BJ.deck().cards) {
            card = BJ.deck().cards[i];
            $div.append(card.view," ");
        }
        BJ.viewStats.append($div);
    };

    BJ.gatherCards = function(){
        BJ.dealer().gatherCards();
        BJ.player().gatherCards();
        BJ.discard().gatherCards();
        BJ.reDrawDeck();
        // $(".view-cards").empty();
    };
    BJ.discardHands = function(){
        BJ.dealer().discardCards();
        BJ.player().discardCards();
        // $(".view-cards").empty();
    };
    BJ.drawTable = function(){

    };
    BJ.reDrawDeck = function(){

        for(var i=0,l=BJ.deck().cards.length; i<l; i++) {
            // BJ.deck().cards[i].stackId = i;
            BJ.deck().cards[i].setDeckPos(i);
        }
    }




// STACK CLASS
    //Stack Constructor
    BJ.Stack = function(id,name,stack,x,y){
        this.cards = [];
        while(stack.length) {
            this.cards.push(stack.shift());
        }
        this.id = id;
        this.name = name;
        this.pos = {
            x:x,
            y:y
        }
    };
    // Shuffle the current stack
    BJ.Stack.prototype.shuffle = function() {
        var temp = [],card;
        while(this.cards.length) {
            card = this.cards.splice(Math.floor(Math.random()*this.cards.length),1)[0];
            if(!this.id) {
                card.setDeckPos(temp.length);
            }
            temp.push(card);
        }
        this.cards = temp;
        return this;
    };
    // Create a new straight deck onto a stack
    BJ.Stack.prototype.freshDeck = function(){
        this.cards = [];
        for(var s in BJ.suits) {
            for(var f in BJ.faces) {
                this.cards.push(new BJ.Card(s,f));
            }
        }
        return this;
    };
    BJ.Stack.prototype.orderBy = function(ord){
        this.cards = _.sortBy(this.cards,function(card){ return card[ord].value; });
        return this;
    };
    BJ.Stack.prototype.orderByFace = function(){
        this.orderBy("face");
        return this;
    };
    BJ.Stack.prototype.orderBySuit = function(){
        this.orderBy("suit");
        return this;
    };
    BJ.Stack.prototype.reOrder = function(){
        this.orderBy("face").orderBy("suit");
        return this;
    };
    BJ.Stack.prototype.gatherCards = function(){
        while(this.cards.length) {
            BJ.sneakCard(this,BJ.deck(),0)
                .addFaceDown()
                .setDeckPos(false);
        }
        return this;
    }
    BJ.Stack.prototype.discardCards = function(){
        while(this.cards.length) {
            BJ.tradeCard(this,BJ.discard(),0)
                // .addFaceDown()
                .setDiscardPos();
        }
        return this;
    }



// CARD CLASS

    // Card Constructor
    BJ.Card = function(suit,face){
        this.id = face + (suit * BJ.faces.length);
        this.suit = BJ.suits[suit];
        this.face = BJ.faces[face];
        this.view = $(BJ.cardTemplate({color:this.suit.color}));
        this.view
            .data({"card":this})
            .appendTo(BJ.viewCards);
        this.pos = { x:0,y:0 };
        this.setDeckPos(this.id);
        // this.ondeck = true;
        this.facedown = true;
        this.stackId = 0;
        // console.log(this.view);
    };
    BJ.Card.prototype.viewUpdate = function(){
        return this;
    };
    BJ.Card.prototype.setPos = function(x,y) {
        if(this.pos.x!=x || this.pos.y!=y) {
            this.pos.x = x;
            this.pos.y = y;
            this.view.css({left:this.pos.x+"px",top:this.pos.y+"px"});
        }
        return this;
    };
    BJ.Card.prototype.setDeckPos = function(deckposition) {
        // console.log(deckposition)
        if(deckposition===false) {
            this.setPos(BJ.deckLeft,BJ.deckTop);
            this.view.css({"z-index":0});
        } else {
            deckposition = deckposition===undefined ? BJ.deck().cards.length-1 : deckposition;
            this.setPos(
                BJ.deckLeft + Math.floor(deckposition/BJ.stackModulo)*2, 
                BJ.deckTop - Math.floor(deckposition/BJ.stackModulo)*2
                );
            this.view.css({"z-index":deckposition});
        }
    };
    BJ.Card.prototype.setHandPos = function(deckposition) {
        var stack = BJ.stacks[this.stackId];
        this.setPos(
            stack.pos.x + ((stack.cards.length-1) * ((BJ.cardWidth/1.8) + BJ.cardGap)),
            stack.pos.y
            );
    };
    BJ.Card.prototype.setDiscardPos = function() {
        var stack = BJ.discard();
        this.setPos(
            stack.pos.x + ((stack.cards.length-1) * ((BJ.cardWidth/4) + BJ.cardGap)),
            stack.pos.y
            );
        this.view.css({"z-index":stack.cards.length});
    };
    BJ.Card.prototype.addFaceDown = function(){
        if(!this.facedown){
            this.facedown = true;
            this.view
                .addClass("facedown")
                .html("");
        }
        return this;
    };
    BJ.Card.prototype.removeFaceDown = function(){
        if(this.facedown){
            this.facedown = false;
            this.view
                .removeClass("facedown")
                .html(
                    "<span class='card-icon-top'>"+this.suit.icon+"<br>"+this.face.icon+"</span>"+
                    "<span class='card-icon-bottom'>"+this.face.icon+"<br>"+this.suit.icon+"</span>"
                    );
        }
        return this;
    };






// Card Functions

    BJ.tradeCard = function(stack1,stack2,card){
        // console.log(stack1,stack2,card)
        var card = stack1.cards.splice(card,1)[0];
        stack2.cards.push(card);
        card.stackId = stack2.id;
        return card;
    };
    BJ.sneakCard = function(stack1,stack2,card){
        var card = stack1.cards.splice(card,1)[0];
        stack2.cards.unshift(card);
        card.stackId = stack2.id;
        return card;
    };
    BJ.dealCard = function(stack1,stack2){
        return BJ.tradeCard(stack1,stack2,stack1.cards.length-1);
    };
    BJ.dealTo = function(hand){
        return BJ.dealCard(BJ.deck(),BJ[hand]());
    };
    BJ.discardCard = function(stack,card) {
        return BJ.tradeCard(
            BJ[stack](),
            BJ.discard(),
            card);
    };




    BJ.init();

    window.BJ = BJ;
})();


(function(){
    var BJ = {};




// DATABASE
    BJ.suits = [
        { name:"Spades", value:0, color:"black", icon:"&spades;" },
        { name:"Hearts", value:1, color:"red", icon:"&hearts;" },
        { name:"Clubs", value:2, color:"black", icon:"&clubs;" },
        { name:"Diamonds", value:3, color:"red", icon:"&diams;" }
        ];
    BJ.faces = [
        { name:"Ace", value:0, points:11, icon:"A" },
        { name:"Two", value:1, points:2, icon:"2" },
        { name:"Three", value:2, points:3, icon:"3" },
        { name:"Four", value:3, points:4, icon:"4" },
        { name:"Five", value:4, points:5, icon:"5" },
        { name:"Six", value:5, points:6, icon:"6" },
        { name:"Seven", value:6, points:7, icon:"7" },
        { name:"Eight", value:7, points:8, icon:"8" },
        { name:"Nine", value:8, points:9, icon:"9" },
        { name:"Ten", value:9, points:10, icon:"10" },
        { name:"Jack", value:10, points:10, icon:"J" },
        { name:"Queen", value:11, points:10, icon:"Q" },
        { name:"King", value:12, points:10, icon:"K" },
    ];
    // Random important heights lengths widths shits
    BJ.stackModulo = 5;
    BJ.cardFontSize = 30;
    BJ.cardWidth = BJ.cardFontSize*1.6666;
    BJ.cardHeight = BJ.cardFontSize*2.3333;

    BJ.rowGap = 30;
    BJ.cardGap = 5;

    BJ.deckTop = BJ.rowGap;
    BJ.deckLeft = BJ.rowGap;

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
    BJ.player = function(){
        return BJ.stacks[2];
    }
    BJ.discard = function(){
        return BJ.stacks[3];
    }




// INITIALIZER
    BJ.init = function(){
        BJ.resetStacks();

        BJ.makeGameDB();
        BJ.drawGameDB();

        BJ.cardTemplate = _.template($("#Card").html());

        $(".view-cards").css({"font-size":BJ.cardFontSize+"px"});
        $(".title-dealer").css({"top":(BJ.rowGap+BJ.cardHeight+BJ.cardGap)+"px"});
        $(".title-player").css({"top":(((BJ.rowGap+BJ.cardHeight)*2)+BJ.cardGap)+"px"});

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
        $(".js-dealinitial").on("click",BJ.dealInitial);
        $(".js-hitplayer").on("click",BJ.hitPlayer);
        $(".js-stayplayer").on("click",BJ.stayPlayer);




        $("body").on("click",".card",function(){
            console.log($(this).data("card"));
        })
        .on("keypress",function(e){
            if(e.keyCode==97) BJ.dealInitial();
            else if(e.keyCode==115) BJ.hitPlayer();
            else if(e.keyCode==100) BJ.stayPlayer();
        })
        ;
    };



// BASIC GAME FUNCTIONS
    BJ.resetStacks = function(){
        BJ.stacks = [
            new BJ.Stack(0,"Deck",[],BJ.deckLeft,BJ.deckTop),
            new BJ.Stack(1,"Dealer",[],BJ.dealerLeft,BJ.dealerTop),
            new BJ.Stack(2,"Player",[],BJ.playerLeft,BJ.playerTop),
            new BJ.Stack(3,"Discard",[],BJ.discardLeft,BJ.discardTop)
        ];
        BJ.writeMsg("");
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
        BJ.dealer_points;
        BJ.player_points;
    }
    BJ.drawGameDB = function(){
        $(".db-money .db-value").html(BJ.money);
        $(".db-bet .db-value").html(BJ.bet);
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
    BJ.reDrawDeck = function(){
        for(var i=0,l=BJ.deck().cards.length; i<l; i++) {
            // BJ.deck().cards[i].stackId = i;
            BJ.deck().cards[i].setDeckPos(i);
        }
    };
    BJ.dealerScore = function(){
        return BJ.dealer().firstCard().facedown ? BJ.dealer().cards[1].face.points : BJ.dealer().points;
    };
    BJ.playerScore = function(){
        return BJ.player().points;
    };





// GAME FUNCTIONS
    BJ.checkHand = function(hand){
        hand.points = 0;
        hand.soft = false;
        for(var i=0,l=hand.cards.length; i<l; i++) {
            BJ.checkCard(hand,hand.cards[i]);
        }
    };
    BJ.checkCard = function(hand,card){
        // console.log(hand.points)
        // card = hand.cards[i];
        // calculate aces
        if(card.face.value==0) {
            if(hand.points+11<=21) {
                console.log("made it soft")
                hand.points += 11;
                hand.soft = true;
            } else if(hand.soft && hand.points+1<21) {
                console.log("unsoftened")
                hand.points += 1;
                hand.soft = true;
            } else {
                console.log("hard")
                hand.points++;
                hand.soft = false;
            }
        } 
        // add other cards
        else {
            hand.points += card.face.points;
        }

        if(hand.soft && hand.points>21) {
            hand.points -= 10;
            hand.soft = false;
        }
        // console.log(hand.points)

    };
    BJ.checkInitial = function(){
        var d = BJ.dealer(), p = BJ.player();
        // console.log(d.points,p.points)
        BJ.writeMsg("");
        if(d.points==21)
        {
            d.firstCard().removeFaceDown();
            if(p.points==21)
            {
                BJ.writeMsg("It's a Draw!");
            }
            else
            {
                BJ.writeMsg("Dealer Blackjack! You Lose!");
            }
        }
        else if(p.points==21)
        {
            d.firstCard().removeFaceDown();
            BJ.writeMsg("Blackjack! You Win!");
        }
        BJ.addMsg("<br>Dealer is showing "+BJ.dealerScore()+"<br>You are showing "+BJ.playerScore());
    }
    BJ.checkScenario = function(){
        var d = BJ.dealer(), p = BJ.player();
        // console.log(d.points,p.points)
        result = false;
        if(d.points==21)
        {
            if(p.points==21)
            {
                BJ.writeMsg("It's a Draw!");
            }
            else
            {
                BJ.writeMsg("Dealer 21! You Lose!");
            }
        }
        else if(d.points>21)
        {
            BJ.writeMsg("Dealer Busts! You Win!");
        }
        else if(p.points>21)
        {
            BJ.writeMsg("Player Busts! You Lose");
        }
        else if(d.points>16 && !d.firstCard().facedown)
        {
            if(d.points>p.points)
            {
                BJ.writeMsg("Dealer Wins! You Lose!");
            }
            else if(d.points==p.points)
            {
                BJ.writeMsg("It's a Draw!");
            }
            else
            {
                BJ.writeMsg("You Win!");
            }
        }
        else if(p.points==21 && !d.firstCard().facedown)
        {
            BJ.writeMsg("21!");
            result = true;
        }
        else
        {
            BJ.writeMsg("No Change");
            result = true;
        }
        if(!result) {
            d.firstCard().removeFaceDown();
            // BJ.discardHands();
        }
        BJ.addMsg("<br>Dealer is showing "+BJ.dealerScore()+"<br>You are showing "+BJ.playerScore());
        return result;
        // if(current_points>21) {
        //     BJ.writeMsg(hand.isDealer?"Dealer BUSTS":"You BUST!");
        //     return false;
        // } else if(current_points==21) {
        //     BJ.writeMsg(hand.isDealer?"21 YOU LOSE":"21 YOU WIN!");
        //     return false;
        // } else if(hand.isDealer && current_points>=16) {
        //     if(current_points>BJ.player_points) {
        //         BJ.writeMsg("Dealer Wins!");
        //     } else if(current_points==BJ.player_points) {
        //         BJ.writeMsg("It's a Draw!");
        //     } else {
        //         BJ.writeMsg("Dealer stays, You Win!");
        //     }

        //     return false;
        // } else if(hand.cards.length>2) {
        //     BJ.writeMsg(hand.isDealer?"Dealer Hits":"You Hit");
        //     return true;
        // } else {
        //     BJ.writeMsg("");
        //     return true;
        // }
    };

    BJ.playDealer = function(){
        BJ.dealer().cards[0].removeFaceDown();
        while(BJ.checkScenario()) {
            BJ.dealTo("dealer")
                .removeFaceDown()
                .setHandPos();
            BJ.checkCard(BJ.dealer(),BJ.dealer().lastCard());
            // BJ.checkScenario();
        }
    };
    BJ.dealInitial = function(){
        if(BJ.dealer().cards.length || BJ.player().cards.length) {
            BJ.discardHands();
        }
        if(BJ.deck().cards.length || BJ.discard().cards.length) {
            BJ.dealTo("player")
                .removeFaceDown()
                .setHandPos();
            BJ.dealTo("dealer")
                // .removeFaceDown()
                .setHandPos();
            BJ.dealTo("player")
                .removeFaceDown()
                .setHandPos();
            BJ.dealTo("dealer")
                .removeFaceDown()
                .setHandPos();
            BJ.checkHand(BJ.player());
            BJ.checkHand(BJ.dealer());
            BJ.checkInitial();
        }
    };
    BJ.hitPlayer = function(){
        if(!BJ.dealer().firstCard().facedown){
            BJ.writeMsg("Game Over<br>Deal a New Hand");
            return;
        }
        if(BJ.deck().cards.length || BJ.discard().cards.length) {
            BJ.dealTo("player")
                .removeFaceDown()
                .setHandPos();
            BJ.checkHand(BJ.player());
        }
        BJ.checkScenario();
    };
    BJ.stayPlayer = function(){
        if(!BJ.dealer().firstCard().facedown){
            BJ.writeMsg("Game Over<br>Deal a New Hand");
            return;
        }
        if(BJ.deck().cards.length || BJ.discard().cards.length) {
            BJ.playDealer();
        }
    };

    BJ.writeMsg = function(msg) {
        $(".db-message").html(msg);
    };
    BJ.addMsg = function(msg) {
        $(".db-message").append(msg);
    };




// STACK CLASS
    //Stack Constructor
    BJ.Stack = function(id,name,stack,x,y){
        this.cards = [];
        while(stack.length) {
            this.cards.push(stack.shift());
        }
        this.id = id;
        this.name = name;
        if(this.id==1) this.isDealer = true;
        else this.isDealer = false;
        this.points = 0;
        this.soft = false;
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
    BJ.Stack.prototype.lastCard = function(){
        return this.cards[this.cards.length-1];
    }
    BJ.Stack.prototype.firstCard = function(){
        return this.cards[0];
    }



// CARD CLASS

    // Card Constructor
    BJ.Card = function(suit,face){
        this.id = +face + (suit * 13);
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
    BJ.Card.prototype.setHandPos = function() {
        var stack = BJ.stacks[this.stackId];
        this.setPos(
            stack.pos.x + ((stack.cards.length-1) * ((BJ.cardWidth) + BJ.cardGap*1)),
            stack.pos.y
            );
        this.view.css({"z-index":(60 * (this.stackId)) + stack.cards.length});
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
        if(!BJ.deck().cards.length) {
            BJ.discard().gatherCards();
            BJ.deck().shuffle().shuffle();
        }
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

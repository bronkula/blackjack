
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
    BJ.dealerLeft = BJ.deckLeft/2;

    BJ.playerTop = BJ.dealerTop + BJ.cardHeight + BJ.rowGap;
    BJ.playerLeft = BJ.deckLeft/2;

    BJ.discardTop = BJ.playerTop + BJ.cardHeight + BJ.rowGap;
    BJ.discardLeft = 0;



    BJ.playerMoney = 100;
    BJ.playerBet = 10;




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

        BJ.cmdStack = new BJ.StackCommand();

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
        $(".js-newgame").on("click",BJ.startGame);
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
                    .setStackPosition();
                BJ.dealTo("player")
                    .removeFaceDown()
                    .setStackPosition();
            }
        });
        $(".js-dealdealer").on("click",function(){
            if(BJ.deck().cards.length) {
                BJ.dealTo("dealer")
                    // .removeFaceDown()
                    .setStackPosition();
                BJ.dealTo("dealer")
                    .removeFaceDown()
                    .setStackPosition();
            }
        });
        $(".js-dealinitial").on("click",function(){BJ.gameMove('deal');});
        $(".js-hitplayer").on("click",function(){BJ.gameMove('hit');});
        $(".js-stayplayer").on("click",function(){BJ.gameMove('stay');});
        $(".js-doubledown").on("click",function(){BJ.gameMove('double');});
        $(".js-splitcards").on("click",function(){BJ.gameMove('split');});




        $("body").on("click",".card",function(){
            console.log($(this).data("card"));
        })
        .on("keypress",function(e){
            if(e.keyCode==97) BJ.dealInitial();
            else if(e.keyCode==115) BJ.hitPlayer();
            else if(e.keyCode==100) BJ.stayPlayer();
        })
        ;

        BJ.makeGameDB();
        BJ.drawGameDB();

        BJ.startGame();
    };



// BASIC GAME FUNCTIONS
    BJ.resetStacks = function(){
        BJ.stacks = [
            new BJ.Stack(0,"Deck",[],BJ.deckLeft,BJ.deckTop),
            new BJ.Stack(1,"Dealer",[],BJ.dealerLeft,BJ.dealerTop),
            new BJ.Stack(2,"Player",[],BJ.playerLeft,BJ.playerTop),
            new BJ.Stack(3,"Discard",[],BJ.discardLeft,BJ.discardTop)
        ];
        BJ.writeMsg("&nbsp;");
    };
    BJ.startGame = function(){
        BJ.resetStacks();
        $(".view-cards").empty();
        BJ.deck().freshDeck().shuffle();
    };
    BJ.makeGameDB = function(){
        BJ.playerMoney = 100;
        BJ.playerBet = 10;
    }
    BJ.drawGameDB = function(){
        $(".db-money .db-value").html(BJ.playerMoney);
        $(".db-bet .db-value").html(BJ.playerBet);
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
        BJ.reDrawStack("deck");
        // $(".view-cards").empty();
    };
    BJ.discardHands = function(){
        BJ.dealer().discardCards();
        BJ.player().discardCards();
        if(!BJ.deck().cards.length) BJ.gatherDiscard();
        // $(".view-cards").empty();
    };
    BJ.gatherDiscard = function(){
        // BJ.cmdStack.addCmd(function(){BJ.discard().gatherCards();},0)
        // .addCmd(function(){BJ.deck().shuffle()},100).addCmd(function(){BJ.deck().shuffle()},100)
        BJ.discard().gatherCards();
        BJ.deck().shuffle().shuffle();
        BJ.cmdStack.delay(300);
    }
    BJ.reDrawStack = function(stack){
        for(var i=0,l=BJ[stack]().cards.length; i<l; i++) {
            // BJ[stack]().cards[i].stackId = i;
            BJ[stack]().cards[i].setStackPosition(i);
        }
    };
    BJ.dealerScore = function(){
        return BJ.dealer().firstCard().facedown ? BJ.dealer().cards[1].face.points : BJ.dealer().points;
    };
    BJ.playerScore = function(){
        return BJ.player().points;
    };
    BJ.writeScores = function(){
        $(".title-dealer .title-points").html(BJ.dealerScore());
        $(".title-player .title-points").html(BJ.playerScore());
        // BJ.addMsg("<br>Dealer is showing "+BJ.dealerScore()+"<br>You are showing "+BJ.playerScore());
    }





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
                // console.log("made it soft")
                hand.points += 11;
                hand.soft = true;
            } else if(hand.soft && hand.points+1<21) {
                // console.log("unsoftened")
                hand.points += 1;
                hand.soft = true;
            } else {
                // console.log("hard")
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
    // BJ.checkInitial = function(){
    //     var d = BJ.dealer(), p = BJ.player();
    //     // console.log(d.points,p.points)
    //     BJ.writeMsg("");
    //     BJ.writeScores();
    // }
    BJ.checkScenario = function(){
        var d = BJ.dealer(), p = BJ.player();
        // console.log(d.points,p.points)
        result = false;
        
        if(d.points==21)
        {
            if(p.points==21)
            {
                // console.log("Scenario 1")
                BJ.writeMsg("It's a Draw!");
            }
            else if(d.cards.length==2)
            {
                // console.log("Scenario 2")
                BJ.writeMsg("Dealer Blackjack! You Lose!");
            }
            else
            {
                // console.log("Scenario 3")
                BJ.writeMsg("Dealer 21! You Lose!");
            }
        }
        else if(p.cards.length==2 && p.points==21)
        {
                // console.log("Scenario 4")
            BJ.writeMsg("Blackjack! You Win!");
        }
        else if(d.points>21)
        {
                // console.log("Scenario 5")
            BJ.writeMsg("Dealer Busts! You Win!");
        }
        else if(p.points>21)
        {
                // console.log("Scenario 6")
            BJ.writeMsg("Player Busts! You Lose");
        }
        else if(d.points>16 && !d.firstCard().facedown)
        {
            if(d.points>p.points)
            {
                // console.log("Scenario 7")
                BJ.writeMsg("Dealer Wins! You Lose!");
            }
            else if(d.points==p.points)
            {
                // console.log("Scenario 8")
                BJ.writeMsg("It's a Draw!");
            }
            else
            {
                // console.log("Scenario 9")
                BJ.writeMsg("You Win!");
            }
        }
        else if(p.points==21 && !d.firstCard().facedown)
        {
                // console.log("Scenario 10")
            BJ.writeMsg("21!");
            result = true;
        }
        else
        {
            // BJ.writeMsg("No Change");
                // console.log("Scenario 11")
            result = true;
        }
        if(!result) {
            d.firstCard().removeFaceDown();
            // BJ.discardHands();
        }
        BJ.writeScores();
        // BJ.addMsg("<br>Dealer is showing "+BJ.dealerScore()+"<br>You are showing "+BJ.playerScore());
        return result;
    };

    BJ.playDealer = function(){
        BJ.dealer().cards[0].removeFaceDown();
        BJ.cmdStack.addCmd(BJ.makeDealerChoice,10);
    };
    BJ.makeDealerChoice = function(){
        if(!BJ.deck().cards.length) {
            BJ.gatherDiscard();
        }
        if(BJ.checkScenario()) {
            BJ.dealTo("dealer")
                .removeFaceDown()
                .setStackPosition();
            BJ.checkCard(BJ.dealer(),BJ.dealer().lastCard());
            BJ.cmdStack.addCmd(BJ.makeDealerChoice,200);
        }
    };

    BJ.gameMove = function(str) {
        if(
            !BJ.deck().cards.length &&
            !BJ.dealer().cards.length &&
            !BJ.player().cards.length &&
            !BJ.discard().cards.length
            ) {
            BJ.deck().freshDeck().shuffle().shuffle();
        }
        if(!BJ.deck().cards.length) {
            BJ.gatherDiscard();
        }

        BJ.writeMsg("&nbsp;");

        switch(str) {
            case "deal":
                BJ.dealInitial();
                break;
            case "hit":
                BJ.hitPlayer();
                break;
            case "stay":
                BJ.stayPlayer();
                break;
        }
    }
    BJ.dealInitial = function(){
        if(BJ.dealer().cards.length || BJ.player().cards.length) {
            if(BJ.dealer().firstCard().facedown) {
                BJ.writeMsg("Finish the hand first");
                return;
            } else {
                BJ.cmdStack.addCmd(BJ.discardHands,150);
            }
        }
        if(BJ.deck().cards.length || BJ.discard().cards.length) {
            if(BJ.deck().cards.length<4){
                BJ.gatherDiscard();
            }
            BJ.cmdStack.addCmd(function(){
                BJ.dealTo("player")
                    .removeFaceDown()
                    .setStackPosition();
            },100)
            .addCmd(function(){
                BJ.dealTo("dealer")
                    // .removeFaceDown()
                    .setStackPosition();
            },100)
            .addCmd(function(){
                BJ.dealTo("player")
                    .removeFaceDown()
                    .setStackPosition();
            },100)
            .addCmd(function(){
                BJ.dealTo("dealer")
                    .removeFaceDown()
                    .setStackPosition();
            },100)
            .addCmd(function(){
                BJ.checkHand(BJ.player());
                BJ.checkHand(BJ.dealer());
                BJ.checkScenario();
            },0);
        }
    };
    BJ.hitPlayer = function(){
        if(!BJ.dealer().firstCard().facedown){
            BJ.writeMsg("Game Over<br>Deal a New Hand");
            return;
        }
        if(BJ.deck().cards.length || BJ.discard().cards.length) {
            BJ.cmdStack.addCmd(function(){
                BJ.dealTo("player")
                    .removeFaceDown()
                    .setStackPosition();
                BJ.checkHand(BJ.player());
                BJ.checkScenario();
            },100);
        }
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
                card.setStackPosition(temp.length);
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
            BJ.tradeCard(this,BJ.deck(),0)
                .addFaceDown()
                .setStackPosition();
        }
        return this;
    }
    BJ.Stack.prototype.discardCards = function(){
        while(this.cards.length) {
            // BJ.cmdStack.addCmd(function(){
                BJ.tradeCard(this,BJ.discard(),0)
                    .setStackPosition();
            // },10);
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
        this.view = $(BJ.cardTemplate({color:this.suit.color,suit:this.suit.icon,face:this.face.icon}));
        this.view
            .data({"card":this})
            .appendTo(BJ.viewCards);
        this.pos = { x:0,y:0 };
        this.stackId = 0;
        this.setStackPosition(this.id);
        // this.ondeck = true;
        this.facedown = true;
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

    // This function should be modified for each new game
    // Containing the way in which each stack will orient its cards
    BJ.Card.prototype.setStackPosition = function(position) {
        // console.log(deckposition)
        var stack = BJ.stacks[this.stackId];
        position = position===undefined ? stack.cards.length-1 : position;
        // console.log(this);
        this.view.css({"z-index":(60 * (this.stackId)) + stack.cards.length});
        if(stack.name=="Deck") 
        {
            this.setPos(
                BJ.deckLeft + Math.floor(position/BJ.stackModulo)*2, 
                BJ.deckTop - Math.floor(position/BJ.stackModulo)*2
                );
            this.view.css({"z-index":position});
        }
        else if(stack.name=="Discard")
        {
            this.setPos(
                stack.pos.x + ((stack.cards.length-1) * ((BJ.cardWidth/10) + BJ.cardGap)),
                stack.pos.y
                );
        }
        else
        {
            this.setPos(
                stack.pos.x + ((stack.cards.length-1) * ((BJ.cardWidth) + BJ.cardGap)),
                stack.pos.y
                );
        }
    };
    BJ.Card.prototype.addFaceDown = function(){
        if(!this.facedown){
            this.facedown = true;
            this.view
                .addClass("facedown");
        }
        return this;
    };
    BJ.Card.prototype.removeFaceDown = function(){
        if(this.facedown){
            this.facedown = false;
            this.view
                .removeClass("facedown");
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





    BJ.StackCommand = function(){
        this.commands = [];
        this.currentCommand = false;
        this.timer = false;
    };
    // Add a command to the end of the stack
    BJ.StackCommand.prototype.addCmd = function(callback,length){
        this.commands.push({cb:callback,l:length});
        if(this.timer===false) this.runCmd();
        return this;
    };
    // Add a command to the beginning of the stack, pause and reset any currently running command
    BJ.StackCommand.prototype.insertCmd = function(callback,length){
        if(this.currentcommand!==false) {
            this.clearTimer();
            this.commands.push(this.currentcommand);
            this.currentcommand = false;
        }
        this.commands.push({cb:callback,l:length});
        if(this.timer===false) this.runCmd();
        return this;
    };
    // Add an array of command objects to the stack
    BJ.StackCommand.prototype.addCmds = function(callbacks){
        this.commands.concat(callbacks);
        if(this.timer===false) this.runCmd();
    };
    // Add an empty timer to the stack
    BJ.StackCommand.prototype.delay = function(time){
        return this.addCmd(function(){},time);
    };
    // Add an empty timer to the beginning of the stack
    BJ.StackCommand.prototype.pause = function(time){
        this.clearTimer();
        return this.insertCmd(function(){},time);
    };
    // Remove and return the first command from the stack
    BJ.StackCommand.prototype.getCmd = function(){
        return this.commands.shift();
    };
    // Run the first command and call itself back if there are more available
    BJ.StackCommand.prototype.runCmd = function(){
        // console.log(this.commands)
        if(!this.commands.length) {
            this.timer = false;
            return;
        }
        var self = this;
        this.currentcommand = this.getCmd();
        this.timer = setTimeout(function(){
            self.currentcommand.cb();
            self.currentcommand = false;
            self.runCmd();
        },self.currentcommand.l);
    };
    // Clear out the current timer
    BJ.StackCommand.prototype.clearTimer = function(){
        clearTimeout(this.timer);
        this.timer = false;
    };





    BJ.init();

    window.BJ = BJ;
})();
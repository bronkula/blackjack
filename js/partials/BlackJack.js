define(['underscore', 'jquery', 'Player', 'Dealer', 'Deck', 'Discard', 'StackCommand'], function() {
    var BJ = {};


// INITIALIZER
    BJ.init = function(){

        BJ.cmdStack = new StackCommand();

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
            BJ.deck().freshDeck(BJ.suits,BJ.faces).shuffle();
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
                BJ.deck().dealTo(BJ.player())
                    .removeFaceDown()
                    .setStackPosition();
                BJ.deck().dealTo(BJ.player())
                    .removeFaceDown()
                    .setStackPosition();
            }
        });
        $(".js-dealdealer").on("click",function(){
            if(BJ.deck().cards.length) {
                BJ.deck().dealTo(BJ.dealer())
                    // .removeFaceDown()
                    .setStackPosition();
                BJ.deck().dealTo(BJ.dealer())
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
            new CardStack(0,"Deck",[],BJ.deckLeft,BJ.deckTop),
            new CardStack(1,"Dealer",[],BJ.dealerLeft,BJ.dealerTop),
            new CardStack(2,"Player",[],BJ.playerLeft,BJ.playerTop),
            new CardStack(3,"Discard",[],BJ.discardLeft,BJ.discardTop)
        ];
        BJ.writeMsg("&nbsp;");
    };
    BJ.startGame = function(){
        BJ.resetStacks();
        $(".view-cards").empty();
        BJ.deck().freshDeck(BJ.suits,BJ.faces).shuffle();
    };


    BJ.makeGameDB = function(){
        BJ.playerMoney = 100;
        BJ.playerBet = 10;
    };
    BJ.drawGameDB = function(){
        $(".db-money .db-value").html(BJ.playerMoney);
        $(".db-bet .db-value").html(BJ.playerBet);
    };

    BJ.changeMoney = function(type) {
        if(type==0){
            BJ.playerMoney -= BJ.playerBet;
        }
        if(type==1){
            BJ.playerMoney += BJ.playerBet;

        }
        if(type==2){
            BJ.playerMoney += Math.ceil(BJ.playerBet * 1.5);
        }
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
        BJ.dealer().gatherCards(BJ.deck());
        BJ.player().gatherCards(BJ.deck());
        BJ.discard().gatherCards(BJ.deck());
        BJ.deck().drawStack();
        // $(".view-cards").empty();
    };
    BJ.discardHands = function(){
        BJ.dealer().discardCards(BJ.discard());
        BJ.player().discardCards(BJ.discard());
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

    };
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
                BJ.changeMoney(0);
            }
            else
            {
                // console.log("Scenario 3")
                BJ.writeMsg("Dealer 21! You Lose!");
                BJ.changeMoney(0);
            }
        }
        else if(p.cards.length==2 && p.points==21)
        {
                // console.log("Scenario 4")
            BJ.writeMsg("Blackjack! You Win!");
                BJ.changeMoney(2);
        }
        else if(d.points>21)
        {
                // console.log("Scenario 5")
            BJ.writeMsg("Dealer Busts! You Win!");
            BJ.changeMoney(1);
        }
        else if(p.points>21)
        {
                // console.log("Scenario 6")
            BJ.writeMsg("Player Busts! You Lose");
            BJ.changeMoney(0);
        }
        else if(d.points>16 && !d.firstCard().facedown)
        {
            if(d.points>p.points)
            {
                // console.log("Scenario 7")
                BJ.writeMsg("Dealer Wins! You Lose!");
                BJ.changeMoney(0);
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
                BJ.changeMoney(1);
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

        // Code to run if the deal is over
        if(!result) {
            d.firstCard().removeFaceDown();
            BJ.drawGameDB();
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
            BJ.deck().dealTo(BJ.dealer())
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
            BJ.deck().freshDeck(BJ.suits,BJ.faces).shuffle().shuffle();
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
                BJ.deck().dealTo(BJ.player())
                    .removeFaceDown()
                    .setStackPosition();
            },100)
            .addCmd(function(){
                BJ.deck().dealTo(BJ.dealer())
                    // .removeFaceDown()
                    .setStackPosition();
            },100)
            .addCmd(function(){
                BJ.deck().dealTo(BJ.player())
                    .removeFaceDown()
                    .setStackPosition();
            },100)
            .addCmd(function(){
                BJ.deck().dealTo(BJ.dealer())
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
                BJ.deck().dealTo(BJ.player())
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







    return {init:init};
});
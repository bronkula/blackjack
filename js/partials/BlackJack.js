define(['underscore', 'jquery', 'Player', 'Dealer', 'Deck',
    'Discard', 'StackCommand', 'GameValues'], 
    function(underscore,jquery,Player,Dealer,Deck,
        Discard,StackCommand,GV) {

    cmdStack = new StackCommand();

// INITIALIZER
    init = function(){

        $(".view-cards").css({"font-size":GV.cardFontSize+"px"});
        $(".title-dealer").css({"top":(GV.rowGap+GV.cardHeight+GV.cardGap)+"px"});
        $(".title-player").css({"top":(((GV.rowGap+GV.cardHeight)*2)+GV.cardGap)+"px"});

        // viewGame = $(".view-game");
        // viewCards = $(".view-cards");
        // viewControls = $(".view-controls");
        // viewStats = $(".view-stats");

        // $("h1").on("click",startGame);
        // $(".js-dealcards").on("click",function(){
        //     GV.deck().freshDeck().shuffle();
        // });
        $(".js-newgame").on("click",startGame);
        // $(".js-gathercards").on("click",function(){
        //     gatherCards();
        //     // deck().reOrder().shuffle();
        // });
        // $(".js-discardhands").on("click",function(){
        //     discardHands();
        //     // deck().reOrder().shuffle();
        // });
        // $(".js-shuffledeck").on("click",function(){
        //     GV.deck().shuffle();
        //     // drawTable();
        // });
        // $(".js-dealplayer").on("click",function(){
        //     if(GV.deck().cards.length) {
        //         GV.deck().dealTo(GV.player())
        //             .removeFaceDown()
        //             .setStackPosition();
        //         GV.deck().dealTo(GV.player())
        //             .removeFaceDown()
        //             .setStackPosition();
        //     }
        // });
        // $(".js-dealdealer").on("click",function(){
        //     if(GV.deck().cards.length) {
        //         GV.deck().dealTo(GV.dealer())
        //             // .removeFaceDown()
        //             .setStackPosition();
        //         GV.deck().dealTo(GV.dealer())
        //             .removeFaceDown()
        //             .setStackPosition();
        //     }
        // });
        $(".js-dealinitial").on("click",function(){gameMove('deal');});
        $(".js-hitplayer").on("click",function(){gameMove('hit');});
        $(".js-stayplayer").on("click",function(){gameMove('stay');});
        $(".js-doubledown").on("click",function(){gameMove('double');});
        $(".js-splitcards").on("click",function(){gameMove('split');});




        $("body").on("click",".card",function(){
            console.log($(this).data("card"));
        })
        .on("keypress",function(e){
            if(e.keyCode==97) dealInitial();
            else if(e.keyCode==115) hitPlayer();
            else if(e.keyCode==100) stayPlayer();
        })
        ;

        makeGameDB();
        drawGameDB();

        startGame();
    };



// BASIC GAME FUNCTIONS
    // resetStacks = function(){
    //     stacks = [
    //         new CardStack(0,"Deck",[],deckLeft,deckTop),
    //         new CardStack(1,"Dealer",[],dealerLeft,dealerTop),
    //         new CardStack(2,"Player",[],playerLeft,playerTop),
    //         new CardStack(3,"Discard",[],discardLeft,discardTop)
    //     ];
    //     writeMsg("&nbsp;");
    // };
    startGame = function(){
        // console.log(BJ)
        GV.makeEntities();
        console.log(GV)
        $(".view-cards").empty();
        // GV.deck().freshDeck().shuffle();
    };


    makeGameDB = function(){
        playerMoney = 100;
        playerBet = 10;
    };
    drawGameDB = function(){
        $(".db-money .db-value").html(playerMoney);
        $(".db-bet .db-value").html(playerBet);
    };

    changeMoney = function(type) {
        if(type==0){
            playerMoney -= playerBet;
        }
        if(type==1){
            playerMoney += playerBet;

        }
        if(type==2){
            playerMoney += Math.ceil(playerBet * 1.5);
        }
    }


    drawDeckInStats = function(){
        // $(".view-stats").empty();
        // console.log(deck,deck.shuffle(),deck);
        var $div = $("<div class='row'>");
        for(var i in GV.deck().cards) {
            card = GV.deck().cards[i];
            $div.append(card.view," ");
        }
        viewStats.append($div);
    };

    gatherCards = function(){
        GV.dealer().gatherCards(GV.deck());
        GV.player().gatherCards(GV.deck());
        GV.discard().gatherCards(GV.deck());
        GV.deck().drawStack();
        // $(".view-cards").empty();
    };
    discardHands = function(){
        GV.dealer().discardCards(GV.discard());
        GV.player().discardCards(GV.discard());
        if(!GV.deck().cards.length) gatherDiscard();
        // $(".view-cards").empty();
    };
    gatherDiscard = function(){
        // cmdStack.addCmd(function(){discard().gatherCards();},0)
        // .addCmd(function(){deck().shuffle()},100).addCmd(function(){deck().shuffle()},100)
        GV.discard().gatherCards();
        GV.deck().shuffle().shuffle();
        cmdStack.delay(300);
    }
    dealerScore = function(){
        return GV.dealer().firstCard().facedown ? GV.dealer().cards[1].face.points : GV.dealer().points;
    };
    playerScore = function(){
        return GV.player().points;
    };
    writeScores = function(){
        $(".title-dealer .title-points").html(dealerScore());
        $(".title-player .title-points").html(playerScore());
        // addMsg("<br>Dealer is showing "+dealerScore()+"<br>You are showing "+playerScore());
    }





// GAME FUNCTIONS
    checkHand = function(hand){
        hand.points = 0;
        hand.soft = false;
        for(var i=0,l=hand.cards.length; i<l; i++) {
            checkCard(hand,hand.cards[i]);
        }
    };
    checkCard = function(hand,card){
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
    checkScenario = function(){
        var d = GV.dealer(), p = GV.player();
        // console.log(d.points,p.points)
        result = false;
        
        if(d.points==21)
        {
            if(p.points==21)
            {
                // console.log("Scenario 1")
                writeMsg("It's a Draw!");
            }
            else if(d.cards.length==2)
            {
                // console.log("Scenario 2")
                writeMsg("Dealer Blackjack! You Lose!");
                changeMoney(0);
            }
            else
            {
                // console.log("Scenario 3")
                writeMsg("Dealer 21! You Lose!");
                changeMoney(0);
            }
        }
        else if(p.cards.length==2 && p.points==21)
        {
                // console.log("Scenario 4")
            writeMsg("Blackjack! You Win!");
            changeMoney(2);
        }
        else if(d.points>21)
        {
                // console.log("Scenario 5")
            writeMsg("Dealer Busts! You Win!");
            changeMoney(1);
        }
        else if(p.points>21)
        {
                // console.log("Scenario 6")
            writeMsg("Player Busts! You Lose");
            changeMoney(0);
        }
        else if(d.points>16 && !d.firstCard().facedown)
        {
            if(d.points>p.points)
            {
                // console.log("Scenario 7")
                writeMsg("Dealer Wins! You Lose!");
                changeMoney(0);
            }
            else if(d.points==p.points)
            {
                // console.log("Scenario 8")
                writeMsg("It's a Draw!");
            }
            else
            {
                // console.log("Scenario 9")
                writeMsg("You Win!");
                changeMoney(1);
            }
        }
        else if(p.points==21 && !d.firstCard().facedown)
        {
                // console.log("Scenario 10")
            writeMsg("21!");
            result = true;
        }
        else
        {
            // writeMsg("No Change");
                // console.log("Scenario 11")
            result = true;
        }

        // Code to run if the deal is over
        if(!result) {
            d.firstCard().removeFaceDown();
            drawGameDB();
            // discardHands();
        }
        writeScores();
        // addMsg("<br>Dealer is showing "+dealerScore()+"<br>You are showing "+playerScore());
        return result;
    };

    playDealer = function(){
        GV.dealer().cards[0].removeFaceDown();
        cmdStack.addCmd(makeDealerChoice,10);
    };
    makeDealerChoice = function(){
        if(!GV.deck().cards.length) {
            gatherDiscard();
        }
        if(checkScenario()) {
            GV.deck().dealTo(GV.dealer())
                .removeFaceDown()
                .setStackPosition();
            checkCard(GV.dealer(),GV.dealer().lastCard());
            cmdStack.addCmd(makeDealerChoice,200);
        }
    };

    gameMove = function(str) {
        if(
            !GV.deck().cards.length &&
            !GV.dealer().cards.length &&
            !GV.player().cards.length &&
            !GV.discard().cards.length
            ) {
            GV.deck().freshDeck().shuffle().shuffle();
        }
        if(!GV.deck().cards.length) {
            gatherDiscard();
        }

        writeMsg("&nbsp;");

        switch(str) {
            case "deal":
                dealInitial();
                break;
            case "hit":
                hitPlayer();
                break;
            case "stay":
                stayPlayer();
                break;
        }
    }
    dealInitial = function(){
        if(GV.dealer().cards.length || GV.player().cards.length) {
            if(GV.dealer().firstCard().facedown) {
                writeMsg("Finish the hand first");
                return;
            } else {
                cmdStack.addCmd(discardHands,150);
            }
        }
        if(GV.deck().cards.length || GV.discard().cards.length) {
            if(GV.deck().cards.length<4){
                gatherDiscard();
            }
            cmdStack.addCmd(function(){
                GV.deck().dealTo(GV.player())
                    .removeFaceDown()
                    .setStackPosition();
            },100)
            .addCmd(function(){
                GV.deck().dealTo(GV.dealer())
                    // .removeFaceDown()
                    .setStackPosition();
            },100)
            .addCmd(function(){
                GV.deck().dealTo(GV.player())
                    .removeFaceDown()
                    .setStackPosition();
            },100)
            .addCmd(function(){
                GV.deck().dealTo(GV.dealer())
                    .removeFaceDown()
                    .setStackPosition();
            },100)
            .addCmd(function(){
                checkHand(GV.player());
                checkHand(GV.dealer());
                checkScenario();
            },0);
        }
    };
    hitPlayer = function(){
        if(!GV.dealer().firstCard().facedown){
            writeMsg("Game Over<br>Deal a New Hand");
            return;
        }
        if(GV.deck().cards.length || GV.discard().cards.length) {
            cmdStack.addCmd(function(){
                GV.deck().dealTo(GV.player())
                    .removeFaceDown()
                    .setStackPosition();
                checkHand(GV.player());
                checkScenario();
            },100);
        }
    };
    stayPlayer = function(){
        if(!GV.dealer().firstCard().facedown){
            writeMsg("Game Over<br>Deal a New Hand");
            return;
        }
        if(GV.deck().cards.length || GV.discard().cards.length) {
            playDealer();
        }
    };

    writeMsg = function(msg) {
        $(".db-message").html(msg);
    };
    addMsg = function(msg) {
        $(".db-message").append(msg);
    };







    return {init:init};
});
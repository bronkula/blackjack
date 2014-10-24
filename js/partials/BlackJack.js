define(['underscore', 'jquery', 'StackCommand', 
    'GameValues', 'GameMechanics', 'ViewMechanics',
    'Deck','Dealer','Player','Discard'], 
    function(underscore,jquery,StackCommand,
        GV,GM,VM,
        Deck,Dealer,Player,Discard) {
    cmdStack = new StackCommand();

// INITIALIZER
    init = function(){

        $(".game-version").html("v"+GV.gameVersion);

        $(".view-cards").css({"font-size":GV.cardFontSize+"px"});
        $(".title-dealer").css({"top":(GV.rowGap+GV.cardHeight+GV.cardGap)+"px"});
        $(".title-player").css({"top":(((GV.rowGap+GV.cardHeight)*2)+GV.cardGap)+"px"});


        // $("h1").on("click",startGame);
        // $(".js-dealcards").on("click",function(){
        //     GM.deck(0).freshDeck().shuffle();
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
        //     GM.deck(0).shuffle();
        //     // drawTable();
        // });
        // $(".js-dealplayer").on("click",function(){
        //     if(GM.deck(0).cards.length) {
        //         GM.deck(0).dealTo(GM.player(0))
        //             .removeFaceDown()
        //             .setStackPosition();
        //         GM.deck(0).dealTo(GM.player(0))
        //             .removeFaceDown()
        //             .setStackPosition();
        //     }
        // });
        // $(".js-dealdealer").on("click",function(){
        //     if(GM.deck(0).cards.length) {
        //         GM.deck(0).dealTo(GM.dealer(0))
        //             // .removeFaceDown()
        //             .setStackPosition();
        //         GM.deck(0).dealTo(GM.dealer(0))
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
    //     VM.writeMsg("&nbsp;");
    // };
    startGame = function(){
        var newentities = [
            (new Deck(0,"Deck",GV.deckLeft,GV.deckTop)).makeStacks(1),
            (new Dealer(1,"Dealer",GV.dealerLeft,GV.dealerTop)).makeStacks(1),
            (new Player(2,"Player",GV.playerLeft,GV.playerTop)).makeStacks(4),
            (new Discard(3,"Discard",GV.discardLeft,GV.discardTop)).makeStacks(1)
        ];
        GM.makeEntities(newentities);
        // console.log(GV)

        $(".view-cards").empty();
        GM.deck(0).freshDeck().drawDeck().shuffle();
        // GM.deck(0).freshDeck().shuffle();
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
        for(var i in GM.deck(0).cards) {
            card = GM.deck(0).cards[i];
            $div.append(card.view," ");
        }
        viewStats.append($div);
    };

    gatherCards = function(){
        GM.dealer(0).gatherCards(GM.deck(0));
        GM.player(0).gatherCards(GM.deck(0));
        GM.discard(0).gatherCards(GM.deck(0));
        GM.deck(0).drawStack();
        // $(".view-cards").empty();
    };
    discardHands = function(){
        GM.dealer(0).discardCards(GM.discard(0));
        GM.player(0).discardCards(GM.discard(0));
        if(!GM.deck(0).cards.length) gatherDiscard();
        // $(".view-cards").empty();
    };
    gatherDiscard = function(){
        // cmdStack.addCmd(function(){discard().gatherCards();},0)
        // .addCmd(function(){deck().shuffle()},100).addCmd(function(){deck().shuffle()},100)
        GM.discard(0).gatherCards();
        GM.deck(0).shuffle().shuffle();
        cmdStack.delay(300);
    }
    dealerScore = function(){
        return GM.dealer(0).firstCard().facedown ? GM.dealer(0).cards[1].face.points : GM.dealer(0).points;
    };
    playerScore = function(){
        return GM.player(0).points;
    };
    writeScores = function(){
        $(".title-dealer .title-points").html(dealerScore());
        $(".title-player .title-points").html(playerScore());
        // VM.addMsg("<br>Dealer is showing "+dealerScore()+"<br>You are showing "+playerScore());
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
        var d = GM.dealer(0), p = GM.player(0);
        // console.log(d.points,p.points)
        result = false;
        
        if(d.points==21)
        {
            if(p.points==21)
            {
                // console.log("Scenario 1")
                VM.writeMsg("It's a Draw!");
            }
            else if(d.cards.length==2)
            {
                // console.log("Scenario 2")
                VM.writeMsg("Dealer Blackjack! You Lose!");
                changeMoney(0);
            }
            else
            {
                // console.log("Scenario 3")
                VM.writeMsg("Dealer 21! You Lose!");
                changeMoney(0);
            }
        }
        else if(p.cards.length==2 && p.points==21)
        {
                // console.log("Scenario 4")
            VM.writeMsg("Blackjack! You Win!");
            changeMoney(2);
        }
        else if(d.points>21)
        {
                // console.log("Scenario 5")
            VM.writeMsg("Dealer Busts! You Win!");
            changeMoney(1);
        }
        else if(p.points>21)
        {
                // console.log("Scenario 6")
            VM.writeMsg("Player Busts! You Lose");
            changeMoney(0);
        }
        else if(d.points>16 && !d.firstCard().facedown)
        {
            if(d.points>p.points)
            {
                // console.log("Scenario 7")
                VM.writeMsg("Dealer Wins! You Lose!");
                changeMoney(0);
            }
            else if(d.points==p.points)
            {
                // console.log("Scenario 8")
                VM.writeMsg("It's a Draw!");
            }
            else
            {
                // console.log("Scenario 9")
                VM.writeMsg("You Win!");
                changeMoney(1);
            }
        }
        else if(p.points==21 && !d.firstCard().facedown)
        {
                // console.log("Scenario 10")
            VM.writeMsg("21!");
            result = true;
        }
        else
        {
            // VM.writeMsg("No Change");
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
        // VM.addMsg("<br>Dealer is showing "+dealerScore()+"<br>You are showing "+playerScore());
        return result;
    };

    playDealer = function(){
        GM.dealer(0).cards[0].removeFaceDown();
        cmdStack.addCmd(makeDealerChoice,10);
    };
    makeDealerChoice = function(){
        if(!GM.deck(0).cards.length) {
            gatherDiscard();
        }
        if(checkScenario()) {
            GM.setStackPosition(
                GM.deck(0).dealTo(GM.dealer(0)).removeFaceDown()
                );
            checkCard(GM.dealer(0),GM.dealer(0).lastCard());
            cmdStack.addCmd(makeDealerChoice,200);
        }
    };

    gameMove = function(str) {
        if(
            !GM.deck(0).cards.length &&
            !GM.dealer(0).cards.length &&
            !GM.player(0).cards.length &&
            !GM.discard(0).cards.length
            ) {
            GM.deck(0).freshDeck().shuffle().shuffle();
        }
        if(!GM.deck(0).cards.length) {
            gatherDiscard();
        }

        VM.writeMsg("&nbsp;");

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
        if(GM.dealer(0).cards.length || GM.player(0).cards.length) {
            if(GM.dealer(0).firstCard().facedown) {
                VM.writeMsg("Finish the hand first");
                return;
            } else {
                cmdStack.addCmd(discardHands,150);
            }
        }
        if(GM.deck(0).cards.length || GM.discard(0).cards.length) {
            if(GM.deck(0).cards.length<4){
                gatherDiscard();
            }
            cmdStack.addCmd(function(){
                GM.setStackPosition(
                    GM.deck(0).dealTo(GM.player(0)).removeFaceDown()
                    );
            },100)
            .addCmd(function(){
                GM.setStackPosition(
                    GM.deck(0).dealTo(GM.dealer(0))
                    // .removeFaceDown()
                    );
            },100)
            .addCmd(function(){
                GM.setStackPosition(
                    GM.deck(0).dealTo(GM.player(0)).removeFaceDown()
                    );
            },100)
            .addCmd(function(){
                GM.setStackPosition(
                    GM.deck(0).dealTo(GM.dealer(0)).removeFaceDown()
                    );
            },100)
            .addCmd(function(){
                checkHand(GM.player(0));
                checkHand(GM.dealer(0));
                checkScenario();
            },0);
        }
    };
    hitPlayer = function(){
        if(!GM.dealer(0).firstCard().facedown){
            VM.writeMsg("Game Over<br>Deal a New Hand");
            return;
        }
        if(GM.deck(0).cards.length || GM.discard(0).cards.length) {
            cmdStack.addCmd(function(){
                GM.setStackPosition(
                    GM.deck(0).dealTo(GM.player(0)).removeFaceDown()
                    );
                checkHand(GM.player(0));
                checkScenario();
            },100);
        }
    };
    stayPlayer = function(){
        if(!GM.dealer(0).firstCard().facedown){
            VM.writeMsg("Game Over<br>Deal a New Hand");
            return;
        }
        if(GM.deck(0).cards.length || GM.discard(0).cards.length) {
            playDealer();
        }
    };







    return {init:init};
});
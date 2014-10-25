define(['GameMechanics','MoneyMechanics'],
    function(GM,MM){

    BM = {};

    BM.checkScenario = function(){
        var d = GM.dealer(0), p = GM.player(0);
        // console.log(d.points,p.points)
        result = false;
        
        if(d.points==21)
        {
            if(p.points==21)
            {
                // console.log("Scenario 1")
                GM.writeMsg("It's a Draw!");
            }
            else if(d.cards.length==2)
            {
                // console.log("Scenario 2")
                GM.writeMsg("Dealer Blackjack! You Lose!");
                MM.changeMoney(0);
            }
            else
            {
                // console.log("Scenario 3")
                GM.writeMsg("Dealer 21! You Lose!");
                MM.changeMoney(0);
            }
        }
        else if(p.cards.length==2 && p.points==21)
        {
                // console.log("Scenario 4")
            GM.writeMsg("Blackjack! You Win!");
            MM.changeMoney(2);
        }
        else if(d.points>21)
        {
                // console.log("Scenario 5")
            GM.writeMsg("Dealer Busts! You Win!");
            MM.changeMoney(1);
        }
        else if(p.points>21)
        {
                // console.log("Scenario 6")
            GM.writeMsg("Player Busts! You Lose");
            MM.changeMoney(0);
        }
        else if(d.points>16 && !d.firstCard().facedown)
        {
            if(d.points>p.points)
            {
                // console.log("Scenario 7")
                GM.writeMsg("Dealer Wins! You Lose!");
                MM.changeMoney(0);
            }
            else if(d.points==p.points)
            {
                // console.log("Scenario 8")
                GM.writeMsg("It's a Draw!");
            }
            else
            {
                // console.log("Scenario 9")
                GM.writeMsg("You Win!");
                MM.changeMoney(1);
            }
        }
        else if(p.points==21 && !d.firstCard().facedown)
        {
                // console.log("Scenario 10")
            GM.writeMsg("21!");
            result = true;
        }
        else
        {
            // GM.writeMsg("No Change");
                // console.log("Scenario 11")
            result = true;
        }

        // Code to run if the deal is over
        if(!result) {
            d.firstCard().removeFaceDown();
            MM.resetBet();
            MM.drawMoney();
            // discardHands();
        }
        BM.writePoints();
        // GM.addMsg("<br>Dealer is showing "+dealerScore()+"<br>You are showing "+playerScore());
        return result;
    };




    // Points handling
    BM.dealerPoint = function(){
        return GM.dealer(0).firstCard().facedown ? GM.dealer(0).cards[1].face.points : GM.dealer(0).points;
    };
    BM.playerPoint = function(){
        return GM.player(0).points;
    };

    BM.writePoints = function(){
        $(".title-dealer .title-points").html(BM.dealerPoint());
        $(".title-player .title-points").html(BM.playerPoint());
        // GM.addMsg("<br>Dealer is showing "+dealerScore()+"<br>You are showing "+playerScore());
    }



    // Move mechanics
    BM.gameMove = function(str) {
        if(
            !GM.deck(0).cards.length &&
            !GM.dealer(0).cards.length &&
            !GM.player(0).cards.length &&
            !GM.discard(0).cards.length
            ) {
            GM.deck(0).freshDeck().shuffle().shuffle();
        }
        if(!GM.deck(0).cards.length) {
            BM.gatherDiscard();
        }

        GM.writeMsg("&nbsp;");

        switch(str) {
            case "deal":
                BM.dealInitial();
                break;
            case "hit":
                BM.hitPlayer();
                break;
            case "double":
                BM.doublePlayer();
                break;
            case "stay":
                BM.stayPlayer();
                break;
            case "split":
                BM.splitPlayer();
                break;
        }
    }
    BM.dealInitial = function(){
        if(GM.dealer(0).cards.length || GM.player(0).cards.length) {
            if(GM.dealer(0).firstCard().facedown) {
                GM.writeMsg("Finish the hand first");
                return;
            } else {
                GV.cmdStack.addCmd(BM.discardHands,150);
            }
        }
        if(GM.deck(0).cards.length || GM.discard(0).cards.length) {
            if(GM.deck(0).cards.length<4){
                BM.gatherDiscard();
            }
            GV.cmdStack.addCmd(function(){
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
                BM.checkHand(GM.player(0));
                BM.checkHand(GM.dealer(0));
                BM.checkScenario();
            },0);
        }
    };
    BM.hitPlayer = function(){
        if(!GM.dealer(0).firstCard().facedown){
            GM.writeMsg("Game Over<br>Deal a New Hand");
            return;
        }
        if(GM.deck(0).cards.length || GM.discard(0).cards.length) {
            GV.cmdStack.addCmd(function(){
                GM.setStackPosition(
                    GM.deck(0).dealTo(GM.player(0)).removeFaceDown()
                    );
                BM.checkHand(GM.player(0));
                BM.checkScenario();
            },100);
        }
    };
    BM.doublePlayer = function(){
        if(GM.player(0).cards.length==2) {
            MM.doubleDown();
            GV.cmdStack.addCmd(function(){
                GM.setStackPosition(
                    GM.deck(0).dealTo(GM.player(0)).removeFaceDown()
                    );
                BM.checkHand(GM.player(0));
                BM.checkScenario();
                
                BM.stayPlayer();
            },100)
        } else {
            GM.writeMsg("Can't Double Down Now");
            return;
        }
    };
    BM.stayPlayer = function(){
        if(!GM.dealer(0).firstCard().facedown){
            GM.writeMsg("Game Over<br>Deal a New Hand");
            return;
        }
        if(GM.deck(0).cards.length || GM.discard(0).cards.length) {
            BM.playDealer();
        }
    };




// GAME FUNCTIONS
    BM.checkHand = function(hand){
        hand.points = 0;
        hand.soft = false;
        for(var i=0,l=hand.cards.length; i<l; i++) {
            BM.checkCard(hand,hand.cards[i]);
        }
    };
    BM.checkCard = function(hand,card){
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



    // Dealer Mechanics
    BM.playDealer = function(){
        GM.dealer(0).cards[0].removeFaceDown();
        GV.cmdStack.addCmd(BM.makeDealerChoice,10);
    };
    BM.makeDealerChoice = function(){
        if(!GM.deck(0).cards.length) {
            BM.gatherDiscard();
        }
        if(BM.checkScenario()) {
            GM.setStackPosition(
                GM.deck(0).dealTo(GM.dealer(0)).removeFaceDown()
                );
            BM.checkCard(GM.dealer(0),GM.dealer(0).lastCard());
            GV.cmdStack.addCmd(BM.makeDealerChoice,200);
        }
    };




    // Gather Mechanics
    BM.gatherCards = function(){
        GM.dealer(0).gatherCards(GM.deck(0));
        GM.player(0).gatherCards(GM.deck(0));
        GM.discard(0).gatherCards(GM.deck(0));
        GM.deck(0).drawStack();
        // $(".view-cards").empty();
    };
    BM.discardHands = function(){
        GM.dealer(0).discardCards(GM.discard(0));
        GM.player(0).discardCards(GM.discard(0));
        if(!GM.deck(0).cards.length) BM.gatherDiscard();
        // $(".view-cards").empty();
    };
    BM.gatherDiscard = function(){
        // GV.cmdStack.addCmd(function(){discard().gatherCards();},0)
        // .addCmd(function(){deck().shuffle()},100).addCmd(function(){deck().shuffle()},100)
        GM.discard(0).gatherCards(GM.deck(0));
        GM.deck(0).shuffle().shuffle();
        GV.cmdStack.pause(300);
    }



    return BM;
});
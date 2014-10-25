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
            gatherDiscard();
        }

        GM.writeMsg("&nbsp;");

        switch(str) {
            case "deal":
                BM.dealInitial();
                break;
            case "hit":
                BM.hitPlayer();
                break;
            case "stay":
                BM.stayPlayer();
                break;
        }
    }
    BM.dealInitial = function(){
        if(GM.dealer(0).cards.length || GM.player(0).cards.length) {
            if(GM.dealer(0).firstCard().facedown) {
                GM.writeMsg("Finish the hand first");
                return;
            } else {
                GV.cmdStack.addCmd(discardHands,150);
            }
        }
        if(GM.deck(0).cards.length || GM.discard(0).cards.length) {
            if(GM.deck(0).cards.length<4){
                gatherDiscard();
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
                checkHand(GM.player(0));
                checkHand(GM.dealer(0));
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
                checkHand(GM.player(0));
                BM.checkScenario();
            },100);
        }
    };
    BM.stayPlayer = function(){
        if(!GM.dealer(0).firstCard().facedown){
            GM.writeMsg("Game Over<br>Deal a New Hand");
            return;
        }
        if(GM.deck(0).cards.length || GM.discard(0).cards.length) {
            playDealer();
        }
    };


    return BM;
});
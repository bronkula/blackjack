define(['underscore', 'jquery',
    'GameValues', 'GameMechanics', 'BlackJackMechanics', 'MoneyMechanics',
    'Deck','Dealer','Player','Discard'],
    function(underscore,jquery,
        GV,GM,BM,MM,
        Deck,Dealer,Player,Discard) {

// INITIALIZER
    init = function(){

        $(".game-version").html("v"+GV.gameVersion);

        $(".view-cards").css({"font-size":GV.cardFontSize+"px"});
        $(".title-dealer").css({"top":(GV.rowGap+GV.cardHeight+GV.cardGap)+"px"});
        $(".title-player").css({"top":(((GV.rowGap+GV.cardHeight)*2)+GV.cardGap)+"px"});

        $(".js-newgame").on("click",startGame);

        $(".js-dealinitial").on("click",function(){BM.gameMove('deal');});
        $(".js-hitplayer").on("click",function(){BM.gameMove('hit');});
        $(".js-stayplayer").on("click",function(){BM.gameMove('stay');});
        $(".js-doubledown").on("click",function(){BM.gameMove('double');});
        $(".js-splitcards").on("click",function(){BM.gameMove('split');});




        $("body").on("click",".card",function(){
            console.log($(this).data("card"));
        })
        .on("keypress",function(e){
            if(e.keyCode==97) dealInitial();
            else if(e.keyCode==115) hitPlayer();
            else if(e.keyCode==100) stayPlayer();
        })
        ;


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
    //     GM.writeMsg("&nbsp;");
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

        MM.makeMoney();
        MM.drawMoney();

        $(".view-cards").empty();
        GM.deck(0).freshDeck().drawDeck().shuffle();
        // GM.deck(0).freshDeck().shuffle();
    };



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
        // GV.cmdStack.addCmd(function(){discard().gatherCards();},0)
        // .addCmd(function(){deck().shuffle()},100).addCmd(function(){deck().shuffle()},100)
        GM.discard(0).gatherCards(GM.deck(0));
        GM.deck(0).shuffle().shuffle();
        GV.cmdStack.pause(300);
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

    playDealer = function(){
        GM.dealer(0).cards[0].removeFaceDown();
        GV.cmdStack.addCmd(makeDealerChoice,10);
    };
    makeDealerChoice = function(){
        if(!GM.deck(0).cards.length) {
            gatherDiscard();
        }
        if(BM.checkScenario()) {
            GM.setStackPosition(
                GM.deck(0).dealTo(GM.dealer(0)).removeFaceDown()
                );
            checkCard(GM.dealer(0),GM.dealer(0).lastCard());
            GV.cmdStack.addCmd(makeDealerChoice,200);
        }
    };








    return {init:init};
});
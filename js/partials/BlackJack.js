define(['underscore', 'jquery',
    'GameValues', 'GameMechanics', 'BlackJackMechanics', 'MoneyMechanics',
    'Deck','Dealer','Player','Discard'],
    function(u,j,
        GV,GM,BM,MM,
        Deck,Dealer,Player,Discard) {

// Initialize the document entities and start game
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
            if(e.keyCode==97) BM.dealInitial();
            else if(e.keyCode==115) BM.hitPlayer();
            else if(e.keyCode==100) BM.stayPlayer();
        })
        ;


        startGame();
    };



// Start up data bases and create deck
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












    return {init:init};
});
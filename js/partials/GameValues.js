define(['jquery','StackCommand'],function(j,SC){
// DATABASE
    // Random important heights lengths widths shits
    GV = {};


    GV.gameVersion = 0.6;
    GV.creator = "Hamilton Cline";
    GV.creatorEmail = "hamdiggy@gmail.com";
    GV.creatorwebsite = "http://www.hamiltondraws.com";

    GV.stackModulo = 5;
    GV.cardFontSize = 30;
    GV.cardWidth = GV.cardFontSize*1.6666;
    GV.cardHeight = GV.cardFontSize*2.3333;

    GV.rowGap = 30;
    GV.cardGap = 5;

    GV.deckTop = GV.rowGap;
    GV.deckLeft = GV.rowGap;

    GV.dealerTop = GV.deckTop + GV.cardHeight + GV.rowGap;
    GV.dealerLeft = GV.deckLeft/2;

    GV.playerTop = GV.dealerTop + GV.cardHeight + GV.rowGap;
    GV.playerLeft = GV.deckLeft/2;

    GV.discardTop = GV.playerTop + GV.cardHeight + GV.rowGap;
    GV.discardLeft = 0;

    GV.playerMoney = 100;
    GV.playerBet = 10;



    GV.entities = [];



    GV.cmdStack = new SC();



    GV.viewGame = $(".view-game");
    GV.viewCards = $(".view-cards");
    GV.viewControls = $(".view-controls");
    GV.viewStats = $(".view-stats");

    return GV;
});
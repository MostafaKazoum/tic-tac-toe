const x_icon = "images/icon-x.png";
const o_icon = "images/icon-o.png";
const WINNING_COMBINATIONS = [
	[0, 1, 2],
	[3, 4, 5],
	[6, 7, 8],
	[0, 3, 6],
	[1, 4, 7],
	[2, 5, 8],
	[0, 4, 8],
	[2, 4, 6],
];


const gameoverScreen = document.querySelector(".gameover-screen");
const choiceBtns = document.querySelectorAll(".mark");
const menu = document.querySelector(".menu");
const game = document.querySelector(".game");
const newGamebtn = document.querySelector(".new-game");
const slots = document.querySelectorAll(".slot");
const turnText = document.getElementById("turn");
const oScoreUI = document.querySelector(".O-score");
const xScoreUI = document.querySelector(".X-score");
const tiedScoreUI = document.querySelector(".ties");
const thinkUI = document.querySelector(".thinking");
let firstPlayerChoice = "X";
let secondPlayerCoice = "O"
let isPlayersTurn = true;
let xScore = 0;
let oScore = 0;
let ties = 0;
let someoneWon = false;
let gameover = false;

// handles the menu's btn interactions
choiceBtns.forEach(element => {
    element.onclick = () =>{
        handleBtns(element);
        updateturn();
        console.log("is palyer turn :" + isPlayersTurn);
        
        
    }
});
// handles the new game btn interaction
newGamebtn.onclick = () =>{
    
    newGame();
};

function cpuTurn(){
    if(gameover) return;


    if(isPlayersTurn == false){
        console.log("cpu thinking....");
        thinkUI.classList.toggle("hide");
        turnText.innerHTML = secondPlayerCoice + "'s";
        setTimeout(choseRandomSlot,1000)
    }
}


// loops over slots and checks slot if clicked
slots.forEach(slot => {

    slot.onclick = ()=>{
        // if its not the player's turn return
        if(!isPlayersTurn || gameover){
            console.log("off");
            
            return;
        }

        checkslot(firstPlayerChoice,slot);
        isPlayersTurn = false;
        cpuTurn();
    }
    
});

//checkes a slot based on a choice
function checkslot(choice,slot){
    if(choice == "X"){
        slot.querySelector("img").src="images/icon-x.png";
        slot.classList.add("full");
        secondPlayerCoice = "O";
    }else{
        slot.querySelector("img").src="images/icon-o.png";
        slot.classList.add("full");
        secondPlayerCoice = "X";
        
    }
   CheckGameStatus();
}


// disables the menu and enables the game window
function newGame(){
    menu.style.display = "none";
    game.style.display = "grid";
    console.log("Game Started!");
    

    console.log("User's turn: " + isPlayersTurn);
    console.log("Player1 : " + firstPlayerChoice);
    console.log("Player2 : " + secondPlayerCoice);
    userUI();
    
    if(!isPlayersTurn){
        cpuTurn();
    }
    
}


// selects and descelect the menu's choices btns
function handleBtns(btn){
    choiceBtns.forEach(element => {
        if(element == btn){
            element.classList.add("select");
            firstPlayerChoice = element.id;
        }else{
            element.classList.remove("select");
            secondPlayerCoice = element.id;
        }
    });
    
}

// gives the first turn to the player if he picked X
function updateturn(){
    if(firstPlayerChoice == "X"){
        isPlayersTurn = true;
    }else{
        isPlayersTurn = false;
    }
}

function choseRandomSlot(){
    let randomNum;
    do{
        randomNum =  Math.floor(Math.random() * 9);
        
    } while (SlotIsFull(randomNum) == true)
    const pickedSlot = findSlot(randomNum);
    
    checkslot(secondPlayerCoice, pickedSlot)
    console.log("done thinking!");
    thinkUI.classList.toggle("hide");
    turnText.innerHTML = firstPlayerChoice + "'s";
    isPlayersTurn = true;
}

function findSlot(num) {
    for (let element of slots) { 
        let slotid = element.id.replace('slot', '');  
        
        if (parseInt(slotid) === num) { 
            return document.getElementById("slot" + slotid); 
        }
    }
    return null; 
}

function SlotIsFull(num) {
    for (let element of slots) {
        let slotid = parseInt(element.id.replace("slot", ""));
        
        // If the ID matches the number and the slot is full, return true
        if (num === slotid && element.classList.contains("full")) {
            return true;
        }
    }
    // If no full slot with matching ID was found, return false
    return false;
}


function CheckGameStatus(){
    for(let slot of slots){
        let slotid = parseInt(slot.id.replace("slot",""));
        let status;
        
        if(slot.classList.contains("full")){
            let mark = (slot.querySelector("img").src.includes("x")) ? "X" : "O";
            status = mark;
            // console.log("slot : " + slotid + "\n" + "mark : " + status);
        }

        if(status != null){
            for (const combo of WINNING_COMBINATIONS) {
                let wantedSlots = [
                    slots[combo[0]],
                    slots[combo[1]],
                    slots[combo[2]]
                ]
                
                HandleWantedSlots(wantedSlots)
            }
            if ([...slots].every(el => el.classList.contains('full')) && !someoneWon) {
                console.log("Draw!");
                GameOver("tied")
            }
        }

        

        
    }
}

function AllSlotsStatus(){
    let fullslotsNum = 0;
    for(let slot of slots){
        if(slot.classList.contains('full')){
            fullslotsNum = fullslotsNum + 1;
        } 
    }
    console.log("full slots : " + fullslotsNum);
    
    if(fullslotsNum == slots.length){
        return true;
    }else{
        return false;
    }
}

function HandleWantedSlots(wantedSlots){
    let fullSlotsCount = 0;
    let slotsStatus = [];
    for(const slot of wantedSlots){
        if(slot.classList.contains("full")){
            let mark = (slot.querySelector("img").src.includes("x")) ? "X" : "O";
            fullSlotsCount = fullSlotsCount + 1;
            slotsStatus.push(mark);
        }
    }
    if(fullSlotsCount == wantedSlots.length){
        if(slotsStatus.every(str => str === slotsStatus[0])){
            someoneWon = true;

            wantedSlots.forEach(el =>{
                if(slotsStatus[0] == "X")
                {
                    el.classList.add("x-select")
                }
                else
                {
                    el.classList.add("o-select")
                }
            })

            if(slotsStatus[0] == "X"){
                GameOver("X");
            }else{
                GameOver("O");
            }

        }
    }
}

function GameOver(winner) {
    if (gameover) return; // Prevent multiple invocations

    const results = gameoverScreen.querySelector(".results");
    const tied = gameoverScreen.querySelector(".tied");

    // Set game as over but delay the screen appearance
    gameover = true;
    
    // Delay the display of the game over screen (e.g., by 1 second)
    setTimeout(() => {
        gameoverScreen.classList.toggle("hide");

        if (winner == "X") {
            results.classList.remove("hide");
            tied.classList.add("hide");
            results.querySelector("img").src = x_icon;

            if (firstPlayerChoice == "X") {
                results.querySelector("h4").innerHTML = "you won";
            } else {
                results.querySelector("h4").innerHTML = "oh no,you lost";
            }
            xScore = parseInt(xScore) + 1; // Increment X score
        } else if (winner == "O") {
            results.classList.remove("hide");
            tied.classList.add("hide");
            results.querySelector("img").src = o_icon;

            if (firstPlayerChoice == "O") {
                results.querySelector("h4").innerHTML = "you won";
            } else {
                results.querySelector("h4").innerHTML = "oh no,you lost";
            }
            oScore = parseInt(oScore) + 1; // Increment O score
        } else {
            results.classList.add("hide");
            tied.classList.remove("hide");
            ties = parseInt(ties) + 1; // Increment tie score
        }

        updateScores();
    }, 500); // 1000 milliseconds = 1 second delay
}




function updateScores(){
    xScoreUI.querySelector("h3").innerHTML = parseInt(xScore);
    oScoreUI.querySelector("h3").innerHTML = parseInt(oScore);
    tiedScoreUI.querySelector("h3").innerHTML = parseInt(ties);
}

function userUI(){
    console.log("userUI done!");
    
    if(firstPlayerChoice == "X"){
        xScoreUI.querySelector(".user").innerHTML = "(YOU)";
        oScoreUI.querySelector(".user").innerHTML = "(CPU)";
    }else{
        xScoreUI.querySelector(".user").innerHTML = "(CPU)";
        oScoreUI.querySelector(".user").innerHTML = "(YOU)";
    }
}

document.querySelector(".quit").onclick = ()=>{
    location.reload();
};
document.querySelector(".restart").onclick = ()=>{
    location.reload();
};
document.querySelector(".next-round").onclick = ()=>{
    restartGame();
};


function restartGame() {
    // Reset game variables
    slots.forEach(slot => {
        slot.classList.remove("full"); // Remove the 'full' class from all slots
        slot.classList.remove("o-select");
        slot.classList.remove("x-select");

        slot.querySelector("img").src = ""; // Clear the images in the slots
    });
    
    if(!gameoverScreen.classList.contains("hide")) gameoverScreen.classList.add("hide");
    isPlayersTurn = firstPlayerChoice == "X"; // Reset player turn based on first player choice
    
    gameover = false; // Allow the game to continue
    someoneWon = false; // Reset win state

    turnText.innerHTML = firstPlayerChoice + "'s"; // Update the turn text
    console.log("Game Restarted!"); // Optional logging for debugging

    // If it's not the player's turn, make the CPU take its turn
    if (!isPlayersTurn) {
        cpuTurn();
    }
}

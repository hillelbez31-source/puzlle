const puzzles = [
{
title: "Puzzle 1 / 5",
image: "images/puzzle1.jpg",
hint: "literally you😭",
missingIndex: 2,
successTitle: "YAAAAAY! 🎉",
successText: "good job my love💗"
},
{
title: "Puzzle 2 / 5",
image: "images/puzzle2.jpg",
hint: "hmmmm?",
missingIndex: 0,
successTitle: "LET'S GOOOOO 😭💗",
successText: "nice one marce <3"
},
{
title: "Puzzle 3 / 5",
image: "images/puzzle3.jpg",
hint: "how lmgt3in t3 lacoste actually looks bara😭",
missingIndex: 5,
successTitle: "WOOOOOOO!!! 🎉🎉",
successText: "YES YES YES PROUD OF YOU😭😭💗"
},
{
title: "Puzzle 4 / 5",
image: "images/puzzle4.jpg",
hint: "HUH?",
missingIndex: 0,
successTitle: "HEHE NICE 😭💗",
successText: "ofc u know that one😭"
},
{
title: "Puzzle 5 / 5",
image: "images/puzzle5.jpg",
hint: "...",
missingIndex: 3,
successTitle: "",
successText: ""
}
];

let currentPuzzle = 0;
let selectedTile = null;
let boardState = [];
let correctState = [];
let puzzleSolved = false;

const introScreen = document.getElementById("intro-screen");
const gameScreen = document.getElementById("game-screen");
const messageScreen = document.getElementById("message-screen");
const letterScreen = document.getElementById("letter-screen");

const startBtn = document.getElementById("start-btn");
const nextBtn = document.getElementById("next-btn");

const board = document.getElementById("board");
const hintText = document.getElementById("hint-text");
const puzzleTitle = document.getElementById("puzzle-title");

const missingPiece = document.getElementById("missing-piece");
const placePieceBtn = document.getElementById("place-piece-btn");

const messageTitle = document.getElementById("message-title");
const messageText = document.getElementById("message-text");

const successSound = document.getElementById("success-sound");
const clickSound = document.getElementById("click-sound");
const bgMusic = document.getElementById("bg-music");

startBtn.addEventListener("click", () => {
introScreen.classList.remove("active");
gameScreen.style.display = "flex";if(bgMusic.src){
bgMusic.volume = 0.4;
bgMusic.play().catch(()=>{});
}
loadPuzzle(currentPuzzle);
});

nextBtn.addEventListener("click", () => {
messageScreen.style.display = "none";

currentPuzzle++;

if(currentPuzzle >= puzzles.length){
letterScreen.style.display = "flex";
return;
}

gameScreen.style.display = "flex";
loadPuzzle(currentPuzzle);
});

placePieceBtn.addEventListener("click", completePuzzle);

function loadPuzzle(index){

board.innerHTML = "";
selectedTile = null;
puzzleSolved = false;
placePieceBtn.disabled = true;

const puzzle = puzzles[index];

puzzleTitle.textContent = puzzle.title;
hintText.textContent = puzzle.hint;

correctState = [];

for(let i=0;i<9;i++){
if(i !== puzzle.missingIndex){
correctState.push(i);
}
}

boardState = shuffleMedium(correctState);

while(isSolved(boardState, correctState)){
boardState = shuffleMedium(correctState);
}

for(let i=0;i<9;i++){

if(i === puzzle.missingIndex){

const empty = document.createElement("div");
empty.className = "empty-slot";
empty.dataset.slot = i;

board.appendChild(empty);

continue;
}

const tileNumber = boardState.shift();

const tile = createTile(
tileNumber,
puzzle.image,
tileNumber
);

tile.dataset.position = tileNumber;
board.appendChild(tile);
}

setupMissingPiece(
puzzle.image,
puzzle.missingIndex
);
}

function createTile(pieceIndex,imagePath,position){

const tile = document.createElement("div");

tile.className = "tile";

const row = Math.floor(pieceIndex / 3);
const col = pieceIndex % 3;

tile.style.backgroundImage = `url(${imagePath})`;
tile.style.backgroundPosition =
`${-col * 100}px ${-row * 100}px`;

tile.dataset.piece = pieceIndex;

tile.addEventListener("click", () => {

if(clickSound.src){
clickSound.currentTime = 0;
clickSound.play().catch(()=>{});
}

if(!selectedTile){

selectedTile = tile;
tile.classList.add("selected");
return;
}

if(selectedTile === tile){
tile.classList.remove("selected");
selectedTile = null;
return;
}

swapTiles(selectedTile,tile);

selectedTile.classList.remove("selected");
selectedTile = null;

checkPuzzle();
});

return tile;
}

function swapTiles(tileA,tileB){

const pieceA = tileA.dataset.piece;
const pieceB = tileB.dataset.piece;

const bgA = tileA.style.backgroundPosition;
const bgB = tileB.style.backgroundPosition;

tileA.dataset.piece = pieceB;
tileB.dataset.piece = pieceA;

tileA.style.backgroundPosition = bgB;
tileB.style.backgroundPosition = bgA;
}

function checkPuzzle(){

const tiles = [...document.querySelectorAll(".tile")];

const puzzle = puzzles[currentPuzzle];

let indexCounter = 0;
let solved = true;

for(let i=0;i<9;i++){

if(i === puzzle.missingIndex){
continue;
}

const tile = tiles[indexCounter];

const piece = Number(tile.dataset.piece);

if(piece !== i){
solved = false;
break;
}

indexCounter++;
}

if(solved){

puzzleSolved = true;
placePieceBtn.disabled = false;
placePieceBtn.textContent = "Place Missing Piece 💗";
}
}

function setupMissingPiece(imagePath,index){

const row = Math.floor(index / 3);
const col = index % 3;

missingPiece.style.backgroundImage =
`url(${imagePath})`;

missingPiece.style.backgroundPosition =
`${-col * 100}px ${-row * 100}px`;

missingPiece.dataset.index = index;
missingPiece.style.opacity = "1";
}

function completePuzzle(){

if(!puzzleSolved) return;

missingPiece.style.opacity = "0.3";

const emptySlot = document.querySelector(".empty-slot");

const piece = document.createElement("div");

piece.className = "tile";

const index =
Number(missingPiece.dataset.index);

const row = Math.floor(index / 3);
const col = index % 3;

piece.style.backgroundImage =
missingPiece.style.backgroundImage;

piece.style.backgroundPosition =
`${-col * 100}px ${-row * 100}px`;

emptySlot.replaceWith(piece);

gameScreen.style.display = "none";

if(currentPuzzle === puzzles.length - 1){

bgMusic.pause();
bgMusic.currentTime = 0;

setTimeout(() => {
letterScreen.style.display = "flex";
},2000);

return;
}

if(successSound.src){
successSound.currentTime = 0;
successSound.play().catch(()=>{});
}

messageTitle.textContent =
puzzles[currentPuzzle].successTitle;

messageText.textContent =
puzzles[currentPuzzle].successText;

messageScreen.style.display = "flex";
}

function shuffleMedium(arr){

let result = [...arr];

for(let i=result.length-1;i>0;i--){

const j =
Math.floor(Math.random()*(i+1));

[result[i],result[j]] =
[result[j],result[i]];
}

return result;
}

function isSolved(a,b){

if(a.length !== b.length) return false;

for(let i=0;i<a.length;i++){

if(a[i] !== b[i]){
return false;
}
}

return true;
}
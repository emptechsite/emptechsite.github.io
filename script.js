let n1, n2, opSelector, ansOpt, answer;
let qNo = document.getElementById("Qno");
let score = document.getElementById("score");
let question = document.getElementById("question");
let buttons = document.querySelectorAll(".answer-card button");
let startBox = document.getElementById("tutorial-section");
let gameBox = document.getElementById("in-game");
let endBox = document.getElementById("end-game");
let progress = document.getElementById("progress");
let message = document.getElementById("message");
let operator = ['+', '-', '*', '/'];
let t;
let timerSpeed = 30; // default seconds per question

function startTutorial() {
    startBox.style.display = "none";
    document.getElementById("difficulty-selection").style.display = "block";
}

function reloadPage() {
    location.reload();
}

function showCustomOptions() {
    document.getElementById("difficulty-selection").style.display = "none";
    document.getElementById("custom-options").style.display = "block";
}

function startGame(difficulty) {
    switch(difficulty) {
        case 'easy': intensity=1; timerSpeed=60; break;
        case 'medium': intensity=2; timerSpeed=30; break;
        case 'hard': intensity=3; timerSpeed=10; break;
        case 'custom':
            intensity=parseInt(document.getElementById("intensity").value,10);
            timerSpeed=parseInt(document.getElementById("timer-speed").value,10);
            break;
    }
    resetGame();
    nextQuestion();
    document.getElementById("difficulty-selection").style.display="none";
    document.getElementById("custom-options").style.display="none";
    gameBox.style.display="block";
}

function resetGame() {
    qNo.innerHTML="0";
    score.innerHTML="0";
    progress.style.width="100%";
    clearInterval(t);
    buttons.forEach(btn => btn.style.backgroundColor="#fff");
}

function nextQuestion() {
    let currentQ = parseInt(qNo.innerText,10);
    if(currentQ>=10){
        endGame();
        return;
    }
    
    qNo.innerHTML=currentQ+1;
    
    // Generate harmonic sequence
    let a = Math.floor(Math.random()*intensity*10)+1;
    let d = Math.floor(Math.random()*intensity*5)+1;
    let seq=[];
    for(let i=0;i<5;i++) seq.push(`1/${a+i*d}`);
    
    question.innerHTML = seq.slice(0,-1).join(", ") + ", ... ?";
    answer = seq[seq.length-1];
    
    ansOpt = Math.floor(Math.random()*4);
    buttons.forEach((btn,i)=>{
        btn.style.backgroundColor="#fff";
        btn.style.color="#000";
        btn.removeEventListener("click",handleAnswerClick);
        btn.addEventListener("click",()=>handleAnswerClick(i));
        if(i!==ansOpt){
            let randOffset=Math.floor(Math.random()*5)+1;
            btn.innerHTML=answer.replace(/\d+$/,m=>parseInt(m)+randOffset);
        } else btn.innerHTML=answer;
    });
    
    startTimer();
}

function handleAnswerClick(i){
    stopTimer();
    let btn=buttons[i];
    let overlay=document.createElement("span");
    overlay.style.position="absolute";
    overlay.style.left=0; overlay.style.top=0;
    overlay.style.width="100%"; overlay.style.height="100%";
    overlay.style.borderRadius="0.9rem";
    overlay.style.pointerEvents="none";
    overlay.style.opacity="0.6";
    overlay.style.backgroundColor=(btn.innerText===answer)?"green":"#fb3640";
    btn.style.position="relative";
    btn.appendChild(overlay);

    if(btn.innerText===answer){
        getScore();
    }

    setTimeout(()=>{
        btn.removeChild(overlay);
        nextQuestion();
    },600); // overlay visible for 0.6s
}

function getScore(){ score.innerHTML=parseInt(score.innerHTML,10)+100; }

function startTimer(){
    clearInterval(t);
    let width=100;
    let interval=10; // ms
    let decrement=(interval/(timerSpeed*1000))*100; // percent per interval
    progress.style.width="100%";
    t=setInterval(()=>{
        width-=decrement;
        if(width<=0){ width=0; stopTimer(); endGame(); return; }
        progress.style.width=width+"%";
    },interval);
}

function stopTimer(){ clearInterval(t); }

function endGame(){
    stopTimer();
    gameBox.style.display="none";
    endBox.style.display="flex";
    document.getElementById("final-score").innerText=score.innerText;
    let s=parseInt(score.innerText,10);
    if(s>=800) message.innerText="WOW !! UNBELIEVABLE !!";
    else if(s>=500) message.innerText="TOO CLOSE !!";
    else if(s>=100) message.innerText="Better luck next time";
    else message.innerText="Bad Luck";
}

document.getElementById("restart-btn").addEventListener('click',()=>{startBox.style.display="block"; endBox.style.display="none";});

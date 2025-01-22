// Sources and collaborator: P5.js library, ChatGPT, AJ

//DOM elements. 
let pageNumber = 1; //start with first page (or another page when testing!). 
let randomPage1 = null; // Store the randomly chosen page after Page 4
let randomPage2 = null; // Second random page for the statements
let randomPage3 = null; // Third random page for the statements
let waitingForNextRandomPage1 = false; // State to track keypresses between random pages
let waitingForNextRandomPage2 = false; // State to track keypresses between random pages
let randomPage4 = null; // Second random page for the statements
let randomPage5 = null; // Third random page for the statements


let styledText;
let styledInput;

let answers = {}; // Object to store answers by question
let pages = []; // Array to store page functions

let currentName = ''; // Initialize currentName, for displaying to the user
let myName='';// to store the confirmed user's name (after enter), and reset after printing
let currentInput = ''; // Store the current numeric input dynamically

let answersJSON = JSON.stringify(answers);
console.log(answersJSON); // Example: {"Q1":"2","Q2":"4","Q3":"3"}

function setup() {
  createCanvas(900, 700);

    webSocket = new WebSocket('ws://localhost:8080'); // connection arduino button
    webSocket.onmessage = function(event){
      console.log(event);
      if (event.data == 'NEXT'){ // button pressed
        startProgramma();
      }
    }

  pages = [
    drawPage1, // Welkom
    drawPage2, // Naam
    drawPage3, // Intro 1
    drawPage4, // Intro 2
    drawPage5, // Stelling 1
    drawPage6, // Stelling 2
    drawPage7, // Stelling 3
    drawPage8, // Stelling 4
    drawPage9, // Stelling 5
    drawPage10, // Stelling 6
    drawPage11, // Stelling 7
    drawPage12, // Uitleg
    drawPage13, // Vraag 1 
    drawPage14, // Vraag 2
    drawPage15, // Vraag 3
    drawPage16, // Final, print scherm
    // Add as many as needed
  ];
}

function draw() {
  background(0);
  // Object.values(elements).forEach(el => el.hide()); // Hide all DOM  elements by default
  drawPageNavigation(); //Draw page navigation (page numbers, instructions navigation)
  
   // Dynamically call the page function
   if (pages[pageNumber - 1]) {
    pages[pageNumber - 1]();
  } else {
    textAlign(CENTER, CENTER);
    textSize(24);
    text("Page Not Found", width / 2, height / 2);
  }

  fill(255); //white text
  text(`mouseX:${mouseX}, mouseY:${mouseY}`, 200, 20); //displays the x and y position of the mouse on the canvas. Delete in the end.
}


function drawPage1(){
  if (styledText) styledText.remove();
  if (styledInput) styledInput.remove();

  //style function with CSS
  styledText = createP(`Welkom bij de World Servants Parkeerautomaat.<br><br>Druk op de blauwe knop om te starten.`);
    // styledText.position(width / 2 - 300, height / 2 - 150); // Adjust position
  styledText.position(width / 2 - 300, height / 2 - styledText.height/2); // Adjust position
  styledText.class("lowlight"); // Assign a CSS class
}

function drawPage2(){
  if (styledText) styledText.remove();
  if (styledInput) styledInput.remove();

  //style function with CSS
  styledText = createP(`Wat is je naam? <br>Typ je naam en druk op enter.`);
  styledText.position(width / 2 - 300, height / 2 - 100); // Adjust position
  styledText.class("lowlight"); // Assign a CSS class

  styledInput = createP(`Mijn naam is ${currentName || "..."}`); 
  styledInput.position(250, 450); // Adjust position
  styledInput.class("lowlightSmall");
}

// function typing() {
//   showInput = this.value();
// }

function drawPage3(){
  if (styledText) styledText.remove();
  if (styledInput) styledInput.remove();
 
  //style function with CSS
  styledText = createP(`Hallo ${myName},<br>Beantwoord de volgende vragen zodat jouw Bon van Betekenis opgesteld kan worden. <br><br>Alvast bedankt voor het vertrouwen om je cultuur hier te parkeren.<br><br> Druk op enter.`);
  styledText.position(width / 2 - 300, height / 2 - 100); // Adjust position
  styledText.class("lowlight"); // Assign a CSS class

}

function drawPage4(){
  if (styledText) styledText.remove();

  styledText = createP(`Hierna volgen 3 stellingen. Geef aan of de stelling herkenbaar is voor jouw leven.<br><br>Er zijn geen goede of foute antwoorden. Laten we beginnen!<br><br>Druk op enter.`);
  styledText.position(width / 2 - 300, height / 2 - 100); // Adjust position
  styledText.class("lowlight"); // Assign a CSS class
}

function drawPage5(){
  if (styledText) styledText.remove();
  if (styledInput) styledInput.remove();

  styledText = createP(`Stelling:<br>“Mijn gezin bestaat uit een vader, moeder, en misschien broer(s) en zus(sen).”<br><br>1 = niet herkenbaar, 2 = neutraal, 3 = heel herkenbaar.<br><br>Druk op 1, 2 of 3 en op enter.`);
  styledText.position(width / 2 - 300, height / 2 - 100); // Adjust position
  styledText.class("lowlight"); // Assign a CSS class

  styledInput = createP(`Jouw antwoord: ${currentInput || "..."}`); 
  styledInput.position(width / 2 - 200, 550); 
  styledInput.class("lowlightSmall");
}

function drawPage6(){
  if (styledText) styledText.remove();
  if (styledInput) styledInput.remove();

  styledText = createP(`Stelling:<br>"Privacy of een momentje voor mezelf? Nee, ik ben altijd met andere mensen.”<br><br>1 = niet herkenbaar, 2 = neutraal, 3 = heel herkenbaar. <br><br> Druk op 1, 2 of 3 en enter.`);
  styledText.position(width / 2 - 300, height / 2 - 100); // Adjust position
  styledText.class("lowlight"); // Assign a CSS class

  styledInput = createP(`Jouw antwoord: ${currentInput || "..."}`); 
  styledInput.position(width / 2 - 200, 550); 
  styledInput.class("lowlightSmall");
}

function drawPage7(){
  if (styledText) styledText.remove();
  if (styledInput) styledInput.remove();

  styledText = createP(`Stelling:<br>“Ik vind het belangrijk dat mensen op tijd komen. Als je te laat komt, stuur je een berichtje.”<br><br>1 = niet herkenbaar, 2 = neutraal, 3 = heel herkenbaar. <br><br> Druk op 1, 2 of 3 en enter.`);
  styledText.position(width / 2 - 300, height / 2 - 100); // Adjust position
  styledText.class("lowlight"); // Assign a CSS class

  styledInput = createP(`Jouw antwoord: ${currentInput || "..."}`); 
  styledInput.position(width / 2 - 200, 550); 
  styledInput.class("lowlightSmall");
}

function drawPage8(){
  if (styledText) styledText.remove();
  if (styledInput) styledInput.remove();

  styledText = createP(`Stelling:<br>“Als iemand op bezoek komt, doet hij gewoon mee met wat ik aan het doen ben. Bijvoorbeeld grasmaaien of koken.”<br><br>1 = niet herkenbaar, 2 = neutraal, 3 = heel herkenbaar. <br><br> Druk op 1, 2 of 3 en enter.`);
  styledText.position(width / 2 - 300, height / 2 - 100); // Adjust position
  styledText.class("lowlight"); // Assign a CSS class

  styledInput = createP(`Jouw antwoord: ${currentInput || "..."}`); 
  styledInput.position(width / 2 - 200, 550); 
  styledInput.class("lowlightSmall");
}

function drawPage9(){
  if (styledText) styledText.remove();
  if (styledInput) styledInput.remove();

  styledText = createP(`Stelling:<br>“Ik voel me altijd vrij om aan te sluiten wanneer mensen alleen of met twee zijn.”<br><br>1 = niet herkenbaar, 2 = neutraal, 3 = heel herkenbaar. <br><br> Druk op 1, 2 of 3 en enter.`);
  styledText.position(width / 2 - 300, height / 2 - 100); // Adjust position
  styledText.class("lowlight"); // Assign a CSS class

  styledInput = createP(`Jouw antwoord: ${currentInput || "..."}`); 
  styledInput.position(width / 2 - 200, 550); 
  styledInput.class("lowlightSmall");
}

function drawPage10(){
  if (styledText) styledText.remove();
  if (styledInput) styledInput.remove();

  styledText = createP(`Stelling:<br>“Mijn opa, oma, neefjes, nichtjes, ooms en/of tantes wonen bij ons thuis.”<br><br>1 = niet herkenbaar, 2 = neutraal, 3 = heel herkenbaar. <br><br> Druk op 1, 2 of 3 en enter.`);
  styledText.position(width / 2 - 300, height / 2 - 100); // Adjust position
  styledText.class("lowlight"); // Assign a CSS class

  styledInput = createP(`Jouw antwoord: ${currentInput || "..."}`); 
  styledInput.position(width / 2 - 200, 550); 
  styledInput.class("lowlightSmall");
}

function drawPage11(){
  if (styledText) styledText.remove();
  if (styledInput) styledInput.remove();

  styledText = createP(`Stelling:<br>“Ik wil niet tot last zijn als ik op bezoek ga. Ik sla de koffie of thee af als niemand neemt.”<br><br>1 = niet herkenbaar, 2 = neutraal, 3 = heel herkenbaar. <br><br> Druk op 1, 2 of 3 en op enter.`);
  styledText.position(width / 2 - 300, height / 2 - 100); // Adjust position
  styledText.class("lowlight"); // Assign a CSS class

  styledInput = createP(`Jouw antwoord: ${currentInput || "..."}`); 
  styledInput.position(width / 2 - 200, 550); 
  styledInput.class("lowlightSmall");
}

function drawPage12(){
  if (styledText) styledText.remove();
  if (styledInput) styledInput.remove();

  styledText = createP(`Dat waren de stellingen. Hierna volgen 2 vragen. Onthoud: er zijn geen goede of foute antwoorden.<br><br> Druk op enter.`);
  styledText.position(width / 2 - 300, height / 2 - 100); // Adjust position
  styledText.class("lowlight"); // Assign a CSS class
}

function drawPage13(){
  if (styledText) styledText.remove();
  if (styledInput) styledInput.remove();

  styledText = createP(`Vraag:<br>Welke smiley beschrijft de schaduwkant van het leven voor jou? <br>A= :)<br>B= :|<br>C= :( <br><br> Druk op A, B, of C en druk op enter.`);
  styledText.position(width / 2 - 300, height / 2 - 100); // Adjust position
  styledText.class("lowlight"); // Assign a CSS class

  styledInput = createP(`Jouw antwoord: ${currentInput || "..."}`); 
  styledInput.position(width / 2 - 200, 550); 
  styledInput.class("lowlightSmall");
}

function drawPage14(){
  if (styledText) styledText.remove();
  if (styledInput) styledInput.remove();

  styledText = createP(`Vraag:<br>Hoe vaak per dag vind jij iets gek of gaat iets anders dan je gewend bent?<br><br>Voer een getal in en druk op enter.`);
  styledText.position(width / 2 - 300, height / 2 - 100); // Adjust position
  styledText.class("lowlight"); // Assign a CSS class

  styledInput = createP(`Jouw antwoord: ${currentInput || "..."} keer per dag.`); 
  styledInput.position(width / 2 - 200, 550); 
  styledInput.class("lowlightSmall");
}

function drawPage15(){
  if (styledText) styledText.remove();
  if (styledInput) styledInput.remove();

  styledText = createP(`Vraag:<br>Hoe vaak per dag frons jij je wenkbrauwen? <br><br> Voer een getal in en druk op enter.`);
  styledText.position(width / 2 - 300, height / 2 - 100); // Adjust position
  styledText.class("lowlight"); // Assign a CSS class

  styledInput = createP(`Jouw antwoord: ${currentInput || "..."} keer per dag.`); 
  styledInput.position(width / 2 - 200, 550); 
  styledInput.class("lowlightSmall");
}

function drawPage16(){
  if (styledText) styledText.remove();
  if (styledInput) styledInput.remove();

  styledText = createP(`Dank je wel voor het parkeren van je cultuur. Vergeet je bon niet! <br><br> Druk op P om te printen.`);
  styledText.position(width / 2 - 300, height / 2 - 100); // Adjust position
  styledText.class("lowlight"); // Assign a CSS class
// additional feature: text [cultuurparkeerplaats]: "Deze reizigers voor jou hebben hun cultuur geparkeerd: ...""
}

//Instructions for navigation
function drawPageNavigation() { 
  fill(255);
  textSize(16);
  textAlign(LEFT, BOTTOM);
  // text(`Page ${pageNumber} of ${pages.length}`, 50, 50);
  
  textAlign(RIGHT, BOTTOM);
  // text("Press Left/Right Arrow to Navigate", width - 10, height - 10); 
}

document.addEventListener("keydown", function(event) {
  const key = event.key;
  const keyCode = event.keyCode;

  // Handle navigation for page change (arrows, Enter)
  if (keyCode === 37) { // Left Arrow Key (back)
    pageNumber = constrain(pageNumber - 1, 1, pages.length); // Go to previous page
    event.preventDefault(); // Prevent default behavior of the key
    console.log("Navigating to page: " + pageNumber); // Debugging log for page navigation
  } 
  else if (keyCode === 39 ) { // Right Arrow key (forward)
    // else if (keyCode === 13 ||keyCode === 39 ) { // Enter Key and Right Arrow key
    saveName();
    pageNumber = constrain(pageNumber + 1, 1, pages.length); // Go to next page
    event.preventDefault(); // Prevent default behavior of the key
    console.log(`Confirmed answer for Q${pageNumber - 1}: ${currentInput}`);
    console.log("Navigating to page: " + pageNumber); // Debugging log for page navigation
    currentInput = ''; // Reset input for the next page
  }
  
  // Page 2: Dynamically store name with any key input
  if (pageNumber === 2) {
    if (key.length === 1 && key !== 'Enter' && key !== 'Backspace' && key !== 'Shift') {
      currentName += key; // Add the character to the name
      // answers[`Q${pageNumber}`] = currentName; // Update the answer for page 2
      currentName = currentName.charAt(0).toUpperCase() + currentName.slice(1);
      console.log("Updated name for Q2: " + currentName); // Debugging log for name storage
      console.log(answers); // Debugging: print the answers object to check if it's saved
    }

    // Handle backspace (to remove last character of the name)
    if (key === 'Backspace') {
      currentName = currentName.slice(0, -1); // Remove last character from the name
      // answers[`Q${pageNumber}`] = currentName; // Update the answer
      console.log("Updated name after backspace for Q2: " + currentName); // Debugging log for backspace
      // console.log(answers); // Debugging: print the answers object after backspace
    }
  }

  if (keyCode === 13) { // 13 = keycode Enter
      if (pageNumber === 4 && randomPage1 === null && randomPage2 === null && randomPage3 === null) { 
        // After Page 4, choose randomly between Page 5, 6, and 7
        const possiblePagesStatements = [6, 7, 8, 10, 11]; //5 and 9 deleted for demoday
        
        // Choose and store the random pages
        randomPage1 = random(possiblePagesStatements);
        randomPage2 = random(possiblePagesStatements.filter(page => page !== randomPage1));
        randomPage3 = random(possiblePagesStatements.filter(page => page !== randomPage1 && page !== randomPage2));
        console.log("Random Page 1:", randomPage1, "Random Page 2:", randomPage2, "Random Page 3:", randomPage3);

        // Navigate to the first random page and  wait for the next key press (waiting=true)
        pageNumber = randomPage1;
        waitingForNextRandomPage1 = true;
        currentInput = ''; // Reset input for the next page
      }
       else if (pageNumber === randomPage1) {
        pageNumber = randomPage2
        // Update state to indicate the second random page was reached
        waitingForNextRandomPage1 = false;
        currentInput = ''; // Reset input for the next page

      } else if (pageNumber === randomPage2) {
        pageNumber = randomPage3
        // Update state to indicate the second random page was reached
        waitingForNextRandomPage1 = false;
        currentInput = ''; // Reset input for the next page

      } else if (pageNumber === randomPage3) {
        pageNumber = 12;
        // Reset random pages for future runs
        randomPage1 = null;
        randomPage2 = null;
        randomPage3 = null;
        currentInput = ''; // Reset input for the next page     
      } 
      
    //hieronder is test
    else if (pageNumber === 12 && randomPage4 === null && randomPage5 === null) { 
      const possiblePagesQuestions = [13,14,15];
        
      // Choose the first random page
      randomPage4 = random(possiblePagesQuestions);
      randomPage5 = random(possiblePagesQuestions.filter(page => page !== randomPage4))  
      
      // Navigate to the first random page
      pageNumber = randomPage4;

      // Set state to wait for the next key press
      waitingForNextRandomPage2 = true;
      currentInput = ''; // Reset input for the next page

    } else if (pageNumber === randomPage4) {
      pageNumber = randomPage5
      // Update state to indicate the second random page was reached
      waitingForNextRandomPage2 = true;
      currentInput = ''; // Reset input for the next page
    } else if (pageNumber === randomPage5) {
      pageNumber = 16;
      // Reset random pages for future runs
      randomPage4 = null;
      randomPage5 = null;
      currentInput = ''; // Reset input for the next page

    } else {
      // Normal navigation: save input and move to the next page
      saveName(); // Save current input
      pageNumber = constrain(pageNumber + 1, 1, pages.length);
      currentInput = ''; // Reset input for the next page
  }
  event.preventDefault();  
  console.log(`Confirmed answer for Q${pageNumber - 1}: ${currentInput}`);
  // console.log("Random Page 1:", randomPage1, "Random Page 2:", randomPage2, "Random Page 3:", randomPage3);
  console.log("Current page:", pageNumber);
  console.log("Waiting for next random page(statements):", waitingForNextRandomPage1);
}
  
  // Store numeric input (for other pages)
  if (pageNumber === 5 || pageNumber === 6 || pageNumber === 7 || pageNumber === 8 || pageNumber === 9 || pageNumber === 10 || pageNumber === 11) {
    if (key >= '1' && key <= '3') { // for statements of 1-3
      currentInput = key; // Update currentInput dynamically
      answers[`Q${pageNumber}`] = currentInput; // Save the answer
      console.log(`Numeric input recorded for Q${pageNumber}: ${currentInput}`); // Debugging
    }
  if (key === 'Backspace') {
    currentInput = currentInput.slice(0, -1); // Remove last character from the name
    console.log(`Updated input after backspace for Q${pageNumber}: ${currentInput}`); // Debugging log for backspace
  }
  }

     
  if (pageNumber === 13) {
    if (key === 'a' || key === 'b' || key === 'c') { // for multiple choice (A, B, C)
      currentInput = key; // Update currentInput dynamically
      answers[`Q${pageNumber}`] = currentInput; // Save the answer
      console.log(`Numeric input recorded for Q${pageNumber}: ${currentInput}`); // Debugging
    }
    if (key === 'Backspace') {
      currentInput = currentInput.slice(0, -1); // Remove last character from the name
      console.log(`Updated input after backspace for Q${pageNumber}: ${currentInput}`); // Debugging log for backspace
    }
  }

  // Store numeric input for these questions 
  if (pageNumber === 14 || pageNumber === 15) {
    if (key >= '0' && key <= '9') { // only nummerical keys
      currentInput += key; // Update currentInput dynamically, adding with the '+='
      answers[`Q${pageNumber}`] = currentInput; // Save the answer
      console.log(`Numeric input recorded for Q${pageNumber}: ${currentInput}`); // Debugging
    }
    if (key === 'Backspace') {
      currentInput = currentInput.slice(0, -1); // Remove last character from the name
      console.log(`Updated input after backspace for Q${pageNumber}: ${currentInput}`); // Debugging log for backspace
    }
    }

  // Trigger sending answers (P key) but only if at the final page
  if (pageNumber === 16){
  if (keyCode === 80) { // P key
    sendAnswers();
    myName = ''; // reset myName for the next user --> wat als ik dit op pagina 1 zet?
    console.log("myName reset after printing"); // for debugging 
    pageNumber = 1;  // return to home page - after a delay? (with a countdown?)
  }
  // if (keyCode === 82) { // R key to restart without printing
  //   // sendAnswers();
  //   myName = ''; // reset myName for the next user
  //   console.log("myName reset after printing"); // for debugging 
  //   pageNumber = 1;  // return to home page - after a delay? (with a countdown?)
  // }
}
});

function startProgramma () {
  if (pageNumber === 1) { 
    pageNumber = 2; // Go to the second page after the button has been pressed
}
}

function saveName() {
  // myName = myInputName.value();   // Capture the input value
  myName = currentName; // assign currentName to myName
  console.log("Name confirmed: " + myName); // Debugging log
}

function sendAnswers() {
  let payload = {
    myName: myName,
    answers: answers
  };
  // let answersJSON = JSON.stringify(answers);

  fetch("http://127.0.0.1:5000/submit", {
    method: "POST",
    headers: {
        "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
    // body: answersJSON,
  })
  .then(response => response.json())
  .then(data => console.log("Success:", data))
  .catch(error => console.error("Error:", error));

}
  




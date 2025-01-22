// Parkeerautomaat World Servants
// Start-knop: uitlezen van het drukken op de knop en via seriale poort communiceren met node.js
// Auteur: Evelijn van Hilten (evelijnvanhilten@gmail.com)
// Datum: 20/01/2025 

void setup() {
  Serial.begin(9600); // Start serial communication
  pinMode(A0, INPUT_PULLUP); // Button pin A0
}

void loop() {
  if (digitalRead(A0) == LOW) { // Button is pressed
    Serial.println("NEXT"); // Send "NEXT" to move to the next page
    delay(500); // Debounce delay
  }
}

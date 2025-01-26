# Parkeerautomaat
Code written for the Park Your Culture Here design for World Servants. 

Main programs and flow:
- Start button is continuously monitored by an Arduino Nano, and its messages are received by a Node.js program on the connected computer.
- Node.js forwards the signals  via websockets to start the user interface, made with HTML, JavaScript and CSS.
- The user interface collects answers, which are send to a Python script using fetch(). 
- The Python script processes the questions and answers, formatting them into a receipt that includes the user’s name, date, and a processed output based on the answers.
- Once the receipt is printed, the system resets, clearing the user’s name and answers to prepare for the next session.
- AutoStart.bat to include in the Windows start-up for easy implementation.

Author: 
Evelijn van Hilten (January, 2025)

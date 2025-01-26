START "Autostart button" cmd /k "cd button\button\ && node button.js"
timeout 5
start "Autostart printer" cmd /k "python server.py"
timeout 5
START "Autostart server" cmd /k "npx http-server -p 5503"
timeout 5
start "Autostart UI" "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe" --kiosk http://127.0.0.1:5503/ --edge-kiosk-type=fullscreen -no-first-run
# Script para abrir dos terminales en Windows y ejecutar comandos en ellas

# Comando del backend
Start-Process -NoNewWindow -FilePath "cmd" -ArgumentList "/c cd API && npm run dev"

# Espera un momento para que la primera terminal se inicie completamente
Start-Sleep -Seconds 5

# Comando del frontend
Start-Process -NoNewWindow -FilePath "cmd" -ArgumentList "/c cd DAC-FRONT-END && npx tailwindcss -i ./src/main.css -o ./dist/output.css --watch "

# Comando del backend
Start-Process -NoNewWindow -FilePath "cmd" -ArgumentList "/c cd DAC-FRONT-END && npm run dev"
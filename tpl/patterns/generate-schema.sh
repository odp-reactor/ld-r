#!/bin/sh

# reference lutra executable has aliases doesn't work in this environment
LUTRA="$HOME/Data/programs/lutra/lutra.jar"

echo "[!] Cleaning schema ... "
rm ../data/schema.ttl

echo "[*] Generating schema ... "
java -jar $LUTRA -m expand -I stottr -f -l ./TBox/ -L stottr -O wottr -o ../data/schema ./schema.stottr $1

echo "Done."

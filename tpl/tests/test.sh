#!/bin/sh

# reference lutra executable has aliases doesn't work in this environment
LUTRA="$HOME/Data/programs/lutra/lutra.jar"
SEP="=======================================================================================\n"
DIR='./'
for FILE in "$DIR"*.stottr
    do
        echo "[*] Template:\n"
        cat $FILE
        echo "\n"
        echo "[*] Expansion:\n"
        java -jar $LUTRA -m expand -f -I stottr -l ../patterns/ABox/ -L stottr -O wottr $FILE  --stdout $1
        echo $SEP
    done

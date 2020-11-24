#!/bin/sh

# reference lutra executable has aliases doesn't work in this environment
LUTRA="$HOME/Data/programs/lutra/lutra.jar"

echo "[!] Cleaning data ... "
rm ../data/arco-*

# measurement-collection
echo "[*] Extracting measurement collection ... "
java -jar $LUTRA -m expand -I bottr -f -l ../patterns/ABox/ -L stottr -O wottr -o ../data/arco-measurement-collection ./MeasurementCollectionMap.bottr

echo "[*] Extracting time indexed typed location ... "
# time indexed typed location
java -jar $LUTRA -m expand -I bottr -f -l ../patterns/ABox/ -L stottr -O wottr -o ../data/arco-extended-time-indexed-typed-location ./ExtendedTimeIndexedTypedLocationMap.bottr

echo "Done."

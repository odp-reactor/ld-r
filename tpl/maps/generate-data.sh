#!/bin/sh

# reference lutra executable has aliases doesn't work in this environment
LUTRA="$HOME/Data/programs/lutra/lutra.jar"

if [ "$2" ]
	then
		echo "[!] Cleaning data ... "
		rm ../data/arco-*
fi

# cultural-property-component-of
echo "[*] Extracting cultural property componnets ... "
java -jar $LUTRA -m expand -I bottr -f -l ../patterns/ABox/ -L stottr -O wottr -o ../data/arco-c-prop-part-of ./CulturalPropertyComponentOfMap.bottr $1

# measurement-collection
echo "[*] Extracting measurement collection ... "
java -jar $LUTRA -m expand -I bottr -f -l ../patterns/ABox/ -L stottr -O wottr -o ../data/arco-measurement-collection ./MeasurementCollectionMap.bottr $1

echo "[*] Extracting time indexed typed location ... "
# time indexed typed location
java -jar $LUTRA -m expand -I bottr -f -l ../patterns/ABox/ -L stottr -O wottr -o ../data/arco-extended-time-indexed-typed-location ./ExtendedTimeIndexedTypedLocationMap.bottr $1

echo "Done."

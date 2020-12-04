# clone forked remote branch of linked data reactor

# $ git clone --branch complex-resource https://github.com/Christian-Nja/ld-r.git

# clone ld-ui-react package in a sibling folder

# $ git clone https://github.com/Christian-Nja/ld-ui-react.git

# Project
#   |
#   |-ld-r
#   |
#   |-ld-ui-react
#   |
#   |dev-install.sh

# install ld-ui-react dependencies
cd ../ld-ui-react && npm install --save &&

# build patched version of react-timeseries-chart
cd ./react-timeseries-chart && npm run build &&

# build ld-ui-react
cd .. && npm run build &&

# install ld-r dependencies
cd ../ld-r && npm install --save &&

# launch local development server for ld-r application
npm run dev

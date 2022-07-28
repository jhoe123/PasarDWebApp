#!/bin/bash

echo "Build App Assist (y/n) ?"
read assist 
rm -rf nodejs
cd ..
cwd=$PWD
yarn
yarn build

# build nodejs
if [ "$assist" == "y" ]; then 
    cd ..
    if [ ! -d "PasarDAssist" ]; then 
        git clone https://github.com/PasarProtocol/PasarDAssist
    fi
    cd PasarDAssist
    yarn 
    cd ..
    cp -rf PasarDAssist PasarDWebApp/elabox/nodejs
    mv PasarDWebApp/elabox/nodejs/bin/www PasarDWebApp/elabox/nodejs/bin/www.js

    # download pasar assist data
    cd $cwd/elabox/nodejs
    if [ ! -d "pasar_data" ]; then 
        wget https://download.trinity-feeds.app/pasar-assist-data.zip
        mkdir pasar_data
        cd pasar_data
        unzip ../pasar-assist-data.zip
        rm ../pasar-assist-data.zip
    fi
fi

cd $cwd
packager elabox/packager/packager.json
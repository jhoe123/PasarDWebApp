#!/bin/bash

# if the app assist data exist
if [ -d "pasar_data" ]; then 
    sudo apt-get install -y mongodb-server
    cd pasar_data
    /usr/bin/mongoimport -d pasar-assist -c pasar_order pasar_order.json
    /usr/bin/mongoimport -d pasar-assist -c pasar_order_event pasar_order_event.json
    /usr/bin/mongoimport -d pasar-assist -c pasar_token pasar_token.json
    /usr/bin/mongoimport -d pasar-assist -c pasar_token_event pasar_token_event.json
    /usr/bin/mongoimport -d pasar-assist -c pasar_order_platform_fee pasar_order_platform_fee.json
    /usr/bin/mongoimport -d pasar-assist -c pasar_approval_event pasar_approval_event.json
    /usr/bin/mongoimport -d pasar-assist -c pasar_token_galleria pasar_token_galleria.json
    /usr/bin/mongoimport -d pasar-assist -c pasar_panel_event pasar_panel_event.json
fi
#!/bin/bash

if [ -z $1 ]; then
  echo "Missing environment. Usage: $0 <environment>"
fi

forge settings set usage-analytics true
forge login -u $FORGE_PROD_EMAIL -t $FORGE_PROD_API_TOKEN
../bin/register-app.sh $FORGE_PROD_APP_ID

forge deploy -f --no-verify --verbose -e $1
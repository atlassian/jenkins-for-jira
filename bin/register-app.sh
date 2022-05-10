#!/bin/bash

# Forge apps can only be deployed & installed by a single person.
# This script overrides the app ID in the manifest.yml file with the provided value.

pwd

if [ -z $1 ]; then
  echo "No Forge app ID provided"
  exit 1
fi

# replaces the current app ID in the manifest with the provided ID
MANIFEST_ID=$(cat manifest.yml | grep "ari:cloud:ecosystem::app" | rev | cut -d "/" -f1 | rev)
if [[ "$MANIFEST_ID" != "$1" ]]; then
  echo "Substituting the Forge app ID in the manifest from $MANIFEST_ID to $1"
  sed "s/${MANIFEST_ID}/$1/" manifest.yml > temp.txt && mv temp.txt manifest.yml
fi

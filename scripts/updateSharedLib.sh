#!/bin/bash

folders=("auth" "tickets" "orders")

cd ..
for folder in "${folders[@]}"
do
  cd $folder
  echo "Running npm update in $folder..."
  npm update @gbotickets/common
  cd ..
done
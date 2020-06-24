#!/bin/bash
echo "closing docker"
docker-compose down
echo "removing vma_angular-app image" 
docker image rm vma_angular-app
cd ./Frontend
echo "rebuilding front end"
ng build --prod
echo "rebuilt front end"
echo "building docker"
docker-compose up 
echo "rebuilt docker"                          

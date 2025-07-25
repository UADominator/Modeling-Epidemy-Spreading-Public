sudo cp /home/EpidemicModelling-0.0.1-SNAPSHOT.jar ./
sudo docker stop domi-api
sudo docker compose up --build
sudo docker start domi-api
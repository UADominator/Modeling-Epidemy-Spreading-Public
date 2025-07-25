sudo cp -r /home/dist ./
sudo docker stop domi-web
sudo docker compose up --build
sudo docker start domi-web
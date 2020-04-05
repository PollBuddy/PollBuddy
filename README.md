# PollBuddy
Welcome to PollBuddy! :D
An affordable and compatible in-class quizzing platform.

RCOS/Project Google Drive (proposal, other project resources): https://drive.google.com/drive/folders/1lCov3Guqql_E-tnq5hascXrdLEYA7Pn6

## Docker Things
### How to run the app (what you want in most cases)
#### Linux:
```
git clone (repo url)
cd PollBuddy
docker-compose up -d --build
```
#### Windows:
Clone in github desktop or something

Open command prompt to the github folder

Run `docker-compose up -d  --build`

### Accessing the app
Frontend available at `http://localhost:3000`

Backend available at `http://localhost:3001`

Database available at `localhost:27017`

### Shutting down the app
```
docker-compose down
```

### Building the container manually
```
docker build -t (username)/(container name) .
```

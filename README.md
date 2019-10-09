# PollBuddy
Welcome to PollBuddy! :D
An affordable and compatible in-class quizzing platform.

Proposal: https://docs.google.com/document/d/1wp2vGtrof0U05jTpSWWiZdXLh2OPzXcVmdZi1mkNAvs/edit

RCOS/Project Google Drive: https://drive.google.com/drive/folders/1lCov3Guqql_E-tnq5hascXrdLEYA7Pn6

## Docker Things
### How to run the app (what you want in most cases)
#### Linux:
```
git clone (repo url)
cd PollBuddy
docker-compose up -d
```
#### Windows:
Clone in github desktop or something

Open command prompt to the github folder

Run `docker-compose up -d`

### Shutting down the app
```
docker-compose down
```

### Building the container manually
```
docker build -t (username)/pollbuddy .
```

### Rebuilding the container (needed after making code changes)
```
docker-compose up --build
```
# PollBuddy
Welcome to PollBuddy! :D
An affordable and compatible in-class quizzing platform.

RCOS/Project Google Drive (proposal, other project resources): https://drive.google.com/drive/folders/1lCov3Guqql_E-tnq5hascXrdLEYA7Pn6

## How to run the app

(Please open an issue if these instructions are not clear enough or are outdated)

### Docker Method

#### Prerequisites

You'll want to install both `Docker` and `Docker-Compose` for your operating system. See the Docker website for instructions. 

You also will want to duplicate the `.env.example` files in both `PollBuddy-Server/frontend` and `PollBuddy-Server/backend` and name them both just `.env`, and then make any necessary changes within that file to match your environment. For most people, the defaults are likely perfectly sufficient. 

#### Linux:
Run in a terminal:
```
git clone <repo url>
cd PollBuddy
docker-compose up -d --build
```

#### Windows:
Clone in GitHub Desktop app (or similar), or download the .zip from the repo web page.

Open command prompt to the downloaded repo folder (hint: open in file explorer and then type `cmd` in the URL/Path bar at the top).

Run `docker-compose up -d  --build`.

#### macOS:
Likely you'll want to follow the Linux directions, but this is an untested configuration and feedback is requested. Please open a PR with changes if you'd like to see better directions here.


### Accessing the app
The Frontend is available at `http://localhost:3000`.

The Backend is available at `http://localhost:3001`.

The Database available at `localhost:27017`. (note, expose the port manually through Docker-Compose in order to connect)

### Shutting down the app
```
docker-compose down
```

## Development information

### Building one of the containers manually
Enter the container's folder (contains a `Dockerfile`) and run:
```
docker build -t <some identifier or name> .
```

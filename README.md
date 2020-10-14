# Poll Buddy
Welcome to Poll Buddy! :D

Poll Buddy is an interactive questionnaire platform that aims to be an enjoyable and easy to use way to collect answers and insights from a group of people.

RCOS/Project Google Drive (proposal, other project resources): https://drive.google.com/drive/folders/1lCov3Guqql_E-tnq5hascXrdLEYA7Pn6

Site Map: https://draft.io/jubvd. Contact PM for edit access.

## How to run the app

(Please open an issue if these instructions are not clear enough or are outdated)

### Docker Method

#### Prerequisites

You'll want to install both `Docker` and `Docker-Compose` [here](https://docs.docker.com/get-docker/) following the instructions for your operating system. Additionally, on Linux you may want to follow [these](https://docs.docker.com/engine/install/linux-postinstall/) steps if you don't want to use `sudo` every time you run a Docker command.

Before running the app, you also will want to duplicate both the `.env.example` files, and name these duplicate `.env` (It's important to duplicate and rename instead of *just* rename these files, so Git doesn't consider the files removed). There are two of these files, one in the `PollBuddy-Server/frontend` directory and one in the `PollBuddy-Server/backend` directory. If you need to make changes to these files to suit your environment, you can do that now, but for most people the defaults are likely sufficient.

#### Linux:
Run in a terminal:
```
git clone <repo url>
cd PollBuddy
docker-compose up -d --build
```

Note about the `-d` option: this option puts the Docker container in the background, meaning that you can do other things on the terminal or even close it and the container will keep running. You can omit this if you want, but you will need to keep that terminal open as you look at the app.

#### Windows:
Clone in GitHub Desktop app (or similar), or download the .zip from the repo web page.

Open command prompt to the downloaded repo folder (hint: open in file explorer and then type `cmd` in the URL/Path bar at the top).

Run `docker-compose up -d  --build`.

The `-d` option does the same thing here that it does on Linux; see above for details.

#### macOS:
Likely you'll want to follow the Linux directions, but this is an untested configuration and feedback is requested. Please open a PR with changes if you'd like to see better directions here.


### Accessing the app
The Frontend is available at `http://localhost:7655`.

The Backend is available at `http://localhost:7655/api`.

TOFIX: The Database available at `localhost:27017`. (note, expose the port manually through Docker-Compose in order to connect)

Reporting is available at `http://localhost:7655/reporting`.

### Shutting down the app
If you used the `-d` option, you should run
```
docker-compose down
```

If you didn't, then Ctrl+C or closing the terminal that the app is running in will shut down the app.

## Development information

### Building one of the containers manually
Enter the container's folder (contains a `Dockerfile`) and run:
```
docker build -t <some identifier or name> .
```

<p align="center">
  <img src="https://github.com/PollBuddy/Resources/raw/main/Branding/Poll%20Buddy%20Logo.png" width="50%" title="Poll Buddy Logo">
</p>

# Poll Buddy
Welcome to Poll Buddy!

Poll Buddy is an interactive questionnaire platform that aims to be an enjoyable and easy to use way to collect answers and insights from a group of people.

RCOS/Project Google Drive (proposal, other project resources): https://drive.google.com/drive/folders/1lCov3Guqql_E-tnq5hascXrdLEYA7Pn6

Site Map: https://draft.io/jubvd. Contact PM for edit access.

## How to run the app

(Please open an issue if these instructions are not clear enough or are outdated)

### Docker Method

#### Prerequisites

You'll want to install both `Docker` and `Docker-Compose` by [following the instructions](https://docs.docker.com/get-docker/) for your operating system. Additionally, on Linux you may want to follow [these](https://docs.docker.com/engine/install/linux-postinstall/) steps if you don't want to use `sudo` every time you run a Docker command (recommended).

Before running the app, you also will want to duplicate (copy and paste) both the `.env.example` files, and name these duplicate `.env` (It's important to duplicate and rename instead of *just* renaming these files, so Git doesn't consider the files removed). There are two of these files, one in the `PollBuddy-Server/frontend` directory and one in the `PollBuddy-Server/backend` directory. If you need to make changes to these files to suit your environment, you can do that now, but for most people the defaults are likely sufficient.

#### Linux:
Run in a terminal:
```
git clone <repo url>
cd PollBuddy
docker-compose up -d --build
```

Note about the `-d` option: this option puts the Docker containers in the background, meaning you can do other things on the terminal or even close it entirely, and the app will keep running. You can omit this if you want, but you will need to keep that terminal open for the app to remain running. This also shows the application logs in the terminal, which can be useful for development or debugging. 

#### Windows:
Clone in GitHub Desktop app (or similar), or download the .zip from the repo web page.

Open command prompt to the downloaded repo folder (hint: open in file explorer and then type `cmd` in the URL/Path bar at the top).

Run `docker-compose up -d  --build`.

The `-d` option does the same thing here that it does on Linux; see above for details.

#### macOS:
Likely you'll want to follow the Linux directions, but this is an untested configuration and feedback is requested. Please open a PR with changes if you'd like to see better directions here.


### Accessing the app
The Frontend is available at [http://localhost:7655](http://localhost:7655).

The Backend is available at [http://localhost:7655/api](http://localhost:7655/api).

The Reporting interface is available at [http://localhost:7655/reporting](http://localhost:7655/reporting).

The Database can be made available at `localhost:27017`. To do this, edit the `docker-compose.yml` file. You should see a comment under the `db` container definition about this. Uncomment the 2 lines for ports under that comment. You will want to restart the app if it is already running for the changes to take effect.

### Shutting down the app
If you used the `-d` option, you should run
```
docker-compose down
```

If you didn't, then you can simply press `Ctrl+C` or close the terminal.

## Development information

### Building one of the containers manually
Enter the container's folder (contains a `Dockerfile`) and run:
```
docker build -t <some identifier or name> .
```

### More development information coming soon on the Wiki

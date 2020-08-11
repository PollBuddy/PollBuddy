**Here's some common questions from your fellow Poll Buddies:**

- *Where can I find Poll Buddy's source code?*
- - Our source code can be explored and downloaded from our [GitHub repository](https://github.com/PollBuddy/PollBuddy).

- *How do I run my own Poll Buddy environment?*
- - Before beginning, make sure you have Poll Buddy's source code downloaded on your system (see above question for help).
- - Poll Buddy is a Docker-based application, meaning you'll first need to install [`Docker Desktop`](https://www.docker.com/products/docker-desktop). Linux users may use this link, but might have to install `Docker` and `Docker-Compose` separately.
- - Next, go to your downloaded Poll Buddy source code and navigate to `PollBuddy-Server/frontend`. In there, duplicate the file named `.env.example` and rename this new copy to just `.env`. Repeat this process in the `PollBuddy-Server/backend` directory as well.
- - After this, launch your system's command line terminal and navigate to the root directory of the source code. Once there, run `docker-compose up --build` to launch the development environment.
- - The frontend of the environment is accessible from <http://localhost:3000> and the backend is accessible from <http://localhost:3001>. To shut down the development environment, press `CTRL + C` in the terminal window.
- - These instructions can also be found on the front page of our [GitHub repository](https://github.com/PollBuddy/PollBuddy).

- *Where can I find help and support?*
- - Here at Poll Buddy, there's no such thing as a bad question! By all means, shoot us an email at <contactus@pollbuddy.app> if you've got anything to ask.
- - If you're encountering a more technical problem (i.e. a bug), please feel free to open an issue on our [GitHub repository](https://github.com/PollBuddy/PollBuddy).

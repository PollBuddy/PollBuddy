# Information

This folder contains multiple files that handle the different modules of the backend.

email.js - This file initializes the email system through gmail and also sends emails through gmail given the account of
the recipient and the contents of the email (subject and body).

influx.js - Initializes the Influx database and handles writing data to the database

mongoConnection.js - Handles the Mongo database connection and indexing of the database. Creates unique indices for each
of the data entries regarding both users and poll answers.

rpi.js - Handles authentication with RPI CAS system

schoolList.js - Stores a list of schools associated with user accounts paired with corresponding url suffixes.

utils.js - Stores some helper functions to support the functionality of the other modules

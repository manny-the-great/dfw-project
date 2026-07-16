# Navigate to backend folder named server ->cd server

# install packages by running command -> npm i

# create a .env file and then add these keys in .env file

PORT = YOUR_PORT (like 4444)

DB_NAME="DATABASE_NAME"
DB_USERNAME="DATABASE_USERNAME"
DB_PASSWORD="DATABASE_PASSWORD"

SECRET_KEY="YOUR_SECRET_KEY for generating token (like abc123)"

TWILIO_ACCOUNT_SID=YOUR_TWILIO_ACCOUNT_SID
TWILIO_AUTH_TOKEN=YOUR_TWILIO_AUTH_TOKEN
TWILIO_PHONE_NUMBER=YOUR_TWILIO_PHONE_NUMBER

# add a config.json file in config folder -> then add the code in this file that is shown below

{
  "development": {
    "username": "root",
    "password": "null",
    "database": "database_development",
    "host": "127.0.0.1",
    "dialect": "mysql"
  },
  "test": {
    "username": "root",
    "password": null,
    "database": "database_test",
    "host": "127.0.0.1",
    "dialect": "mysql"
  },
  "production": {
    "username": "root",
    "password": null,
    "database": "database_production",
    "host": "127.0.0.1",
    "dialect": "mysql"
  }
}

# now run this by running command -> npm start

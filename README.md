# Vehicle-monitor
A web application for monitoring vehicles entering/exiting from gates at resedential campus with video streaming (webcam/static video) feature.
For this project, webcam is implemented. 
Application keeps track of vehicles entering/exiting with entry barred for blacklisted vehicles, the list of blacklist/whitelist vehicles maintained in Database.

## Technologies used
```
Node.js [Express.js]
MongoDB
Bootstrap
```

## Getting started
These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.
See deployment for notes on how to deploy the project on a live system.

## Prerequisites
```
Node.js
MongoDB
VSCode (recommened)
```
## Installation
Download the .zip file and extract it to some folder and open project in cmd(or bash)
```
1.npm install
2.Create MongoDB database locally and add collections from models folder (Refer models folder for more info and code)
3.Set environment variables for your machine.
    1.NODE_ENV=test/prod
    2.PORT=<YOUR_LOCALHOST_PORT>
    3.LOCAL_DB_URL=<YOUR_MONGODB_URL>
    4.SECRET=<YOUR_SECRET_KEY_FOR_SESSION>
4.npm run start to start the project
```
## Deployment
You can deploy this live on server using any cloud services.Use [Heroku](https://heroku.com) for server and [MLAB](https://mlab.com) for cloud MongoDB.

## Authors
[RohitDalal](https://www.linkedin.com/in/rohit-dalal-61330116b/)

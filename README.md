# facerecog-svr
Express server for facerecog app

This project forms the backend for a [facial recognition app](https://github.com/DevDaveJ/facerecog). Tech stack here is:
* Debian 10 on a Google Cloud instance
* nginx serving
* PostgreSQL database to store users image / detection count
* express

# Requirements
Please note that a (free) API key will be required from [Clarifai](https://clarifai.com) to do the actual detection. 
To find out more and try out the project, go to the other associated [repository](https://github.com/DevDaveJ/facerecog) here.

Please also note that a database server is required to effect user login (hashed key) and store / count face detection attempts. The db engine used for this project was PostgreSQL.
### Go over to [facerecog](https://github.com/DevDaveJ/facerecog) and check it out!

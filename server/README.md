# skills-test

### Getting Started

### API

#### Prerequisites

- Download and install the latest version of NodeJS https://nodejs.org/en/

###### Environmental Variables

- JWT_SECRET, set this to a memorable passphrase
- PORT, set the port for the server to run on
- DATABASE_URI
  - visit https://www.mongodb.com/ to create a free account and set up a cluster.
  - Once your cluster is set up then create a database.
  - The default name for the users collection should be users.
  - Don't forget to set at least one user for your database with admin access under "Database Access". This should be different from your mongoDB Atlas username.
  - Next, get the URI for your new database by clicking "Connect" > "Connect your Application". Copy the URI and paste it into your application in the .env as the DATABASE_URI variable. The URI provided by mongoDB Atlas will look like this;
    `mongodb+srv://<username>:<password>@cluster.mongodb.net/**<dbname>**?retryWrites=true&w=majority.`
  - Make sure to replace username and password with the username and password you created for the database and make sure to replace database name.
  - Note this is not your account username for mongoDB atlas, you need to create a user under the "Database Access" tab. Make sure to give the user read and write permissions.

#### Installation - server

Install all dependencies by running the following command in the root directory.

`$ npm install`

#### Installation - client

Install all dependencies by running the following command in the client directory.

`$ cd client`
`$ npm install`

#### Startup - server

Start the server by running the following command in the root directory.

`$ npm run start`

## UnionVMS Mock Server
This is a simple Nodejs server that will provide mocked data into the frontend for development purposes.

#Installation
To run the server you will need to install:
1. Nodejs:
	* Go to [http://nodejs.org](http://nodejs.org)
	* Download and install nodejs.
	* Verify installation in cmder by typing `node --version && npm --version`, a version number should appear for node and npm in the console.
2. Dependencies:
	* Type `npm install`

#Running the server
To start up the server you need to type the command `npm start` and you will have a local server running on port 8081.
In the `server.js` file you will find all available routes for mocked data.

#Addtional tools
* [http://jsonschema.net/#/] - It allows to build JSON schemas by pasting a JSON file
* [http://www.jsonschema2pojo.org/] - It creates POJO from JSON files or JSON schemas

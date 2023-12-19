# AsteroidsGetter

### Prerequisites
1. Download and install Node.js (LTS version preferably) from [here](https://nodejs.org/en/download)
2. Verify the installation is completed by executing the following commands after restarting the computer. You should see version numbers for both.
   - **node -v**
   - **npm -v**
3. Download the files from the repository (or clone it). If you downloaded the archive - unpack it in a selected directory.

### How to run the application
1. Open a Terminal or Command Prompt in Windows
2. Navigate to the directory where you placed the files from the repository
3. Execute command **npm install** to download all the dependencies
4. Execute command **node index.js**
5. Once you see the message *Server is running on port 3000* you can access the application through a browser (or Postman for example)
   with the following example URL: **http://localhost:3000/getNeosNames?dateStart=2023-02-28&dateEnd=2023-03-01&within=900000**

### Notes
1. The **within** query parameter is required. Error will be shown if it's not provided.
2. If only **dateEnd** query parameter is provided, an error will be shown - **dateStart** should be also present.
3. If no **dateStart** is provided, the request will be executed taking the current date as start date and it will set end date
   7 days from start date by default.

https://api.nasa.gov/

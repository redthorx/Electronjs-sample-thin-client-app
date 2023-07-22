## Sample Electron app

This is a sample CRUD electron app that runs a backend on localhost:3000 and a windowed desktop application which is technically just a browser window to the webpage

Technically, its just CRU as theres no delete function in this application.

requirements: python for sqlite 

To run locally, run `npm i` to install dependencies, followed by `npm start` to start the app window

To build (tested only on windows), run `npm run dist --windows`. The app will be compiled in the \dist\ folder.

To run compiled app, (for windows) navigate to and run dist/win-unpacked/{{app_name}}.exe

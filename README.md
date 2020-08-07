<img src="https://github.com/chrismojekwu/KidsLearn-client/blob/master/src/img/kidslearn3.png" width="600" />

# KidsLearn

KidsLearn is a platform centered around children aged 1-3 years old and their parents. Its meant to help parents teach the basics and provide young children with more productive screentime. The app could also assist the older children in learning basic computer skills & principles.

## Working Prototypes

React App: https://kidslearn.vercel.app/

Node App: https://stormy-tor-86942.herokuapp.com/

## Features

- 6 publicly available activity sections that can be used to help teach children in a number of ways.
- Subjects that could be covered include letters, words, sentences, numbers, shapes, colors, common objects, animals, clothing, body parts, and basic computer skills.
- Users have the option to create an account.
- Registered users can save, share & delete progress reports to help assess their childs learning needs.
- Simple UI & detailed instructions to help computer users of any level use the platform.

## User Stories

View the initial user stories here:(https://gist.github.com/chrismojekwu/6725a879bc04f4ba9ce45e880c56992b)

### Wireframes

View the initial wire frames here:(https://gist.github.com/chrismojekwu/562ec191c7068fec480d202ff58cb8f9)

## Screenshots

<img src="https://github.com/chrismojekwu/KidsLearn-client/blob/master/src/img/screendesk1.png" width="800">
<img src="https://github.com/chrismojekwu/KidsLearn-client/blob/master/src/img/screendesk2.png" width="800">
<img src="https://github.com/chrismojekwu/KidsLearn-client/blob/master/src/img/screenmobile1.png" height="800" >
<img src="https://github.com/chrismojekwu/KidsLearn-client/blob/master/src/img/screenmobile2.png" height="800">

## Technology

- Front-End: HTML5, CSS3, JavaScript ES6, React
- Back-End: Node.js, Express.js, Mocha, Chai, RESTful API Endpoints, Postgres
- Development Environment: Heroku, DBeaver, VS Code
- Visuals: Logo made with getPaint.NET, Additional Images / Icons provided by Flaticon.com, Freepik.com, & Flaticon users: small like art, item2101, pixel perfect.

## API Documentation

API Documentation:

### Users

- POST /api/users - Sends a new user to be registered in database

### Reports

- GET - /api/reports - Gets a logged in user's reports
- POST - /api/reports - Posts a new progress report
- GET - /api/reports/:id - Retrieves a specified report
- DELETE - /api/reports/:id - Deletes a sepecified report
- GET - /api/reports/share/:id - Public route that allows a user to share a specified report

## Responsive

KidsLearn is built to be responsive accross most devices.

## Future Updates

This is v1.0 of the app, but future enhancements are expected to include:

- More visual effects for children.
- A badge / reward system based on recorded scores and frequency of use.
- Guided challenges.
- Message board system for parents to share techniques & use ideas.
- The ability to save and share Doodle drawings.

## Local Node scripts

- To install the node project ===> npm install
- To migrate the database ===> npm run migrate -- 1
- To run Node server (on port 8000) ===> npm run dev
- To run tests ===> npm run test

## Local React scripts

- To install the react project ===> npm install
- To run react (on port 3000) ===> npm start
- To run tests ===> npm run test

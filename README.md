# generate-node-project

Generate a complete NodeJS app (API) with babel, jest, Sequelize, JWT already configured for you.

- [Creating an App](#creating-an-app) – How to create a new app.

Generate Node Project works on macOS, Windows, and Linux.<br>
If something doesn’t work, please [file an issue](https://github.com/abayo-luc/generate-node-project/issues/new).<br>
If you have questions or need help, please ask via email: luc.bayo@gmail.com

## Installation

```sh
npm i -g generate-node-project
```

or

```sh
yarn global add generate-node-project
```

## Quick Overview

```sh
generate-node-project new_node
cd new_node
npm start
```

### Get Started Immediately

You **don’t** need to install or configure tools like babel, eslint, sequelize, jest, mocha, mongodb, etc....<br>
They are pre-configured and working, so that you can focus on the code.

Create a project, and you’re good to go.

## Creating an App

**You’ll need to have Node 8.16.0 or Node 10.16.0 or later version on your local development machine**

To create a new app, you may choose one of the following methods:

### generate-node-project

```sh
generate-node-project new_node
```

### OR create-node-api

```sh
create-node-api new_node
```

It will create a directory called `new_node` inside the current folder.<br>
Inside that directory, it will generate the initial project structure and install the required dependencies:

```
new_node
├── README.md
├── node_modules
├── package.json
├── .gitignore
├── .eslintrc
├── .jest.config.js
├── .env
├── app.js
├── index.js
├── __tests__
└── src
    ├── config
    ├── controllers
    ├── routes
    ├── models
    ├── migrations
    └── seeders
```

Now all the configurations and folder structures are done for you.<br>
Once the installation is done, you can open your project folder:

```sh
cd new_node
```

Inside the newly created project, you can run some existing commands:

### `npm start` or `yarn start`

Runs the app in development mode.<br>
And it will be available on [http://localhost:3000](http://localhost:3000).

### `npm test` or `yarn test`

Runs the test.<br>

## More Commands:

Generate basic NodeJs API: javascript

```sh
generate-node-project --skip
```

Generate basic NodeJs API: typscript

```sh
generate-node-project --template=typescript
```

View all available commands

```sh
generate-node-project --help
```

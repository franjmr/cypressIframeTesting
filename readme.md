# Cypress Iframe Testing 
Cypres does not support iframes 100% and has difficulties working with them because all built-in cy DOM traversal commands do hard stop the moment they hit #document node inside the iframe. 

In this project I will show how to interact with DOM elements inside an iframe

## 'cypress-iframe' plugin
This project use [cypress-iframe](https://www.npmjs.com/package/cypress-iframe) plugin to add iframe support to Cypress with custom commands simplifying working with elements inside an iframe.

## Installation
```
npm install
```

## Open the Cypress Test Runner
```
npm run cy:open
```

## Run Cypress from the command line
<b>Run all specs headlessly in the Electron browser</b>
```
npm run cy:run:checkout:all
```

<b>Run 'Checkout is OK' spec headlessly in the Electron browser</b>
```
npm run cy:run:checkout:ok
```

<b>Run 'Checkout is KO' spec headlessly in the Electron browser</b>
```
npm run cy:run:checkout:ko
```

<b>Run 'Checkout is PENDING' spec headlessly in the Electron browser</b>
```
npm run cy:run:checkout:pending
```

> <b>Pass command’s arguments using npm run:</b> when calling a command using npm run, you need to pass the command’s arguments using the -- string.

<b>Run 'Checkout is PENDING' spec headlessly in the Chrome browser</b>
```
npm run cy:run:checkout:pending -- --browser chrome --headless
```

## Run Cypress with JUnit reporter from the command line
```
npm run cy:run:checkout:pending -- --reporter junit --reporter-options "mochaFile=cypress/results/[hash].xml"
```

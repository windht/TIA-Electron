# TIA-Electron
The open source TIA Electron App. Contains full set of automation runtime, together with Socket and HTTP interface to be controlled by remote api calls.

## What is this

Think of it as a worker that does tasks for you in schedule in order according to the **blueprint** you give to it.

## What can it do

* Browser automation using [chromeless](https://github.com/graphcool/chromeless)
* HTTP Request using [request](https://github.com/request/request)
* Email using [node-mailer](https://github.com/nodemailer/nodemailer)
* Wildcard script that access all modules in your package.json

## Current Base Modules
TIA-Electron is used in many enterprise settings, so there exists a sets of document generation and encryption modules. We may remove all the irrelevant bases in the future. Check package.json for details.

## Install Dependencies

    npm install
    
Or if you have installed yarn

    yarn install

## Develop & Debug

Running and packaging are based on [Electron-Forge](https://github.com/electron-userland/electron-forge)

    npm run start #Start the app
    npm run package #Pack the app
    
## Code Editor

Recommend Using [VSCode](https://code.visualstudio.com/), a preset vs launch config is ready.

## How To Add Modules

## Features

* A Tray App that runs in background.
* Run The Builder FRA Apps with specific browser window properties.
* Start task listening to both socket and http calls (listen port 10531).
* Use desktop installed chrome to do Browser Automations (debug port 10411);

## TIA-Cloud
TIA Cloud is a interface backed by Parse Server that manage all TIA Worker Runtimes. 
Visit https://thebuilder.hk/board and have a try.

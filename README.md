# TIA-Electron
The TIA Electron App. Contains full set of automation runtime, together with Socket and HTTP interface to be controlled by remote api calls.

## Install Dependencies

    npm install

## Develop & Debug

Running and packaging are based on [Electron-Forge](https://github.com/electron-userland/electron-forge)

    electron-forge start #Start the app
    electron-forge package #Pack the app
    
## Code Editor

Recommend Using [VSCode](https://code.visualstudio.com/), a preset vs launch config is ready.

## Features

* A Tray App that runs in background.
* Run The Builder FRA Apps with specific browser window properties.
* Start task listening to both socket and http calls (listen port 10531).
* Use desktop installed chrome to do Browser Automations (debug port 10411);

## TIA-Cloud
TIA Cloud is a interface backed by Parse Server that manage all TIA Worker Runtimes. 
Visit https://thebuilder.hk/board and have a try.

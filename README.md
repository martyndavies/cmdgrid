# CmdGrid

Command line interface for interacting with the [SendGrid Parse API](http://docs.sendgrid.com) written in [node.js](http://nodejs.org).


## Installation

    $ npm install cmdgrid

## Usage

Once installed, you can run `$ cmd --help` to see a list of options, but given this application currently only deals with the SendGrid Parse API.

You have options to add, edit and delete your settings via the app.

### Adding a new setting

`$ cmdgrid -p add -h madco.in -u http://madco.in/inbound.php`

### Editing an existing setting

`$ cmdgrid -p add -h madco.in -u http://alternativeurl.com/inbound.php`

### Deleting a setting

`$ cmdgrid -p add -h madco.in

### List all settings

`$ cmdgrid -p -l`
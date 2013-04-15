# CmdGrid

Command line interface for interacting with the [SendGrid Parse API](http://docs.sendgrid.com) written in [node.js](http://nodejs.org).


## Installation

    $ npm install cmdgrid

## Usage

Once installed, you can run `$ cmd --help` to see a list of options, but given this application currently only deals with the SendGrid Parse API.

You have options to add, edit and delete your settings via the app.

Flags are used to alternate options:

```
	-p, --parse <option> [hostname] [url], [add|edit|delete] a new Parse API setting
	-a, --add [hostname] [url], add a new endpoing'
	-e, --edit [hostname] [url], 'edit a Parse API setting
	-d, --delete [hostname], delete and endpoint and all settings associated with it
	-u, --url <url>, specify a url endpoint
	-h, --hostname <url>, specify a hostname
	-s, --spamcheck <option>, specify if spam checking is to be performed (on|off)
	-l, --list, list out all the current Parse API settings
```

You can pass short flags, like `-h`, or long flags like `--hostname`.

### Adding a new setting

Adding a new inbound parse setting requires both a hostname and a URL endpoint, so you must pass the `-h` and `-u` flags.

    $ cmdgrid -p add -h madco.in -u http://madco.in/inbound.php

### Editing an existing setting

    $ cmdgrid -p add -h madco.in -u http://alternativeurl.com/inbound.php

### Deleting a setting

    $ cmdgrid -p add -h madco.in

### List all settings

    $ cmdgrid -p -l
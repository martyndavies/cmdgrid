# CmdGrid

Command line interface for interacting with the [SendGrid Parse API](http://docs.sendgrid.com) written in [node.js](http://nodejs.org). The idea being that it speeds up the process of changing settings, particularly for developers who work in a terminal environment such as Vim.


## Installation

    $ npm install cmdgrid

## Usage

Once installed, you can run `$ cmd --help` to see a list of options. This application currently only deals with the SendGrid Parse API.

You have options to `add`, `update`, `delete` and `list` your settings via the app.

Flags are used to alternate options:

```
-p, --parse <option> [hostname] [url], options=[add|edit|delete|list] a new Parse API setting
-u, --url <url>, specify a url endpoint
-h, --hostname <url>, specify a hostname
-s, --spamcheck <option>, specify if spam checking is to be performed (on|off)
```

You can pass short flags, like `-h`, or long flags like `--hostname`.

### The -p flag

The `-p` flag tells the application you'll be working with the Parse API.

Although the application currently only supports the Parse API, it will support more aspects of SendGrid soon and flags will be used to differentiate between these, hence its requirement now.


### Adding a new setting

Adding a new inbound parse setting requires both a hostname and a URL endpoint, so you must pass the `-h` and `-u` flags.

    $ cmdgrid -p add -h madco.in -u http://madco.in/inbound.php

### Updating an existing setting

    $ cmdgrid -p update -h madco.in -u http://alternativeurl.com/inbound.php

### Deleting a setting

    $ cmdgrid -p delete -h madco.in

### List all settings

    $ cmdgrid -p list

## Links

[SendGrid Parse API](http://docs.sendgrid.com)

## License

(The MIT License)

Copyright (c) 2013 Martyn Davies (martyn@martyndavies.net)

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

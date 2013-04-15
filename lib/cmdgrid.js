#!/usr/bin/env node

var program = require('commander'),
		Table = require('cli-table'),
		request = require('request');


var username, pwd, optionsString;

// Generic logging in
function loginAndRequest(endpoint, options, callback){
	'use strict';
	if (options){
		if(!options.spam){options.spamcheck = '0';}
		if (!options.endpoint) {
			var optionsString = '&hostname='+options.hostname;
		} else {
			var optionsString = '&hostname='+options.hostname+'&url='+options.endpoint+'&spam_check='+options.spamcheck;
		}
	}
	request('https://sendgrid.com/api/'+endpoint+'.json?api_user='+username+'&api_key='+pwd+optionsString, function (error, response, body) {
		if (!error && response.statusCode === 200) {
			callback(error, body);
		} else {
			callback(error);
		}
	});
}

function perform(action, hostname, endpoint, spam){
	'use strict';
	program.prompt('Username: ', function(inputName){
		username = inputName;
		program.password('Password: ', '*', function(inputPassword){
			pwd = inputPassword;
			process.stdin.destroy();
			loginAndRequest(action, {hostname: hostname, endpoint: endpoint, spam: spam}, function(error, body){
				//console.log(body);
				var res = JSON.parse(body);
				if (res.error){
					console.log(res.error.message+'\n');
				} else if (res.message === 'error'){
					console.log('Sorry, '+res.errors[0]);
				} else if (res.message === 'success') {
					if (action === 'parse.delete'){
						console.log('Successfully removed '+hostname+' and its settings\n');
					} else {
						console.log('\nSuccessfully pointed '+hostname+' to '+endpoint+'!\n');
						console.log('NOTE:\r');
						console.log('To complete the setup, add an MX record to the DNS for '+hostname+' and point it to mx.sendgrid.net\n');
					}
				} else {
					console.log('so much error! '+res);
				}
			});
		});
	});
}

program
	.version('0.0.1')
	.option('-p, --parse <option> [hostname] [url]', '[add|edit|delete] a new Parse API setting')
	.option('-a, --add [hostname] [url]', 'add a new endpoing')
	.option('-e, --edit [hostname] [newurl]', 'edit a Parse API setting')
	.option('-d, --delete [hostname]', 'delet and endpoint and all settings associated with it')
	.option('-u, --url <url>', 'specify a url endpoint')
	.option('-h, --hostname <url>', 'specify a hostname')
	.option('-s, --spamcheck <option>', 'specify if spam checking is to be performed (on|off)', 'on')
	.option('-l, --list', 'list out all the current Parse API settings')
	.parse(process.argv);



if(program.parse === 'add') {
	console.log('Adding a new hostname to the Parse API');
	if(program.hostname && program.url) {
		perform('parse.set', program.hostname, program.url);
	}
} else if (program.parse === 'edit') {
	console.log('Updating details for '+program.hostname+' using the Parse API');
	if(program.hostname && program.url) {
		perform('parse.edit', program.hostname, program.url);
	}
} else if (program.parse === 'delete') {
	console.log('Removing '+program.hostname+' and all settings (you can confirm this again before action is taken!');
	if(program.hostname) {
		program.confirm('Are you sure you want to delete the settings for '+program.hostname, function(ok){
			if (ok === true) {
				console.log('Deleting '+ program.hostname);
				perform('parse.delete', program.hostname);
			} else {
				console.log('Right, we\'ll just forget you mentioned it then...\n');
				process.stdin.destroy()
			}

		});
	}
} else if (program.parse === 'list'){
	perform('parse.get', program.hostname, program.url);
} else {
	console.log('please supply some args');
}





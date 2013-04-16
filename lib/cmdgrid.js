#!/usr/bin/env node

var program = require('commander'),
		Table = require('cli-table'),
		request = require('request');


var username, pwd, optionsString;

var table = new Table({
    head: ['#', 'Hostname', 'URL', 'Spam Check?']
  , colWidths: [5, 20, 50, 15]
});

function errorCatcher(){
	console.log('\033[31mThere was an error connecting to SendGrid.\033[39m\n');
}

// Generic logging in
function loginAndRequest(endpoint, options, callback){
	'use strict';
	if (options){
		if(!options.spam){
			options.spamcheck = '0';
		} else if (options.spam === 'on' || options.spam === 'On'){
			options.spamcheck = '1';
		} else {
			options.spam = '1';
		}
		
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
	program.prompt('Username: ', function(inputName){
		username = inputName;
		program.password('Password: ', ' ', function(inputPassword){
			pwd = inputPassword;
			process.stdin.destroy();
			loginAndRequest(action, {hostname: hostname, endpoint: endpoint, spam: spam}, function(error, body){
				if (!body) {
					errorCatcher();
				} else {
					var res = JSON.parse(body);
					if (res.error){
						console.log('\033[31m'+res.error.message+'\033[39m\n');
					} else if (res.message === 'error'){
						console.log('\033[31mSorry, '+res.errors[0]+'\033[39m\n');
					} else if (res.message === 'success') {
						if (action === 'parse.delete'){
							console.log('\n\033[32mSuccessfully removed '+hostname+' and its settings\033[39m\n');
						} else {
							console.log('\n\033[32mSuccessfully pointed '+hostname+' to '+endpoint+'!\033[39m\n');
							console.log('\033[35mNOTE:\033[39m\r');
							console.log('\033[35mTo complete the setup, add an MX record to the DNS for '+hostname+' and point it to mx.sendgrid.net\033[39m\n');
						}
					} else {
						console.log('\033[31mSo much error! '+res.error+'\033[39m\n');
					}
				}
			});
		});
	});
}

program
	.version('0.0.1')
	.option('-p, --parse <option> [hostname] [url] [list]', '[add|edit|delete] a new Parse API setting')
	.option('-u, --url <url>', 'specify a url endpoint')
	.option('-h, --hostname <url>', 'specify a hostname')
	.option('-s, --spamcheck <option>', 'specify if spam checking is to be performed (on|off)', 'on')
	.option('-l, --list', 'list out all the current Parse API settings')
	.parse(process.argv);

if(program.parse === 'add') {
	console.log('Adding a new hostname to the Parse API\n');
	if(program.hostname && program.url) {
		if (program.spamcheck) {
			perform('parse.set', program.hostname, program.url, program.spamcheck);
		} else {
			perform('parse.set', program.hostname, program.url);
		}
	}
} else if (program.parse === 'edit') {
	console.log('Updating details for '+program.hostname+' using the Parse API\n');
	if(program.hostname && program.url) {
		perform('parse.edit', program.hostname, program.url);
	}
} else if (program.parse === 'delete') {
	console.log('Removing '+program.hostname+' and all settings (you can confirm this again before action is taken!\n');
	if(program.hostname) {
		program.confirm('Are you sure you want to delete the settings for '+program.hostname, function(ok){
			if (ok === true) {
				console.log('Deleting '+ program.hostname);
				perform('parse.delete', program.hostname);
			} else {
				console.log('Right, we\'ll just forget you mentioned it then...\n');
				process.stdin.destroy();
			}
		});
	}
} else if (program.parse === 'list'){
	console.log('Listing all your Parse API settings...\n');
	program.prompt('Username: ', function(inputName){
		username = inputName;
		program.password('Password: ', ' ', function(inputPassword){
			pwd = inputPassword;
			process.stdin.destroy();
			loginAndRequest('parse.get',{},function(err, body){
				if (!body || err){
					errorCatcher();
				} else {
					var res = JSON.parse(body);

					if (res.error){
						console.log('\033[31m'+res.error.message+'\033[39m\n');
					} else if (res.message === 'error'){
						console.log('\033[31mSorry, '+res.errors[0]+'\033[39m\n');
					} else {
						var length = res.parse.length;
						for (var i=0; i < length; i++) {
							var spamCheck = res.parse[i].spam_check === 0 ? 'Off' : 'On';
							table.push([i+1, res.parse[i].hostname, res.parse[i].url, spamCheck]);
						}
						console.log(table.toString());
					}
				}
			});
		});
	});
} else {
	program.outputHelp();
}





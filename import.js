/**
 * Created by Qarles on 2015-10-20.
 */

var baseApiUrl = 'https://api.github.com',
	fs = require('fs'),
	argv = require('optimist').argv,
	restler = require('restler'),
	dataFile = JSON.parse(fs.readFileSync(argv.f, 'utf-8')),
	milestones = dataFile.milestones || [],
	labels = dataFile.components || [],
	issues = dataFile.issues || [],
	comments = dataFile.comments || [],
	globalVars = {
		owner: argv.owner || '',
		repo: argv.repo || '',
		token: argv.token || ''
	},
	apiReq = function (method, url, data) {
		for (var i in globalVars) {
			url = url.replace(':' + i, globalVars[i]);
		}
		for (var i in data) {
			url = url.replace(':' + i, data[i]);
		}
		url = baseApiUrl+url;

		method = method.toLowerCase();
		var req = restler[method](url, {
			method: method,
			data: JSON.stringify(data),
			headers: {
				'Authorization': 'token '+globalVars.token,
				'Content-Type': 'application/json'
			}
		}).on('complete', function(result) {
			if (result instanceof Error) {
				console.log('['+url+'] Error:', result.message);
			} else {
				console.log(url, result.message);
			}
		});
	},

	importMilestones = function () {
		milestones.forEach(function (milestone, index) {
			apiReq('POST', '/repos/:owner/:repo/milestones', {
				id: index + 1,
				title: milestone.name
			});
		});
	},

	findMilestone = function (title) {
		milestones.forEach(function (milestone, index) {
			if (milestone.name == title) {
				return index + 1;
			}
		});
		return null;
	},

	importLabels = function () {
		labels.forEach(function (label, index) {
			apiReq('POST', '/repos/:owner/:repo/labels', {
				name: label.name,
				color: 'f29513'
			});
		});
	},

	importIssues = function () {
		issues.forEach(function (issue) {
			apiReq('POST', '/repos/:owner/:repo/issues', {
				id: issue.id,
				title: issue.title,
				body: issue.content,
				assignee: issue.assignee,
				state: issue.status == 'resolved' ? 'closed' : 'open',
				milestone: findMilestone(issue.milestone),
				labels: [issue.component]
			});
		});
	},

	importComments = function () {
		comments.forEach(function (comment, index) {
			apiReq('POST', '/repos/:owner/:repo/issues/:issue/comments', {
				body: comment.content,
				user: comment.user,
				issue: comment.issue
			});
		});
	};

if (argv.m) {
	importMilestones();
}
if (argv.l) {
	importLabels();
}
if (argv.i) {
	importIssues();
}

if (argv.c) {
	importComments();
}
'use strict';

var chai = require('chai');
var expect = chai.expect;
chai.use(require('chai-spies'));

var utils = require('./utils');
var green = chai.spy.on(utils, 'green');
var red = chai.spy.on(utils, 'red');

var fs = require('fs');
var exercise = require('./exercise-two');
var dirpath = __dirname + '/poem-two/';
var stanzas = fs.readdirSync(dirpath)
.filter(function (filename) {
	return filename[0] !== '.'
})
.map(function (filename) {
	return fs.readFileSync(dirpath + filename).toString();
});

describe('exercise two (involving poem two)', function () {

	beforeEach(function () {
		green.reset();
		red.reset();
	});

	var greenCalls, redCalls;
	beforeEach(function () {
		greenCalls = green.__spy.calls;
		redCalls = red.__spy.calls;
	});

	var originalLog = console.log;
	beforeEach(function () {
		console.log = function () {
			var args = [].slice.call(arguments);
			console.log.calls.push({
				args: args,
				priorNumGreenCalls: green.__spy.calls.length,
				priorNumRedCalls: red.__spy.calls.length
			});
			return originalLog.apply(console, arguments);
		}
		console.log.calls = [];
	});

	function getLoggedDoneCalls () {
		return console.log.calls.filter(function (call) {
			return call.args.some(function (arg) {
				return /done/.test(arg);
			});
		});
	}

	describe('problemA', function () {

		it('ignoring errors, logs the first and second stanza in any order, and a done message when both are complete', function (done) {
			exercise.problemA();
			setTimeout(function () {
				expect(green).to.have.been.called.with(stanzas[0]);
				expect(green).to.have.been.called.with(stanzas[1]);
				var loggedDoneCalls = getLoggedDoneCalls();
				expect(loggedDoneCalls).to.have.length(1);
				var loggedDoneCall = loggedDoneCalls[0];
				expect(loggedDoneCall.priorNumGreenCalls).to.equal(2);
				done();
			}, 500);
		});

	});
	
	describe('problemB', function () {

		it('ignoring errors, logs all stanzas in any order, and a done message when all are complete', function (done) {
			this.timeout(3000);
			exercise.problemB();
			setTimeout(function () {
				stanzas.forEach(function (stanza) {
					expect(green).to.have.been.called.with(stanza);
				});
				var loggedDoneCalls = getLoggedDoneCalls();
				expect(loggedDoneCalls).to.have.length(1);
				var loggedDoneCall = loggedDoneCalls[0];
				expect(loggedDoneCall.priorNumGreenCalls).to.equal(stanzas.length);
				done();
			}, 2000);
		});

	});
	
	describe('problemC', function () {

		it('ignoring errors, logs all stanzas in the correct order, and a done message when all are complete', function (done) {
			this.timeout(3000);
			exercise.problemC();
			setTimeout(function () {
				stanzas.forEach(function (stanza, index) {
					var callArgs = greenCalls[index];
					expect(callArgs[0]).to.equal(stanza);
				});
				var loggedDoneCalls = getLoggedDoneCalls();
				expect(loggedDoneCalls).to.have.length(1);
				var loggedDoneCall = loggedDoneCalls[0];
				expect(loggedDoneCall.priorNumGreenCalls).to.equal(8);
				done();
			}, 2000);
		});

	});
	
	describe('problemD', function () {

		it('logs all stanzas in the correct order; if an error occurs does not read the next file and instead logs the error; always logs done at the end', function (done) {
			this.timeout(3000);
			exercise.problemD();
			setTimeout(function () {
				greenCalls.forEach(function (callArgs, index) {
					expect(callArgs[0]).to.equal(stanzas[index]);
				});
				if (redCalls.length) {
					expect(redCalls.length).to.equal(1);
					expect(redCalls[0][0]).to.be.instanceof(Error);
					expect(greenCalls.length).to.be.below(8);
				}
				var loggedDoneCalls = getLoggedDoneCalls();
				expect(loggedDoneCalls).to.have.length(1);
				var loggedDoneCall = loggedDoneCalls[0];
				expect(loggedDoneCall.priorNumGreenCalls).to.equal(greenCalls.length);
				if (greenCalls.length !== stanzas.length) {
					expect(loggedDoneCall.priorNumRedCalls).to.equal(1);
				}
				done();
			}, 2000);
		});

	});

describe('problemE', function () {

		it('is a promisified version of fs.writeFIle', function (done) {
			this.timeout(3000);
			exercise.problemE();
			// setTimeout(function () {
			// 	greenCalls.forEach(function (callArgs, index) {
			// 		expect(callArgs[0]).to.equal(stanzas[index]);
			// 	});
			// 	if (redCalls.length) {
			// 		expect(redCalls.length).to.equal(1);
			// 		expect(redCalls[0][0]).to.be.instanceof(Error);
			// 		expect(greenCalls.length).to.be.below(8);
			// 	}
			// 	var loggedDoneCalls = getLoggedDoneCalls();
			// 	expect(loggedDoneCalls).to.have.length(1);
			// 	var loggedDoneCall = loggedDoneCalls[0];
			// 	expect(loggedDoneCall.priorNumGreenCalls).to.equal(greenCalls.length);
			// 	if (greenCalls.length !== stanzas.length) {
			// 		expect(loggedDoneCall.priorNumRedCalls).to.equal(1);
			// 	}
			 	done();
			// }, 2000);
		});

	});
});
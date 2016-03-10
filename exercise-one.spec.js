'use strict';

var chai = require('chai');
var expect = chai.expect;
chai.use(require('chai-spies'));

var utils = require('./utils');
var green = chai.spy.on(utils, 'green');
var red = chai.spy.on(utils, 'red');

var fs = require('fs');
var exercise = require('./exercise-one');
var dirpath = __dirname + '/poem-one/';
var stanzas = fs.readdirSync(dirpath)
.filter(function (filename) {
	return filename[0] !== '.'
})
.map(function (filename) {
	return fs.readFileSync(dirpath + filename).toString();
});

function exactlyOneIsTrue (boolA, boolB) {
	var onlyOne = true;
	if (boolA && boolB) {
		onlyOne = false;
	} else if (!boolA && !boolB) {
		onlyOne = false;
	}
	return onlyOne;
}

function getCall (spy, n) {
	return spy.__spy.calls[n] || [];
}

describe('exercise one (involving poem one)', function () {

	beforeEach(function () {
		green.reset();
		red.reset();
	});

	var greenCalls, redCalls;
	beforeEach(function () {
		greenCalls = green.__spy.calls;
		redCalls = red.__spy.calls;
	});

	describe('problemA', function () {
		
		it('logs the first stanza', function (done) {
			exercise.problemA();
			setTimeout(function () {
				expect(green).to.have.been.called.with(stanzas[0]);
				done();
			}, 250);
		});

	});

	describe('problemB', function () {
		
		it('logs the second and third stanzas in any order', function (done) {
			exercise.problemB();
			setTimeout(function () {
				expect(green).to.have.been.called.with(stanzas[1]);
				expect(green).to.have.been.called.with(stanzas[2]);
				done();
			}, 500);
		});

	});

	describe('problemC', function () {
		
		it('logs the second THEN the third stanza', function (done) {
			exercise.problemC();
			setTimeout(function () {
				var firstCallArgs = greenCalls[0];
				var secondCallArgs = greenCalls[1];
				expect(firstCallArgs[0]).to.equal(stanzas[1]);
				expect(secondCallArgs[0]).to.equal(stanzas[2]);
				done();
			}, 500);
		});

	});

	describe('problemD', function () {
		
		it('logs the fourth stanza or an error if it occurs', function (done) {
			exercise.problemD();
			setTimeout(function () {
				var greenCalledWithStanza = (getCall(green, 0)[0] == stanzas[3]);
				var redCalledWithError = (getCall(red, 0)[0] instanceof Error);
				var exactlyOneOccured = exactlyOneIsTrue(greenCalledWithStanza, redCalledWithError);
				expect(exactlyOneOccured).to.equal(true);
				done();
			}, 250);
		});

	});

	describe('problemE', function () {
		
		it('logs the third THEN the fourth stanza; if an error occurs only logs the error and does not continue reading (if there is a file still left to read)', function (done) {
			exercise.problemE();
			setTimeout(function () {
				var bothSucceeded = (greenCalls.length === 2);
				var onlyFirstSucceeded = (greenCalls.length === 1);
				var firstFailed = (greenCalls.length === 0);
				if (bothSucceeded) {
					expect(greenCalls[0][0]).to.equal(stanzas[2]);
					expect(greenCalls[1][0]).to.equal(stanzas[3]);
					expect(redCalls).to.be.empty;
				} else if (onlyFirstSucceeded) {
					expect(greenCalls[0][0]).to.equal(stanzas[2]);
					expect(redCalls).to.have.length(1);
					expect(redCalls[0][0]).to.be.instanceof(Error);
				} else if (firstFailed) {
					expect(redCalls).to.have.length(1);
					expect(redCalls[0][0]).to.be.instanceof(Error);
				} else {
					throw Error('Cannot determine how many file reads succeeded or failed');
				}
				done();
			}, 500);
		});

	});

	describe('problemF', function () {


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
		
		it('logs the third THEN the fourth stanza; if an error occrus only logs the error and does not continue reading (if there is a file still left to read); always finishes by logging some done message', function (done) {
			exercise.problemF();
			setTimeout(function () {
				var loggedDoneCalls = console.log.calls.filter(function (call) {
					return call.args.some(function (arg) {
						return /done/.test(arg);
					});
				});
				expect(loggedDoneCalls).to.have.length(1);
				var loggedDoneCall = loggedDoneCalls[0];
				var bothSucceeded = (greenCalls.length === 2);
				var onlyFirstSucceeded = (greenCalls.length === 1);
				var firstFailed = (greenCalls.length === 0);
				if (bothSucceeded) {
					expect(greenCalls[0][0]).to.equal(stanzas[2]);
					expect(greenCalls[1][0]).to.equal(stanzas[3]);
					expect(redCalls).to.be.empty;
					expect(loggedDoneCall.priorNumGreenCalls).to.equal(2);
					expect(loggedDoneCall.priorNumRedCalls).to.equal(0);
				} else if (onlyFirstSucceeded) {
					expect(greenCalls[0][0]).to.equal(stanzas[2]);
					expect(redCalls).to.have.length(1);
					expect(redCalls[0][0]).to.be.instanceof(Error);
					expect(loggedDoneCall.priorNumGreenCalls).to.equal(1);
					expect(loggedDoneCall.priorNumRedCalls).to.equal(1);
				} else if (firstFailed) {
					expect(redCalls).to.have.length(1);
					expect(redCalls[0][0]).to.be.instanceof(Error);
					expect(loggedDoneCall.priorNumGreenCalls).to.equal(0);
					expect(loggedDoneCall.priorNumRedCalls).to.equal(1);
				} else {
					throw Error('Cannot determine how many file reads succeeded or failed');
				}
				done();
			}, 500);
		});

	});
});
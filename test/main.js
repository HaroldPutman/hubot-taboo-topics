'use strict';

const Helper = require('hubot-test-helper');
const expect = require('chai').expect;

const helper = new Helper('../src/main.js'); // path to file you want to test

let NewMockResponse;
const hasProp = {}.hasOwnProperty;
const extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

NewMockResponse = (function(superClass) {
  extend(NewMockResponse, superClass);

  function NewMockResponse() {
    return NewMockResponse.__super__.constructor.apply(this, arguments);
  }

  NewMockResponse.prototype.random = function(items) {
    return items[0];
  };

  return NewMockResponse;

})(Helper.Response);


describe('hubot', () => {

	let room;

	beforeEach(function() { room = helper.createRoom({response: NewMockResponse})});
	afterEach(function() { room.destroy()});

	it('should respond when making topic taboo', (done) => {

		room.user.say('alice', 'hubot refactoring is taboo').then(() => {
			room.user.say('alice', 'I love the taste of refactoring.').then(() => {
				console.log(room.messages);
				expect(room.messages).to.eql([
					['alice', 'hubot refactoring is taboo'],
					['hubot', '@alice Refactoring is now taboo'],
					['alice', 'I love the taste of refactoring.'],
					['hubot', '@alice Do not speak of refactoring.'],
				]);
				done();
			});
		});

	});

});

'use strict';

const Helper = require('hubot-test-helper');
const expect = require('chai').expect;

const helper = new Helper('../src/main.js'); // path to file you want to test



class NewMockResponse extends Helper.Response {
  random(items) {
    return items[0];
  }
}

describe('hubot', () => {

  let room;

  beforeEach(function() { room = helper.createRoom({response: NewMockResponse})});
  afterEach(function() { room.destroy()});

  it('should respond when making topic taboo', (done) => {
    room.user.say('alice', 'hubot refactoring is taboo').then(() => {
      expect(room.messages).to.eql([
        ['alice', 'hubot refactoring is taboo'],
        ['hubot', '@alice Refactoring is now taboo'],
      ]);
      done();
    });

  });

  it('should respond when making topic no longer taboo', (done) => {
    room.user.say('becky', 'hubot taboo leverage.').then(() => {
      room.user.say('becky', 'hubot untaboo leverage').then(() => {
        expect(room.messages).to.eql([
          ['becky', 'hubot taboo leverage.'],
          ['hubot', '@becky Leverage is now taboo'],
          ['becky', 'hubot untaboo leverage'],
          ['hubot', '@becky Leverage is no longer taboo'],
        ]);
        done();
      });
    });
  });
});

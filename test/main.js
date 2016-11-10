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

  beforeEach(function() { room = helper.createRoom({response: NewMockResponse});});
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

  it('should handle untimely clearing of taboo', (done) => {
    room.user.say('alice', 'hubot pimento is no longer taboo').then(() => {
      expect(room.messages).to.eql([
        ['alice', 'hubot pimento is no longer taboo'],
        ['hubot', '@alice Oops, pimento is not taboo'],
      ]);
      done();
    });
  });

  it('should respond to mentions of taboo topics', (done) => {
    room.user.say('becky', 'hubot make squirrel taboo').then(() => {
      room.user.say('becky', 'I love me some squirrel').then(() => {
        expect(room.messages).to.eql([
          ['becky', 'hubot make squirrel taboo'],
          ['hubot', '@becky Squirrel is now taboo'],
          ['becky', 'I love me some squirrel'],
          ['hubot', '@becky Do not speak of squirrel.']
        ]);
        done();
      });
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

  it('should allow alternate wording', (done) => {
    room.user.say('becky', 'hubot make lettuce taboo').then(() => {
      room.user.say('becky', 'hubot lettuce is not taboo').then(() => {
        expect(room.messages).to.eql([
          ['becky', 'hubot make lettuce taboo'],
          ['hubot', '@becky Lettuce is now taboo'],
          ['becky', 'hubot lettuce is not taboo'],
          ['hubot', '@becky Lettuce is no longer taboo'],
        ]);
        done();
      });
    });
  });

  it('should indicate repeating taboo', (done) => {
    room.user.say('becky', 'hubot make tomatoe taboo').then(() => {
      room.user.say('becky', 'hubot make tomatoe taboo').then(() => {
        expect(room.messages).to.eql([
          ['becky', 'hubot make tomatoe taboo'],
          ['hubot', '@becky Tomatoe is now taboo'],
          ['becky', 'hubot make tomatoe taboo'],
          ['hubot', '@becky Oops, tomatoe is already taboo'],
        ]);
        done();
      });
    });
  });

  it('should report an empty taboo list', (done) => {
    room.user.say('alice', 'hubot list taboo').then(() => {
      expect(room.messages).to.eql([
        ['alice', 'hubot list taboo'],
        ['hubot', '@alice Nothing is taboo here.'],
      ]);
      done();
    });
  });

  it('should report a taboo list', (done) => {
    room.robot.brain.set("taboo", ['synergy', 'actionable']);
    room.user.say('alice', 'hubot list taboo').then(() => {
      expect(room.messages).to.eql([
        ['alice', 'hubot list taboo'],
        ['hubot', '@alice Taboo topics are: synergy, actionable'],
      ]);
      done();
    });
  });

  it('should report a taboo list alternate wording', (done) => {
    room.robot.brain.set("taboo", ['growth', 'headwinds']);
    room.user.say('alice', 'hubot taboo list').then(() => {
      expect(room.messages).to.eql([
        ['alice', 'hubot taboo list'],
        ['hubot', '@alice Taboo topics are: growth, headwinds'],
      ]);
      done();
    });
  });
});

// Description:
//   Hubot responds when taboo topics are mentioned.
//
// Dependencies:
//   none.
//
// Configuration:
//   LIST_OF_ENV_VARS_TO_SET
//
// Commands:
//   hubot taboo term - mark this teram as taboo
//   hubot not taboo term - remove the term from the taboo list
//   term - Admonish user not to speak about this term.
//
// Author:
//   HaroldPutman

'use strict';

module.exports = (robot) => {

  function admonish(res, term) {
    res.reply("I thought we agreed not to mention ${term}");
  }
  // The 'hear' callback will match against any chat in text, not just messages
  // directed at Hubot.
  robot.hear(/kiado/i, (res) => {
    // `send` will simply post this message back to chat
    admonish(res, "kiado");
  });

  // The `respond` callback will only match if Hubot is mentioned at the start
  // of the message. E.g.,
  //
  //   you: hubot speak
  //   you: @hubot speak
  robot.respond(/(not )?taboo (.*)/i, (res) => {
    // `reply` will, naturally, reply to the original sender.
    //
    //   you: hubot speak
    //   hubot: @you Arf!
    var term = res.match[1];
    res.reply("${term} is now taboo");
  });
};

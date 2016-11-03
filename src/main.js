// Description:
//   Hubot responds when taboo topics are mentioned.
//
// Dependencies:
//   None.
//
// Configuration:
//   None.
//
// Commands:
//   hubot taboo term - mark this term as taboo
//   hubot not taboo term - remove the term from the taboo list
//   hubot taboo list - List all the taboo terms
//   term - Admonish user not to speak about this term.
//
// Author:
//   HaroldPutman

'use strict';

module.exports = (robot) => {
  const responses = [
    "Do not speak of ${term}.",
    "${user}, I thought we agreed not to mention ${term}.",
    "${term} should be forgotten.",
    "We all pretend that ${term} never happened.",
    "What is this ${term} you speak of?",
    "${user}, you did not just bring up ${term}!"
  ];

  var taboo = new Map();
  var taboolist = robot.brain.get("taboo");
  if (taboolist != null) {
    for (term of taboolist) {
      taboo.set(term, new RegExp(`\\b${term}\\b`, "i"));
    }
  }

  /**
   * Insert a term into a string formatted like a template string.
   *   insert("Hello ${loc}", "loc", "World") -> "Hello World"
   */
  function insert(str, key, valu) {
    const re = new RegExp("\\$\\{" + key + "\\}", 'g');
    return str.replace(re, valu);
  }

  /**
   * Capitalize the first letter in a string.
   */
  function capitalize(str) {
    let result = str.trim();
    return result.substring(0, 1).toUpperCase() + result.substring(1);
  }

  /**
   * Rebuilds the taboolist in brain.
   */
  function rememberList(brain) {
    var taboolist = [];
    taboo.forEach((re, term) => {
      taboolist.push(term);
    });
    brain.set("taboo", taboolist);
  }

  /**
   * Removes a term from the taboo list.
   */
  function deleteTerm(res, term) {
    if (taboo.delete(term)) {
      res.reply(capitalize(`${term} is no longer taboo`));
      rememberList(res.robot.brain);
    } else {
      res.reply(`Oops, ${term} is not taboo`);
    }
  }

  /**
   * Adds a new taboo term.
   */
  function addTerm(res, term) {
    if (!taboo.has(term)) {
      taboo.set(term, new RegExp(`\\b${term}\\b`, "i"));
      rememberList(res.robot.brain);
      res.reply(capitalize(`${term} is now taboo`));
    } else {
      res.reply(`Oops, ${term} is already taboo`);
    }
  }

  /**
   * Lists all the taboo terms.
   */
  function listTerms(res) {
    if (taboo.size == 0) {
      res.reply("Nothing is taboo here.");
    } else {
      let terms = [];
      taboo.forEach((re, term) => {
        terms.push(term);
      })
      res.reply("Taboo terms are: " + terms.join(", "));
    }
  }

  /**
   * Handle the "taboo" commands
   */
  robot.respond(/(not |remove |un)?taboo (.*)/i, (res) => {
    var term = res.match[2];

    if (typeof res.match[1] !== "undefined") {
      // not taboo <term>: clearing taboo term
      deleteTerm(res, term);
    } else {
      if (term === "list") {
        // taboo list: Show list of the taboo terms.
        listTerms(res);
      } else {
        // taboo <term>: Add a new taboo term
        addTerm(res, term);
      }
    }
  });

  /**
   * Listen for taboo terms.
   */
  robot.listen((msg) => {
       if (msg.constructor.name === 'CatchAllMessage') {
         return false;
       }
       let matched = false;
       taboo.forEach((re) => {
           if (!matched) {
             var match = msg.text.match(re);
             if (match) {
               matched = match[0]
             }
           }
       });
       return matched;
    }, (res) => {
      // Complain about the use of taboo term.
      let response = res.random(responses);
      response = insert(response, "term", res.match);
      response = insert(response, "user", res.message.user.name);
      res.reply(capitalize(response));
    });

};

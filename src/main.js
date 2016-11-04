// Description:
//   Hubot responds when taboo topics are mentioned.
//
// Dependencies:
//   None.
//
// Configuration:
//   HUBOT_TABOO_FREQUENCY - How often taboo words should be noticed. (0-100)
//
// Commands:
//   hubot taboo <topic> - mark this topic as taboo
//   hubot not taboo <topic> - remove the topic from the taboo list
//   hubot taboo list - List all the taboo topics
//   topic - Admonish user not to speak about this topic.
//
// Author:
//   HaroldPutman

'use strict';

export default (robot) => {
  const responses = [
    "Do not speak of ${topic}.",
    "${user}, I thought we agreed not to mention ${topic}.",
    "${topic} should be forgotten.",
    "We all pretend that ${topic} never happened.",
    "What is this ${topic} you speak of?",
    "${user}, you did not just bring up ${topic}!"
  ];

  const taboo = new Map();
  const taboolist = robot.brain.get("taboo");
  if (taboolist != null) {
    for (topic of taboolist) {
      taboo.set(topic, new RegExp(`\\b${topic}\\b`, "i"));
    }
  }

  // Get the frequency at which to complain
  // 0 means never, 100 means always
  let frequency = parseInt(process.env["HUBOT_TABOO_FREQUENCY"], 10);
  if (frequency == NaN | frequency < 0 || frequency > 100) {
    frequency = 100;
  }

  /**
   * Insert a topic into a string formatted like a template string.
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
    const taboolist = [];
    taboo.forEach((re, topic) => {
      taboolist.push(topic);
    });
    brain.set("taboo", taboolist);
  }

  /**
   * Removes a topic from the taboo list.
   */
  function deleteTopic(res, topic) {
    const keyTopic = topic.toLowerCase();
    if (taboo.delete(keyTopic)) {
      res.reply(capitalize(`${topic} is no longer taboo`));
      rememberList(res.robot.brain);
    } else {
      res.reply(`Oops, ${topic} is not taboo`);
    }
  }

  /**
   * Adds a new taboo topic.
   */
  function addTopic(res, topic) {
    const keyTopic = topic.toLowerCase();
    if (!taboo.has(keyTopic)) {
      taboo.set(keyTopic, new RegExp(`\\b${topic}\\b`, "i"));
      rememberList(res.robot.brain);
      res.reply(capitalize(`${topic} is now taboo`));
    } else {
      res.reply(`Oops, ${topic} is already taboo`);
    }
  }

  /**
   * Lists all the taboo topics.
   */
  function listTopics(res) {
    if (taboo.size == 0) {
      res.reply("Nothing is taboo here.");
    } else {
      let topics = [];
      taboo.forEach((re, topic) => {
        topics.push(topic);
      })
      res.reply("Taboo topics are: " + topics.join(", "));
    }
  }

  /**
   * Handle the "taboo" commands starting with topic.
   */
  robot.respond(/(?:(?:make|set) )?(.+?) (is )?(not |no longer )?taboo[.?!]?$/i, (res) => {
    const topic = res.match[1];

    if (typeof res.match[3] !== "undefined") {
      // <topic> is not taboo: clearing taboo topic
      deleteTopic(res, topic);
    }  else {
      if (topic == "what" || topic == "list") {
        // what is taboo: Show list of the taboo topics.
        listTopics(res);
      } else {
        // <topic> is taboo: Add new taboo topic.
        addTopic(res, topic);
      }
    }
  });

  /**
   * Handle the "taboo" commands starting with taboo.
   */
  robot.respond(/(not |remove |un)?taboo (?:me )?(.+?)[.?!]?$/i, (res) => {
    const topic = res.match[2];

    if (typeof res.match[1] !== "undefined") {
      // not taboo <topic>: clearing taboo topic
      deleteTopic(res, topic);
    } else {
      if (topic === "list") {
        // taboo list: Show list of the taboo topics.
        listTopics(res);
      } else {
        // taboo <topic>: Add a new taboo topic
        addTopic(res, topic);
      }
    }
  });

  const robotNameRe = new RegExp("^" + robot.name, "i");

  /**
   * Listen for taboo topics.
   */
  robot.listen((msg) => {
       if (msg.constructor.name === 'CatchAllMessage') {
         return false;
       }
       if (msg.text.match(robotNameRe)) {
         // Ignore taboo words spoken to Hubot. This prevents
         // getting scolded immediately after setting a taboo topic.
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
      // Complain about the use of taboo topic.
      if (Math.floor(Math.random() * 99 + 1) <= frequency) {
        let response = res.random(responses);
        response = insert(response, "topic", res.match);
        response = insert(response, "user", res.message.user.name);
        res.reply(capitalize(response));
      }
    });

};

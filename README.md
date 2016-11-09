# hubot-taboo-topics
[![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Dependency Status][daviddm-image]][daviddm-url] [![Coverage Status][coveralls-image]][coveralls-url]

Hubot reacts when taboo topics are mentioned.

## Installation

In a hubot project repository, run:

```
npm install hubot-taboo-topics --save
```
Then add **hubot-taboo-topics** to your `external-scripts.json`:

```json
[
  "hubot-taboo-topics"
]
```
## Configuring

hubot-taboo-topics is configured by one environment variables:

* `HUBOT_TABOO_FREQUENCY` - optional, the percentage of times that hubot will respond to mentions of the taboo terms. (integer, 0-100)


## Sample interaction

```
user> hubot taboo election
hubot> Election is now taboo
user> @Bob we'll take that up after the election
hubot> What is this election you speak of?
```

## Testing

To test this script interactively, run:

```
npm start
```

[npm-image]: https://badge.fury.io/js/hubot-taboo-topics.svg
[npm-url]: https://npmjs.org/package/hubot-taboo-topics
[travis-image]: https://travis-ci.org/HaroldPutman/hubot-taboo-topics.svg?branch=master
[travis-url]: https://travis-ci.org/HaroldPutman/hubot-taboo-topics
[daviddm-image]: https://david-dm.org/haroldputman/hubot-taboo-topics/dev-status.svg?theme=shields.io
[daviddm-url]: https://david-dm.org/HaroldPutman/hubot-taboo-topics
[coveralls-image]: https://coveralls.io/repos/github/HaroldPutman/hubot-taboo-topics/badge.svg?branch=master
[coveralls-url]:https://coveralls.io/github/HaroldPutman/hubot-taboo-topics?branch=master

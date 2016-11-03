# hubot-taboo-topics

Hubot responds when taboo topics are mentioned.

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

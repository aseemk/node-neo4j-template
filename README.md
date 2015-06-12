[![Build Status](https://travis-ci.org/aseemk/node-neo4j-template.svg?branch=master)](https://travis-ci.org/aseemk/node-neo4j-template)

# Node-Neo4j Template

This is a template [Node.js][] + [Neo4j][] app, using the
**[node-neo4j][]** library (available on npm as `neo4j`).

A demo is running on Heroku at **<https://node-neo4j-template.herokuapp.com/>**.

The app is a simple social network manager: it lets you add, remove, follow,
and unfollow users.
It's basic, and the UI is crappy, but hey, it's a template app. =)

So try it out, browse the code, and fork this project to get a head start on
coding your own app. Enjoy!


## Installation

```
git clone git@github.com:aseemk/node-neo4j-template.git
cd node-neo4j-template
npm install
```

You'll also need a local Neo4j 2.x instance.
Install it via **[neo4j.org/download](http://neo4j.org/download)**,
or if you're on a Mac, `brew install neo4j`.


## Usage

Start your local Neo4j instance (e.g. `neo4j start`), then:

```
npm start
```

The app will now be accessible at
[http://localhost:3000/](http://localhost:3000/).

To run the tests:

```
npm test
```


## Deploying

This app is running on Heroku, using the free version of the
[GrapheneDB add-on](https://addons.heroku.com/graphenedb):

<https://node-neo4j-template.herokuapp.com/>

You can run your own instance similarly for free:

[![Deploy](https://www.herokucdn.com/deploy/button.png)](https://heroku.com/deploy)

If you prefer to deploy this sample app manually, these are the steps:

```
heroku create [your-app-name]
heroku addons:add graphenedb
git push heroku master
```

There's already a [Procfile](./Procfile) here, and the code already checks for the
necessary `PORT` and `GRAPHENEDB_URL` environment variables,
so your deploy should go off without a hitch!

If you're deploying in another way, the code also checks for a `NEO4J_URL`
environment variable to support pointing to any other Neo4j database.
The value of this variable should be set to the database root URL, and it can
contain HTTP Basic Auth info. E.g. `https://user:pass@1.2.3.4:5678`.
You can alternately pass the auth portion (`user:pass`) as `NEO4J_AUTH`.

One thing to note is that `npm start` is currently geared towards development:
it runs [node-dev](https://github.com/fgnass/node-dev) instead of node.
Edit `scripts.start` in [package.json](./package.json) if you need to change that.


## Miscellany

- MIT license.
- Questions/comments/etc. are welcome.
- As an exercise, I built this without using [CoffeeScript][coffeescript] or
  [Streamline][streamline]. What a gigantic pain! Never again. =P


[Node.js]: http://nodejs.org/
[Neo4j]: http://www.neo4j.org/
[node-neo4j]: https://github.com/thingdom/node-neo4j

[coffeescript]: http://www.coffeescript.org/
[streamline]: https://github.com/Sage/streamlinejs

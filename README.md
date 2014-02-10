# Node-Neo4j Template

This is a template app showing the use of [Neo4j][] from Node.js. It uses the
**[node-neo4j][]** library, available on npm as `neo4j`.

The app is a simple social network manager: it lets you add and remove users,
and follow/unfollow them.

This app supports deploying to Heroku, and a demo is in fact running live at
**<https://node-neo4j-template.herokuapp.com/>**.

So try it out, browse the code, and fork this project to get a head start on
creating your own Node-Neo4j app. Enjoy!


## Installation

```
git clone git@github.com:aseemk/node-neo4j-template.git
cd node-neo4j-template
npm install
```

You'll also need a local Neo4j 2.0 instance.
Install it via **[neo4j.org/download](http://neo4j.org/download)**.
Alternately, if you're on a Mac, you can do `brew install neo4j`.


## Usage

Start your local Neo4j instance (e.g. `neo4j start`), then:

```
npm start
```

The app will now be accessible at
[http://localhost:3000/](http://localhost:3000/).

The UI is admittedly quite crappy, but hopefully it shows the functionality.
(Anyway, this project is really about the code! =P)


## Deploying

An instance of this app runs on Heroku, using the free test version of the
[GrapheneDB add-on](https://addons.heroku.com/graphenedb):

<https://node-neo4j-template.herokuapp.com/>

If you want to run your own app on Heroku similarly, there isn't much you need to do:

```
heroku create [your-app-name]
heroku addons:add graphenedb
git push heroku master
```

There's already a [Procfile](./Procfile) here for Heroku, and the code already
checks for the necessary `PORT` and `GRAPHENEDB_URL` environment variables,
so your deploy should go off without a hitch!

If you're deploying in another way, the code also checks for a `NEO4J_URL`
environment variable to support pointing to *any* Neo4j database.
The value of this variable should be set to the database root URL, and it can
contain HTTP Basic Auth info. E.g. `https://user:pass@1.2.3.4:5678`.

One thing to note is that `npm start` is currently geared towards development:
it runs [node-dev](https://github.com/fgnass/node-dev) instead of node.
Edit `scripts.start` in [package.json](./package.json) if you need to change that.



## Miscellany

- MIT license.
- Questions/comments/etc. are welcome.
- As an exercise, I built this without using [CoffeeScript][coffeescript] or
  [Streamline][streamline]. What a gigantic pain! Never again. =P


[Neo4j]: http://www.neo4j.org/
[node-neo4j]: https://github.com/thingdom/node-neo4j

[coffeescript]: http://www.coffeescript.org/
[streamline]: https://github.com/Sage/streamlinejs

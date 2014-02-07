# Node-Neo4j Template

This is a template app showing the use of [Neo4j][] from Node.js. It uses the
**[node-neo4j][]** library, available on npm as `neo4j`.

The app is a simple social network manager: it lets you add and remove users,
and follow/unfollow them.

This app supports deploying to Heroku, and a demo is in fact running live at
**[http://node-neo4j-template.herokuapp.com/](http://node-neo4j-template.herokuapp.com/)**.

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

Start your local Neo4j instance (e.g. `neo4j start`), and assuming it's
running on the default of port 7474:

```
npm start
```

The app will now be accessible at
[http://localhost:3000/](http://localhost:3000/).

(You can optionally point to Neo4j elsewhere via a `NEO4J_URL` environment
variable, or change the app's port via a `PORT` one.
This is how the app works on Heroku.)

The UI is admittedly quite crappy, but hopefully it shows the functionality.
(Anyway, this project is really about the code! =P)


## Miscellany

- MIT license.
- Questions/comments/etc. are welcome.
- As an exercise, I built this without using [CoffeeScript][coffeescript] or
  [Streamline][streamline]. What a gigantic pain! Never again. =P


[Neo4j]: http://www.neo4j.org/
[node-neo4j]: https://github.com/thingdom/node-neo4j

[coffeescript]: http://www.coffeescript.org/
[streamline]: https://github.com/Sage/streamlinejs

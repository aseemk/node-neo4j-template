# Node-Neo4j Template

This is a template app showing the use of [Neo4j][] from Node.js. It uses the
[node-neo4j][] library, available on npm as `neo4j`.

The app is a simple social network manager: it lets you add and remove users
and "follows" relationships between them.

This app supports deploying to Heroku, and a demo is in fact running live at
[http://node-neo4j-template.herokuapp.com/](http://node-neo4j-template.herokuapp.com/).

So try it out, browse the code, and fork this project to get a head start on
creating your own Node-Neo4j app. Enjoy!


## Installation

```bash
# Install the required dependencies
npm install

# Install a local Neo4j instance
NEO4J_VERSION=neo4j-community-1.9.4
curl http://dist.neo4j.org/$NEO4J_VERSION-unix.tar.gz --O $NEO4J_VERSION-unix.tar.gz
tar -zxvf $NEO4J_VERSION-unix.tar.gz
rm $NEO4J_VERSION-unix.tar.gz
ln -s $NEO4J_VERSION/bin/neo4j neo4j
```


## Usage

```bash
# Start the local Neo4j instance
./neo4j start

# Run the app!
npm start
```

The app will now be accessible at [http://localhost:3000/](http://localhost:3000/).

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

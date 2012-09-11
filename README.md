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
curl "http://dist.neo4j.org/neo4j-community-1.6-unix.tar.gz" --O "db-unix.tar.gz"
tar -zxvf db-unix.tar.gz 2> /dev/null
rm db-unix.tar.gz
```


## Usage

```bash
# Start the local Neo4j instance
neo4j-community-1.6/bin/neo4j start

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

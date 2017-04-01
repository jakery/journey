# Journey
A 2D, grid-based game engine.

## Jake's Journey
Jake's Journey is a full game built entirely in Journey. To run Jake's Journey locally with minimal setup (using lite-server), run:

    npm start dev


## Version History
### Version 2.0.0

* Runs on Node.js locally.
* Massive refactoring almost everywhere.
    * Embracing ES6 syntax.
* Massive linting almost everywhere.
    * ESLint added for linting.
* Modularized all components with AMD-style design.
* Split out common utility functions into a separate project, [Jaja.js](https://github.com/jakery/jaja).
* Added Webpack for bundling.
    * Html file now contains two `<script>` references, down from 9.
    * Bundled all json map data into the game. No more AJAX!
* Removed all jQuery dependencies.
    * jQuery.Keyboard.js is now an AMD module.
    * $(document).ready removed in favor of lightweight, custom "Dom" module.
* Split many thousand-line files out into more manageable sizes.
* Added unit tests using Mocha, wrapped in Karma.

### Version 1.0.0
* Initial Github Commit

### Pre-Git Version
* Version currently hosted on [http://jacobking.us](http://jacobking.us)

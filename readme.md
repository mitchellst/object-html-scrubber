# Object HTML Scrubber

This module recursively drills down into a javascript object or array searching for HTML string values. When html strings are encountered, it parses the HTML and removes values that match a given CSS selector. It returns an object containing the value that was passed, shorn of its offending HTML, and an array of the (escaped) html strings that were removed.

`scrubber(obj, selectors)`

Where:

`obj` - any javascript object or array. HTML strings will be sought out even if they are nested several levels deep.

`selectors` - an array of strings, where each string is a CSS selector for elements that should be stripped out. The default value is `['script', 'iframe']`.

Returns: an object with 2 keys, `scrubbed`, whose value is the object without the offending html elements, and `incidents`, an array of offending elements (as escaped HTML strings) that were found in the object.


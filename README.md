# New York Times Headlines

## Setup
This is a very minimalist interpretation of this challenge. There are no frameworks or dependencies, and this should be compatible back to IE9.

1. Open the `index.html` file in your favorite browser. Or, if you'd prefer, use your favorite command line server to view the static files on localhost. I like node's [zeit/serve](https://github.com/zeit/serve) package myself.

## Development
Since the project instructions discouraged the use of third-party frameworks and libraries, I decided to try to challenge myself to produce a minimalist version of the app. I love the convenience of React and the expressiveness of ES6, but to get a really nice implementation with either of those, you need a transpiler, which means a build pipeline, etc. And I like minimalism anyway.

So I decided to try to implement this as a static, client-only app, using only javascript and CSS that is compatible going back to IE9. I chose IE9 because it supports a lot of really nice functions in JS: `Array.prototype.map`, `Array.prototype.forEach`, `Array.prototype.indexOf`, and a few more.

It was a little bit like stepping into a time machine, but I ended up with only three static files (besides the CSS reset), with my styles close to 50 LOC and application close to 100 LOC, while staying pretty readable and expressive (I hope you agree, anyway). Those are pretty arbitrary numbers, and this would have to grow with more functionality, but it was a neat data point at the end. I haven't had been able to fully test this across browsers, but it should be fairly compatible.

## Notes on instructions:
1. The instructions reference the possibility of using server-side code, but with JSONP, it's not really necessary.
2,3. If I were to continue working on this, I would probably include the article summary in the desktop sized version and lay out the articles in more of a grid. For an MVP, the list view seemed sufficient, particularly working from a mobile-first mentality.
4. This was a pretty straightforward string manipulation, but was a fun opportunity to learn about the second argument of JavaScript's `String.prototype.replace`, which allows you to pass a function to operate on  matches.

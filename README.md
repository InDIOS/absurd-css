# Absurd-CSS

## Overview

AbsurdJS CSS preprocessor only.

## Installation

```bash
  npm i absurd-css
```

## About

This is the CSS preprocessor part of the super power preprocessor AbsurdJS that contain 
some new features and changes and no dependencies needed. So, you could transform:

  - JavaScript, JSON, CSS to CSS

## Usage
```javascript
  var api = Absurd();
  api.add({
    body: {
      marginTop: "20px",
      p: {
        color: "#000"
      }
    }
  });
  api.compile(function(err, css) {
    // use the compiled css
  });
```

## Features

  - Tiny and without cli usage.
  - Added `scope` method for scoped styles.
  - Added `unmorph` method to disable the morphs.
  - Refactored methods, plugins and molecules to a sigle files.
  - Support for custom delimiters in dynamic-css morph and value replacement in CSS.

## Changes

  - `compile` method no longer accept a path as a parameter, just callback and options.
  - `import`, `importCSS` and `rawImport` no longer accept a path or path array as parameter, you must give it a content or array of contents.
  - In Webpack or Browserify environment, you can import CSS in CSS `@import` at-rule, with the corresponding loader or transformation. Otherwise is disabled.
  - Only `jsonify` and `dynamic-css` morph are avaliables.

## Examples

### Scoped style

```javascript
  var api = Absurd();
  api.scope('#scope');
  api.add({
    body: {
      marginTop: "20px",
      p: {
        color: "#000"
      }
    }
  });
  api.compile(function(err, css) {
    console.log(css); // => #scope body{margin-top: 20px;}#scope body p{color: #000;}
  }, { minify: true });
```

### Unmorph

```javascript
  var api = Absurd();
  api.morph('jsonify');
  api.add({
    body: {
      marginTop: "20px",
      p: {
        color: "#000"
      }
    }
  });
  var rules = api.compile(); // => compile rules to a json
  var scope = { '#scope': rules }; // store json in a scope object
  api.unmorph().add(scope); // adding again as scope style
  api.compile(function(err, css) {
    console.log(css); // => #scope body{margin-top: 20px;}#scope body p{color: #000;}
  }, { minify: true });
```

### Delimiters

```javascript
  var api = Absurd();
  // this delimiters are the default, this is just an example.
  api.delimiters = ['{%', '%}'];
  api.define('someValue', '#765935');
  api.add({
    body: {
      marginTop: "20px",
      p: {
        color: "{% someValue %}"
      }
    }
  });
  api.compile(function(err, css) {
    console.log(css); // => body{margin-top: 20px;}body p{color: #765935;}
  }, { minify: true });
```

### Tip for atoms

```javascript
var api = Absurd();
  api.add({
    body: {
      marginTop: "20px",
      p: {
        // Atoms with properties that contain `()`
        // like url() you no need to put them, just put the value 
        bgi: "./path/to/some/image.png"
      }
    }
  });
  api.compile(function(err, css) {
    console.log(css); // => body{margin-top: 20px;}body p{background-image: url(./path/to/some/image.png);}
  }, { minify: true });
```

## Official site, documentation

[http://absurdjs.com/](http://absurdjs.com/)

## Resources

  - AbsurdJS fundamentals - [link](http://krasimirtsonev.com/blog/article/AbsurdJS-fundamentals)
  - Writing your CSS with JavaScript - [link](http://davidwalsh.name/write-css-javascript)
  - Componentizing the Web - [link](http://code.tutsplus.com/tutorials/componentizing-the-web--cms-20602)

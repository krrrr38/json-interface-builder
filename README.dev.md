### TypeScript + Angular template

- Dependency
  - `npm`

- including...
  - README.md
  - bower.json
  - gulpfile.js
  - package.json
  - tsd.json
  - src/

### Setup
- First, `npm install`
- To add js library

```
`npm bin`/bower --save library_name
```

- If you want to install from bower.json

```
`npm bin`/bower install
```

### How to develop
- See gulpfile.js to see dev settings.
  - `APP_NAME`: application name
  - `TS_ROOT`: typescript src directory (include editable files)
  - `JS_ROOT`: javascript src directory (include generated filed from ts)
  - `JS_VENDOR`: javascript library directory (include libs installed by bower)
  - `JS_MINIFIED`: all merged/generated js file (which contain all js)
- dev process
  - install js libs with bower
  - tsd: install library DefinitelyTyped for TypeScript
    - "`npm bin`/tsd query angular --resolve --overwrite --save --action install`"
  - "`npm bin`/gulp watch": typescript compile watcher
  - write TS in `TS_ROOT`
  - "`npm bin`/gulp minify" which generate merged js file into `JS_MINIFIED` dir




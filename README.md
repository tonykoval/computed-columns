# Computed Columns

> An awesome Kibana plugin.

This visualization plugin is like a table, but with computed columns.
Every new columns is a computation from normal basics columns. Every new column
has it own expression (e.g. col[0] * col[1] / 100).

---

## Considerations

* Any mathematical expression can be used to create computed columns. Even parentheses can be used to group expressions - e.g. (col[0] - col[1]) / col[0].
* To refence a colums use word _col_ followed by brackets with zero base index inside - e.g. col[1] = column 1 (second column).
* Computed column can be used to create new computed columns.
* Multiples computed colums will be computed in order, thous, you can only use column index n-1.
* Current Release Version: 0.4.1.
* Hidden columns are evaluated after computed columns.

## Install

From 0.5.x every release includes plugins version (x.y.z) and Kibana version (a.b.c).

#### From Kibana Installation Path:
`./bin/kibana-plugin install https://github.com/seadiaz/computed-columns/releases/download/x.y.z/computed-columns-x.y.z-a.b.c.zip`

#### From Docker Image:
`kibana-plugin install https://github.com/seadiaz/computed-columns/releases/download/x.y.z/computed-columns-x.y.z-a.b.c.zip`

## Roadmap

* Numeric data validation.
* Hidden columns format validation.

## Development
See the [kibana contributing guide](https://github.com/elastic/kibana/blob/master/CONTRIBUTING.md) for instructions setting up your development environment. Once you have completed that, use the following yarn scripts.

  - `yarn kbn bootstrap`

    Install dependencies and crosslink Kibana and all projects/plugins.

    > ***IMPORTANT:*** Use this script instead of `yarn` to install dependencies when switching branches, and re-run it whenever your dependencies change.

  - `yarn start`

    Start kibana and have it include this plugin. You can pass any arguments that you would normally send to `bin/kibana`

      ```
      yarn start --elasticsearch.url http://localhost:9220
      ```

  - `yarn build`

    Build a distributable archive of your plugin.

  - `yarn test:browser`

    Run the browser tests in a real web browser.

  - `yarn test:server`

    Run the server tests using mocha.

For more information about any of these commands run `yarn ${task} --help`. For a full list of tasks checkout the `package.json` file, or run `yarn run`.

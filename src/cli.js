#!/usr/bin/env node
import yargs from 'yargs'
import convert from './api'
import {fromJSONUnsafe} from '@buggyorg/graphtools'
import cliExt from 'cli-ext'

var args = yargs
  .usage('Usage: cat graph.json | $0 or $0 --graph graph.json --out kgraph.json')
  .boolean('p')
  .alias('p', 'pretty')
  .describe('Prettyprint output JSON.')
  .option('n', {
    alias: 'names',
    default: false,
    describe: 'Prefer node names instead of component IDs when naming nodes.'
  })

const pp = (args.argv.p) ? (graph) => JSON.stringify(graph, null, 2) : JSON.stringify

cliExt.input(args.argv._[0]).then((graphString) => {
  var graph = fromJSONUnsafe(JSON.parse(graphString))
  const conv = convert(graph)
  process.stdout.write(pp(conv))
})
.catch((err) => {
  console.error('Error while processing graph.\n', err.stack || err)
  process.exit(1)
})


import yargs from 'yargs'
import convert from './api'
import {fromJSON} from '@buggyorg/graphtools'
import getStdin from 'get-stdin'

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

getStdin().then((graphString) => {
  var graph = fromJSON(JSON.parse(graphString))
  process.stdout.write(pp(convert(graph)))
})
.catch((err) => {
  console.error('Error while processing graph.\n' + err)
  process.exit(1)
})

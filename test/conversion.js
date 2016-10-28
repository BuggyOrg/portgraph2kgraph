/* eslint-env mocha */

import chai from 'chai'
import * as Graph from '@buggyorg/graphtools'
import convert from '../src/api'

var expect = chai.expect

describe('Convert Port Graph to KGraph', () => {
  it('Can convert an empty Graph', () => {
    var kGraph = convert(Graph.empty())
    expect(kGraph).to.be.an('object')
    expect(kGraph).to.have.property('id')
    expect(kGraph).to.have.property('children')
    expect(kGraph).to.have.property('edges')
    expect(kGraph.children).to.have.length(0)
    expect(kGraph.edges).to.have.length(0)
  })

  it('Converts each node in the root layer', () => {
    var kGraph = convert(Graph.flow(
      Graph.addNode({ports: [{port: 'a', kind: 'output'}]}),
      Graph.addNode({ports: [{port: 'b', kind: 'output'}]})
    )())
    expect(kGraph.children).to.have.length(2)
  })

  it('Converts each node in the root layer', () => {
    var cmp = Graph.flow(
      Graph.addNode({ports: [{port: 'a', kind: 'output'}]})
    )(Graph.compound({ports: [{port: 'b', kind: 'input'}]}))
    var kGraph = convert(Graph.flow(
      Graph.addNode(cmp)
    )())
    expect(kGraph.children).to.have.length(1)
    expect(kGraph.children[0]).to.be.an('object')
    expect(kGraph.children[0].children).to.have.length(1)
  })
})

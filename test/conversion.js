/* eslint-env mocha */

import chai from 'chai'
import * as Graph from '@buggyorg/graphtools'
import convert from '../src/api'

var expect = chai.expect

const node = (name, kGraph) => {
  return kGraph.children.filter((c) => c.labels[0].text === name)[0]
}

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

  it('Converts edges correctly', () => {
    var kGraph = convert(Graph.flow(
      Graph.addNode({name: 'a', ports: [{port: 'a', kind: 'output'}]}),
      Graph.addNode({name: 'b', ports: [{port: 'b', kind: 'input'}]}),
      Graph.addEdge({from: 'a@a', to: 'b@b'})
    )())
    expect(kGraph.edges).to.have.length(1)
    expect(kGraph.edges[0].sourcePort).to.equal(node('a', kGraph).ports[0].id)
    expect(kGraph.edges[0].targetPort).to.equal(node('b', kGraph).ports[0].id)
  })

  it('Converts edges in a compound node', () => {
    var cmp = Graph.flow(
      Graph.addNode({name: 'a', ports: [{port: 'a', kind: 'output'}]}),
      Graph.addNode({name: 'b', ports: [{port: 'b', kind: 'input'}]}),
      Graph.addEdge({from: 'a@a', to: 'b@b'})
    )(Graph.compound({ports: [{port: 'b', kind: 'input'}]}))
    var kGraph = convert(Graph.flow(
      Graph.addNode(cmp)
    )())
    expect(kGraph.children).to.have.length(1)
    expect(kGraph.children[0]).to.be.an('object')
    expect(kGraph.children[0].edges).to.have.length(1)
  })
})

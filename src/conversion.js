
import * as Graph from '@buggyorg/graphtools'
import _ from 'lodash'

const Node = Graph.Node
const Port = Graph.Port

function convertPortKind (kind) {
  if (kind === 'output') return 'out'
  else if (kind === 'input') return 'in'
}

export function convertPort (port) {
  return {
    id: Port.node(port) + '_' + Port.portName(port) + '_' + convertPortKind(Port.kind(port)),
    meta: {
      type: Port.type(port),
      name: port
    }
  }
}

export function convertEdge (graph, edge) {
  var sourceHierarchy = false
  var targetHierarchy = false
  if (Node.equal(Graph.parent(edge.from, graph), edge.to)) {
    sourceHierarchy = true
  } else if (Node.equal(Graph.parent(edge.from, graph), edge.to)) {
    targetHierarchy = true
  } else if (Node.equal(edge.from, edge.to)) {
    sourceHierarchy = true
    targetHierarchy = true
  }
  return {
    id: Port.node(edge.from) + Port.node(edge.to),
    source: Port.node(edge.from),
    sourcePort: Port.node(edge.from) + '_' + Port.portName(edge.from) + ((targetHierarchy) ? '_in' : '_out'),
    target: Port.node(edge.to),
    targetPort: Port.node(edge.to) + '_' + Port.portName(edge.to) + ((sourceHierarchy) ? '_out' : '_in'),
    meta: {
      sourceType: Graph.port(edge.from, graph).type,
      targetType: Graph.port(edge.to, graph).type,
      sourcePort: edge.from,
      targetPort: edge.to,
      layer: edge.layer,
      style: _.get(edge, 'value.meta.style')
    }
  }
}

export function convertGraph (graph) {
  var nodes = _(Graph.nodes(graph))
    .map(convertGraph)
    .value()
  var edges = _(Graph.edges(graph))
    // .map(_.partial(setEdgeParent, _, graph))
    .map(_.partial(convertEdge, graph))
    .value()
  return {
    id: graph.id,
    labels: [{text: Node.component(graph) || Node.name(graph)}],
    children: nodes,
    ports: Node.ports(graph).map(convertPort),
    edges: edges,
    meta: Object.assign({}, graph.metaInformation, { style: _.get(graph, 'metaInformation.style') })
  }
}

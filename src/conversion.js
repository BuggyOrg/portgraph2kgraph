
import * as Graph from '@buggyorg/graphtools'
import _ from 'lodash'

const Node = Graph.Node

export function convertPort (nodeName, type, port, portType) {
  return {
    id: nodeName + '_' + port + '_' + portType,
    meta: {
      type: type,
      name: port
    }
  }
}

export function convertEdge (graph, edge) {
  var sourceHierarchy = false
  var targetHierarchy = false
  if (graph.parent(edge.v) === edge.w) {
    sourceHierarchy = true
  } else if (graph.parent(edge.w) === edge.v) {
    targetHierarchy = true
  } else if (edge.v === edge.w) {
    sourceHierarchy = true
    targetHierarchy = true
  }
  return {
    id: edge.v + edge.w,
    source: edge.v,
    sourcePort: edge.v + '_' + edge.value.outPort + ((targetHierarchy) ? '_in' : '_out'),
    target: edge.w,
    targetPort: edge.w + '_' + edge.value.inPort + ((sourceHierarchy) ? '_out' : '_in'),
    meta: {
      sourceType: graph.node(edge.v)[(targetHierarchy) ? 'inputPorts' : 'outputPorts'][edge.value.outPort],
      targetType: graph.node(edge.w)[(sourceHierarchy) ? 'outputPorts' : 'inputPorts'][edge.value.inPort],
      sourceNode: edge.v,
      sourcePort: edge.value.outPort,
      targetNode: edge.w,
      targetPort: edge.value.inPort,
      style: _.get(edge, 'value.meta.style')
    }
  }
}

export function convertEdges (graph, edges) {
  return _.map(edges, _.partial(convertEdge, graph, _))
}
/*
function combineNodes (graph, node, childMap, edgeMap) {
  if (_.has(childMap, node.id)) {
    node.children = _.map(childMap[node.id], _.partial(combineNodes, graph, _, childMap, edgeMap))
  }
  if (_.has(edgeMap, node.id)) {
    node.edges = convertEdges(graph, edgeMap[node.id])
  }
  return node
}
*/
var edgeParent = function (graph, edge) {
  var outP = edge.v
  var inP = edge.w
  if (outP === inP) {
    return outP
  } else if (graph.parent(outP) === graph.parent(inP)) {
    return graph.parent(outP)
  } else if (graph.parent(outP) === inP) {
    return inP
  } else {
    return outP
  }
}

function setEdgeParent (edge, graph) {
  return _.merge({}, edge, {parent: edgeParent(graph, edge)})
}

export function convertGraph (graph) {
  var nodes = _(Graph.nodes(graph))
    .map(convertGraph)
    .value()
  var edges = _(Graph.edges(graph))
    .map(_.partial(setEdgeParent, _, graph))
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

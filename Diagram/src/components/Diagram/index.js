import React, { useMemo, useCallback } from 'react';
import ReactFlow, {
  Background,
  useNodes,
  useEdges,
  useReactFlow,
  MarkerType,
  BezierEdge,
  StepEdge
} from 'reactflow';
import dagre from 'dagre';
import 'reactflow/dist/style.css';

const dagreGraph = new dagre.graphlib.Graph();
dagreGraph.setDefaultEdgeLabel(() => ({}));

const nodeWidth = 200;
const nodeHeight = 100;

const getLayoutedElements = (nodes, edges, direction = 'TB') => {
  const isHorizontal = direction === 'LR' || direction === 'RL';
  dagreGraph.setGraph({ rankdir: direction, align: 'UL', nodesep: 50, edgesep: 50, ranksep: 100 });

  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
  });

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  return nodes.map((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    return {
      ...node,
      position: {
        x: nodeWithPosition.x - nodeWidth / 2,
        y: nodeWithPosition.y - nodeHeight / 2,
      },
    };
  });
};

const CustomNode = ({ data, selected }) => {
  const rotation = data.rotation || 0;
  const size = data.size || 100;
  const legendPosition = data.legendPosition || 'inside';

  return (
    <div style={{
      transform: `rotate(${rotation}deg)`,
      width: size,
      height: size,
      backgroundColor: data.backgroundColor,
      border: `${data.borderThickness}px solid ${data.borderColor}`,
      borderRadius: data.borderRadius,
      position: 'relative'
    }}>
      {/* Inner form */}
      {data.innerForm && (
        <div style={{
          position: 'absolute',
          inset: 8,
          border: `${data.innerBorderThickness}px solid ${data.innerBorderColor}`,
          borderRadius: data.innerBorderRadius,
        }} />
      )}
      
      {/* Legend */}
      {data.legend && (
        <div style={{
          position: legendPosition === 'inside' ? 'absolute' : 'absolute',
          top: legendPosition === 'inside' ? '50%' : '100%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          backgroundColor: legendPosition.includes('outside') ? data.legendBackground : 'transparent',
          padding: legendPosition === 'outside-block' ? '4px 8px' : 0,
          borderRadius: 4,
          whiteSpace: 'nowrap',
          pointerEvents: 'none',
          ...(legendPosition.includes('outside') && {
            top: 'calc(100% + 8px)',
            transform: 'translateX(-50%)'
          })
        }}>
          <span style={{ 
            color: data.legendTextColor,
            fontSize: 12,
            transform: `rotate(${-rotation}deg)`,
            display: 'inline-block'
          }}>
            {data.legend}
          </span>
        </div>
      )}
    </div>
  );
};

const CustomEdge = (props) => {
  const { data, markerEnd, style } = props;
  const edgeType = data.straight ? 'straight' : data.angled ? 'step' : 'default';

  const EdgeComponent = edgeType === 'step' ? StepEdge : BezierEdge;

  return (
    <>
      <EdgeComponent 
        {...props}
        style={{
          ...style,
          stroke: data.color,
          strokeWidth: data.thickness,
          strokeDasharray: data.dotted ? '5,5' : 'none'
        }}
        markerEnd={data.arrow ? markerEnd : undefined}
      />
      {data.label && (
        <foreignObject
          width={100}
          height={40}
          requiredExtensions="http://www.w3.org/1999/xhtml"
          style={{
            overflow: 'visible',
            pointerEvents: 'none'
          }}
        >
          <div style={{
            position: 'relative',
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: data.labelBackground || '#ffffff',
            padding: '2px 6px',
            borderRadius: 4,
            fontSize: 12,
            textAlign: 'center',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            {data.label}
          </div>
        </foreignObject>
      )}
    </>
  );
};

const edgeTypes = {
  custom: CustomEdge,
};

const nodeTypes = {
  custom: CustomNode,
};

const GraphComponent = (props) => {
  const { fitView } = useReactFlow();
  const nodes = useMemo(() => props.nodesCollection?.map(node => ({
    id: node.id,
    type: 'custom',
    data: {
      ...node,
      size: node.size,
      rotation: node.rotation,
      legend: node.legend,
      legendPosition: node.legendType,
      legendBackground: node.legendBackgroundColor,
      legendTextColor: node.legendTextColor
    },
    position: { x: 0, y: 0 }
  })) || [], [props.nodesCollection]);

  const edges = useMemo(() => props.edgesCollection?.map(edge => ({
    id: `${edge.source}-${edge.target}`,
    source: edge.source,
    target: edge.target,
    type: 'custom',
    data: {
      ...edge,
      angled: edge.angled,
      label: edge.label,
      labelBackground: edge.labelBackgroundColor,
      arrow: edge.arrowEnd
    },
    markerEnd: edge.arrowEnd ? {
      type: MarkerType.ArrowClosed,
      color: edge.color,
      width: props.EdgeStyle.arrowSize,
      height: props.EdgeStyle.arrowSize
    } : undefined
  })) || [], [props.edgesCollection, props.EdgeStyle]);

  const layoutedNodes = useMemo(() => 
    getLayoutedElements(nodes, edges, props.globalOrientation),
    [nodes, edges, props.globalOrientation]
  );

  const onLayout = useCallback(() => {
    fitView({ padding: 0.1 });
  }, [fitView]);

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <ReactFlow
        nodes={layoutedNodes}
        edges={edges}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        fitView
        onInit={onLayout}
        nodesDraggable={false}
        nodesConnectable={false}
        elementsSelectable={false}
        defaultEdgeOptions={{
          type: 'custom',
          style: {
            strokeWidth: props.EdgeStyle.thickness,
            stroke: props.EdgeStyle.color
          }
        }}
      >
        <Background color="#aaa" gap={16} />
      </ReactFlow>
    </div>
  );
};

export default GraphComponent;
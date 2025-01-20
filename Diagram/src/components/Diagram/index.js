import React from 'react';
import { View } from 'react-native';
import Svg, {
  Rect,
  Line,
  Path,
  Text as SvgText,
  G
} from 'react-native-svg';

const Diagram = (props) => {
  const {
    nodeCollection = [],
    edgeCollection = [],
    diagramOrientation = 'horizontal',
    _width = 800,
    _height = 600
  } = props;

  // Create a map of node IDs to their data for easy lookup
  const nodeMap = {};
  nodeCollection.forEach((node) => {
    nodeMap[node.id] = node;
  });

  // Render Nodes
  const renderNodes = nodeCollection.map((node) => (
    <NodeComponent key={`node-${node.id}`} node={node} />
  ));

  // Render Edges
  const renderEdges = edgeCollection.map((edge, index) => {
    const fromNode = nodeMap[edge.fromNodeId];
    const toNode = nodeMap[edge.toNodeId];

    if (!fromNode || !toNode) {
      // If nodes are missing, skip rendering this edge
      return null;
    }

    return (
      <EdgeComponent
        key={`edge-${index}`}
        edge={edge}
        fromNode={fromNode}
        toNode={toNode}
      />
    );
  });

  return (
    <View style={{ width: _width, height: _height }}>
      <Svg width="100%" height="100%">
        {/* Edges are drawn before nodes to ensure they are behind nodes */}
        {renderEdges}
        {renderNodes}
      </Svg>
    </View>
  );
};

const NodeComponent = ({ node }) => {
  const {
    positionX,
    positionY,
    color,
    borderColor,
    borderThickness,
    borderRadius,
    innerBorderColor,
    innerBorderThickness,
    innerBorderRadius,
    rotation,
    id
  } = node;

  const legend = node.legend || {};

  const nodeWidth = 100;
  const nodeHeight = 50;

  return (
    <G
      transform={`translate(${positionX}, ${positionY}) rotate(${rotation}, ${
        nodeWidth / 2
      }, ${nodeHeight / 2})`}
    >
      {/* Outer Rectangle */}
      <Rect
        x={0}
        y={0}
        width={nodeWidth}
        height={nodeHeight}
        fill={color}
        stroke={borderColor}
        strokeWidth={borderThickness}
        rx={borderRadius}
        ry={borderRadius}
      />
      {/* Inner Rectangle */}
      {innerBorderThickness > 0 && (
        <Rect
          x={borderThickness}
          y={borderThickness}
          width={nodeWidth - 2 * borderThickness}
          height={nodeHeight - 2 * borderThickness}
          fill="transparent"
          stroke={innerBorderColor}
          strokeWidth={innerBorderThickness}
          rx={innerBorderRadius}
          ry={innerBorderRadius}
        />
      )}
      {/* Legend */}
      {legend.type && (
        <LegendComponent
          legend={legend}
          nodeWidth={nodeWidth}
          nodeHeight={nodeHeight}
        />
      )}
    </G>
  );
};

const LegendComponent = ({ legend, nodeWidth, nodeHeight }) => {
  const {
    type,
    text,
    textColor,
    backgroundColor,
    borderColor,
    borderThickness
  } = legend;

  let x = nodeWidth / 2;
  let y = nodeHeight / 2;
  let textAnchor = 'middle';

  if (type === 'simpleTextOutside') {
    y = nodeHeight + 20;
  } else if (type === 'textBlockOutside') {
    y = nodeHeight + 5;
  }

  return (
    <SvgText
      x={x}
      y={y}
      fill={textColor}
      fontSize="14"
      stroke={borderColor}
      strokeWidth={borderThickness}
      textAnchor={textAnchor}
    >
      {text}
    </SvgText>
  );
};

const EdgeComponent = ({ edge, fromNode, toNode }) => {
  const {
    thickness,
    color,
    dotted,
    arrow,
    straight,
    text,
    labelBackgroundColor
  } = edge;

  const fromX = fromNode.positionX + 50; // Assuming nodeWidth / 2
  const fromY = fromNode.positionY + 25; // Assuming nodeHeight / 2
  const toX = toNode.positionX + 50;
  const toY = toNode.positionY + 25;

  // Determine the path
  let pathData = '';
  if (straight) {
    pathData = `M ${fromX},${fromY} L ${toX},${toY}`;
  } else {
    // Right-angled path with rounded corners
    const midX = fromX;
    const midY = toY;
    const radius = 10; // Corner radius

    pathData = `M ${fromX},${fromY}`;

    if (fromX !== toX && fromY !== toY) {
      pathData += ` L ${fromX},${(fromY + toY) / 2 - radius}`;
      pathData += ` Q ${fromX},${(fromY + toY) / 2} ${fromX + radius},${
        (fromY + toY) / 2
      }`;
      pathData += ` L ${toX - radius},${(fromY + toY) / 2}`;
      pathData += ` Q ${toX},${(fromY + toY) / 2} ${toX},${
        (fromY + toY) / 2 + radius
      }`;
    }

    pathData += ` L ${toX},${toY}`;
  }

  // Arrowhead
  let arrowHead = null;
  if (arrow) {
    const arrowSize = 10;
    const angle = Math.atan2(toY - fromY, toX - fromX);
    const arrowX = toX - arrowSize * Math.cos(angle - Math.PI / 6);
    const arrowY = toY - arrowSize * Math.sin(angle - Math.PI / 6);
    const arrowX2 = toX - arrowSize * Math.cos(angle + Math.PI / 6);
    const arrowY2 = toY - arrowSize * Math.sin(angle + Math.PI / 6);

    arrowHead = (
      <Path
        d={`M ${toX},${toY} L ${arrowX},${arrowY} M ${toX},${toY} L ${arrowX2},${arrowY2}`}
        stroke={color}
        strokeWidth={thickness}
        fill="none"
      />
    );
  }

  // Edge label
  const edgeLabel = text
    ? [
        <Rect
          key="label-bg"
          x={(fromX + toX) / 2 - 30}
          y={(fromY + toY) / 2 - 10}
          width={60}
          height={20}
          fill={labelBackgroundColor}
        />,
        <SvgText
          key="label-text"
          x={(fromX + toX) / 2}
          y={(fromY + toY) / 2 + 5}
          fill="#000"
          fontSize="12"
          textAnchor="middle"
        >
          {text}
        </SvgText>
      ]
    : null;

  return (
    <G>
      <Path
        d={pathData}
        stroke={color}
        strokeWidth={thickness}
        strokeDasharray={dotted ? '5,5' : '0'}
        fill="none"
      />
      {arrowHead}
      {edgeLabel}
    </G>
  );
};

export default Diagram;
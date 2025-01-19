import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Path, Rect, Text as SvgText, Defs, Marker, Polygon } from 'react-native-svg';

/**
 * A helper function to build a simple layout for nodes given
 * the orientation, spacing, and container size. 
 * 
 * This example uses a naive linear layout:
 *  - LR (Left to Right) or RL (Right to Left) will lay nodes horizontally.
 *  - TB (Top to Bottom) or BT (Bottom to Top) will lay nodes vertically.
 */
function computeNodePositions({
  nodeCollection,
  orientation,
  nodeWidth,
  nodeHeight,
  horizontalSpacing,
  verticalSpacing
}) {
  // We'll store x/y in an array of { nodeId, x, y }
  let positions = [];
  
  // For a simple layout, place each node in a single line.
  // You could compute a more complex layout in a real scenario.
  nodeCollection.forEach((node, idx) => {
    let x = 0;
    let y = 0;

    // For simplicity, we just place each node at an equal offset from the previous.
    if (orientation === 'LR') {
      x = idx * (nodeWidth + horizontalSpacing);
      y = 0;
    } else if (orientation === 'RL') {
      // We'll invert the index, but typically you'd measure the entire width first.
      // For a simple approach, we do the same as LR, then you might flip it later in the drawing.
      x = idx * (nodeWidth + horizontalSpacing);
      y = 0;
    } else if (orientation === 'TB') {
      x = 0;
      y = idx * (nodeHeight + verticalSpacing);
    } else if (orientation === 'BT') {
      // same logic as TB for a naive layout
      x = 0;
      y = idx * (nodeHeight + verticalSpacing);
    }

    positions.push({
      nodeId: node.nodeId,
      x,
      y
    });
  });

  return positions;
}

/**
 * Build a path (string in SVG d= syntax) for edges.
 * If "curved" is false, we draw a simple line from (x1,y1) to (x2,y2).
 * If "curved" is true (i.e. 90° angles), we do a simple L-shaped path.
 */
function buildEdgePath(x1, y1, x2, y2, curved) {
  if (!curved) {
    // Straight line
    return `M${x1},${y1} L${x2},${y2}`;
  } else {
    // 90° angled path: We'll do a midpoint turn
    // For instance, if we go horizontally then vertically:
    const midX = x2;
    const midY = y1;
    return `M${x1},${y1} L${midX},${midY} L${x2},${y2}`;
  }
}

/**
 * The main Diagram component
 */
const Diagram = (props) => {
  const {
    diagramOrientation,
    nodeWidth,
    nodeHeight,
    horizontalSpacing,
    verticalSpacing,
    nodeCollection = [],
    edgeCollection = []
  } = props;

  // 1) Compute node positions
  const positions = useMemo(() => {
    return computeNodePositions({
      nodeCollection,
      orientation: diagramOrientation,
      nodeWidth,
      nodeHeight,
      horizontalSpacing,
      verticalSpacing
    });
  }, [nodeCollection, diagramOrientation, nodeWidth, nodeHeight, horizontalSpacing, verticalSpacing]);

  // Convert node positions to a map for easy retrieval
  const positionMap = useMemo(() => {
    let map = {};
    positions.forEach(pos => {
      map[pos.nodeId] = pos;
    });
    return map;
  }, [positions]);

  // 2) Determine total needed width/height to wrap all nodes
  //    so the SVG or container can adapt
  const { maxX, maxY } = useMemo(() => {
    let maxXVal = 0;
    let maxYVal = 0;
    positions.forEach((pos) => {
      const right = pos.x + nodeWidth;
      const bottom = pos.y + nodeHeight;
      if (right > maxXVal) maxXVal = right;
      if (bottom > maxYVal) maxYVal = bottom;
    });
    return { maxX: maxXVal + horizontalSpacing, maxY: maxYVal + verticalSpacing };
  }, [positions, nodeWidth, nodeHeight, horizontalSpacing, verticalSpacing]);

  // 3) Prepare rendering
  // We build each node as an SVG <Rect> or any shape, plus edges as <Path>.
  // We'll store them in arrays to render in the Svg block.

  // 3a) Render edges
  const edgeElements = edgeCollection.map((edge, idx) => {
    const { fromNodeId, toNodeId, thickness, color, dotted, arrow, curved, edgeText } = edge;
    // If either node is missing in the position map, skip
    if (!positionMap[fromNodeId] || !positionMap[toNodeId]) {
      return null;
    }

    const fromPos = positionMap[fromNodeId];
    const toPos = positionMap[toNodeId];

    // We will connect the center of each node
    const x1 = fromPos.x + nodeWidth / 2;
    const y1 = fromPos.y + nodeHeight / 2;
    const x2 = toPos.x + nodeWidth / 2;
    const y2 = toPos.y + nodeHeight / 2;

    const pathD = buildEdgePath(x1, y1, x2, y2, curved);

    // For a dotted line, we can set strokeDasharray
    const dashArray = dotted ? [4, 4] : null;

    // Edge label: We'll position it at the midpoint of the path
    const midX = (x1 + x2) / 2;
    const midY = (y1 + y2) / 2;

    return (
      <React.Fragment key={`edge-${idx}`}>
        <Path
          d={pathD}
          stroke={color}
          strokeWidth={thickness}
          fill="none"
          strokeDasharray={dashArray}
          markerEnd={arrow ? "url(#arrowMarker)" : undefined}
        />
        {edgeText ? (
          <SvgText
            x={midX}
            y={midY - 5} // shift up a bit for better visibility
            fill={color}
            fontSize="12"
            textAnchor="middle"
          >
            {edgeText}
          </SvgText>
        ) : null}
      </React.Fragment>
    );
  });

  // 3b) Render nodes
  const nodeElements = nodeCollection.map((node, idx) => {
    const {
      nodeId,
      borderRadius,
      color,
      borderColor,
      borderThickness,
      innerFormBorderColor,
      innerFormColor,
      innerFormBorderRadius,
      innerFormBorderThickness,
      rotation,
      legendType,
      legendText,
      legendColor,
      legendBorderColor,
      legendBorderThickness,
      legendBorderRadius,
      legendFillColor
    } = node;
    const pos = positionMap[nodeId];
    if (!pos) return null; // if we can't find a position, skip

    const { x, y } = pos;

    // We'll define a group transform for rotation around the node center
    const cx = x + nodeWidth / 2;
    const cy = y + nodeHeight / 2;
    const rotationTransform = `rotate(${rotation}, ${cx}, ${cy})`;

    // We define inner form as an optional border inside the main node
    // Let's keep it simple and place it inside with 4px offset, for example
    const innerOffset = 4;
    const innerWidth = nodeWidth - innerOffset * 2;
    const innerHeight = nodeHeight - innerOffset * 2;

    // Legend logic
    let legendElement = null;
    if (legendText) {
      if (legendType === 'inside') {
        // Place text in the center of the node
        legendElement = (
          <SvgText
            x={cx}
            y={cy + 4} // small shift for vertical alignment
            fill={legendColor}
            fontSize="12"
            textAnchor="middle"
          >
            {legendText}
          </SvgText>
        );
      } else if (legendType === 'outside-simple') {
        // Place text below the node
        legendElement = (
          <SvgText
            x={cx}
            y={y + nodeHeight + 14}
            fill={legendColor}
            fontSize="12"
            textAnchor="middle"
          >
            {legendText}
          </SvgText>
        );
      } else if (legendType === 'outside-block') {
        // A rectangle plus text below the node
        const legendBoxWidth = nodeWidth;
        const legendBoxHeight = 30;
        const legendBoxX = x;
        const legendBoxY = y + nodeHeight + 5; // small margin

        legendElement = (
          <React.Fragment>
            <Rect
              x={legendBoxX}
              y={legendBoxY}
              width={legendBoxWidth}
              height={legendBoxHeight}
              fill={legendFillColor}
              stroke={legendBorderColor}
              strokeWidth={legendBorderThickness}
              rx={legendBorderRadius}
              ry={legendBorderRadius}
            />
            <SvgText
              x={legendBoxX + legendBoxWidth / 2}
              y={legendBoxY + legendBoxHeight / 2 + 4}
              fill={legendColor}
              fontSize="12"
              textAnchor="middle"
            >
              {legendText}
            </SvgText>
          </React.Fragment>
        );
      }
    }

    return (
      <React.Fragment key={`node-${idx}`}>
        <Rect
          x={x}
          y={y}
          width={nodeWidth}
          height={nodeHeight}
          fill={color}
          stroke={borderColor}
          strokeWidth={borderThickness}
          rx={borderRadius}
          ry={borderRadius}
          transform={rotationTransform}
        />
        {/* Inner form */}
        <Rect
          x={x + innerOffset}
          y={y + innerOffset}
          width={innerWidth}
          height={innerHeight}
          fill={innerFormColor}
          stroke={innerFormBorderColor}
          strokeWidth={innerFormBorderThickness}
          rx={innerFormBorderRadius}
          ry={innerFormBorderRadius}
          transform={rotationTransform}
        />
        {legendElement}
      </React.Fragment>
    );
  });

  return (
    <View style={styles.wrapper}>
      {/* 
        We use an SVG with a Defs for the arrow marker (if used),
        then we place nodeElements and edgeElements inside
      */}
      <Svg
        width="100%"
        height="100%"
        viewBox={`0 0 ${Math.max(1, maxX)} ${Math.max(1, maxY)}`}
      >
        <Defs>
          <Marker
            id="arrowMarker"
            viewBox="0 0 10 10"
            refX="10"
            refY="5"
            markerWidth="6"
            markerHeight="6"
            orient="auto"
          >
            <Polygon points="0,0 10,5 0,10" fill="#000000" />
          </Marker>
        </Defs>
        {/* Draw edges under nodes */}
        {edgeElements}
        {/* Draw nodes on top */}
        {nodeElements}
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    height: '100%'
  }
});

export default Diagram;

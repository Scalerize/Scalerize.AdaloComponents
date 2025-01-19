// index.js

import React, { useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, {
  Defs,
  Marker,
  Polygon,
  Rect,
  Path,
  Text as SvgText
} from 'react-native-svg';

// d3-force to compute node positions
import {
  forceSimulation,
  forceManyBody,
  forceLink,
  forceCenter,
  forceCollide,
  forceX,
  forceY
} from 'd3-force';

/**
 * Utility: convert color string to an ID-safe string (for marker IDs).
 * Example: "#FF0000" -> "_FF0000"
 */
function colorToId(color) {
  return color.replace(/[^a-zA-Z0-9]+/g, '_');
}

/**
 * Runs a synchronous force simulation to obtain node positions.
 * @param {Array} nodeCollection - array of node configs from props
 * @param {Array} edgeCollection - array of edge configs from props
 * @param {Number} width         - approximate bounding width for the layout
 * @param {Number} height        - approximate bounding height for the layout
 * @param {String} orientation   - "LR", "RL", "TB", or "BT"
 * @returns {Object} An object with:
 *   { nodesData, linksData }
 *   where each node has { id, x, y }
 */
function computeForceLayout(nodeCollection, edgeCollection, width, height, orientation) {
  // Create data arrays in d3-compatible format
  const nodesData = nodeCollection.map((node) => ({
    id: node.nodeId
    // d3-force will add x, y, vx, vy, etc.
  }));
  const linksData = edgeCollection.map((edge) => ({
    // "source" and "target" must match node IDs
    source: edge.fromNodeId,
    target: edge.toNodeId
  }));

  // Set up the simulation
  const simulation = forceSimulation(nodesData)
    .force('charge', forceManyBody().strength(-120)) // negative => repels
    .force('link', forceLink(linksData).id((d) => d.id).distance(120))
    .force('collide', forceCollide(50)) // keep nodes from overlapping
    .force('center', forceCenter(width / 2, height / 2));

  // If user wants a predominantly L-R layout, apply forceX
  // If user wants a predominantly T-B layout, apply forceY
  if (orientation === 'LR' || orientation === 'RL') {
    // Align all nodes around the same Y coordinate
    simulation.force('orientAxis', forceY(height / 2).strength(0.5));
  } else if (orientation === 'TB' || orientation === 'BT') {
    // Align all nodes around the same X coordinate
    simulation.force('orientAxis', forceX(width / 2).strength(0.5));
  }

  // Stop automatic simulation so we can run it synchronously
  simulation.stop();

  // Tick enough times to let the layout stabilize (tweak as needed)
  for (let i = 0; i < 200; i++) {
    simulation.tick();
  }

  // At this point, each node in nodesData has x and y
  return { nodesData, linksData };
}

/**
 * Main Diagram component
 */
const Diagram = (props) => {
  const {
    // Overall diagram bounding size (from Adalo or user props)
    _width = 800,
    _height = 600,

    // Orientation can be "LR", "RL", "TB", or "BT"
    diagramOrientation = 'LR',

    // Node sizing
    nodeWidth = 100,
    nodeHeight = 60,

    backgroundColor = '#ffffff',

    // Collections
    nodeCollection = [],
    edgeCollection = []
  } = props;

  // 1) Run a force-directed layout to compute node positions
  const { nodesData, linksData } = useMemo(() => {
    return computeForceLayout(
      nodeCollection,
      edgeCollection,
      _width,
      _height,
      diagramOrientation
    );
  }, [nodeCollection, edgeCollection, _width, _height, diagramOrientation]);

  // 2) Build a map from nodeId -> { x, y, ...nodeProps }
  //    We'll also store original node config so we can style each node
  const nodeMap = useMemo(() => {
    const map = {};
    nodesData.forEach((nodeD) => {
      // Find matching config in nodeCollection
      const config = nodeCollection.find((n) => n.nodeId === nodeD.id);
      if (config) {
        map[nodeD.id] = {
          ...config, // borderRadius, color, etc.
          x: nodeD.x,
          y: nodeD.y
        };
      }
    });
    return map;
  }, [nodesData, nodeCollection]);

  // 3) Figure out bounding box so we can set the SVG's viewBox
  //    We look for min/max X/Y among all nodes
  const { minX, maxX, minY, maxY } = useMemo(() => {
    let minXVal = Infinity, maxXVal = -Infinity;
    let minYVal = Infinity, maxYVal = -Infinity;

    nodesData.forEach((nodeD) => {
      if (nodeD.x < minXVal) minXVal = nodeD.x;
      if (nodeD.x > maxXVal) maxXVal = nodeD.x;
      if (nodeD.y < minYVal) minYVal = nodeD.y;
      if (nodeD.y > maxYVal) maxYVal = nodeD.y;
    });

    // Pad on each side to ensure the nodes/edges are fully visible
    const pad = 100;
    return {
      minX: minXVal - pad,
      maxX: maxXVal + pad,
      minY: minYVal - pad,
      maxY: maxYVal + pad
    };
  }, [nodesData]);

  // 4) We need to define <Marker> elements for each unique edge color if arrow=true
  //    so each arrow can match the edge color.
  const uniqueEdgeColors = Array.from(
    new Set(edgeCollection.filter((e) => e.arrow).map((e) => e.color || '#000000'))
  );

  // 5) Render Edges
  const edgeElements = useMemo(() => {
    return edgeCollection.map((edge, idx) => {
      const {
        fromNodeId,
        toNodeId,
        thickness = 2,
        color = '#000000',
        dotted = false,
        arrow = true,
        curved = false,
        edgeText
      } = edge;
      // If either node is missing in the map, skip
      if (!nodeMap[fromNodeId] || !nodeMap[toNodeId]) return null;

      const fromPos = nodeMap[fromNodeId];
      const toPos = nodeMap[toNodeId];

      // We'll connect the center of each node
      const x1 = fromPos.x;
      const y1 = fromPos.y;
      const x2 = toPos.x;
      const y2 = toPos.y;

      // Build path: straight vs. 90° angle
      let pathD = '';
      if (!curved) {
        // Straight line
        pathD = `M${x1},${y1} L${x2},${y2}`;
      } else {
        // L-shaped path
        const midX = x2;
        const midY = y1;
        pathD = `M${x1},${y1} L${midX},${midY} L${x2},${y2}`;
      }

      // Dotted line => dash array
      const dashArray = dotted ? [4, 4] : null;

      // For arrow, reference a marker with ID = "arrowMarker_<colorToId>"
      const arrowId = `arrowMarker_${colorToId(color)}`;

      // For edge label background, measure approximate text width:
      const labelFontSize = 12;
      const labelPadding = 4;
      const labelWidth = edgeText ? edgeText.length * 7 + labelPadding : 0;
      const labelHeight = edgeText ? labelFontSize + labelPadding : 0;

      // Midpoint for text
      const midX = (x1 + x2) / 2;
      const midY = (y1 + y2) / 2;

      return (
        <React.Fragment key={`edge-${idx}`}>
          {/* The line path */}
          <Path
            d={pathD}
            stroke={color}
            strokeWidth={thickness}
            strokeDasharray={dashArray}
            fill="none"
            // If arrow is true, attach the relevant marker
            markerEnd={arrow ? `url(#${arrowId})` : undefined}
          />

          {/* Edge label (if any) */}
          {edgeText ? (
            <>
              {/* A rect behind the text to ensure readability */}
              <Rect
                x={midX - labelWidth / 2}
                y={midY - labelHeight / 2 - 2} // shift up slightly
                width={labelWidth}
                height={labelHeight}
                fill={backgroundColor}
                // Slight corner rounding
                rx={3}
                ry={3}
              />
              <SvgText
                x={midX}
                y={midY + (labelFontSize * 0.35)} // center text vertically
                fill={color}
                fontSize={labelFontSize}
                textAnchor="middle"
              >
                {edgeText}
              </SvgText>
            </>
          ) : null}
        </React.Fragment>
      );
    });
  }, [edgeCollection, nodeMap, backgroundColor]);

  // 6) Render Nodes
  const nodeElements = useMemo(() => {
    return nodesData.map((nodeD, idx) => {
      const config = nodeMap[nodeD.id];
      if (!config) return null; // no config, skip

      const {
        nodeId,
        borderRadius = 10,
        color = '#ffffff',
        borderColor = '#000000',
        borderThickness = 2,
        innerFormBorderColor = '#cccccc',
        innerFormColor = '#ffffff',
        innerFormBorderRadius = 5,
        innerFormBorderThickness = 1,
        rotation = 0,

        // Legend
        legendType = 'inside', // "inside", "outside-simple", "outside-block"
        legendText = '',
        legendColor = '#000000',
        legendBorderColor = '#000000',
        legendBorderThickness = 1,
        legendBorderRadius = 3,
        legendFillColor = '#ffffff'
      } = config;

      const cx = nodeD.x;
      const cy = nodeD.y;

      // We'll place the main rect so that (cx, cy) is the center
      const x = cx - nodeWidth / 2;
      const y = cy - nodeHeight / 2;

      // Rotation transform (center = node center)
      const rotationTransform = `rotate(${rotation}, ${cx}, ${cy})`;

      // Inner form rect (slightly smaller, offset by 4 px)
      const innerOffset = 4;
      const innerRectX = x + innerOffset;
      const innerRectY = y + innerOffset;
      const innerRectW = nodeWidth - innerOffset * 2;
      const innerRectH = nodeHeight - innerOffset * 2;

      // Render legend (if any)
      let legendElement = null;
      if (legendText) {
        // Decide the legend position depending on orientation + legendType
        const isHorizontal = diagramOrientation === 'LR' || diagramOrientation === 'RL';

        if (legendType === 'inside') {
          // Text in the center
          legendElement = (
            <SvgText
              x={cx}
              y={cy + 4}
              fill={legendColor}
              fontSize="12"
              textAnchor="middle"
              transform={rotationTransform}
            >
              {legendText}
            </SvgText>
          );
        } else if (legendType === 'outside-simple') {
          // For LR/RL => text above
          // For TB/BT => text to the right
          if (isHorizontal) {
            // Above the node
            legendElement = (
              <SvgText
                x={cx}
                y={y - 5} // a little gap above
                fill={legendColor}
                fontSize="12"
                textAnchor="middle"
              >
                {legendText}
              </SvgText>
            );
          } else {
            // TB/BT => to the right
            legendElement = (
              <SvgText
                x={x + nodeWidth + 5}
                y={cy + 4} // center vertically
                fill={legendColor}
                fontSize="12"
              >
                {legendText}
              </SvgText>
            );
          }
        } else if (legendType === 'outside-block') {
          // For LR/RL => block above
          // For TB/BT => block to the right
          const blockWidth = nodeWidth;
          const blockHeight = 28;

          if (isHorizontal) {
            // Above
            const blockX = x;
            const blockY = y - blockHeight - 5; // margin above
            legendElement = (
              <>
                <Rect
                  x={blockX}
                  y={blockY}
                  width={blockWidth}
                  height={blockHeight}
                  fill={legendFillColor}
                  stroke={legendBorderColor}
                  strokeWidth={legendBorderThickness}
                  rx={legendBorderRadius}
                  ry={legendBorderRadius}
                />
                <SvgText
                  x={blockX + blockWidth / 2}
                  y={blockY + blockHeight / 2 + 4}
                  fill={legendColor}
                  fontSize="12"
                  textAnchor="middle"
                >
                  {legendText}
                </SvgText>
              </>
            );
          } else {
            // TB/BT => block to the right
            const blockX = x + nodeWidth + 5;
            const blockY = cy - blockHeight / 2; // center vertically
            legendElement = (
              <>
                <Rect
                  x={blockX}
                  y={blockY}
                  width={blockWidth}
                  height={blockHeight}
                  fill={legendFillColor}
                  stroke={legendBorderColor}
                  strokeWidth={legendBorderThickness}
                  rx={legendBorderRadius}
                  ry={legendBorderRadius}
                />
                <SvgText
                  x={blockX + blockWidth / 2}
                  y={blockY + blockHeight / 2 + 4}
                  fill={legendColor}
                  fontSize="12"
                  textAnchor="middle"
                >
                  {legendText}
                </SvgText>
              </>
            );
          }
        }
      }

      return (
        <React.Fragment key={`node-${nodeId}`}>
          {/* Outer rect */}
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
          {/* Inner rect */}
          <Rect
            x={innerRectX}
            y={innerRectY}
            width={innerRectW}
            height={innerRectH}
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
  }, [
    nodeMap,
    nodesData,
    diagramOrientation,
    nodeWidth,
    nodeHeight
  ]);

  // 7) Build Markers in <Defs> for each arrow color
  //    (arrow heads with fill = that color)
  const arrowMarkers = uniqueEdgeColors.map((c) => {
    const markerId = `arrowMarker_${colorToId(c)}`;
    return (
      <Marker
        key={markerId}
        id={markerId}
        viewBox="0 0 10 10"
        refX="10"
        refY="5"
        markerWidth="6"
        markerHeight="6"
        orient="auto"
        markerUnits="strokeWidth"
      >
        {/* A simple triangle shape for arrowhead */}
        <Polygon points="0,0 10,5 0,10" fill={c} />
      </Marker>
    );
  });

  return (
    <View style={styles.container}>
      <Svg
        width="300"
        height="600"
        // The viewBox ensures all nodes/edges fit the visible area
        viewBox={`${minX} ${minY} ${maxX - minX} ${maxY - minY}`}
      >
        <Defs>
          {arrowMarkers}
        </Defs>
        {/* Edges first (so nodes are on top) */}
        {edgeElements}
        {/* Nodes on top */}
        {nodeElements}
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});

export default Diagram;

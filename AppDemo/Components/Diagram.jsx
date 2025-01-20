import React, { useState, useEffect } from 'react';
import { View } from 'react-native';
import { Svg, Rect, Path, Text, G } from 'react-native-svg';
import ELK from 'elkjs/lib/elk.bundled.js';

const elk = new ELK();

const DiagramComponent = (props) => {
  const [layout, setLayout] = useState({ children: [], edges: [] });
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const computeLayout = async () => {
      const nodes = props.nodes?.map(node => ({
        id: node.nodeId,
        width: node.nodeSize,
        height: node.nodeSize,
        labels: node.legendType !== 'none' ? [{
          text: node.legendText || '',
          width: 80,
          height: 20
        }] : []
      })) || [];

      const edges = props.edges?.map(edge => ({
        id: edge.edgeId,
        sources: [edge.edgeSource],
        targets: [edge.edgeTarget],
        labels: edge.edgeLabel ? [{
          text: edge.edgeLabel,
          width: 60,
          height: 20
        }] : [],
        layoutOptions: {
          'elk.edgeRouting': edge.edgeRouting === 'orthogonal' ? 'ORTHOGONAL' : 'SPLINES'
        }
      })) || [];

      const elkGraph = {
        id: 'root',
        layoutOptions: {
          'elk.algorithm': 'layered',
          'elk.direction': props.globalOrientation,
          'elk.spacing.nodeNode': '40',
          'elk.layered.spacing.nodeNodeBetweenLayers': '50'
        },
        children: nodes,
        edges: edges
      };

      try {
        const elkLayout = await elk.layout(elkGraph);
        setLayout(elkLayout);
      } catch (error) {
        console.error('Layout computation failed:', error);
      }
    };

    computeLayout();
  }, [props.nodes, props.edges, props.globalOrientation]);

  const renderNode = (nodeElk) => {
    const nodeConfig = props.nodes.find(n => n.nodeId === nodeElk.id);
    if (!nodeConfig) return null;

    const centerX = nodeElk.x + nodeElk.width / 2;
    const centerY = nodeElk.y + nodeElk.height / 2;

    return (
      <G key={nodeElk.id}>
        {/* Main Node */}
        <Rect
          x={nodeElk.x}
          y={nodeElk.y}
          width={nodeElk.width}
          height={nodeElk.height}
          fill={nodeConfig.nodeColor}
          stroke={nodeConfig.nodeBorderColor}
          strokeWidth={nodeConfig.nodeBorderThickness}
          rx={nodeConfig.nodeBorderRadius}
          transform={`rotate(${nodeConfig.nodeRotation}, ${centerX}, ${centerY})`}
        />

        {/* Inner Form */}
        {nodeConfig.innerForm && (
          <Rect
            x={nodeElk.x + 5}
            y={nodeElk.y + 5}
            width={nodeElk.width - 10}
            height={nodeElk.height - 10}
            fill={nodeConfig.innerFormColor}
            stroke={nodeConfig.innerFormBorderColor}
            strokeWidth={nodeConfig.innerFormBorderThickness}
            rx={nodeConfig.innerFormBorderRadius}
          />
        )}

        {/* Labels */}
        {nodeConfig.legendType === 'inside' && (
          <Text
            x={centerX}
            y={centerY}
            textAnchor="middle"
            dy=".3em"
            fill={nodeConfig.legendTextColor || '#000000'}
          >
            {nodeConfig.legendText}
          </Text>
        )}

        {nodeElk.labels?.map((label, idx) => (
          <G key={idx} transform={`translate(${label.x}, ${label.y})`}>
            {nodeConfig.legendType === 'blockOutside' && (
              <Rect
                width={label.width}
                height={label.height}
                fill={nodeConfig.legendBackground || '#ffffff'}
                rx="3"
                stroke={nodeConfig.legendBorderColor || '#000000'}
                strokeWidth={nodeConfig.legendBorderThickness || 1}
              />
            )}
            <Text
              x={label.width / 2}
              y={label.height / 2}
              textAnchor="middle"
              dy=".3em"
              fill={nodeConfig.legendTextColor || '#000000'}
            >
              {label.text}
            </Text>
          </G>
        ))}
      </G>
    );
  };

  const renderEdge = (edgeElk) => {
    const edgeConfig = props.edges.find(e => e.edgeId === edgeElk.id);
    if (!edgeConfig || !edgeElk.sections?.[0]) return null;

    const section = edgeElk.sections[0];
    const pathCommands = [
      `M ${section.startPoint.x} ${section.startPoint.y}`,
      ...(section.bendPoints?.map(p => `L ${p.x} ${p.y}`) || []),
      `L ${section.endPoint.x} ${section.endPoint.y}`
    ].join(' ');

    // Arrowhead calculation
    const endPoint = section.endPoint;
    const lastBend = section.bendPoints?.[section.bendPoints.length - 1] || section.startPoint;
    const angle = Math.atan2(endPoint.y - lastBend.y, endPoint.x - lastBend.x);

    return (
      <G key={edgeElk.id}>
        {/* Edge Path */}
        <Path
          d={pathCommands}
          stroke={edgeConfig.edgeColor}
          strokeWidth={edgeConfig.edgeThickness}
          strokeDasharray={edgeConfig.edgeStyle === 'solid' ? null : '5,5'}
          fill="none"
        />

        {/* Arrowhead */}
        {edgeConfig.edgeArrows && (
          <G transform={`translate(${endPoint.x}, ${endPoint.y}) rotate(${angle * 180 / Math.PI})`}>
            <Path
              d="M0,0 L-10,-5 L-10,5 Z"
              fill={edgeConfig.edgeColor}
            />
          </G>
        )}

        {/* Edge Label */}
        {edgeElk.labels?.map((label, idx) => (
          <G key={idx} transform={`translate(${label.x}, ${label.y})`}>
            <Rect
              width={label.width}
              height={label.height}
              fill="#ffffff"
              rx="3"
              stroke="#cccccc"
              strokeWidth="1"
            />
            <Text
              x={label.width / 2}
              y={label.height / 2}
              textAnchor="middle"
              dy=".3em"
            >
              {label.text}
            </Text>
          </G>
        ))}
      </G>
    );
  };

  return (
    <View 
      style={{ flex: 1 }}
      onLayout={(event) => {
        const { width, height } = event.nativeEvent.layout;
        setDimensions({ width, height });
      }}
    >
      <Svg width={dimensions.width} height={dimensions.height}>
        {layout.edges?.map(renderEdge)}
        {layout.children?.map(renderNode)}
      </Svg>
    </View>
  );
};

export default DiagramComponent;
import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet
} from 'react-native';

/**
 * Recursive component that renders one tree node.
 * If the node has a non-empty “children” array, a chevron is displayed to allow toggling.
 */
const TreeNode = (props) => {
  const {
    node,
    level,
    treeItemLabel,
    treeItemIcon,
    nodeIndentation,
    nodeHeight,
    fontSize,
    textColor,
    backgroundColor,
    chevronProps
  } = props;

  const [expanded, setExpanded] = useState(false);
  const hasChildren = node.children && Array.isArray(node.children) && node.children.length > 0;

  const toggleExpand = () => {
    setExpanded(!expanded);
  };

  return (
    <View>
      <View
        style={[
          styles.nodeContainer,
          {
            height: nodeHeight,
            backgroundColor: backgroundColor,
            marginLeft: level * nodeIndentation
          }
        ]}
      >
        {hasChildren ? (
          <TouchableOpacity onPress={toggleExpand} style={styles.chevronContainer}>
            <Image
              source={{ uri: expanded ? chevronProps.openChevronIcon : chevronProps.closedChevronIcon }}
              style={styles.chevronIcon}
              resizeMode="contain"
            />
          </TouchableOpacity>
        ) : (
          // Insert an empty placeholder for alignment if no chevron is needed.
          <View style={[styles.chevronContainer, { width: 24 }]} />
        )}
        {treeItemIcon && node[treeItemIcon] ? (
          <Image
            source={{ uri: node[treeItemIcon] }}
            style={styles.nodeIcon}
            resizeMode="contain"
          />
        ) : null}
        <Text style={[styles.nodeLabel, { fontSize: fontSize, color: textColor }]}>
          {node[treeItemLabel]}
        </Text>
      </View>
      {hasChildren && expanded && (
        <View>
          {node.children.map((child, index) => (
            <TreeNode
              key={index}
              node={child}
              level={level + 1}
              treeItemLabel={treeItemLabel}
              treeItemIcon={treeItemIcon}
              nodeIndentation={nodeIndentation}
              nodeHeight={nodeHeight}
              fontSize={fontSize}
              textColor={textColor}
              backgroundColor={backgroundColor}
              chevronProps={chevronProps}
            />
          ))}
        </View>
      )}
    </View>
  );
};

/**
 * Main TreeView component.
 * In editor mode, if no treeData is bound, a default tree structure is used.
 */
const TreeView = (props) => {
  // Destructure customization and binding props.
  const {
    treeData,
    treeItemLabel,
    treeItemIcon,
    nodeIndentation,
    nodeHeight,
    fontSize,
    textColor,
    backgroundColor,
    Chevron,
    editor
  } = props;

  // Default tree structure for preview (editor mode)
  const defaultTreeData = [
    {
      label: "Root Node 1",
      icon: "",
      children: [
        {
          label: "Child Node 1",
          icon: "",
          children: []
        },
        {
          label: "Child Node 2",
          icon: "",
          children: [
            {
              label: "Grandchild Node 1",
              icon: "",
              children: []
            }
          ]
        }
      ]
    },
    {
      label: "Root Node 2",
      icon: "",
      children: []
    }
  ];

  // Use the default tree data if in editor mode.
  const effectiveTreeData = editor ? defaultTreeData : treeData;
  // Use provided selectors or fallback defaults.
  const effectiveTreeItemLabel = treeItemLabel || "label";
  const effectiveTreeItemIcon = treeItemIcon || "";

  // Calculate effective customization properties.
  const effectiveNodeIndentation = nodeIndentation || 20;
  const effectiveNodeHeight = nodeHeight || 40;
  const effectiveFontSize = fontSize || 14;
  const effectiveTextColor = textColor || "#000000";
  const effectiveBackgroundColor = backgroundColor || "#ffffff";
  const effectiveChevronProps = {
    openChevronIcon:
      Chevron && Chevron.openChevronIcon
        ? Chevron.openChevronIcon
        : "./chevron-down.png",
    closedChevronIcon:
      Chevron && Chevron.closedChevronIcon
        ? Chevron.closedChevronIcon
        : "./chevron-right.png"
  };

  return (
    <View style={styles.container}>
      {effectiveTreeData &&
        effectiveTreeData.map((node, index) => (
          <TreeNode
            key={index}
            node={node}
            level={0}
            treeItemLabel={effectiveTreeItemLabel}
            treeItemIcon={effectiveTreeItemIcon}
            nodeIndentation={effectiveNodeIndentation}
            nodeHeight={effectiveNodeHeight}
            fontSize={effectiveFontSize}
            textColor={effectiveTextColor}
            backgroundColor={effectiveBackgroundColor}
            chevronProps={effectiveChevronProps}
          />
        ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10
  },
  nodeContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 4
  },
  chevronContainer: {
    width: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center"
  },
  chevronIcon: {
    width: 16,
    height: 16
  },
  nodeIcon: {
    width: 24,
    height: 24,
    marginRight: 8
  },
  nodeLabel: {
    marginLeft: 8
  }
});

export default TreeView;

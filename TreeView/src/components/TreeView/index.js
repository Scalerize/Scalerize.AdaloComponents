import React, { useMemo, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import Icon from "@react-native-vector-icons/material-icons";

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
    chevronProps,
  } = props;

  const [expanded, setExpanded] = useState(false);
  const hasChildren =
    node.children && Array.isArray(node.children) && node.children.length > 0;

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
            marginLeft: level * nodeIndentation,
          },
        ]}
      >
        {hasChildren ? (
          <TouchableOpacity
            onPress={toggleExpand}
            style={styles.chevronContainer}
          >
            <Icon
              name={
                expanded
                  ? chevronProps.openChevronIcon
                  : chevronProps.closedChevronIcon
              }
              size={16}
              color={textColor}
            />
          </TouchableOpacity>
        ) : (
          // Insert an empty placeholder for alignment if no chevron is needed.
          <View style={[styles.chevronContainer, { width: 24 }]} />
        )}
        {treeItemIcon  ? (
          <Icon name={treeItemIcon} size={24} color={textColor} />
        ) : null}
        <Text
          style={[styles.nodeLabel, { fontSize: fontSize, color: textColor }]}
        >
          {treeItemLabel}
        </Text>
      </View>
      {hasChildren && expanded && (
        <View>
          {node.children.map((child, index) => (
            <TreeNode
              key={index}
              node={child}
              level={level + 1}
              {...props}
            />
          ))}
        </View>
      )}
    </View>
  );
};

const TreeView = (props) => {
  const {
    treeData,
    nodeIndentation,
    nodeHeight,
    fontSize,
    textColor,
    backgroundColor,
    chevron,
    editor,
  } = props;

  const createDataTree = (dataset) => {
    const hashTable = Object.create(null);
    dataset.forEach(
      (aData) => (hashTable[aData.id] = { ...aData, children: [] })
    );
    const dataTree = [];
    dataset.forEach((aData) => {
      if (aData.parentId)
        hashTable[aData.parentId].children.push(hashTable[aData.id]);
      else dataTree.push(hashTable[aData.id]);
    });
    return dataTree;
  };

  const defaultTreeData = [
    {
      id: 1,
      treeItemLabel: "Root Node 1",
      treeItemIcon: "",
      children: [
        {
          id: 2,
          treeItemLabel: "Child Node 1",
          treeItemIcon: "",
          children: [],
        },
        {
          id: 3,
          treeItemLabel: "Child Node 2",
          treeItemIcon: "",
          children: [
            {
              id: 4,
              treeItemLabel: "Grandchild Node 1",
              treeItemIcon: "",
              children: [],
            },
          ],
        },
      ],
    },
    {
      treeItemLabel: "Root Node 2",
      icon: "",
      children: [],
    },
  ];

  const effectiveTreeData = useMemo(
    () => (editor ? defaultTreeData : createDataTree(treeData)),
    [treeData, editor]
  );
  
  const effectiveNodeIndentation = nodeIndentation || 20;
  const effectiveNodeHeight = nodeHeight || 40;
  const effectiveFontSize = fontSize || 14;
  const effectiveTextColor = textColor || "#000000";
  const effectiveBackgroundColor = backgroundColor || "#ffffff";
  
  const effectiveChevronProps = {
    openChevronIcon: chevron?.openChevronIcon || "chevron-down",
    closedChevronIcon: chevron?.closedChevronIcon || "chevron-right",
  };

  return (
    <View style={styles.container}>
      {effectiveTreeData &&
        effectiveTreeData.map((node, index) => (
          <TreeNode
            key={index}
            node={node}
            level={0}
            treeItemLabel={node.treeItemLabel || "label"}
            treeItemIcon={node.treeItemIcon || ""}
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
    padding: 10,
  },
  nodeContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 4,
  },
  chevronContainer: {
    width: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  chevronIcon: {
    width: 16,
    height: 16,
  },
  nodeIcon: {
    width: 24,
    height: 24,
    marginRight: 8,
  },
  nodeLabel: {
    marginLeft: 8,
  },
});

export default TreeView;

import React, { useMemo, useState, memo } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import Icon from "@react-native-vector-icons/material-icons";

const TreeNode = memo((props) => {
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
    onPress,
  } = props;

  const [expanded, setExpanded] = useState(false);
  const hasChildren =
    node.children && Array.isArray(node.children) && node.children.length > 0;
    const finalExpanded = props.editor ? true : expanded;

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
                finalExpanded
                  ? chevronProps.openChevronIcon
                  : chevronProps.closedChevronIcon
              }
              size={16}
              color={textColor}
            />
          </TouchableOpacity>
        ) : (
          <View style={[styles.chevronContainer, { width: 24 }]} />
        )}
        {treeItemIcon ? (
          <Icon name={treeItemIcon} size={24} color={textColor} />
        ) : null}
        <TouchableOpacity
          style={styles.nodeLabel}
          onPress={() => onPress(node?.id, !node?.children?.length)}
        >
          <Text style={{ fontSize: fontSize, color: textColor }}>
            {treeItemLabel}
          </Text>
        </TouchableOpacity>
      </View>
      {hasChildren && finalExpanded && (
        <View>
          {node.children.map((child, index) => {
            const childProps = {
              ...props,
              treeItemIcon: child.treeItemIcon,
              treeItemLabel: child.treeItemLabel,
              node: child,
              level: level + 1,
            };
            return <TreeNode key={index} {...childProps} />;
          })}
        </View>
      )}
    </View>
  );
});

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
    treeItemIcon,
    onItemPress,
  } = props;

  const createDataTree = (dataset) => {
    if (!dataset) return [];
    const hashTable = Object.create(null);

    dataset.forEach(
      (aData) => (hashTable[aData.id] = { ...aData, children: [] })
    );
    const dataTree = [];
    dataset.forEach((aData) => {
      if (aData.parentId && dataset.some((item) => item.id == aData.parentId))
        hashTable[String(aData.parentId)].children.push(
          hashTable[String(aData.id)]
        );
      else dataTree.push(hashTable[String(aData.id)]);
    });
    console.log(dataTree);
    return dataTree;
  };

  const defaultTreeData = [
    {
      id: 1,
      treeItemLabel: "Root Node 1",
      treeItemIcon,
      children: [
        {
          id: 2,
          treeItemLabel: "Child Node 1",
          treeItemIcon,
          children: [],
        },
        {
          id: 3,
          treeItemLabel: "Child Node 2",
          treeItemIcon,
          children: [
            {
              id: 4,
              treeItemLabel: "Grandchild Node 1",
              treeItemIcon,
              children: [],
            },
          ],
        },
      ],
    },
    {
      treeItemLabel: "Root Node 2",
      icon: "folder",
      children: [],
    },
  ];

  const effectiveTreeData = useMemo(
    () => (editor ? defaultTreeData : createDataTree(treeData)),
    [treeData, editor, treeItemIcon]
  );

  const effectiveNodeIndentation = nodeIndentation || 20;
  const effectiveNodeHeight = nodeHeight || 40;
  const effectiveFontSize = fontSize || 14;
  const effectiveTextColor = textColor || "#000000";
  const effectiveBackgroundColor = backgroundColor || "#ffffff";

  const effectiveChevronProps = {
    openChevronIcon: chevron?.openChevronIcon || "keyboard-arrow-down",
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
            treeItemIcon={treeItemIcon || ""}
            nodeIndentation={effectiveNodeIndentation}
            nodeHeight={effectiveNodeHeight}
            fontSize={effectiveFontSize}
            textColor={effectiveTextColor}
            backgroundColor={effectiveBackgroundColor}
            chevronProps={effectiveChevronProps}
            editor={editor}
            onPress={onItemPress}
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

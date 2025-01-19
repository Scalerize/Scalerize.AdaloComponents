export const diagramTestProps = {
    diagramOrientation: "LR",      // "LR", "RL", "TB", or "BT"
    nodeWidth: 100,
    nodeHeight: 60,
    horizontalSpacing: 60,
    verticalSpacing: 60,
    nodeCollection: [
      {
        nodeId: "A",
        borderRadius: 10,
        color: "#F5F5F5",
        borderColor: "#000000",
        borderThickness: 2,
        innerFormBorderColor: "#CCCCCC",
        innerFormColor: "#FFFFFF",
        innerFormBorderRadius: 5,
        innerFormBorderThickness: 1,
        rotation: 0,
        legendType: "inside",          // "inside", "outside-simple", or "outside-block"
        legendText: "Node A",
        legendColor: "#000",
        legendBorderColor: "#333",
        legendBorderThickness: 1,
        legendBorderRadius: 2,
        legendFillColor: "#FFF"
      },
      {
        nodeId: "B",
        borderRadius: 10,
        color: "#DCE775",
        borderColor: "#000000",
        borderThickness: 2,
        innerFormBorderColor: "#9E9E9E",
        innerFormColor: "#FFFFFF",
        innerFormBorderRadius: 5,
        innerFormBorderThickness: 1,
        rotation: 0,
        legendType: "outside-simple", 
        legendText: "Node B",
        legendColor: "#000",
        legendBorderColor: "#333",
        legendBorderThickness: 1,
        legendBorderRadius: 2,
        legendFillColor: "#FFF"
      },
      {
        nodeId: "C",
        borderRadius: 10,
        color: "#FFCC80",
        borderColor: "#000000",
        borderThickness: 2,
        innerFormBorderColor: "#9E9E9E",
        innerFormColor: "#FFFFFF",
        innerFormBorderRadius: 5,
        innerFormBorderThickness: 1,
        rotation: 0,
        legendType: "outside-block",
        legendText: "Node C",
        legendColor: "#000",
        legendBorderColor: "#333",
        legendBorderThickness: 1,
        legendBorderRadius: 2,
        legendFillColor: "#FFF"
      }
    ],
    edgeCollection: [
      {
        fromNodeId: "A",
        toNodeId: "B",
        thickness: 2,
        color: "#000000",
        dotted: false,
        arrow: true,
        curved: false,
        edgeText: "Edge A-B"
      },
      {
        fromNodeId: "B",
        toNodeId: "C",
        thickness: 2,
        color: "#000000",
        dotted: true,
        arrow: true,
        curved: true,
        edgeText: "Dotted L-Edge"
      }
    ]
  };
  
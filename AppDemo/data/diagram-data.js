export const diagramTestProps = {
    diagramOrientation: "TB",      // "LR", "RL", "TB", or "BT"
    nodeWidth: 20,
    nodeHeight: 20,
    horizontalSpacing: 60,
    verticalSpacing: 60,
    backgroundColor: "#ffffff",
    nodeCollection: [
      {
        nodeId: "A",
        borderRadius: 0,
        color: "red",
        borderColor: "#000000",
        borderThickness: 2,
        innerFormBorderColor: "#CCCCCC",
        innerFormColor: "#FFFFFF00",
        innerFormBorderRadius: 100,
        innerFormBorderThickness: 0,
        rotation: 45,
        legendType: "inside",          // "inside", "outside-simple", or "outside-block"
        legendText: "A",
        legendColor: "#000",
        legendBorderColor: "#333",
        legendBorderThickness: 1,
        legendBorderRadius: 2,
        legendFillColor: "#FFF"
      },
      {
        nodeId: "B",
        borderRadius: 100,
        color: "red",
        borderColor: "#000000",
        borderThickness: 2,
        innerFormBorderColor: "#9E9E9E",
        innerFormColor: "#FFFFFF00",
        innerFormBorderRadius: 100,
        innerFormBorderThickness: 0,
        rotation: 0,
        legendType: "outside-simple", 
        legendText: "B",
        legendColor: "#000",
        legendBorderColor: "#333",
        legendBorderThickness: 1,
        legendBorderRadius: 2,
        legendFillColor: "#FFF"
      },
      {
        nodeId: "C",
        borderRadius: 100,
        color: "red",
        borderColor: "#000000",
        borderThickness: 2,
        innerFormBorderColor: "#9E9E9E",
        innerFormColor: "#FFFFFF00",
        innerFormBorderRadius: 100,
        innerFormBorderThickness: 0,
        rotation: 0,
        legendType: "outside-block",
        legendText: "C",
        legendColor: "#000",
        legendBorderColor: "#333",
        legendBorderThickness: 1,
        legendBorderRadius: 2,
        legendFillColor: "#FFF"
      },
      {
        nodeId: "D",
        borderRadius: 100,
        color: "red",
        borderColor: "#000000",
        borderThickness: 2,
        innerFormBorderColor: "#9E9E9E",
        innerFormColor: "#FFFFFF00",
        innerFormBorderRadius: 100,
        innerFormBorderThickness: 0,
        rotation: 0,
        legendType: "outside-block",
        legendText: "",
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
        curved:     false,
        edgeText: "Edge A-B"
      },
      {
        fromNodeId: "A",
        toNodeId: "C",
        thickness: 2,
        color: "#000000",
        dotted: true,
        arrow: true,
        curved:  false,
        edgeText: "Edge B-C"
      },
      {
        fromNodeId: "A",
        toNodeId: "D",
        thickness: 2,
        color: "#000000",
        dotted: true,
        arrow: true,
        curved: false,
        edgeText: "Edge A-D"
      }
    ]
  };
  
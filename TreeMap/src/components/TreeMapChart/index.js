import React from "react";
import { View, Text, StyleSheet } from "react-native";
import squarifyModule from "squarify";

const fakeDataset = [20, 10, 5, 2, 1].map((x) => ({
  item: { title: `Item #${x}`, value: x },
}));

const squarify =
  typeof squarifyModule === "function"
    ? squarifyModule
    : squarifyModule?.default ?? squarifyModule;

const normalizeSizes =
  typeof squarify?.normalizeSizes === "function"
    ? squarify.normalizeSizes
    : (vals, w, h) => {
        const total = vals.reduce((sum, v) => sum + (v || 0), 0) || 1;
        const area = w * h;
        return vals.map((v) => ((v || 0) * area) / total);
      };

const Treemap = (props) => {
  console.log(props);
  const items = !props.editor ? props.items || [] : fakeDataset;

  const width = props._width;
  const height = props._height;

  const values = items.map((item) => item.item.value || 0);
  const normed = normalizeSizes(values, width, height);
  const rects = squarify(normed, 0, 0, width, height);

  console.log(rects);
  return (
    <View style={[styles.container, { width, height }]}>
      {rects.map((rect, index) => (
        <View
          key={index}
          style={{
            position: "absolute",
            left: rect.x,
            top: rect.y,
            width: rect.dx,
            height: rect.dy,
            backgroundColor: `hsl(${(index * 47) % 360}, 60%, 70%)`,
            justifyContent: "center",
            alignItems: "center",
            borderWidth: 1,
            borderColor: "#fff",
          }}
        >
          <Text style={styles.text}>{items[index].item.title}</Text>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "relative",
  },
  text: {
    color: "#000",
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default Treemap;

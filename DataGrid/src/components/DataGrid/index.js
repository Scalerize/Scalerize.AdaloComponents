import { useState, useEffect, memo } from "react";
import { DataTable } from "react-native-paper";
import Icon from "@react-native-vector-icons/material-icons";
import { DateTime } from "luxon";
import { Text, View, Linking, Image, StyleSheet } from "react-native";
import { editorData } from "./editor-data";
import { isEmail, getAdaloPictureLink } from "./helpers";

const Cell = memo(({ type, value }) => {
  const style = {
    display: "flex",
    "justify-content": "center",
    "align-items": "center",
    width: "100%",
  };

  if (value == null) {
    let conditionalStyle = ["image", "boolean"].includes(type) ? style : {};
    return (
      <View style={conditionalStyle}>
        <Text>-</Text>
      </View>
    );
  }

  if (type == null && !!value) {
    return isEmail(value) ? (
      <Text onPress={() => Linking.openURL(`mailto:${value}`)}>{value}</Text>
    ) : (
      <Text>{value}</Text>
    );
  }

  if (type === "date") {
    return (
      <Text>{DateTime.fromISO(value).toLocaleString(DateTime.DATE_SHORT)}</Text>
    );
  } else if (type === "dateOnly") {
    return (
      <Text>
        {DateTime.fromISO(value).toLocaleString(DateTime.DATETIME_SHORT)}
      </Text>
    );
  } else if (type === "image") {
    return (
      <View style={style}>
        <Image
          height="24"
          alt={value.filename}
          source={{ uri: getAdaloPictureLink(value) }}
        ></Image>
      </View>
    );
  } else if (type === "file") {
    return (
      <Text onPress={() => Linking.openURL(getAdaloPictureLink(value))}>
        {value.filename}
      </Text>
    );
  } else if (type === "boolean") {
    return (
      <View style={style}>
        {value ? (
          <Icon size={16} name="check"></Icon>
        ) : (
          <Icon size={16} name="close"></Icon>
        )}
      </View>
    );
  }
});

const DataGrid = (props) => {
  const propsRows = props?.rows || [];
  const propsColumns = props?.columns || [];
  const appId = props?.appId;
  const rowsMeta = propsRows?.length > 0 ? propsRows?.[0]?._meta : null;
  const isEditor = props?.editor;

  const [propertiesDict, setPropertiesDict] = useState(undefined);
  const [propertiesTypesDict, setPropertiesTypesDict] = useState(undefined);

  useEffect(() => {
    try {
      if (
        !rowsMeta ||
        !!propertiesDict ||
        !!propertiesTypesDict ||
        !appId ||
        isEditor
      ) {
        return;
      }
      const response = fetch(
        `https://cdn.adalo.com/apps/${appId}/clients/runner`
      )
        .then((x) => {
          if (response.ok) {
            throw new Error(`${response.status} ${response.statusText}`);
          }
          return x;
        })
        .then((x) => x.json())
        .then((json) => {
          const { datasourceId, tableId } = rowsMeta;
          let tableStructure =
            json?.datasources?.[datasourceId]?.tables?.[tableId]?.fields;
          if (!tableStructure) {
            return;
          }

          let nameMapping = Object.keys(tableStructure).map((x) => [
            tableStructure[x].name,
            x,
          ]);
          setPropertiesDict(Object.fromEntries(nameMapping));

          let typeMapping = Object.keys(tableStructure).map((x) => [
            tableStructure[x].name,
            tableStructure[x].type,
          ]);
          setPropertiesTypesDict(Object.fromEntries(typeMapping));
        });
    } catch (e) {
      console.error(e);
    }
  });

  function getField(x) {
    return propertiesDict && x.field ? propertiesDict[x.field] : "-";
  }

  function getFieldType(x) {
    return propertiesTypesDict && x.field
      ? propertiesTypesDict[x.field]
      : "text";
  }

  function getColumns() {
    return !!isEditor && !rowsMeta
      ? editorData.columns
      : propsColumns
          ?.map((x) => x?.["Column Definition"])
          ?.filter((x) => !!x)
          ?.map((x) => {
            let field = getField(x);
            return {
              field,
              headerName: x.headerName || field,
              fieldType: getFieldType(x),
            };
          })
          ?.reduce((acc, next) => {
            if (!acc.some((x) => x.field === next.field)) {
              acc.push(next);
            }
            return acc;
          }, [])
          ?.filter((x) => !!x.field) || [];
  }

  function getRows() {
    return !!isEditor
      ? editorData.rows
      : propsRows?.map((x) => x?._meta?.record).filter((x) => !!x) || [];
  }

  function darkenColor(hex, amount = 8) {
    if (!hex || !hex.startsWith("#") || hex.length < 7) {
      return "#cccccc";
    }
    let num = parseInt(hex.slice(1), 16),
      r = (num >> 16) - amount,
      g = ((num >> 8) & 0x00ff) - amount,
      b = (num & 0x0000ff) - amount;
    r = r < 0 ? 0 : r;
    g = g < 0 ? 0 : g;
    b = b < 0 ? 0 : b;
    return "#" + (b | (g << 8) | (r << 16)).toString(16).padStart(6, "0");
  }

  const columns = getColumns();
  const rows = getRows();

  return (
    <DataTable
      style={[
        style.table,
        {
          backgroundColor: props.backgroundColor,
          borderWidth: 0,
          borderColor: "transparent",
        },
      ]}
    >
      {!!columns?.length ? (
        <DataTable.Header
          style={{
            backgroundColor: props.headerBackgroundColor,
            borderWidth: 0,
            paddingHorizontal: 0,
          }}
        >
          {columns.map((x, i, arr) => (
            <DataTable.Title
              key={i}
              textStyle={{ color: props.foregroundColor }}
              style={[
                { paddingHorizontal: 8, borderColor: props.borderColor },
                props.borderType === "rows" ||
                props.borderType === "rows-and-cols"
                  ? {
                      borderTopWidth: props.borderThickness / 2,
                      borderBottomWidth: props.borderThickness / 2,
                    }
                  : {},
                props.borderType === "cols" ||
                props.borderType === "rows-and-cols"
                  ? {
                      borderLeftWidth: props.borderThickness / 2,
                      borderRightWidth: props.borderThickness / 2,
                    }
                  : {},
              ]}
            >
              {x.headerName}
            </DataTable.Title>
          ))}
        </DataTable.Header>
      ) : (
        <></>
      )}

      {rows?.length && !!columns?.length ? (
        rows.map((row, i) => (
          <DataTable.Row
            key={i}
            style={[
              { paddingHorizontal: 0 },
              props.striped && i % 2 === 1
                ? { backgroundColor: darkenColor(props.backgroundColor) }
                : {},
            ]}
          >
            {columns.map((column, j) => (
              <DataTable.Cell
                key={j}
                textStyle={{ color: props.foregroundColor }}
                style={[
                  { borderColor: props.borderColor },
                  props.borderType === "rows" ||
                  props.borderType === "rows-and-cols"
                    ? {
                        borderBottomWidth: props.borderThickness / 2,
                        borderTopWidth: props.borderThickness / 2,
                      }
                    : {},
                  props.borderType === "cols" ||
                  props.borderType === "rows-and-cols"
                    ? {
                        borderRightWidth: props.borderThickness / 2,
                        borderLeftWidth: props.borderThickness / 2,
                      }
                    : {},
                ]}
              >
                <Cell type={column.fieldType} value={row[column.field]}></Cell>
              </DataTable.Cell>
            ))}
          </DataTable.Row>
        ))
      ) : (
        <></>
      )}
    </DataTable>
  );
};

export default DataGrid;

const style = StyleSheet.create({
  table: {
    height: "100%",
    width: "100%",
  },
});

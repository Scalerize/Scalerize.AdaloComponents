import {useState, useEffect, memo} from 'react';
import {DataTable, Icon} from 'react-native-paper';
import {DateTime} from 'luxon';
import {Text, View, Linking, Image, StyleSheet} from 'react-native';
import {editorData} from "./editor-data";
import {isEmail, getAdaloPictureLink} from "./helpers";

const Cell = memo(({type, value}) => {
    const style = {
        display: 'flex',
        'justify-content': 'center',
        'align-items': 'center',
        width: '100%'
    };

    if (value == null) {
        let conditionalStyle = ['image', 'boolean'].includes(type) ? style : {};
        return <View style={conditionalStyle}>
            <Text>-</Text>
        </View>;
    }

    if (type == null && !!value) {
        return isEmail(value)
            ? <Text onPress={() => Linking.openURL(`mailto:${value}`)}>{value}</Text>
            : <Text>{value}</Text>
    }

    if (type === 'date') {
        return <Text>{DateTime.fromISO(value).toLocaleString(DateTime.DATE_SHORT)}</Text>
    } else if (type === 'dateOnly') {
        return <Text>{DateTime.fromISO(value).toLocaleString(DateTime.DATETIME_SHORT)}</Text>
    } else if (type === 'image') {
        return (
            <View style={style}>
                <Image height="24" alt={value.filename}
                       source={{uri: getAdaloPictureLink(value)}}></Image>
            </View>
        );
    } else if (type === 'file') {
        return <Text onPress={() => Linking.openURL(getAdaloPictureLink(value))}>{value.filename}</Text>;
    } else if (type === 'boolean') {
        return <View style={style}>
            {value
                ? <Icon size={16} source="check"></Icon>
                : <Icon size={16} source="close"></Icon>
            }
        </View>
    }
});

const Table = (props) => {
    const propsRows = props?.rows || [];
    const propsColumns = props?.columns || [];
    const appId = props?.appId;
    const rowsMeta = propsRows?.length > 0 ? propsRows?.[0]?._meta : null;
    const isEditor = props?.editor;

    const [propertiesDict, setPropertiesDict] = useState(undefined);
    const [propertiesTypesDict, setPropertiesTypesDict] = useState(undefined);

    useEffect(() => {
        try {
            if (!rowsMeta || !!propertiesDict || !!propertiesTypesDict || !appId || isEditor) {
                return;
            }
            const response = fetch(`https://cdn.adalo.com/apps/${appId}/clients/runner`)
                .then(x => {
                    if (response.ok) {
                        throw new Error(`${response.status} ${response.statusText}`);
                    }
                    return x;
                })
                .then(x => x.json())
                .then(json => {
                    const {datasourceId, tableId} = rowsMeta;
                    let tableStructure = json?.datasources?.[datasourceId]?.tables?.[tableId]?.fields;
                    if (!tableStructure) {
                        return;
                    }

                    let nameMapping = Object.keys(tableStructure)
                        .map(x => [tableStructure[x].name, x]);
                    setPropertiesDict(Object.fromEntries(nameMapping));

                    let typeMapping = Object.keys(tableStructure)
                        .map(x => [tableStructure[x].name, tableStructure[x].type]);
                    setPropertiesTypesDict(Object.fromEntries(typeMapping));
                });
        } catch (e) {
            console.error(e);
        }
    })

    function getField(x) {
        return propertiesDict && x.field ? propertiesDict[x.field] : '-';
    }

    function getFieldType(x) {
        return propertiesTypesDict && x.field ? propertiesTypesDict[x.field] : 'text';
    }

    function getColumns() {
        return !!isEditor
            ? editorData.columns
            : propsColumns
            ?.map(x => x?.['Column Definition'])
            ?.filter(x => !!x)
            ?.map(x => {
                let field = getField(x);
                return ({
                    field,
                    headerName: x.headerName || field,
                    fieldType: getFieldType(x)
                });
            })
            ?.reduce((acc, next) => {
                if (!acc.some(x => x.field === next.field)) {
                    acc.push(next);
                }
                return acc;
            }, [])
            ?.filter(x => !!x.field) || [];
    }

    function getRows() {
        return !!isEditor
            ? editorData.rows
            : propsRows?.map(x => x?._meta?.record)
            .filter(x => !!x) || [];
    }
    
    const columns = getColumns();
    const rows = getRows();

    return <DataTable style={style.table}>
        {
            !!columns?.length
                ? <DataTable.Header>
                    {columns.map((x, i) =>
                        <DataTable.Title key={i}>{x.headerName}</DataTable.Title>
                    )}
                </DataTable.Header>
                : <></>
        }

        {
            rows?.length && !!columns?.length
                ? rows.map((row, i) => (
                    <DataTable.Row key={i}>
                        {columns.map((column, j) => (
                            <DataTable.Cell key={j}>
                                <Cell type={column.fieldType} value={row[column.field]}></Cell>
                            </DataTable.Cell>
                        ))}
                    </DataTable.Row>
                ))
                : <></>
        }
    </DataTable>;
};

export default Table;

const style = StyleSheet.create({
    table: {
        height: '100%',
        width: '100%'
    }
});

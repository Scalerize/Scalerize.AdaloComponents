import {useState, useEffect} from 'react';
import {DataTable} from 'react-native-paper';
import {log, report} from "../../../../Shared/utils";
import {DateTime} from 'luxon';
import {Text, View, Linking, Image, StyleSheet} from 'react-native';

const Cell = ({type, value}) => {
    const style = {
        display: 'flex', 'justify-content': 'center', 'align-items': 'center', width: '100%'
    };

    if (value == null) {
        let conditionalStyle = ['image', 'boolean'].includes(type) ? style : {};
        return <View style={conditionalStyle}>
            <Text>-</Text>
        </View>;
    }
    const getAdaloUrlFromValue = (value) => {
        return `https://adalo-uploads.imgix.net/${value.url}?auto=compress&h=30`;
    }

    const isEmail = (email) => {
        if (typeof (email) !== 'string') {
            return false;
        }
        return /^[+0-9a-z._-]+@{1}[0-9a-z.-]{2,}[.]{1}[a-z]{2,5}$/gm.test(email);
    }

    const date = type.startsWith('date') ? DateTime.fromISO(value) : null;

    if (type === 'date') {
        return <Text>{date.toLocaleString(DateTime.DATE_SHORT)}</Text>
    } else if (type === 'dateOnly') {
        return <Text>{date.toLocaleString(DateTime.DATETIME_SHORT)}</Text>
    } else if (type === 'image') {
        return <View style={style}>
            <Image height="24" alt={value.filename}
                   source={{uri: getAdaloUrlFromValue(value)}}></Image></View>;
    } else if (type === 'file') {
        return <Text onPress={() => Linking.openURL(getAdaloUrlFromValue(value))}>{value.filename}</Text>;
    } else if (type === 'boolean') {
        return <View style={style}>{value ? <CheckIcon></CheckIcon> : <CloseIcon></CloseIcon>}</View>
    } else if (isEmail(value)) {
        return <Text onPress={() => Linking.openURL(`mailto:${value}`)}>{value}</Text>;
    } else {
        return <Text>{value}</Text>
    }
}
const Table = (props) => {
    const propsRows = props?.rows || [];
    const propsColumns = props?.columns || [];
    const appId = props?.appId;
    const rowsMeta = propsRows?.length > 0 ? propsRows[0]._meta : null;

    const [propertiesDict, setPropertiesDict] = useState(undefined);
    const [propertiesTypesDict, setPropertiesTypesDict] = useState(undefined);

    useEffect(() => {
        if (!rowsMeta || !!propertiesDict || !appId) {
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
                let tableStructure = json.datasources[datasourceId].tables[tableId].fields;
                let nameMapping = Object.keys(tableStructure)
                    .map(x => [tableStructure[x].name, x]);
                setPropertiesDict(Object.fromEntries(nameMapping));
                let typeMapping = Object.keys(tableStructure)
                    .map(x => [tableStructure[x].name, tableStructure[x].type]);
                setPropertiesTypesDict(Object.fromEntries(typeMapping));
            })
            .catch(x => report({
                'component': 'table', 'missing-icon': `Error fetching runner: ${x.message}`
            }));
    })

    function getField(x) {
        return propertiesDict && x.field ? propertiesDict[x.field] : x.field;
    }

    const columns = propsColumns
        ?.map(x => x['Column Definition'])
        ?.map(x => ({
            field: getField(x),
            headerName: x.headerName || getField(x)
        }))
        ?.reduce((acc, next) => {
            if (!acc.some(x => x.field === next.field)) {
                acc.push(next);
            }
            return acc;
        }, [])
        ?.filter(x => !!x.field) || [];

    const rows = propsRows?.map(x => x?._meta?.record)
        .filter(x => !!x) || [];


    return <View style={wrapperStyle}>
        <DataTable>
            <DataTable.Header>
                {columns.map((x, i) => <DataTable.Title key={i}>{x.headerName}</DataTable.Title>)}
            </DataTable.Header>
            {rows.map((row, i) => <DataTable.Row key={i}>
                {columns.map((column, j) =>
                    <DataTable.Cell key={j}>
                        <Cell type={propertiesTypesDict?.[column.field]} value={row[column.field]}></Cell>
                    </DataTable.Cell>
                )}
            </DataTable.Row>)}
        </DataTable>
    </View>;

};

export default Table;

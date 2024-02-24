import React, {useState, useEffect} from 'react';
import {DataGrid} from '@mui/x-data-grid';
import {log} from "../../utils";

const Table = (props) => {
    let propsRows = props?.rows || [];
    let propsCoumns = props?.columns || [];
    let rowsMeta = propsRows?.length > 0 ? propsRows[0]._meta : null;

    const [propertiesDict, setPropertiesDict] = useState(undefined);
    useEffect(
        () => {
            if (!rowsMeta || !!propertiesDict) {
                return;
            }
            const appId = props.appId;
            fetch(`https://cdn.adalo.com/apps/${appId}/clients/runner`)
                .then(x => x.json())
                .then(x => {
                        let dataSourceId = rowsMeta.datasourceId;
                        let tableId = rowsMeta.tableId;
                        let tableStructure = x.datasources[dataSourceId].tables[tableId].fields;
                        let nameMapping = Object.keys(tableStructure)
                            .map(x => [tableStructure[x].name, x]);
                        setPropertiesDict(Object.fromEntries(nameMapping));
                    }
                );
        }
    )

    const columns = propsCoumns
        ?.map(x => x['Column Header'])
        ?.map(x => ({
            field: propertiesDict
                ? propertiesDict[x.field]
                : x.field,
            headerName: x.headerName || '',
            width: x.width,
            editable: false
        }))
        ?.filter(x => !!x.field) || [];

    const rows = propsRows?.map(x => x?._meta?.record)
        .filter(x => !!x) || [];

    const componentProperties = {
        columns,
        rows,
        disableColumnMenu: true,
        density: props.density || 'standard',
        sx: {width: '100%'}
    };

    let isComponentHeight = props.tableHeight === 'manual';
    if (isComponentHeight) {
        // Component height is fetch from component props
        componentProperties.sx.height = `${props._height}px`;
    } else {
        componentProperties.autoHeight = true;
    }
    
    log(props);

    let grid = <DataGrid {...componentProperties}></DataGrid>;
    return isComponentHeight ? <div style={componentProperties.sx}>{grid}</div> : grid;

};

export default Table;

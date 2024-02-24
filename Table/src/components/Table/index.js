import React, {useState, useEffect} from 'react';
import {DataGrid} from '@mui/x-data-grid';
import {log, report} from "../../utils";
import * as _ from 'lodash';

const Table = (props) => {

    const propsRows = props?.rows || [];
    const propsCoumns = props?.columns || [];
    const appId = props?.appId;
    const rowsMeta = propsRows?.length > 0 ? propsRows[0]._meta : null;

    const [propertiesDict, setPropertiesDict] = useState(undefined);
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
                })
                .catch(x => report({
                    'component': 'table',
                    'missing-icon': `Error fetching runner: ${x.message}`
                }));
        }
    )

    const columns = _.uniqBy(propsCoumns
        ?.map(x => x['Column Header'])
        ?.map(x => ({
            field: propertiesDict
                ? propertiesDict[x.field]
                : x.field,
            headerName: x.headerName || '',
            width: x.width,
            editable: false
        })), 'field')
        ?.filter(x => !!x.field) || [];

    const rows = propsRows?.map(x => x?._meta?.record)
        .filter(x => !!x) || [];

    let style = props.Style;

    const componentProperties = {
        columns,
        rows,
        disableColumnMenu: true,
        disableRowSelectionOnClick: true,
        density: style.density || 'standard',
        getRowClassName: style.stripped
            ? (x) =>
                x.indexRelativeToCurrentPage % 2 === 0
                    ? 'even'
                    : 'odd'
            : undefined,
        sx: {
            width: '100%',
            color: style.foregroundColor,
            bgcolor: style.backgroundColor,
            '& .even': {
                bgcolor: 'rgba(0, 0, 0, 0.05)'
            },
        }
    };

    // Configure height
    let isComponentHeight = style.tableHeight === 'manual';
    if (isComponentHeight) {
        // Component height is fetch from component props
        componentProperties.sx.height = `${props._height}px`;
    } else {
        componentProperties.autoHeight = true;
    }

    // Configure border color, thickness and sides
    componentProperties.sx.border = style.borderThickness;
    componentProperties.sx.borderColor = style.borderColor;
    componentProperties.sx['& .MuiDataGrid-withBorderColor'] = {
        border: 0
    };
    componentProperties.sx['& .MuiDataGrid-footerContainer'] = {
        border: 0,
        borderTop: style.borderThickness,
        borderColor: style.borderColor
    };
    if (style.borderType === 'rows-and-cols') {
        componentProperties.sx['& .MuiDataGrid-columnHeader'] = {
            borderRight: style.borderThickness,
            borderColor: style.borderColor,
        }
        componentProperties.sx["& .MuiDataGrid-cell"] = {
            borderRight: style.borderThickness,
            borderColor: style.borderColor,
        }
    }
    componentProperties.sx['& .MuiDataGrid-columnHeaders'] = {
        borderBottom: style.borderThickness,
        borderColor: style.borderColor,
    }
    componentProperties.sx["& .MuiDataGrid-row"] = {
        borderBottom: style.borderThickness,
        borderColor: style.borderColor,
        borderTop: 0
    }

    // Configure foregroud color
    componentProperties.sx['& .MuiTablePagination-root'] = {
        color: `${style.foregroundColor} !important`
    }

    componentProperties.sx['& .MuiDataGrid-cell:focus'] = {
        outline: 'none',
    }

    let wrapperStyle = {
        width: componentProperties.sx.width,
        height: componentProperties.sx.height
    };

    let grid = <DataGrid {...componentProperties}></DataGrid>;
    return <div style={wrapperStyle}>{grid}</div>;

};

export default Table;

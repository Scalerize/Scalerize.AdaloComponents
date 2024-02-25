import React, {useState, useEffect} from 'react';
import {DataGrid} from '@mui/x-data-grid';
import {log, report} from "../../utils"; 
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import dayjs from 'dayjs' 

const Cell = ({type, value}) => {
    const style = {
        display: 'flex',
        'justify-content': 'center',
        'align-items': 'center',
        width: '100%'
    };

    if (value == null) {
        let conditionalStyle = ['image', 'boolean'].includes(type) ? style : {};
        return <div style={conditionalStyle}>
            <span>{'-'}</span>
        </div>;
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

    if (type === 'date') {
        return <span>{dayjs(Date.parse(value)).format('DD/MM/YYYY')}</span>
    } else if (type === 'dateOnly') {
        return <span>{dayjs(Date.parse(value)).format('DD/MM/YYYY hh:mm:ss')}</span>
    } else if (type === 'image') {
        return <div style={style}><img height="24" alt={value.filename} src={getAdaloUrlFromValue(value)}></img></div>;
    } else if (type === 'file') {
        return <a href={getAdaloUrlFromValue(value)} target='_blank'>{value.filename}</a>;
    } else if (type === 'boolean') {
        return <div style={style}>{value
            ? <CheckIcon></CheckIcon>
            : <CloseIcon></CloseIcon>
        }</div>
    } else if (isEmail(value)) {
        return <a href={`mailto:${value}`} target='_blank'>{value}</a>;
    } else {
        return <span>{value}</span>
    }
}
const Table = (props) => {log(props);
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
                    'component': 'table',
                    'missing-icon': `Error fetching runner: ${x.message}`
                }));
        }
    )

    function getField(x) {
        return propertiesDict && x.field
            ? propertiesDict[x.field]
            : x.field;
    }

    const columns = propsColumns
        ?.map(x => x['Column Definition'])
        ?.map(x => ({
            field: getField(x),
            headerName: x.headerName || getField(x),
            width: x.width === 0 ? undefined : x.width,
            flex: x.width === 0 ? 1 : undefined,
            editable: false,
            renderCell: ({value}) => <Cell type={propertiesTypesDict?.[x.field]} value={value}></Cell>
        }))
        ?.reduce((acc, next) =>{
            if(!acc.some(x =>x.field === next.field)) {
                acc.push(next);
            }
            return acc;
        }, [] )
        ?.filter(x => !!x.field) || [];

    const rows = propsRows?.map(x => x?._meta?.record)
        .filter(x => !!x) || [];

    let style = props.Style;

    const componentProperties = {
        columns,
        rows,
        disableColumnMenu: true,
        disableColumnResize: true,
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
        borderTop: 0,
        borderColor: style.borderColor
    };
    componentProperties.sx["& .MuiDataGrid-cell *"] = {
        overflow: 'hidden',
        textOverflow: 'ellipsis'
    }
    if (style.borderType === 'rows-and-cols') {
        componentProperties.sx['& .MuiDataGrid-columnHeader'] = {
            borderRight: style.borderThickness,
            borderColor: style.borderColor
        }
        componentProperties.sx["& .MuiDataGrid-cell:not(:last-child)"] = {
            borderRight: style.borderThickness,
            borderColor: style.borderColor,
        }
        componentProperties.sx["& .MuiDataGrid-cell:last-child"] = {
            borderRight: 0
        }
    }
    componentProperties.sx['& .MuiDataGrid-columnHeaders'] = {
        borderBottom: style.borderThickness,
        borderColor: style.borderColor,
        bgcolor:  style.headerBackgroundColor
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

    componentProperties.sx['& .MuiDataGrid-columnHeader:focus'] = {
        outline: 'none',
    }
    componentProperties.sx['& .MuiDataGrid-cell:focus'] = {
        outline: 'none',
    }

    let wrapperStyle = {
        width: componentProperties.sx.width,
        height: componentProperties.sx.height
    };

    return <div style={wrapperStyle}>
        <DataGrid {...componentProperties}></DataGrid>
    </div>;

};

export default Table;

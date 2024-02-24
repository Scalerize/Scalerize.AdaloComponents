import React, {useState, useEffect} from 'react';
import {DataGrid} from '@mui/x-data-grid';
import {log} from '../../utils'

const divStyle = {
    width: '100%',
    height: '100%'
}
const Table = (props) => {
    let rowsMeta = props?.rows?.length > 0 ? props.rows[0]._meta : null;

    const [propertiesDict, setPropertiesDict] = useState(undefined);
    useEffect(
        () => {
            if (!rowsMeta || !!propertiesDict) {
                return;
            }
            const appId = props.appId;
            const url = `https://cdn.adalo.com/apps/${appId}/clients/runner`; 
            fetch(url)
                .then(x => x.json())
                .then(x => { 
                        let dataSourceId = rowsMeta.datasourceId;
                        let tableId = rowsMeta.tableId;
                        let tableStructure = x.datasources[dataSourceId].tables[tableId].fields;
                        log(tableStructure);
                        let entries = Object.keys(tableStructure)
                            .map(x => [tableStructure[x].name, x]);
                        log(entries);
                        setPropertiesDict(Object.fromEntries(entries));
                    }
                );
        }
    )

    const columns = props?.columns
        ?.map(x => ({
            field: propertiesDict
                ? propertiesDict[x.column.field]
                : x.column.field,
            headerName: x.column.headerName,
            width: x.width,
            editable: false
        })) || [];

    const rows = props.rows?.map(x => x._meta.record) || [];

    return (<DataGrid sx={divStyle} columns={columns} rows={rows}></DataGrid>);

};

export default Table;

// props extract

/* 
* {
"rows": [
    {
        "id": 1,
        "_meta": {
            "datasourceId": "3fzcfwlp173oz755v7t0skco2",
            "tableId": "t_0b4f2eea7e3d4abb83c6a92a1e787a1e",
            "id": 1,
            "record": {
                "id": 1,
                "email": "frank.libolt@hotmail.com",
                "password": "[hidden]",
                "username": "frank.libolt@hotmail.com",
                "full_name": "Frank LIBOLT",
                "temporary_password": "[hidden]",
                "temporary_password_expires_at": null,
                "uuid": "f45bf5a9-7882-4124-bda4-7f8b422f2c8b",
                "created_at": "2024-02-24T11:42:11.889Z",
                "updated_at": "2024-02-24T11:42:11.889Z",
                "_meta": {
                    "datasourceId": "3fzcfwlp173oz755v7t0skco2",
                    "tableId": "t_0b4f2eea7e3d4abb83c6a92a1e787a1e",
                    "id": 1
                }
            }
        }
    }
],
"appId": "2229ccb5-53d3-4f84-b566-080b634f336c",
"active": false,
"authToken": null,
"topScreen": true,
"_fonts": {
    "body": "inherit",
    "heading": "Libre Baskerville"
},
"_height": 849,
"_width": 1512,
"isResponsiveComponent": true,
"isPreviewer": true,
"_deviceType": "desktop",
"_screenHeight": 646.2,
"_screenWidth": 1536,
"_layoutGuides": {
    "top": 0,
    "bottom": 0
}
}
* 
* */

// runner extract
/*
{
    "id": "2229ccb5-53d3-4f84-b566-080b634f336c",
    "icon": null,
    "name": "test",
    "path": "test",
    "type": "test",
    "DomainId": null,
    "branding": {
        "text": "#424242",
        "fonts": {
            "body": {
                "family": "default"
            },
            "heading": {
                "family": "Libre Baskerville",
                "category": "serif",
                "variants": [
                    "200",
                    "300",
                    "regular",
                    "500",
                    "600",
                    "700"
                ]
            }
        },
        "primary": "#00A898",
        "secondary": "#FFC00E",
        "background": "#FFFFFF"
    },
    "flagUser": {
        "key": 19561,
        "name": "Frank LIBOLT",
        "custom": {
            "id": 19561,
            "admin": null,
            "developer": true,
            "expert": true,
            "organizationId": 19683,
            "planType": "free",
            "paying": false,
            "trialEndDate": "2020-04-30T19:22:58.638Z",
            "createdAt": "2020-04-15T19:22:58.639Z"
        }
    },
    "shortURL": "",
    "createdAt": "2024-02-23T20:06:27.335Z",
    "published": false,
    "updatedAt": 1708775611046,
    "components": {
        "998942e43ce445e7a8ed43cc51862f42": {
            "x": 3137,
            "y": 0,
            "id": "998942e43ce445e7a8ed43cc51862f42",
            "name": "Home",
            "type": "component",
            "links": {},
            "width": 1512,
            "height": 982,
            "hidden": false,
            "layout": {
                "body": [
                    {
                        "id": "4bf44742618a4bab9cbef207f5015c54",
                        "link": null,
                        "type": "wrapper",
                        "layout": {
                            "width": "100%"
                        },
                        "actions": [],
                        "children": [
                            {
                                "id": "cw7c7c9eicgudmxykwcqrq9zc",
                                "type": "libraryComponent",
                                "layout": {
                                    "top": 133,
                                    "left": "0%",
                                    "width": "100%",
                                    "height": "auto",
                                    "zIndex": 1,
                                    "position": "relative"
                                },
                                "mobile": {
                                    "layout": {
                                        "top": 133
                                    },
                                    "attributes": {
                                        "adjustedY": 133
                                    }
                                },
                                "tablet": {
                                    "layout": {
                                        "top": 133
                                    },
                                    "attributes": {
                                        "adjustedY": 133
                                    }
                                },
                                "actions": {},
                                "desktop": {
                                    "layout": {
                                        "top": 133
                                    },
                                    "attributes": {
                                        "adjustedY": 133
                                    }
                                },
                                "children": [],
                                "actionRefs": [],
                                "attributes": {
                                    "x": 0,
                                    "y": 133,
                                    "name": "Table",
                                    "rows": {
                                        "id": "c51km0f48ovralxlspuden2sd",
                                        "type": "binding",
                                        "source": {
                                            "sort": {
                                                "type": "text",
                                                "fieldId": "email",
                                                "direction": "asc"
                                            },
                                            "type": "data",
                                            "source": null,
                                            "tableId": "t_0b4f2eea7e3d4abb83c6a92a1e787a1e",
                                            "dataType": "list",
                                            "datasourceId": "3fzcfwlp173oz755v7t0skco2"
                                        },
                                        "options": {},
                                        "bindingType": "libraryProp",
                                        "childBindings": [],
                                        "siblingBindings": [
                                            "9y8laz3f98tbwad9hve2avogq",
                                            "0ym3lufn8hs37silzvhlzm7om"
                                        ]
                                    },
                                    "width": 1512,
                                    "column": {
                                        "field": [
                                            "",
                                            {
                                                "id": "1zonywx8nhq6vsx94qtnk8t09",
                                                "type": "binding",
                                                "label": "Property",
                                                "source": {
                                                    "type": "field",
                                                    "source": {
                                                        "type": "data",
                                                        "source": null,
                                                        "tableId": "t_ccc6yakei11d4lndybezm5b0a",
                                                        "dataType": "object",
                                                        "selector": {
                                                            "type": "LIST_ITEM_SELECTOR",
                                                            "listObjectId": "9y8laz3f98tbwad9hve2avogq"
                                                        },
                                                        "datasourceId": "3fzcfwlp173oz755v7t0skco2"
                                                    },
                                                    "fieldId": "c_8krpb1xlldb3gv7gjwrrfe9no",
                                                    "dataType": "text"
                                                },
                                                "bindingType": "libraryProp",
                                                "childBindings": [],
                                                "siblingBindings": [
                                                    "55ynw0puglxgo3kzo4qq760q6"
                                                ]
                                            },
                                            ""
                                        ],
                                        "headerName": [
                                            "",
                                            {
                                                "id": "55ynw0puglxgo3kzo4qq760q6",
                                                "type": "binding",
                                                "label": "Name",
                                                "source": {
                                                    "type": "field",
                                                    "source": {
                                                        "type": "data",
                                                        "source": null,
                                                        "tableId": "t_ccc6yakei11d4lndybezm5b0a",
                                                        "dataType": "object",
                                                        "selector": {
                                                            "type": "LIST_ITEM_SELECTOR",
                                                            "listObjectId": "9y8laz3f98tbwad9hve2avogq"
                                                        },
                                                        "datasourceId": "3fzcfwlp173oz755v7t0skco2"
                                                    },
                                                    "fieldId": "c_ae5thofvvh7gzshng2ygshk66",
                                                    "dataType": "text"
                                                },
                                                "bindingType": "libraryProp",
                                                "childBindings": [],
                                                "siblingBindings": [
                                                    "1zonywx8nhq6vsx94qtnk8t09"
                                                ]
                                            },
                                            ""
                                        ]
                                    },
                                    "height": 849,
                                    "hidden": false,
                                    "zIndex": 1,
                                    "columns": {
                                        "id": "9y8laz3f98tbwad9hve2avogq",
                                        "type": "binding",
                                        "source": {
                                            "sort": null,
                                            "type": "data",
                                            "source": null,
                                            "tableId": "t_ccc6yakei11d4lndybezm5b0a",
                                            "dataType": "list",
                                            "datasourceId": "3fzcfwlp173oz755v7t0skco2"
                                        },
                                        "options": {},
                                        "bindingType": "libraryProp",
                                        "childBindings": [
                                            "1zonywx8nhq6vsx94qtnk8t09",
                                            "55ynw0puglxgo3kzo4qq760q6"
                                        ],
                                        "siblingBindings": [
                                            "c51km0f48ovralxlspuden2sd",
                                            "0ym3lufn8hs37silzvhlzm7om"
                                        ]
                                    },
                                    "opacity": 1,
                                    "adjustedY": 133,
                                    "libraryName": "customcomponents",
                                    "positioning": "fixedBottom",
                                    "componentName": "Table",
                                    "initialDevice": "desktop",
                                    "libraryVersion": "dev",
                                    "variableHeight": true
                                },
                                "bindingRefs": [
                                    [
                                        "rows",
                                        "c51km0f48ovralxlspuden2sd"
                                    ],
                                    [
                                        "columns",
                                        "9y8laz3f98tbwad9hve2avogq"
                                    ]
                                ],
                                "positioning": "fixedBottom",
                                "responsivity": {
                                    "verticalScaling": "VARIABLE_HEIGHT",
                                    "horizontalScaling": "SCALES_WITH_PARENT",
                                    "verticalPositioning": "TOP",
                                    "horizontalPositioning": "CENTER"
                                }
                            },
                            {
                                "id": "e4d7jdrtp0oh497hv8bysvl38",
                                "type": "libraryComponent",
                                "layout": {
                                    "top": 51,
                                    "left": "96.61904761904762%",
                                    "width": "2.6455026455026456%",
                                    "height": "auto",
                                    "zIndex": 2,
                                    "position": "relative"
                                },
                                "mobile": {
                                    "layout": {
                                        "top": 51
                                    },
                                    "attributes": {
                                        "adjustedY": 51
                                    }
                                },
                                "tablet": {
                                    "layout": {
                                        "top": 51
                                    },
                                    "attributes": {
                                        "adjustedY": 51
                                    }
                                },
                                "desktop": {
                                    "layout": {
                                        "top": 51
                                    },
                                    "attributes": {
                                        "adjustedY": 51
                                    }
                                },
                                "children": [],
                                "actionRefs": [],
                                "attributes": {
                                    "x": 1456,
                                    "y": 51,
                                    "name": "ContextualMenu",
                                    "width": 40,
                                    "height": 40,
                                    "hidden": false,
                                    "zIndex": 2,
                                    "opacity": 1,
                                    "adjustedY": 51,
                                    "libraryName": "customcomponents",
                                    "positioning": "fixedTop",
                                    "componentName": "ContextualMenu",
                                    "fifthMenuItem": {
                                        "icon": "arrow-back",
                                        "text": "",
                                        "enabled": false,
                                        "hasDivider": false
                                    },
                                    "firstMenuItem": {
                                        "icon": "edit",
                                        "text": "Edit",
                                        "enabled": true,
                                        "hasDivider": false
                                    },
                                    "initialDevice": "desktop",
                                    "sixthMenuItem": {
                                        "icon": "arrow-back",
                                        "text": "",
                                        "enabled": false,
                                        "hasDivider": false
                                    },
                                    "thirdMenuItem": {
                                        "icon": "arrow-back",
                                        "text": "",
                                        "enabled": false,
                                        "hasDivider": false
                                    },
                                    "fourthMenuItem": {
                                        "icon": "arrow-back",
                                        "text": "",
                                        "enabled": false,
                                        "hasDivider": false
                                    },
                                    "libraryVersion": "dev",
                                    "secondMenuItem": {
                                        "icon": "delete",
                                        "text": "Delete",
                                        "enabled": true,
                                        "hasDivider": false
                                    },
                                    "variableHeight": true
                                },
                                "bindingRefs": [],
                                "positioning": "fixedTop",
                                "responsivity": {
                                    "verticalScaling": "VARIABLE_HEIGHT",
                                    "horizontalScaling": "SCALES_WITH_PARENT",
                                    "verticalPositioning": "TOP",
                                    "horizontalPositioning": "CENTER"
                                }
                            },
                            {
                                "id": "74xyfaa55ej29j7nu7y7utin6",
                                "type": "label",
                                "layout": {
                                    "top": 62,
                                    "left": "6.294973544973543%",
                                    "width": "22.685185185185187%",
                                    "height": "auto",
                                    "zIndex": 3,
                                    "position": "relative"
                                },
                                "mobile": {
                                    "layout": {
                                        "top": 62
                                    },
                                    "attributes": {
                                        "adjustedY": 62
                                    }
                                },
                                "tablet": {
                                    "layout": {
                                        "top": 62
                                    },
                                    "attributes": {
                                        "adjustedY": 62
                                    }
                                },
                                "desktop": {
                                    "layout": {
                                        "top": 62
                                    },
                                    "attributes": {
                                        "adjustedY": 62
                                    }
                                },
                                "children": [],
                                "attributes": {
                                    "x": 90,
                                    "y": 62,
                                    "name": null,
                                    "text": [
                                        "",
                                        {
                                            "id": "0ym3lufn8hs37silzvhlzm7om",
                                            "type": "binding",
                                            "label": "Field",
                                            "source": {
                                                "type": "field",
                                                "source": {
                                                    "type": "data",
                                                    "source": null,
                                                    "tableId": "t_0b4f2eea7e3d4abb83c6a92a1e787a1e",
                                                    "dataType": "object",
                                                    "selector": {
                                                        "type": "CURRENT_USER_SELECTOR"
                                                    },
                                                    "datasourceId": "3fzcfwlp173oz755v7t0skco2"
                                                },
                                                "fieldId": "c_4z6h1zlpqvk9il1oqkzqmpd7l",
                                                "dataType": "text"
                                            },
                                            "bindingType": "libraryProp",
                                            "childBindings": [],
                                            "siblingBindings": [
                                                "c51km0f48ovralxlspuden2sd",
                                                "9y8laz3f98tbwad9hve2avogq"
                                            ]
                                        },
                                        ""
                                    ],
                                    "color": "@text",
                                    "width": 343,
                                    "height": 19,
                                    "hidden": false,
                                    "zIndex": 3,
                                    "opacity": 1,
                                    "fontSize": 16,
                                    "adjustedY": 62,
                                    "autoWidth": false,
                                    "fontStyle": "normal",
                                    "maxLength": null,
                                    "multiline": true,
                                    "fontFamily": "@body",
                                    "fontWeight": 500,
                                    "layoutText": [
                                        "Field"
                                    ],
                                    "selectable": false,
                                    "positioning": "fixedTop",
                                    "initialDevice": "desktop",
                                    "textAlignment": "left",
                                    "variableHeight": true
                                },
                                "positioning": "fixedTop",
                                "responsivity": {
                                    "verticalScaling": "VARIABLE_HEIGHT",
                                    "horizontalScaling": "SCALES_WITH_PARENT",
                                    "verticalPositioning": "TOP",
                                    "horizontalPositioning": "CENTER"
                                }
                            }
                        ],
                        "pushGraph": {
                            "edges": [
                                {
                                    "distance": 11,
                                    "endNodeId": "74xyfaa55ej29j7nu7y7utin6",
                                    "startNodeId": "buffer_74xyfaa55ej29j7nu7y7utin6"
                                },
                                {
                                    "distance": 42,
                                    "endNodeId": "cw7c7c9eicgudmxykwcqrq9zc",
                                    "startNodeId": "e4d7jdrtp0oh497hv8bysvl38"
                                },
                                {
                                    "distance": 42,
                                    "endNodeId": "cw7c7c9eicgudmxykwcqrq9zc",
                                    "startNodeId": "74xyfaa55ej29j7nu7y7utin6"
                                }
                            ],
                            "nodeIds": [
                                "e4d7jdrtp0oh497hv8bysvl38",
                                "buffer_74xyfaa55ej29j7nu7y7utin6",
                                "74xyfaa55ej29j7nu7y7utin6",
                                "cw7c7c9eicgudmxykwcqrq9zc"
                            ]
                        },
                        "attributes": {
                            "x": 0,
                            "y": 0,
                            "width": 1512,
                            "height": 982,
                            "variableHeight": false
                        },
                        "dataBinding": null,
                        "positioning": null,
                        "responsivity": {}
                    }
                ],
                "fixed": []
            },
            "mobile": {
                "pushGraph": {
                    "edges": [],
                    "nodeIds": []
                }
            },
            "tablet": {
                "pushGraph": {
                    "edges": [],
                    "nodeIds": []
                }
            },
            "actions": {
                "cw7c7c9eicgudmxykwcqrq9zc": {},
                "998942e43ce445e7a8ed43cc51862f42": {
                    "039j83u8kk3r21dobmt9k0sqy": {
                        "type": "action",
                        "actions": [
                            {
                                "id": "7345bq5twqrsek890wc3zi7h8",
                                "options": {},
                                "actionType": "notificationPermission"
                            }
                        ],
                        "eventType": "tap",
                        "useInstantNavigation": true
                    }
                }
            },
            "desktop": {
                "pushGraph": {
                    "edges": [],
                    "nodeIds": []
                }
            },
            "objects": [
                {
                    "x": 0,
                    "y": 133,
                    "id": "cw7c7c9eicgudmxykwcqrq9zc",
                    "name": "Table",
                    "type": "libraryComponent",
                    "width": 1512,
                    "height": 849,
                    "hidden": false,
                    "actions": {},
                    "opacity": 1,
                    "children": [],
                    "attributes": {
                        "rows": {
                            "id": "c51km0f48ovralxlspuden2sd",
                            "type": "binding",
                            "source": {
                                "sort": {
                                    "type": "text",
                                    "fieldId": "email",
                                    "direction": "asc"
                                },
                                "type": "data",
                                "source": null,
                                "tableId": "t_0b4f2eea7e3d4abb83c6a92a1e787a1e",
                                "dataType": "list",
                                "datasourceId": "3fzcfwlp173oz755v7t0skco2"
                            },
                            "options": {},
                            "bindingType": "libraryProp"
                        },
                        "column": {
                            "field": [
                                "",
                                {
                                    "id": "1zonywx8nhq6vsx94qtnk8t09",
                                    "type": "binding",
                                    "label": "Property",
                                    "source": {
                                        "type": "field",
                                        "source": {
                                            "type": "data",
                                            "source": null,
                                            "tableId": "t_ccc6yakei11d4lndybezm5b0a",
                                            "dataType": "object",
                                            "selector": {
                                                "type": "LIST_ITEM_SELECTOR",
                                                "listObjectId": "9y8laz3f98tbwad9hve2avogq"
                                            },
                                            "datasourceId": "3fzcfwlp173oz755v7t0skco2"
                                        },
                                        "fieldId": "c_8krpb1xlldb3gv7gjwrrfe9no",
                                        "dataType": "text"
                                    },
                                    "bindingType": "libraryProp"
                                },
                                ""
                            ],
                            "headerName": [
                                "",
                                {
                                    "id": "55ynw0puglxgo3kzo4qq760q6",
                                    "type": "binding",
                                    "label": "Name",
                                    "source": {
                                        "type": "field",
                                        "source": {
                                            "type": "data",
                                            "source": null,
                                            "tableId": "t_ccc6yakei11d4lndybezm5b0a",
                                            "dataType": "object",
                                            "selector": {
                                                "type": "LIST_ITEM_SELECTOR",
                                                "listObjectId": "9y8laz3f98tbwad9hve2avogq"
                                            },
                                            "datasourceId": "3fzcfwlp173oz755v7t0skco2"
                                        },
                                        "fieldId": "c_ae5thofvvh7gzshng2ygshk66",
                                        "dataType": "text"
                                    },
                                    "bindingType": "libraryProp"
                                },
                                ""
                            ]
                        },
                        "columns": {
                            "id": "9y8laz3f98tbwad9hve2avogq",
                            "type": "binding",
                            "source": {
                                "sort": null,
                                "type": "data",
                                "source": null,
                                "tableId": "t_ccc6yakei11d4lndybezm5b0a",
                                "dataType": "list",
                                "datasourceId": "3fzcfwlp173oz755v7t0skco2"
                            },
                            "options": {},
                            "bindingType": "libraryProp"
                        }
                    },
                    "libraryName": "customcomponents",
                    "positioning": "fixedBottom",
                    "responsivity": {
                        "verticalScaling": "FIXED",
                        "horizontalScaling": "SCALES_WITH_PARENT",
                        "verticalPositioning": "TOP",
                        "horizontalPositioning": "CENTER"
                    },
                    "componentName": "Table",
                    "initialDevice": "desktop",
                    "libraryVersion": "dev"
                },
                {
                    "x": 1456,
                    "y": 51,
                    "id": "e4d7jdrtp0oh497hv8bysvl38",
                    "name": "ContextualMenu",
                    "type": "libraryComponent",
                    "width": 40,
                    "height": 40,
                    "hidden": false,
                    "opacity": 1,
                    "children": [],
                    "attributes": {
                        "fifthMenuItem": {
                            "icon": "arrow-back",
                            "text": "",
                            "enabled": false,
                            "hasDivider": false
                        },
                        "firstMenuItem": {
                            "icon": "edit",
                            "text": "Edit",
                            "enabled": true,
                            "hasDivider": false
                        },
                        "sixthMenuItem": {
                            "icon": "arrow-back",
                            "text": "",
                            "enabled": false,
                            "hasDivider": false
                        },
                        "thirdMenuItem": {
                            "icon": "arrow-back",
                            "text": "",
                            "enabled": false,
                            "hasDivider": false
                        },
                        "fourthMenuItem": {
                            "icon": "arrow-back",
                            "text": "",
                            "enabled": false,
                            "hasDivider": false
                        },
                        "secondMenuItem": {
                            "icon": "delete",
                            "text": "Delete",
                            "enabled": true,
                            "hasDivider": false
                        }
                    },
                    "libraryName": "customcomponents",
                    "positioning": "fixedTop",
                    "responsivity": {
                        "verticalScaling": "FIXED",
                        "horizontalScaling": "SCALES_WITH_PARENT",
                        "verticalPositioning": "TOP",
                        "horizontalPositioning": "CENTER"
                    },
                    "componentName": "ContextualMenu",
                    "initialDevice": "desktop",
                    "libraryVersion": "dev"
                },
                {
                    "x": 90,
                    "y": 62,
                    "id": "74xyfaa55ej29j7nu7y7utin6",
                    "name": null,
                    "text": [
                        "",
                        {
                            "id": "0ym3lufn8hs37silzvhlzm7om",
                            "type": "binding",
                            "label": "Field",
                            "source": {
                                "type": "field",
                                "source": {
                                    "type": "data",
                                    "source": null,
                                    "tableId": "t_0b4f2eea7e3d4abb83c6a92a1e787a1e",
                                    "dataType": "object",
                                    "selector": {
                                        "type": "CURRENT_USER_SELECTOR"
                                    },
                                    "datasourceId": "3fzcfwlp173oz755v7t0skco2"
                                },
                                "fieldId": "c_4z6h1zlpqvk9il1oqkzqmpd7l",
                                "dataType": "text"
                            },
                            "bindingType": "libraryProp"
                        },
                        ""
                    ],
                    "type": "label",
                    "color": "@text",
                    "width": 343,
                    "height": 19,
                    "hidden": false,
                    "opacity": 1,
                    "children": [],
                    "fontSize": 16,
                    "autoWidth": false,
                    "fontStyle": "normal",
                    "maxLength": null,
                    "multiline": true,
                    "fontFamily": "@body",
                    "fontWeight": 500,
                    "layoutText": [
                        "Field"
                    ],
                    "selectable": false,
                    "positioning": "fixedTop",
                    "responsivity": {
                        "verticalScaling": "FIXED",
                        "horizontalScaling": "SCALES_WITH_PARENT",
                        "verticalPositioning": "TOP",
                        "horizontalPositioning": "CENTER"
                    },
                    "initialDevice": "desktop",
                    "textAlignment": "left"
                }
            ],
            "onVisit": {
                "type": "actionRef",
                "actionId": "039j83u8kk3r21dobmt9k0sqy"
            },
            "opacity": 1,
            "pushGraph": {
                "edges": [
                    {
                        "distance": 11,
                        "endNodeId": "74xyfaa55ej29j7nu7y7utin6",
                        "startNodeId": "buffer_74xyfaa55ej29j7nu7y7utin6"
                    },
                    {
                        "distance": 42,
                        "endNodeId": "cw7c7c9eicgudmxykwcqrq9zc",
                        "startNodeId": "e4d7jdrtp0oh497hv8bysvl38"
                    },
                    {
                        "distance": 42,
                        "endNodeId": "cw7c7c9eicgudmxykwcqrq9zc",
                        "startNodeId": "74xyfaa55ej29j7nu7y7utin6"
                    }
                ],
                "nodeIds": [
                    "e4d7jdrtp0oh497hv8bysvl38",
                    "buffer_74xyfaa55ej29j7nu7y7utin6",
                    "74xyfaa55ej29j7nu7y7utin6",
                    "cw7c7c9eicgudmxykwcqrq9zc"
                ]
            },
            "positioning": null,
            "bindingsHash": "fcb30d9f4fbdf1b99caa0384491cb086831a2009",
            "dataBindings": {
                "0ym3lufn8hs37silzvhlzm7om": {
                    "id": "0ym3lufn8hs37silzvhlzm7om",
                    "type": "binding",
                    "label": "Field",
                    "source": {
                        "type": "field",
                        "source": {
                            "type": "data",
                            "source": null,
                            "tableId": "t_0b4f2eea7e3d4abb83c6a92a1e787a1e",
                            "dataType": "object",
                            "selector": {
                                "type": "CURRENT_USER_SELECTOR"
                            },
                            "datasourceId": "3fzcfwlp173oz755v7t0skco2"
                        },
                        "fieldId": "c_4z6h1zlpqvk9il1oqkzqmpd7l",
                        "dataType": "text"
                    },
                    "bindingType": "libraryProp",
                    "childBindings": [],
                    "siblingBindings": [
                        "c51km0f48ovralxlspuden2sd",
                        "9y8laz3f98tbwad9hve2avogq"
                    ]
                },
                "1zonywx8nhq6vsx94qtnk8t09": {
                    "id": "1zonywx8nhq6vsx94qtnk8t09",
                    "type": "binding",
                    "label": "Property",
                    "source": {
                        "type": "field",
                        "source": {
                            "type": "data",
                            "source": null,
                            "tableId": "t_ccc6yakei11d4lndybezm5b0a",
                            "dataType": "object",
                            "selector": {
                                "type": "LIST_ITEM_SELECTOR",
                                "listObjectId": "9y8laz3f98tbwad9hve2avogq"
                            },
                            "datasourceId": "3fzcfwlp173oz755v7t0skco2"
                        },
                        "fieldId": "c_8krpb1xlldb3gv7gjwrrfe9no",
                        "dataType": "text"
                    },
                    "bindingType": "libraryProp",
                    "childBindings": [],
                    "siblingBindings": [
                        "55ynw0puglxgo3kzo4qq760q6"
                    ]
                },
                "55ynw0puglxgo3kzo4qq760q6": {
                    "id": "55ynw0puglxgo3kzo4qq760q6",
                    "type": "binding",
                    "label": "Name",
                    "source": {
                        "type": "field",
                        "source": {
                            "type": "data",
                            "source": null,
                            "tableId": "t_ccc6yakei11d4lndybezm5b0a",
                            "dataType": "object",
                            "selector": {
                                "type": "LIST_ITEM_SELECTOR",
                                "listObjectId": "9y8laz3f98tbwad9hve2avogq"
                            },
                            "datasourceId": "3fzcfwlp173oz755v7t0skco2"
                        },
                        "fieldId": "c_ae5thofvvh7gzshng2ygshk66",
                        "dataType": "text"
                    },
                    "bindingType": "libraryProp",
                    "childBindings": [],
                    "siblingBindings": [
                        "1zonywx8nhq6vsx94qtnk8t09"
                    ]
                },
                "9y8laz3f98tbwad9hve2avogq": {
                    "id": "9y8laz3f98tbwad9hve2avogq",
                    "type": "binding",
                    "source": {
                        "sort": null,
                        "type": "data",
                        "source": null,
                        "tableId": "t_ccc6yakei11d4lndybezm5b0a",
                        "dataType": "list",
                        "datasourceId": "3fzcfwlp173oz755v7t0skco2"
                    },
                    "options": {},
                    "bindingType": "libraryProp",
                    "childBindings": [
                        "1zonywx8nhq6vsx94qtnk8t09",
                        "55ynw0puglxgo3kzo4qq760q6"
                    ],
                    "siblingBindings": [
                        "c51km0f48ovralxlspuden2sd",
                        "0ym3lufn8hs37silzvhlzm7om"
                    ]
                },
                "c51km0f48ovralxlspuden2sd": {
                    "id": "c51km0f48ovralxlspuden2sd",
                    "type": "binding",
                    "source": {
                        "sort": {
                            "type": "text",
                            "fieldId": "email",
                            "direction": "asc"
                        },
                        "type": "data",
                        "source": null,
                        "tableId": "t_0b4f2eea7e3d4abb83c6a92a1e787a1e",
                        "dataType": "list",
                        "datasourceId": "3fzcfwlp173oz755v7t0skco2"
                    },
                    "options": {},
                    "bindingType": "libraryProp",
                    "childBindings": [],
                    "siblingBindings": [
                        "9y8laz3f98tbwad9hve2avogq",
                        "0ym3lufn8hs37silzvhlzm7om"
                    ]
                }
            },
            "inputActions": {},
            "layoutVersion": "0.3",
            "reverseScroll": false,
            "statusBarStyle": "dark",
            "backgroundColor": "@background",
            "componentActions": {
                "039j83u8kk3r21dobmt9k0sqy": {
                    "type": "action",
                    "actions": [
                        {
                            "id": "7345bq5twqrsek890wc3zi7h8",
                            "options": {},
                            "actionType": "notificationPermission"
                        }
                    ],
                    "eventType": "tap",
                    "useInstantNavigation": true
                }
            },
            "keyboardBehavior": "default"
        }
    },
    "visibility": false,
    "magicLayout": true,
    "webSettings": {
        "previewType": "web",
        "showAddToHomeScreen": false,
        "showAdaloAttribution": true
    },
    "Organization": {
        "id": 19683,
        "name": "Frank LIBOLT’s Team",
        "planType": "free",
        "billingCycle": "monthly",
        "billingType": null,
        "discountAmount": null,
        "trialEndDate": "2020-04-30T19:22:58.638Z",
        "active": false,
        "stripeCustomerId": "cus_H6TmG119wZMnpa",
        "stripePublishedApps": 0,
        "uniqueUserCount": 88,
        "totalUserCount": 93,
        "subdomain": "frank-libolts-team",
        "rewardfulToken": "e6ee3712-60b1-4616-bb72-ce88cd3e62ba",
        "seenEndIntegrationTrial": true,
        "billingStartDate": "2020-12-19T10:32:52.000Z",
        "createdAt": "2020-04-15T19:22:58.639Z",
        "updatedAt": "2024-02-09T15:45:54.788Z",
        "enabledFeatures": [],
        "planFeatures": [],
        "trialState": {
            "canStartTrial": false,
            "isTrialActive": false,
            "trialStartTimestamp": 1706274037702,
            "trialEndTimestamp": 1707483637702,
            "canExtendTrial": true
        },
        "billing": null,
        "limits": {
            "actions": 1000,
            "testApps": 1000000000,
            "publishedApps": 0,
            "seats": 1
        }
    },
    "showBranding": true,
    "librariesUsed": [
        "customcomponents"
    ],
    "OrganizationId": 19683,
    "componentsUsed": {
        "customcomponents": [
            "Table",
            "ContextualMenu"
        ]
    },
    "libraryGlobals": {
        "customcomponents": {
            "Table": {},
            "ContextualMenu": {}
        },
        "@adalo/navigation": {
            "NavigationBar": {}
        }
    },
    "authComponentId": "998942e43ce445e7a8ed43cc51862f42",
    "primaryPlatform": "responsive",
    "launchComponentId": "998942e43ce445e7a8ed43cc51862f42",
    "builtWithFreelancer": false,
    "libraryComponentManifests": {
        "iap": {},
        "lottie": {},
        "switch": {},
        "countdown": {},
        "@adalo/ads": {},
        "plyr-video": {},
        "randomizer": {},
        "markdownLib": {},
        "star-rating": {},
        "viewmorelib": {},
        "apple-signin": {},
        "friendly-url": {},
        "image-slider": {},
        "progress-bar": {},
        "range-slider": {},
        "iaphub-public": {},
        "calendar-strip": {},
        "google-signin2": {},
        "email-validator": {},
        "qr-code-scanner": {},
        "signature-phone": {},
        "customcomponents": {
            "Table": {
                "icon": "./example-thumbnail.png",
                "name": "Table",
                "props": [
                    {
                        "name": "columns",
                        "type": "list",
                        "displayName": "Columns"
                    },
                    {
                        "name": "rows",
                        "type": "list",
                        "displayName": "Rows"
                    }
                ],
                "resizeX": true,
                "resizeY": true,
                "displayName": "Table",
                "defaultWidth": 600,
                "defaultHeight": 400,
                "childComponents": [
                    {
                        "name": "column",
                        "role": "listItem",
                        "props": [
                            {
                                "name": "field",
                                "type": "text",
                                "displayName": "Field"
                            },
                            {
                                "name": "headerName",
                                "type": "text",
                                "displayName": "Header Name Field"
                            }
                        ],
                        "reference": "columns"
                    }
                ]
            },
            "ContextualMenu": {
                "icon": "./example-thumbnail.png",
                "name": "ContextualMenu",
                "props": [],
                "resizeX": false,
                "resizeY": false,
                "displayName": "ContextualMenu",
                "defaultWidth": 40,
                "defaultHeight": 40,
                "childComponents": [
                    {
                        "name": "firstMenuItem",
                        "props": [
                            {
                                "name": "enabled",
                                "type": "boolean",
                                "default": true
                            },
                            {
                                "name": "icon",
                                "type": "icon",
                                "default": "edit",
                                "displayName": "Icon"
                            },
                            {
                                "name": "text",
                                "type": "text",
                                "default": "Edit",
                                "displayName": "Text"
                            },
                            {
                                "name": "hasDivider",
                                "type": "boolean",
                                "default": false,
                                "displayName": "Separator"
                            },
                            {
                                "name": "action",
                                "type": "action",
                                "arguments": [],
                                "displayName": "Action"
                            }
                        ],
                        "displayName": "First menu item"
                    },
                    {
                        "name": "secondMenuItem",
                        "props": [
                            {
                                "name": "enabled",
                                "type": "boolean",
                                "default": true
                            },
                            {
                                "name": "icon",
                                "type": "icon",
                                "default": "delete",
                                "displayName": "Icon"
                            },
                            {
                                "name": "text",
                                "type": "text",
                                "default": "Delete",
                                "displayName": "Text"
                            },
                            {
                                "name": "hasDivider",
                                "type": "boolean",
                                "default": false,
                                "displayName": "Separator"
                            },
                            {
                                "name": "action",
                                "type": "action",
                                "arguments": [],
                                "displayName": "Action"
                            }
                        ],
                        "displayName": "Second menu item"
                    },
                    {
                        "name": "thirdMenuItem",
                        "props": [
                            {
                                "name": "enabled",
                                "type": "boolean",
                                "default": false
                            },
                            {
                                "name": "icon",
                                "type": "icon",
                                "default": "arrow-back",
                                "displayName": "Icon"
                            },
                            {
                                "name": "text",
                                "type": "text",
                                "default": "",
                                "displayName": "Text"
                            },
                            {
                                "name": "hasDivider",
                                "type": "boolean",
                                "default": false,
                                "displayName": "Separator"
                            },
                            {
                                "name": "action",
                                "type": "action",
                                "arguments": [],
                                "displayName": "Action"
                            }
                        ],
                        "displayName": "Third menu item"
                    },
                    {
                        "name": "fourthMenuItem",
                        "props": [
                            {
                                "name": "enabled",
                                "type": "boolean",
                                "default": false
                            },
                            {
                                "name": "icon",
                                "type": "icon",
                                "default": "arrow-back",
                                "displayName": "Icon"
                            },
                            {
                                "name": "text",
                                "type": "text",
                                "default": "",
                                "displayName": "Text"
                            },
                            {
                                "name": "hasDivider",
                                "type": "boolean",
                                "default": false,
                                "displayName": "Separator"
                            },
                            {
                                "name": "action",
                                "type": "action",
                                "arguments": [],
                                "displayName": "Action"
                            }
                        ],
                        "displayName": "Fourth menu item"
                    },
                    {
                        "name": "fifthMenuItem",
                        "props": [
                            {
                                "name": "enabled",
                                "type": "boolean",
                                "default": false
                            },
                            {
                                "name": "icon",
                                "type": "icon",
                                "default": "arrow-back",
                                "displayName": "Icon"
                            },
                            {
                                "name": "text",
                                "type": "text",
                                "default": "",
                                "displayName": "Text"
                            },
                            {
                                "name": "hasDivider",
                                "type": "boolean",
                                "default": false,
                                "displayName": "Separator"
                            },
                            {
                                "name": "action",
                                "type": "action",
                                "arguments": [],
                                "displayName": "Action"
                            }
                        ],
                        "displayName": "Fifth menu item"
                    },
                    {
                        "name": "sixthMenuItem",
                        "props": [
                            {
                                "name": "enabled",
                                "type": "boolean",
                                "default": false
                            },
                            {
                                "name": "icon",
                                "type": "icon",
                                "default": "arrow-back",
                                "displayName": "Icon"
                            },
                            {
                                "name": "text",
                                "type": "text",
                                "default": "",
                                "displayName": "Text"
                            },
                            {
                                "name": "hasDivider",
                                "type": "boolean",
                                "default": false,
                                "displayName": "Separator"
                            },
                            {
                                "name": "action",
                                "type": "action",
                                "arguments": [],
                                "displayName": "Action"
                            }
                        ],
                        "displayName": "Sixth menu item"
                    }
                ]
            }
        },
        "dynamic-calendar": {},
        "switch-component": {},
        "@adalo/navigation": {},
        "@adalo/stripe-kit": {},
        "progress-bars-kit": {},
        "signature-library": {},
        "@adalo/audio-player": {},
        "clicksend-sms-adalo": {},
        "minimal-deck-swiper": {},
        "rectangle-component": {},
        "multiselect-dropdown": {},
        "nocoderhq-html-renderer": {},
        "@protonapp/map-component": {},
        "nocoderhq-qrcode-generator": {},
        "@protonapp/stripe-component": {},
        "@protonapp/youtube-component": {},
        "@protonapp/barchart-component": {},
        "@protonapp/material-components": {}
    },
    "datasources": {
        "3fzcfwlp173oz755v7t0skco2": {
            "auth": {
                "table": "t_0b4f2eea7e3d4abb83c6a92a1e787a1e"
            },
            "type": "apto-backend",
            "tables": {
                "t_ccc6yakei11d4lndybezm5b0a": {
                    "name": "Columns",
                    "fields": {
                        "c_8krpb1xlldb3gv7gjwrrfe9no": {
                            "name": "Property",
                            "type": "text"
                        },
                        "c_ae5thofvvh7gzshng2ygshk66": {
                            "name": "Name",
                            "type": "text",
                            "isPrimaryField": true
                        }
                    },
                    "tableId": "t_ccc6yakei11d4lndybezm5b0a",
                    "orderedFields": [
                        "c_ae5thofvvh7gzshng2ygshk66",
                        "c_8krpb1xlldb3gv7gjwrrfe9no"
                    ]
                },
                "t_0b4f2eea7e3d4abb83c6a92a1e787a1e": {
                    "name": "Users",
                    "fields": {
                        "email": {
                            "name": "Email",
                            "type": "text",
                            "locked": true,
                            "required": false,
                            "isPrimaryField": true
                        },
                        "password": {
                            "name": "Password",
                            "type": "password",
                            "locked": true,
                            "required": false
                        },
                        "username": {
                            "name": "Username",
                            "type": "text",
                            "locked": true,
                            "required": false
                        },
                        "full_name": {
                            "name": "Full Name",
                            "type": "text",
                            "locked": true,
                            "required": false
                        },
                        "temporary_password": {
                            "name": "Temporary Password",
                            "type": "password",
                            "locked": true,
                            "required": false
                        },
                        "c_4z6h1zlpqvk9il1oqkzqmpd7l": {
                            "name": "Field",
                            "type": "text"
                        },
                        "temporary_password_expires_at": {
                            "name": "Temporary Password Expiration",
                            "type": "date",
                            "locked": true,
                            "required": false
                        }
                    },
                    "tableId": "t_0b4f2eea7e3d4abb83c6a92a1e787a1e",
                    "orderedFields": [
                        "email",
                        "password",
                        "username",
                        "full_name",
                        "c_4z6h1zlpqvk9il1oqkzqmpd7l"
                    ]
                }
            }
        }
    },
    "associatedApps": []
}
 */

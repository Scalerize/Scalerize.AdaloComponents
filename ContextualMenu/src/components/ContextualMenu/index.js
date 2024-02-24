import React, {useState} from 'react';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import * as DynamicIcon from "@mui/icons-material";
import Divider from '@mui/material/Divider'
import {report} from "../../utils";

const divStyle = {
    width: '100%',
    height: '100%'
}
const ContextualMenu = (props) => {
    const menuItems = Object.keys(props)
        .filter(x => x.endsWith('MenuItem'))
        .map(x => props[x])
        .filter(x => !!x?.enabled);

    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = (action) => {
        setAnchorEl(null);
        if (typeof (action) === 'function') {
            action();
        }
    };

    const upperFirst = (str) => {
        return str.slice(0, 1).toUpperCase() + str.slice(1, str.length);
    }

    const fixIconNames = (str) => {
        let baseIconName = str.split(/[-_]/gm).map(upperFirst).join('');
        let map = {
            'AddCall': 'AddIcCall',
            '360': 'ThreeSixty',
            '5G': 'FiveG',
            '3dRotation': 'ThreeDRotation',
            '13mp': 'ThirteenMp',
            //TODO : Add all Mp variants + all icons starting with numbers
        };
        return map[baseIconName] || baseIconName;
    }

    return (
        <div style={divStyle}>
            <IconButton
                id="basic-button"
                aria-controls={open ? 'basic-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                onClick={handleClick}
            >
                <MoreVertIcon onClick={handleClick}></MoreVertIcon>
            </IconButton>
            <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                    'aria-labelledby': 'basic-button',
                }}
            >{menuItems.flatMap(x => {
                    const Icon = !!x.icon
                        ? DynamicIcon[fixIconNames(x.icon)]
                        : undefined;

                    if (!!x.icon && !Icon) {
                        report({
                            'component': 'contextual-menu',
                            'missing-icon': x.icon
                        });
                    }

                    let elements = [
                        <MenuItem onClick={() => handleClose(x.action)}>
                            {Icon
                                ? (<ListItemIcon>
                                    <Icon fontSize="small"/>
                                </ListItemIcon>)
                                : ''}
                            <ListItemText>{x.text}</ListItemText>
                        </MenuItem>
                    ];
                    if (x.hasDivider) {
                        elements.push(<Divider></Divider>)
                    }
                    return elements;
                }
            )}
            </Menu>
        </div>

    );

};

export default ContextualMenu;

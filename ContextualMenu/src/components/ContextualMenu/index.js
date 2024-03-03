import {useState} from 'react';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import Divider from '@mui/material/Divider'
import {View} from 'react-native';
import {MaterialIcons} from '@expo/vector-icons';

const divStyle = {
    width: '100%',
    height: '100%'
}
const ContextMenu = (props) => {
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
 
    return (
        <View style={divStyle}>
            <MaterialIcons
                onClick={handleClick} name="more-vert" color={props.color}/>
            {/* TODO: replace menu */}
            <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
            >

                {/* TODO: replace menuItem */}
                {menuItems.flatMap(x => {
                    let elements = [
                        <MenuItem onClick={() => handleClose(x.action)}>
                            {/* TODO: replace listItemIcon */}
                            {x.icon
                                ? (<ListItemIcon>
                                    <MaterialIcons name={x.icon} fontSize="small"/>
                                </ListItemIcon>)
                                : <></>}
                            <ListItemText>{x.text}</ListItemText>
                        </MenuItem>
                    ];
                    if (x.hasDivider) {
                        {/* TODO: replace divider */}
                        elements.push(<Divider></Divider>)
                    }
                    return elements;
                }
            )}
            </Menu>
        </View>

    );

};

export default ContextMenu;

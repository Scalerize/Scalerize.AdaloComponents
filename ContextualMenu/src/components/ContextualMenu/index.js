import {useState} from 'react';
import {View, StyleSheet} from 'react-native';
import {
    IconButton,
    Divider,
    Menu
} from 'react-native-paper';

const ContextMenu = (props) => {
    const menuItems = Object.keys(props)
        .filter(x => x.endsWith('MenuItem'))
        .map(x => props[x])
        .filter(x => !!x?.enabled);

    const [open, setOpen] = useState(false);
    const handleClick = () => {
        setOpen(true);
    };
    const handleClose = (action) => {
        setOpen(false);
        if (typeof (action) === 'function') {
            action();
        }
    };
    const style = StyleSheet.create({
        div: {
            width: '100%',
            height: '100%'
        }
    });

    return (
        <View style={style.div}>
            <Menu
                visible={open}
                onDismiss={handleClose}
                anchor={
                    <IconButton
                        onClick={handleClick} icon="more-vert" iconColor={props.color}/>
                }
            >
                {menuItems.flatMap(x => {
                        var props = {
                            leadingIcon: x.icon || undefined,
                            title: x.text || undefined
                        };
                        let elements = [
                            <Menu.Item onClick={() => handleClose(x.action)} {...props}/>
                        ];
                        if (x.hasDivider) {
                            elements.push(<Divider/>)
                        }
                        return elements;
                    }
                )}
            </Menu>
        </View>

    );

};

export default ContextMenu;

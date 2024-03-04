import {useState} from 'react';
import {View, StyleSheet, Platform} from 'react-native';
import {
    IconButton,
    Divider,
    Menu,
    PaperProvider
} from 'react-native-paper';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import materialIconPath from 'react-native-vector-icons/Fonts/MaterialIcons.ttf';

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

    return <PaperProvider settings={{icon: props => <MaterialIcons {...props} />}}>
        {Platform.OS === 'web'
            ? <style type="text/css">{`
                    @font-face {
                      font-family: 'MaterialIcons';
                      src: url(${materialIconPath}) format('truetype');
                    }
                  `}</style>
            : null}
        <View style={style.div}>
            <Menu
                visible={open}
                onDismiss={handleClose}
                anchor={<IconButton onPress={handleClick} icon="more-vert" iconColor={props.color}/>}
                anchorPosition="bottom"
            >
                {menuItems.flatMap(x => {
                        var props = {
                            leadingIcon: x.icon || undefined,
                            title: x.text || undefined
                        };
                        // TODO: bad positioning of elements + use material 2 instead of 3
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
    </PaperProvider>;

};

export default ContextMenu;

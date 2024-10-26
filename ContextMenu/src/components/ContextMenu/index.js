import React, {useState, useEffect} from 'react';
import {View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const ContextMenu = (props) => {
    const [menuVisible, setMenuVisible] = useState(false);
    const [offset, setOffset] = useState({x: 0, y: 0});

    const handleLayout = (event) => {
        const {x, y} = event.nativeEvent.layout;
        setOffset({x, y});
    };

    const toggleMenu = () => {
        setMenuVisible(!menuVisible);
    };

    const closeMenu = () => {
        setMenuVisible(false);
    };

    const handleMenuItemPress = (action) => {
        setMenuVisible(false);
        if (action && typeof action === 'function') {
            action();
        }
    };

    const iconName = props.icon?.iconName || 'menu';
    const iconColor = props.icon?.iconColor || '#000000';
    const iconSize = props.icon?.iconSize || 24;
    
    const isEditor = props.editor || false;
    const showMenuOnEditor = isEditor &&
        (props.openAccordion === 'root' || props.openAccordion?.startsWith('menuItem'));

    const dynamicStyles = StyleSheet.create({
        menuContainer: {
            ...styles.menuContainer,
            position: isEditor ? 'fixed' : 'absolute',
            backgroundColor: props.backgroundColor || '#FFFFFF',
            borderRadius: props.menuBorderRadius !== undefined ? props.menuBorderRadius : 5,
            shadowColor: props.menuShadowColor || '#000000',
            shadowOpacity:
                props.menuShadowOpacity !== undefined ? (props.menuShadowOpacity / 100) : 0.1,
        },
        overlay: {
            ...styles.overlay,
            transform: [
                {translateX: offset.x},
                {translateY: offset.y},
            ],
        },
        menuItemText: {
            ...styles.menuItemText,
            color: props.textColor || '#000000'
        },
    });

    const menuItems = [];
    for (let i = 1; i <= 5; i++) {
        const item = props[`menuItem${i}`];
        if (item && item.label && item.enabled) {
            menuItems.push(item);
        }
    }


    if(isEditor) {
        useEffect(() => {
            const style = document.createElement('style');
            style.innerHTML = `
          foreignObject:has(.context-menu-fixed-container) {
            overflow: visible !important;
          }
          
          .context-menu-fixed-container {
            z-index: 1000;
            margin-top: ${iconSize}px !important;
          }
        `;
            document.head.appendChild(style);
            return () => {
                document.head.removeChild(style);
            };
        }, []);
    }
    
    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={toggleMenu}>
                <Icon name={iconName} size={iconSize} color={iconColor}/>
            </TouchableOpacity>
            {(menuVisible || showMenuOnEditor) && (
                <>
                    {!isEditor && <TouchableOpacity
                        style={dynamicStyles.overlay}
                        onLayout={handleLayout}
                        activeOpacity={1}
                        onPress={closeMenu}
                    /> }
                    <View style={dynamicStyles.menuContainer} className="context-menu-fixed-container">
                        {menuItems
                            .map((item, index) => (
                            <TouchableOpacity
                                key={index}
                                style={styles.menuItem}
                                onPress={() => !isEditor && handleMenuItemPress(item.action)}
                            >
                                {item.iconName && (
                                    <Icon
                                        name={item.iconName}
                                        size={20}
                                        color={
                                            item.iconColor || props.textColor || '#000000'
                                        }
                                        style={styles.menuItemIcon}
                                    />
                                )}
                                <Text
                                    style={dynamicStyles.menuItemText}
                                    numberOfLines={1}
                                    ellipsizeMode="tail"
                                >
                                    {item.label}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'relative',
    },
    overlay: {
        position: 'fixed',
        inset: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 999,
    },
    menuContainer: {
        top: 50,
        right: 0,
        backgroundColor: '#FFFFFF',
        borderRadius: 5,
        shadowRadius: 5,
        shadowOffset: {width: 0, height: 2},
        zIndex: 1000,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
    },
    menuItemIcon: {
        marginRight: 10,
    },
    menuItemText: {
        fontSize: 16,
        flexShrink: 1,
    }
});

export default ContextMenu;

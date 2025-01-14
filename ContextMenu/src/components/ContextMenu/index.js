import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  TouchableWithoutFeedback,
  Platform
} from 'react-native';
 
const Icon = Platform.select({
  web: () => require('react-native-vector-icons/MaterialIcons').default,
  default:() => require('@react-native-vector-icons/material-design-icons').default,
});
const spacing = 10;


const ContextMenu = props => {
  console.log(props);
  const [menuVisible, setMenuVisible] = useState(false);
  const [iconLayout, setIconLayout] = useState(null);
  const iconRef = useRef(null);

  const measureIcon = () => {
    iconRef.current?.measure((x, y, width, height, pageX, pageY) => {
      setIconLayout({pageX, pageY, width, height});
    });
  };

  const toggleMenu = () => {
    measureIcon();
    setMenuVisible(!menuVisible);
  };

  const closeMenu = () => {
    setMenuVisible(false);
  };

  const handleMenuItemPress = action => {
    setMenuVisible(false);
    if (action && typeof action === 'function') {
      action();
    }
  };

  const iconName = props.icon?.iconName || 'menu';
  const iconColor = props.icon?.iconColor || '#000000';
  const iconSize = props.icon?.iconSize || 24;

  const isEditor = props.editor || false;
  const showMenuOnEditor =
    isEditor &&
    (props.openAccordion === 'root' ||
      props.openAccordion?.startsWith('menuItem'));

  const dynamicStyles = StyleSheet.create({
    menuContainer: {
      ...styles.menuContainer,
      position: isEditor ? 'fixed' : 'absolute',
      backgroundColor: props.backgroundColor || '#FFFFFF',
      borderRadius:
        props.menuBorderRadius !== undefined ? props.menuBorderRadius : 5,
      shadowColor: props.menuShadowColor || '#000000',
      shadowOpacity:
        props.menuShadowOpacity !== undefined
          ? props.menuShadowOpacity / 100
          : 0.1,
      transform: [
        {translateX: iconLayout?.pageX || 0},
        {translateY: (iconLayout?.pageY + iconLayout?.height + spacing) || 0},
      ],
    },
    menuItemText: {
      ...styles.menuItemText,
      color: props.textColor || '#000000',
    },
  });

  const menuItems = [];
  for (let i = 1; i <= 5; i++) {
    const item = props[`menuItem${i}`];
    if (item && item.label && item.enabled) {
      menuItems.push(item);
    }
  }

  if (isEditor) {
    useEffect(() => {
      const style = document.createElement('style');
      style.innerHTML = `
          foreignObject:has(.context-menu-fixed-container) {
            overflow: visible !important;
          }
          
          .context-menu-fixed-container {
            z-index: 1000;
            margin-top: calc(${iconSize}px + 10px) !important;
            right: 20px;
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
      <TouchableOpacity
        ref={iconRef}
        onPress={toggleMenu}
        onLayout={() => measureIcon()}>
        <Icon name={iconName} size={iconSize} color={iconColor} />
      </TouchableOpacity>
      <Modal
        visible={showMenuOnEditor || menuVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={closeMenu}>
        {!isEditor && (
          <TouchableWithoutFeedback onPress={closeMenu} style={styles.overlay}>
            <View style={styles.overlay} />
          </TouchableWithoutFeedback>
        )}
        <View
          style={dynamicStyles.menuContainer}
          className="context-menu-fixed-container">
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.menuItem}
              onPress={() => !isEditor && handleMenuItemPress(item.action)}>
              {item.iconName && (
                <Icon
                  name={item.iconName}
                  size={20}
                  color={item.iconColor || props.textColor || '#000000'}
                  style={styles.menuItemIcon}
                />
              )}
              <Text style={dynamicStyles.menuItemText} numberOfLines={1}>
                {item.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  overlay: {
    position: 'absolute',
    inset: 0
  },
  menuContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 5,
    shadowRadius: 5,
    shadowOffset: {width: 0, height: 2},
    zIndex: 1000,
    position: 'absolute',
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
  },
});

export default ContextMenu;

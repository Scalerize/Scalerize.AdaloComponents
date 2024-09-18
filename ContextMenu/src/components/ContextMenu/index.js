import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const ContextMenu = (props) => {
	const [menuVisible, setMenuVisible] = useState(false);

	const toggleMenu = () => {
		setMenuVisible(!menuVisible);
	};

	const handleMenuItemPress = (action) => {
		setMenuVisible(false);
		if (action && typeof action === 'function') {
			action();
		}
	};

	// Props du déclencheur
	const iconName = props.iconName || 'menu';
	const iconColor = props.iconColor || '#000000';
	const iconSize = props.iconSize || 24;

	// Styles dynamiques basés sur les props
	const dynamicStyles = StyleSheet.create({
		menuContainer: {
			...styles.menuContainer,
			backgroundColor: props.backgroundColor || '#FFFFFF',
		},
		menuItemText: {
			...styles.menuItemText,
			color: props.textColor || '#000000',
		},
	});

	// Récupération des éléments du menu avec leurs icônes
	const menuItems = [];
	for (let i = 1; i <= 5; i++) {
		const item = props[`menuItem${i}`];
		if (item && item.label) {
			menuItems.push(item);
		}
	}

	return (
		<View style={styles.container}>
			<TouchableOpacity onPress={toggleMenu}>
				<Icon name={iconName} size={iconSize} color={iconColor} />
			</TouchableOpacity>
			{menuVisible && (
				<View style={dynamicStyles.menuContainer}>
					{menuItems.map((item, index) => (
						<TouchableOpacity
							key={index}
							style={styles.menuItem}
							onPress={() => handleMenuItemPress(item.action)}
						>
							{item.iconName && (
								<Icon
									name={item.iconName}
									size={20}
									color={item.iconColor || props.textColor || '#000000'}
									style={styles.menuItemIcon}
								/>
							)}
							<Text style={dynamicStyles.menuItemText}>{item.label}</Text>
						</TouchableOpacity>
					))}
				</View>
			)}
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		position: 'relative',
	},
	menuContainer: {
		position: 'absolute',
		top: Platform.OS === 'web' ? '100%' : 50,
		left: 0,
		backgroundColor: '#FFFFFF',
		borderRadius: 5,
		shadowColor: '#000',
		shadowOpacity: 0.1,
		shadowRadius: 5,
		shadowOffset: { width: 0, height: 2 },
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
	},
});

export default ContextMenu;

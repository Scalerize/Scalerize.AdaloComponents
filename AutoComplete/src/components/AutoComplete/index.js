import React, { useState } from 'react';
import { View, TextInput, FlatList, Text, TouchableOpacity, StyleSheet } from 'react-native';

const AutoComplete = ({ suggestions }) => {

};

const styles = StyleSheet.create({
	container: {
		padding: 16,
	},
	input: {
		height: 40,
		borderColor: '#ccc',
		borderWidth: 1,
		paddingHorizontal: 8,
		borderRadius: 5,
	},
	suggestion: {
		padding: 10,
		borderBottomWidth: 1,
		borderBottomColor: '#ccc',
	},
});

export default AutoComplete;

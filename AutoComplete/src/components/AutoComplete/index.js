import React, { useState } from 'react';
import { View, TextInput, FlatList, Text, TouchableOpacity, StyleSheet } from 'react-native';

const AutoComplete = ({ suggestions }) => {
	const [query, setQuery] = useState('');
	const [filteredSuggestions, setFilteredSuggestions] = useState([]);

	const handleInputChange = (text) => {
		setQuery(text);
		if (text.length > 0) {
			const filtered = suggestions.filter((suggestion) =>
				suggestion.toLowerCase().includes(text.toLowerCase())
			);
			setFilteredSuggestions(filtered);
		} else {
			setFilteredSuggestions([]);
		}
	};

	const handleSelectSuggestion = (suggestion) => {
		setQuery(suggestion);
		setFilteredSuggestions([]);
	};

	return (
		<View style={styles.container}>
			<TextInput
				style={styles.input}
				placeholder="Type something..."
				value={query}
				onChangeText={handleInputChange}
			/>
			{filteredSuggestions.length > 0 && (
				<FlatList
					data={filteredSuggestions}
					keyExtractor={(item, index) => index.toString()}
					renderItem={({ item }) => (
						<TouchableOpacity onPress={() => handleSelectSuggestion(item)}>
							<Text style={styles.suggestion}>{item}</Text>
						</TouchableOpacity>
					)}
				/>
			)}
		</View>
	);
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

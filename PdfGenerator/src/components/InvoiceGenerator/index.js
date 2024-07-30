import React from 'react'
import { Text, View, StyleSheet } from 'react-native'

// https://github.com/AdaloHQ/material-components-library/blob/main/src/TextButton/TextButton.js
const InvoiceGenerator = (props) => {
	const { color, text } = props

	return(
		<View style={styles.wrapper}>
			<Text style={{ color }}>{text}</Text>
		</View>
	)
}

const styles = StyleSheet.create({
	wrapper: {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
	}
})

export default InvoiceGenerator

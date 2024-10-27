// SuggestionBox.js
import React, {useState} from 'react';
import {
    View,
    TextInput,
    FlatList,
    TouchableOpacity,
    Text,
    Image,
    StyleSheet,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const AutoComplete = (props) => {
    const {
        editor,
        openAccordion,
        searchField,
        suggestionsOverlay,
        suggestion,
        leftElement,
        title,
        subtitle,
        rightButton,
    } = props;

    const [searchText, setSearchText] = useState('');
    const [isFocused, setIsFocused] = useState(false);

    const shouldDisplayOverlay =
        (editor &&
            openAccordion &&
            openAccordion !== 'searchField' &&
            openAccordion !== 'searchField' &&
            ['suggestionsOverlay', 'suggestion', 'leftElement', 'title', 'subtitle', 'rightButton'].includes(
                openAccordion
            )) ||
        (!editor && isFocused);

    return (
        <View>
            <View
                style={[
                    styles.searchField,
                    {
                        borderColor: searchField?.border?.borderColor,
                        borderWidth: searchField?.border?.borderWidth,
                        borderRadius: searchField?.borderRadius,
                        backgroundColor: searchField?.backgroundColor,
                        // Add shadow styles if enabled
                        ...(searchField?.shadow?.enabled ? getShadowStyle(searchField.shadow) : {}),
                    },
                ]}
            >
                {/* Left Icon */}
                {searchField?.leftIcon && (
                    <View style={styles.leftIcon}>
                        {/* Replace with your Icon component */}
                        <Icon name={searchField.leftIcon} size={24} color={searchField?.textColor}/>
                    </View>
                )}
                <TextInput
                    style={[styles.textInput, {color: searchField?.textColor}]}
                    placeholder="Search"
                    placeholderTextColor={searchField?.placeholderColor}
                    value={searchText}
                    onChangeText={setSearchText}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                />
            </View>

            {shouldDisplayOverlay && (
                <View
                    style={[
                        styles.suggestionsOverlay,
                        {
                            borderColor: suggestionsOverlay?.border?.borderColor,
                            borderWidth: suggestionsOverlay?.border?.borderWidth,
                            borderRadius: suggestionsOverlay?.borderRadius,
                            ...(suggestionsOverlay?.shadow?.enabled ? getShadowStyle(suggestionsOverlay.shadow) : {}),
                        },
                    ]}
                >
                    <FlatList
                        data={suggestionsOverlay?.suggestionsList}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={({item}) => (
                            <TouchableOpacity onPress={suggestion?.onSuggestionClick}>
                                <View style={styles.suggestionItem}>
                                    {leftElement?.enabled && (
                                        <View style={styles.leftElement}>
                                            {leftElement.type === 'icon' ? (
                                                <View style={{backgroundColor: leftElement?.backgroundColor}}>
                                                    <Icon name={leftElement.icon} size={24} color={leftElement.foregroundColor}/>
                                                </View>
                                            ) : (
                                                <Image source={{uri: leftElement.image}} style={styles.leftImage}/>
                                            )}
                                        </View>
                                    )}

                                    <View style={styles.textContainer}>
                                        <Text style={[styles.titleText, {color: title?.color}]}>
                                            {title?.content || item.title}
                                        </Text>
                                        {subtitle?.enabled && (
                                            <Text style={[styles.subtitleText, {color: subtitle?.color}]}>
                                                {subtitle?.content || item.subtitle}
                                            </Text>
                                        )}
                                    </View>

                                    {rightButton?.enabled && (
                                        <TouchableOpacity onPress={rightButton?.onClick} style={styles.rightButton}>
                                            {rightButton.type === 'icon' ? (
                                                <View
                                                    style={{
                                                        backgroundColor: rightButton?.backgroundColor,
                                                    }}
                                                >
                                                    <Icon
                                                        name={rightButton.icon}
                                                        size={24}
                                                        color={rightButton?.foregroundColor}
                                                    />
                                                </View>
                                            ) : (
                                                <Text
                                                    style={{
                                                        color: rightButton?.foregroundColor,
                                                        backgroundColor: rightButton?.backgroundColor,
                                                    }}
                                                >
                                                    {rightButton.text}
                                                </Text>
                                            )}
                                        </TouchableOpacity>
                                    )}
                                </View>
                            </TouchableOpacity>
                        )}
                    />
                </View>
            )}
        </View>
    );
};

const getShadowStyle = (shadow) => ({
    shadowColor: shadow.color || '#000',
    shadowOffset: {
        width: shadow.x || 0,
        height: shadow.y || 2,
    },
    shadowOpacity: shadow.size ? shadow.size / 10 : 0.2,
    shadowRadius: shadow.size || 4,
    elevation: shadow.size || 4, // For Android shadow
});

const styles = StyleSheet.create({
    searchField: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 8,
        height: 40,
        marginBottom: 10,
    },
    leftIcon: {
        marginRight: 8,
    },
    textInput: {
        flex: 1,
    },
    suggestionsOverlay: {
        maxHeight: 200,
        borderWidth: 1,
        backgroundColor: '#fff',
    },
    suggestionItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
    },
    leftElement: {
        marginRight: 10,
    },
    leftImage: {
        width: 24,
        height: 24,
    },
    textContainer: {
        flex: 1,
    },
    titleText: {
        fontSize: 16,
    },
    subtitleText: {
        fontSize: 12,
        color: '#666',
    },
    rightButton: {
        marginLeft: 10,
    },
});

export default AutoComplete;

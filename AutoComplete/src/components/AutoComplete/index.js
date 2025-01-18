// SuggestionBox.js
import React, {useState, useEffect} from 'react';
import {
    View,
    TextInput,
    FlatList,
    TouchableOpacity,
    Text,
    Image,
    StyleSheet,
} from 'react-native';
import Icon from '@react-native-vector-icons/material-icons';

const defaultFunctionGenerator = () => async () => { };

const AutoComplete = (props) => {
    const {
        editor,
        openAccordion,
        searchField,
        suggestionsList,
        suggestionsOverlay
    } = props;

    const [searchText, setSearchText] = useState(searchField.search);
    const [isFocused, setIsFocused] = useState(false);
    const [currentAction, setCurrentAction] = useState(defaultFunctionGenerator);
    
    if(searchText !== searchField.search.value) {
        setSearchText(searchField.search.value);
    }

    const shouldDisplayOverlay =
        (editor &&
            openAccordion &&
            openAccordion !== 'searchField' &&
            openAccordion !== 'searchField' &&
            ['suggestionsOverlay', 'suggestion', 'leftElement', 'title', 'subtitle', 'rightButton'].includes(
                openAccordion
            )) ||
        (!editor && isFocused);

    const data = editor ? generateFakeData() : suggestionsList || [];

    if (editor) {
        useEffect(() => {
            const style = document.createElement('style');
            style.innerHTML = `
          foreignObject:has(.context-menu-fixed-container) {
            overflow: visible !important;
          }
          .context-menu-fixed-container {
            position: fixed;
            top: 70px !important;
            width: calc(100% - 40px) !important;
          }
        `;
            document.head.appendChild(style);
            return () => {
                document.head.removeChild(style);
            };
        }, []);
    }

    function executeAction(action) {
        setCurrentAction(action);
    }

    async function handleBlur() {
        setTimeout(async () => {
            setIsFocused(false);
            await currentAction();
            setCurrentAction(defaultFunctionGenerator);
        }, 100);
    }
    
    function onSearchChange() {
        setSearchText(searchField.search.value);
        searchField.search.onChange();
    }

    return (
        <View>
            <View
                style={[
                    styles.searchField,
                    {
                        borderStyle: searchField?.border?.borderStyle,
                        borderColor: searchField?.border?.borderColor,
                        borderWidth: searchField?.border?.borderWidth,
                        borderRadius: searchField?.borderRadius,
                        backgroundColor: searchField?.backgroundColor,
                        ...(searchField?.shadow?.enabled ? getShadowStyle(searchField.shadow) : {}),
                    },
                ]}
            >
                {searchField?.leftIcon && (
                    <View style={styles.leftIcon}>
                        <Icon name={searchField.leftIcon} size={24} color={searchField?.textColor}/>
                    </View>
                )}
                <TextInput
                    style={[styles.textInput, {color: searchField?.textColor}]}
                    placeholder={searchField?.placeholder}
                    placeholderTextColor={searchField?.placeholderColor}
                    value={searchText}
                    onChangeText={() => onSearchChange()}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => handleBlur()}
                />
            </View>

            {shouldDisplayOverlay && (
                <View
                    className="context-menu-fixed-container"
                    style={[
                        styles.suggestionsOverlay,
                        {
                            borderStyle: suggestionsOverlay?.border?.borderStyle,
                            borderColor: suggestionsOverlay?.border?.borderColor,
                            borderWidth: suggestionsOverlay?.border?.borderWidth,
                            borderRadius: suggestionsOverlay?.borderRadius,
                            ...(suggestionsOverlay?.shadow?.enabled ? getShadowStyle(suggestionsOverlay.shadow) : {}),
                        },
                    ]}
                >
                    <FlatList
                        data={data}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={({item}) => (
                            <TouchableOpacity onPress={() => executeAction(item.suggestion?.onSuggestionClick)}>
                                <View style={styles.suggestionItem}>
                                    {suggestionsOverlay?.leftType !== 'none' && (
                                        <View style={styles.leftElement}>
                                            {suggestionsOverlay?.leftType === 'icon' ? (
                                                <View
                                                    style={[styles.leftIconWrapper, {
                                                        backgroundColor: suggestionsOverlay?.leftBackgroundColor,
                                                        borderRadius: suggestionsOverlay?.leftBorderRadius
                                                    }]}>
                                                    <Icon name={suggestionsOverlay?.leftIcon} size={24}
                                                          color={suggestionsOverlay?.leftForegroundColor}/>
                                                </View>
                                            ) : (
                                                <Image source={{uri: suggestionsOverlay?.leftImage}}
                                                       style={styles.leftImage}/>
                                            )}
                                        </View>
                                    )}

                                    <View style={styles.textContainer}>
                                        <Text style={[styles.titleText, {color: suggestionsOverlay.titleColor}]}>
                                            {item.suggestion?.titleContent}
                                        </Text>
                                        <Text style={[styles.subtitleText, {color: suggestionsOverlay?.subtitleColor}]}>
                                            {item.suggestion?.subtitleContent}
                                        </Text>
                                    </View>

                                    {suggestionsOverlay?.buttonType !== 'none' && (
                                        <TouchableOpacity onPress={() => executeAction(item.suggestion?.buttonOnClick)}
                                                          style={[styles.rightButton,
                                                              {backgroundColor: suggestionsOverlay?.buttonBackgroundColor}]}>
                                            {suggestionsOverlay?.buttonType === 'icon' ? (
                                                <Icon
                                                    name={suggestionsOverlay?.buttonIcon}
                                                    size={24}
                                                    color={suggestionsOverlay?.buttonForegroundColor}
                                                />
                                            ) : (
                                                <Text
                                                    style={{
                                                        color: suggestionsOverlay?.buttonForegroundColor
                                                    }}
                                                >
                                                    {suggestionsOverlay?.buttonText}
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

const generateFakeData = () => {
    const itemGenerator = (i) => ({
        suggestion: {
            titleContent: `Title ${i}`,
            titleColor: '#000',
            subtitleContent: `Subtitle ${i}`,
            subtitleColor: '#666',
            leftType: 'icon',
            leftIcon: 'search',
            leftBackgroundColor: '#e0e0e0',
            leftForegroundColor: '#fff',
            onSuggestionClick: () => alert(`Suggestion ${i} clicked`),
            buttonType: 'icon',
            buttonIcon: 'close',
            buttonBackgroundColor: '#fff',
            buttonForegroundColor: '#ddd',
            buttonOnClick: () => alert(`Button ${i} clicked`),
        },
    });
    return Array.from({length: 3}, (_, i) => itemGenerator(i));
}
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
    wrapper: {
        position: 'relative',
        zIndex: 1000
    },
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
    leftIconWrapper: {
        padding: 4,
    },
    textInput: {
        flex: 1,
        outline: 'none'
    },
    suggestionsOverlay: {
        position: 'absolute',
        top: '50px',
        width: '100%',
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
        fontSize: 16
    },
    subtitleText: {
        fontSize: 12,
        color: '#666',
    },
    rightButton: {
        marginLeft: 10,
        padding: 4,
        borderRadius: 4
    },
});

export default AutoComplete;

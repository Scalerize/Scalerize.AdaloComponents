/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  useColorScheme,
  View,
} from 'react-native';

import {Colors, Header} from 'react-native/Libraries/NewAppScreen';
import TreeView from './Components/TreeView';

function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  const props = {
    treeData: [
      {
        id: 1,
        treeItemLabel: 'Parent 1',
        treeItemIcon: 'folder',
        parentId: null,
      },
      {
        id: 2,
        treeItemLabel: 'Child 1',
        treeItemIcon: 'file',
        parentId: 1,
      },
      {
        id: 3,
        treeItemLabel: 'Child 2',
        treeItemIcon: 'file',
        parentId: 1,
      },
      {
        id: 4,
        treeItemLabel: 'Parent 2',
        treeItemIcon: 'folder',
        parentId: null,
      },
      {
        id: 5,
        treeItemLabel: 'Child 3',
        treeItemIcon: 'file',
        parentId: 4,
      },
      {
        id: 6,
        treeItemLabel: 'Child 4',
        treeItemIcon: 'file',
        parentId: 4,
      },
    ],
    nodeIndentation: 20,
    nodeHeight: 40,
    fontSize: 16,
    textColor: '#000000',
    backgroundColor: '#ffffff00',
    chevron: {
      openChevronIcon: 'chevron-down',
      closeChevronIcon: 'chevron-right',
    },
  };

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={backgroundStyle}>
        <Header />
        <View
          style={{
            backgroundColor: isDarkMode ? Colors.black : Colors.white,
          }}>
          <TreeView {...props} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

export default App;

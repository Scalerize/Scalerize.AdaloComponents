import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import DraggableFlatList from 'react-native-draggable-flatlist';
import Icon from 'react-native-vector-icons/MaterialIcons';

const KanbanBoard = ({ columns, cards }) => {
  const [cardsState, setCardsState] = useState(cards);

  // Render a draggable card (Pressable supports onLongPress, unlike View)
  const renderCard = ({ item, drag, isActive }) => (
    <Pressable
      onLongPress={drag}
      disabled={isActive}
      style={({ pressed }) => [
        styles.card,
        isActive && styles.activeCard,
        pressed && styles.pressedCard
      ]}
    >
      <Icon name={item.icon} size={24} />
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.subtitle}>{item.subtitle}</Text>
    </Pressable>
  );

  return (
    <ScrollView horizontal style={styles.board}>
      {columns.map(column => (
        <View key={column.id} style={styles.column}>
          <Text style={styles.columnTitle}>{column.title}</Text>
          <DraggableFlatList
            data={cardsState.filter(card => card.columnId === column.id)}
            renderItem={renderCard}
            keyExtractor={item => item.id.toString()}
            onDragEnd={({ data }) => {
              // Reassign cards to this column
              const updated = data.map(card => ({ ...card, columnId: column.id }));
              const remaining = cardsState.filter(card => card.columnId !== column.id);
              setCardsState([...remaining, ...updated]);

              updated.forEach(card => {
                if (card.onColumnChange) {
                  card.onColumnChange(column.id);
                }
              });
            }}
          />
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  board: {
    flexDirection: 'row'
  },
  column: {
    width: 300,
    marginRight: 10,
    padding: 10,
    backgroundColor: '#f4f4f4',
    borderRadius: 8
  },
  columnTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10
  },
  card: {
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 6,
    marginBottom: 8,
    elevation: 2
  },
  // Interaction feedback styles
  pressedCard: {
    opacity: 0.7
  },
  activeCard: {
    backgroundColor: '#e8e8e8'
  },
  title: {
    fontSize: 16,
    fontWeight: '600'
  },
  subtitle: {
    fontSize: 14,
    color: '#666'
  }
});

export default KanbanBoard;

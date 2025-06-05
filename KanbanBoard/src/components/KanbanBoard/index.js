import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import DraggableFlatList from 'react-native-draggable-flatlist';
import Icon from 'react-native-vector-icons/MaterialIcons';

const KanbanBoard = ({ columns, cards }) => {
  const [cardsState, setCardsState] = useState(cards);

  const renderCard = (card, drag) => (
    <View style={styles.card} onLongPress={drag}>
      <Icon name={card.icon} size={24} />
      <Text style={styles.title}>{card.title}</Text>
      <Text style={styles.subtitle}>{card.subtitle}</Text>
    </View>
  );

  return (
    <ScrollView horizontal style={styles.board}>
      {columns.map(column => (
        <View key={column.id} style={styles.column}>
          <Text style={styles.columnTitle}>{column.title}</Text>
          <DraggableFlatList
            data={cardsState.filter(card => card.columnId === column.id)}
            renderItem={({ item, drag }) => renderCard(item, drag)}
            keyExtractor={item => item.id}
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

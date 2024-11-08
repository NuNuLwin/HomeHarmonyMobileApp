import { useState } from 'react';
import {
  Alert,
  Image,
  StyleSheet, 
  Text, 
  TouchableOpacity,
  View
} from "react-native";

import { 
  Agenda
} from 'react-native-calendars';

import moment from 'moment';

export default function calendar() {

  const [items, setItems] = useState({});

  const timeToString = (time) => {
    const date = new Date(time);
    return date.toISOString().split('T')[0];
  }

  const handleRenderItem = (item, isFirst) => {

    return (
      <View
        style={[styles.item, {height: item.height}]}
      >
        <View
          style={styles.itemDetails}
        >
          <Text style={styles.itemTime}>{item.time}</Text> 
          <Text style={styles.itemTitle}>{item.name}</Text>
        </View>
        <View
          style={styles.itemDetails}
        >
          <Image 
            style={styles.icon} 
            source={require('../../assets/images/location_on.png')} 
          />
          <Text>{item.location}</Text>
        </View>
        <View
          style={styles.itemDetails}
        >
          <Image 
            style={styles.icon} 
            source={require('../../assets/images/person.png')} 
          />
          <Text>{item.occupancy}</Text>
        </View>
        <TouchableOpacity
          style={styles.deleteIcon}
          onPress={() => Alert.alert(item.name + " deleted!")}
        >
          <Image 
            style={styles.icon} 
            source={require('../../assets/images/delete.png')} 
          />
        </TouchableOpacity>
      </View>
    );
  };

  const loadItems = () => {
    const _date = Date.now();
    for ( let i = -15; i < 15; i++ ) {
      const time = _date + i * 24 * 60 * 60 * 1000;
      const strTime = timeToString(time);

        if (!items[strTime]) {
          items[strTime] = [];

          if (i > -7 && i < 7) {
            continue
          }

          const numItems = Math.floor(Math.random() * 3 + 1);
          for (let j = 0; j < numItems; j++) {
            items[strTime].push({
              name: "Birthday " + "#" + (j + 1),
              height: 100,
              day: strTime,
              time: '10:00 AM',
              location: 'Dragon Restaurant',
              occupancy: '10 guests'
            });
          }
        }

        const newItems = {};
        Object.keys(items).forEach(key => {
          newItems[key] = items[key];
        });

        setItems(newItems);
      }
  }

  const handleRenderEmptyDate = () => {
    return (
      <View style={styles.emptyDate}>
        <Text>No events!</Text>
      </View>
    );
  };

  return (
    <View style={styles.wrapper}>
      <Agenda
        items={items}
        // Specify how each item should be rendered in agenda
        renderItem={handleRenderItem}
        // Callback that gets called when items for a certain month should be loaded (month became visible)
        loadItemsForMonth={loadItems}
        // Initially selected day
        selected={moment(new Date()).format("YYYY-MM-DD")}
        // Specify how empty date content with no items should be rendered
        renderEmptyDate={handleRenderEmptyDate}
        // When `true` and `hideKnob` prop is `false`, the knob will always be visible and the user will be able to drag the knob up and close the calendar. Default = false
        showClosingKnob={false}
        // Specify your item comparison function for increased performance
        rowHasChanged={(r1, r2) => {
          return r1.name !== r2.name;
        }}
        theme={{
          agendaDayTextColor: '#000000',
          agendaDayNumColor: '#686868',
          // agendaTodayColor: 'red',
          agendaKnobColor: 'blue'
        }}
      />
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ddd'
  },
  deleteIcon: {
    position: "absolute",
    top: 45,
    right: 10
  },
  emptyDate: {
    flex: 1,
    justifyContent: "center",
    alignItems: "flex-start",
    backgroundColor: "#ddd",
    borderRadius: 5,
    padding: 10,
    marginRight: 10,
    marginTop: 17
  },
  icon: {
    width: 20,
    height: 20
  },
  item: {
    backgroundColor: '#BDD8BD',
    borderRadius: 5,
    flex: 1,
    gap: 10,
    padding: 10,
    marginRight: 10,
    marginTop: 17
  },
  itemDetails: {
    display: "flex",
    flexDirection: "row",
    gap: 10,
    justifyContent: "flex-start"
  },
  itemTitle: {
    color: '#000000',
    fontWeight: "700"
  },
  itemTime: {
    color: '#484848'
  },
  wrapper: {
    flex: 1,
    backgroundColor: 'blue'
  }
});
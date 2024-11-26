import { View, StyleSheet, Dimensions, ScrollView } from "react-native";
import React, { useState } from "react";
import Colors from "../../constants/Colors";
import FirstSlide from "../../components/intro/FirstSlide";
import SecondSlide from "../../components/intro/SecondSlide";
import SlideBar from "../../components/intro/SlideBar";
import ButtonGroup from "../../components/intro/ButtonGroup";
import ThirdSlide from "../../components/intro/ThirdSlide";

const { width } = Dimensions.get("window");

export default function index() {
  const [currentPage, setCurrentPage] = useState(0);

  const setSliderPage = (e) => {
    const { x } = e.nativeEvent.contentOffset;
    const indexOfNext = Math.floor(x / width);
    if (indexOfNext !== currentPage) {
      setCurrentPage(indexOfNext);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal={true}
        scrollEventThrottle={16}
        pagingEnabled={true}
        onScroll={setSliderPage}
        showsHorizontalScrollIndicator={false}
      >
        <FirstSlide />
        <SecondSlide />
        <ThirdSlide />
      </ScrollView>

      <SlideBar currentPage={currentPage} />

      <ButtonGroup />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.WHITE,
    justifyContent: "center",
    alignItems: "center",
  },
});

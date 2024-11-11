import { View, Text, StyleSheet, Image } from "react-native";
import Colors from "../../constants/Colors";

export default function RedeemedItem({ redeemed, selectedKid }) {
  const formattedDate =
    redeemed.redeemDate instanceof Date
      ? redeemed.redeemDate.toLocaleDateString()
      : redeemed.redeemDate;

  return (
    <View style={styles.card}>
      <View style={styles.bar}></View>
      <View style={styles.mainContent}>
        <View style={styles.detailsContainer}>
          <Image
            style={styles.img}
            source={require("./../../assets/images/rewards.png")}
          />
          <View style={{ gap: 5 }}>
            <Text style={styles.name}>{redeemed.rewardName}</Text>
            <View style={styles.point_container}>
              <Image
                style={styles.img1}
                source={require("./../../assets/images/coin.png")}
              />
              <Text style={styles.point}>{redeemed.point}</Text>
            </View>
          </View>
          <View style={styles.date_warpper}>
            <Text style={styles.date}>{formattedDate}</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginTop: 5,
    gap: 10,
    alignItems: "center",
    flexDirection: "row",
    backgroundColor: Colors.WHITE,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.LIGHT_BLUE,
  },
  bar: {
    width: "1%",
    backgroundColor: "#7F9AFD",
    height: "90%",
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
  },

  point_container: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
  },
  name: { fontFamily: "outfit-regular", fontSize: 18 },
  point: { fontFamily: "outfit-light", fontSize: 14 },
  date: { fontFamily: "outfit-light", fontSize: 14, color: Colors.GREY },
  img: {
    width: 50,
    height: 50,
  },
  img1: {
    width: 25,
    height: 25,
  },
  btn: {
    width: "25%",
    padding: 6,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
    backgroundColor: Colors.PINK,
  },
  btn_text: { fontFamily: "outfit-regular", fontSize: 14 },
  mainContent: {
    padding: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingLeft: 0,
    width: "95%",
    justifyContent: "space-between",
  },
  detailsContainer: {
    flexDirection: "row",
    gap: 10,
    flex: 1,
  },
  date_warpper: {
    flex: 1,
    alignItems: "flex-end",
  },
});

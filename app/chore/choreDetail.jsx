import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Modal,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

// expo
import { useNavigation, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";

// image
import Image from 'react-native-image-progress';
import * as ImageManipulator from 'expo-image-manipulator';
import * as ImagePicker from "expo-image-picker";
import ImageViewer from "react-native-image-zoom-viewer";
import { Pie } from "react-native-progress";

// firebase
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { doc, updateDoc, getDoc } from "firebase/firestore";
import { db, storage } from "../../config/FirebaseConfig";

// async storage
import AsyncStorage from "@react-native-async-storage/async-storage";

// icons
import Ionicons from "@expo/vector-icons/Ionicons";

// components
import { Uploading } from "../../components/common/Uploading";

// constants
import Colors from "../../constants/Colors";
import Folders from "../../constants/Folders";
import Keys from "../../constants/Keys";

export default function choreDetail() {
  const navigation = useNavigation();
  const router = useRouter();

  const [currentRole, setCurrentRole] = useState(null);
  const [selectedChore, setSelectedChore] = useState(null);
  const [progress, setProgress] = useState(0);
  const [image, setImage] = useState();
  const [images, setImages] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [btnLoading, setBtnLoading] = useState(false);
  const [showImagePreview, setShowImagePreview] = useState(false);
  const [selectedImage, setSelectedImage] = useState(-1);

  const CHORE_FOLDER = Folders.CHORE_FOLDER;

  const GetSelectedChore = async () => {
    try {
      let selected_chore = await AsyncStorage.getItem(Keys.SELECTED_CHORE);
      selected_chore = JSON.parse(selected_chore);

      const docRef = doc(db, "AssignChores", selected_chore.id);
      const docSnap = await getDoc(docRef);
      selected_chore = {
        id: selected_chore.id,
        ...docSnap.data(),
        chore: selected_chore.chore,
      };

      if (selected_chore?.images) {
        setImages(selected_chore.images);
      }
      setSelectedChore(selected_chore);

      const current_role = await AsyncStorage.getItem(Keys.CURRENT_ROLE);
      setCurrentRole(current_role);
    } catch (error) {
      console.error("Error getting async storage update:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTransparent: true,
      headerTitle: "Detail",
      headerBackTitle: "Home",
    });

    GetSelectedChore();
  }, []);

  /* Image Manipulation */
  const doUploadImage = async (uri, uploadProgress) => {
    const response = await fetch(uri);
    const blob = await response.blob();
    const storageRef = ref(storage, `${CHORE_FOLDER}/` + new Date().getTime());
    const task = uploadBytesResumable(storageRef, blob);

    task.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        if (uploadProgress) {
          setProgress(parseInt(progress.toFixed()));
        }
      },
      (error) => {
        // handle error
        console.log("File upload error:", error);
      }
    );
    await task;
    return await getDownloadURL(task.snapshot.ref);
  };

  const uploadImage = async (uri) => {
    let file_url = await doUploadImage(uri, true);
    return file_url;
  };

  const takeImage = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

    if (permissionResult.granted === false) {
      Alert.alert("No permission for the camera!");
      return;
    }

    let result = await ImagePicker.launchCameraAsync();

    if (!result.canceled) {
      // On iPhone, modal does not appear when camera dialog is closed
      setTimeout(async () => {
        try {
          const thumbnail = await ImageManipulator.manipulateAsync(
            result.assets[0].uri, [],
            { compress: 0.5, format: ImageManipulator.SaveFormat.JPEG }
          );

          setShowModal(true);
          setImage(thumbnail.uri);

          // Wrap in try...catch to catch errors in uploadImage or Firestore update
          const file_url = await uploadImage(thumbnail.uri, "image");
          let copiedImages = [...images];
          copiedImages.push(file_url);
          setImages(copiedImages);

          console.log("=== selectedChore.id ===", selectedChore.id);
          console.log("=== copiedImages ===", copiedImages);

          await updateDoc(doc(db, "AssignChores", selectedChore.id), {
            images: copiedImages,
          });

          setShowModal(false);
          setProgress(0);
          setImage(null);
        } catch (error) {
          console.error(
            "Error during image upload or Firestore update:",
            error
          );
          setShowModal(false); // Ensure modal is closed even if there's an error
        }
      }, 500);
    }
  };

  /* Click Events */
  const handleCompleteClicked = async () => {
    if (btnLoading) return;

    setBtnLoading(true);

    try {
      let newStatus =
        currentRole === "parent" ? Keys.COMPLETED : Keys.IN_PROGRESS;
      await updateDoc(doc(db, "AssignChores", selectedChore.id), {
        status: newStatus,
      });

      Alert.alert("Sucess", "The chore status has been updated!", [
        { text: "OK", onPress: () => router.replace({ pathname: "/chore" }) },
      ]);
    } catch (error) {
      console.log("Error updating chore status:", error);
    } finally {
      setBtnLoading(false);
    }
  };

  const handleRejectClicked = async () => {
    if (btnLoading) return;

    setBtnLoading(true);

    try {
      let newStatus = Keys.PENDING;
      await updateDoc(doc(db, "AssignChores", selectedChore.id), {
        status: newStatus,
      });

      Alert.alert("Sucess", "The chore status has been updated!", [
        { text: "OK", onPress: () => router.replace({ pathname: "/chore" }) },
      ]);
    } catch (error) {
      console.log("Error updating chore status:", error);
    } finally {
      setBtnLoading(false);
    }
  };

  /* Components */
  const ChoreImageItem = (img, index) => {
    return (
      <View
        style={{
          justifyContent: "center",
          alignItems: "center"
        }}
        key={index}
      >
        <TouchableOpacity 
          style={styles.thumbnail} 
          onPress={() => {
            setSelectedImage(index);
            setShowImagePreview(true);
            console.log('=== selected image ===', index);
          }}
          key={index}
        >
          <Image 
            source={{ uri: img }}
            style={{ flex: 1 }}
            indicator={Pie}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={async () => {
            setLoading(true);

            let copiedImages = [...images];
            copiedImages.splice(index, 1);
            setImages(copiedImages);

            await updateDoc(doc(db, "AssignChores", selectedChore.id), {
              images: copiedImages,
            });

            setLoading(false);

          }}
        >
          <Text
            style={{
              color: Colors.RED,
              paddingTop: 5
            }}
          >Remove</Text>
        </TouchableOpacity>
      </View>
    )
  }

  const ImagePreviewModal = () => {
    return (
      <Modal 
        visible={showImagePreview} 
        transparent={false}
        style={{
          backgroundColor: "black",
        }}
      >
        <TouchableOpacity
            onPress={() => setShowImagePreview(false)}
            style={{
              position: "absolute",
              top: StatusBar.length + 40,
              right: 10,
              width: 44,
              height: 44,
              backgroundColor: "black",
              justifyContent: "center",
              alignItems: "center",
              borderRadius: 25,
              zIndex: 2
            }}
        >
            <Ionicons name="close-outline" size={24} color="white" />
        </TouchableOpacity>
        <ImageViewer 
          imageUrls={[{url: images[selectedImage]}]}
          renderImage={(props) => <Image
            {...props} indicator={Pie} />}
          renderIndicator={() => <View></View>}
          style={{
            backgroundColor: "black",
          }}
        />
      </Modal>
    )
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.WHITE }}>
      {loading ? (
        <ActivityIndicator
          size="small"
          color={Colors.PRIMARY}
          style={styles.loader}
        />
      ) : (
        <View style={styles.container}>
          <View style={styles.header}>
            <View style={styles.left_box}>
              <Text style={styles.text_medium}>
                {selectedChore?.chore?.point} Pts
              </Text>
            </View>
            <View style={styles.right_box}>
              <Text>{selectedChore?.kidName}</Text>
            </View>
          </View>

          <View style={styles.img_wrapper}>
            <Image
              style={styles.img}
              indicator={Pie}
              source={
                selectedChore?.chore?.image
                  ? { uri: selectedChore.chore.image }
                  : require("./../../assets/images/to-do-list.png")
              }
            />
            <Text style={[styles.text, { fontSize: 20 }]}>
              {selectedChore?.chore?.name}
            </Text>
          </View>

          <View style={{ flexDirection: "row", gap: 10 }}>
            <View style={styles.detail_box}>
              <Text style={styles.text}>
                {selectedChore?.chore?.minAge}-{selectedChore?.chore?.maxAge}{" "}
                yrs
              </Text>
            </View>
            <View style={styles.detail_box}>
              <Text style={styles.text}>
                {selectedChore?.chore?.image ? "Recommended" : "Custom"}
              </Text>
            </View>
          </View>

          {images.length > 2 || selectedChore.status === Keys.COMPLETED ? (
            <></>
          ) : (
            <Text style={[styles.text_medium, { fontSize: 16 }]}>
              Attach photo for Approval
            </Text>
          )}

          {showModal === true ? (
            <Uploading image={image} progress={progress} />
          ) : null}

          <ImagePreviewModal />

          <View
            style={{
              gap: 10,
              paddingTop: 10,
              paddingBottom: 10,
              flexDirection: "row",
            }}
          >
            {images.map((img, index) => ChoreImageItem(img, index))}

            {images.length > 2 || selectedChore.status === Keys.COMPLETED ? (
              <></>
            ) : (
              <TouchableOpacity style={styles.camera_box} onPress={takeImage}>
                <Ionicons name="camera" size={24} color="black" />
              </TouchableOpacity>
            )}
          </View>

          <View
            style={{
              gap: 10,
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            {((selectedChore?.status === Keys.PENDING &&
              currentRole === "kid") ||
              ((selectedChore?.status === Keys.PENDING ||
                selectedChore?.status === Keys.IN_PROGRESS) &&
                currentRole === "parent")) && (
              <TouchableOpacity
                style={[styles.btn, { backgroundColor: Colors.GREEN }]}
                onPress={handleCompleteClicked}
              >
                {btnLoading ? (
                  <ActivityIndicator
                    size="small"
                    color={Colors.WHITE}
                    style={styles.btnLoader}
                  />
                ) : (
                  <Text style={[styles.text, styles.btn_text]}>Complete</Text>
                )}
              </TouchableOpacity>
            )}
            {selectedChore?.status === Keys.IN_PROGRESS &&
              currentRole === "parent" && (
                <TouchableOpacity
                  style={[styles.btn, { backgroundColor: Colors.RED }]}
                  onPress={handleRejectClicked}
                >
                  {btnLoading ? (
                    <ActivityIndicator
                      size="small"
                      color={Colors.WHITE}
                      style={styles.btnLoader}
                    />
                  ) : (
                    <Text style={[styles.text, styles.btn_text]}>Reject</Text>
                  )}
                </TouchableOpacity>
              )}
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 20,
    padding: 15,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  left_box: {
    padding: 3,
    backgroundColor: Colors.PINK,
    paddingHorizontal: 10,
  },
  right_box: {
    padding: 3,
    alignItems: "flex-end",
  },
  img_wrapper: {
    alignItems: "center",
    gap: 20,
  },
  img: {
    width: 200,
    height: 200,
  },
  text: {
    fontFamily: "outfit-regular",
  },
  text_medium: {
    fontFamily: "outfit-medium",
  },
  detail_box: {
    backgroundColor: Colors.LIGHT_BLUE,
    borderRadius: 20,
    padding: 3,
    paddingHorizontal: 10,
  },
  camera_box: {
    backgroundColor: Colors.LIGHT_GREY,
    padding: 20,
    alignItems: "center",
    width: "20%",
    borderRadius: 10,
    height: 70,
    alignSelf: "flex-start"
  },
  btn: {
    borderRadius: 20,
    justifyContent: "center",
    padding: 10,
    paddingHorizontal: 30,
    flex: 1,
    alignItems: "center",
  },
  btn_text: {
    color: Colors.WHITE,
    fontFamily: "outfit-medium",
    fontSize: 15,
  },
  thumbnail: {
    width: 70,
    height: 70,
  },
  loader: {
    marginTop: 20,
    marginBottom: 20,
    alignSelf: "center",
  },
  btnLoader: {
    alignSelf: "center",
  },
});

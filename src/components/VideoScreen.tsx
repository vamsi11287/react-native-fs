import React, {useState} from 'react';
import {
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Video from 'react-native-video';
import MediaModal from './MediaPopup';

const VideoScreen = ({videos}: any) => {
  const [isOpen, setIsOpen] = useState(false);
  const [active, setActive] = useState(null);

  const closeModel = (value: boolean) => {
    setIsOpen(value);
  };
  const renderItem = ({item}: any) => {
    return (
      <View style={styles.imageContainer}>
        <TouchableOpacity
          onPress={() => {
            setIsOpen(!isOpen);
            setActive(item.node.image.uri);
          }}>
          <Video
            source={{uri: item.node.image.uri}}
            style={styles.backgroundVideo}
            paused
            playInBackground={false}
            playWhenInactive={false}
            resizeMode="cover"
            repeat={false}
          />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView>
      <FlatList
        numColumns={2}
        data={videos?.videos ?? []}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        columnWrapperStyle={styles.columnWrapper}
        ListEmptyComponent={<Text>No images available</Text>}
      />
      <MediaModal
        item={active}
        open={isOpen}
        closeModel={closeModel}
        type="video"
      />
    </SafeAreaView>
  );
};

export default VideoScreen;

const styles = StyleSheet.create({
  backgroundVideo: {
    height: 120,
  },
  imageContainer: {
    flex: 1,
    margin: 5,
  },
  columnWrapper: {
    justifyContent: 'space-between',
  },
});

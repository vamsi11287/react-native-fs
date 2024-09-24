import React, {useState} from 'react';
import {
  FlatList,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import MediaModal from './MediaPopup';
import { IRednderImages } from '../config/Interfaces';

const ImageScreen = ({images}: any) => {
  const [isOpen, setIsOpen] = useState(false);
  const [active, setActive] = useState(null);

  const closeModel = (value: boolean) => {
    setIsOpen(value);
  };
  const renderItem = ({item}:IRednderImages) =>{
    return  (
      <View style={styles.imageContainer}>
        <TouchableOpacity
          onPress={() => {
            setIsOpen(!isOpen);
            setActive(item.node.image.uri);
          }}>
          <Image style={styles.image} source={{uri: item.node.image.uri}} />
        </TouchableOpacity>
      </View>
    )
  };

  return (
    <SafeAreaView>
      <FlatList
        numColumns={2}
        data={images?.photos ?? []}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        columnWrapperStyle={styles.columnWrapper}
        ListEmptyComponent={<Text>No images available </Text>}
      />
      <MediaModal
        item={active}
        open={isOpen}
        closeModel={closeModel}
        type="image"
      />
    </SafeAreaView>
  );
};

export default ImageScreen;

const styles = StyleSheet.create({
  imageContainer: {
    flex: 1,
    margin: 5,
  },
  image: {
    width: '100%',
    height: 100,
    borderRadius: 5,
  },
  columnWrapper: {
    justifyContent: 'space-between',
  },
});

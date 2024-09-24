import React, {useState} from 'react';
import {Button, Image, Modal, StyleSheet, View} from 'react-native';
import Video from 'react-native-video';

const MediaModal = ({item, open,closeModel,type}: any) => {

  const toggleModal = () => {
    closeModel(!open)
  };
  return (
    <View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={open}
        onRequestClose={toggleModal}>
        <View style={styles.modalView}>
          {open && type=="video" ? (
            <Video
              source={{uri: item}} 
              style={styles.media}
              resizeMode="cover"
              controls
            />
          ) : (
            <Image
              source={{uri: item}} 
              style={styles.media}
            />
          )}
          <Button title="Close" onPress={toggleModal} />
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgb(40, 200, 300)',
    padding: 20,
    gap:10
  },
  media: {
    width: '100%',
    height: 300,
    borderWidth: 4,
  },
});

export default MediaModal;

import notifee, {EventType} from '@notifee/react-native';
import React, {useEffect, useState} from 'react';
import {
  Alert,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import RNFetchBlob from 'rn-fetch-blob';
import {fonts} from '../constants/fonts';

const Download = () => {
  const [url, setUrl] = useState('');

  const actualDownload = async (url: string) => {
    if (!url) {
      Alert.alert('URL', 'provide any url');
    }
    const {dirs} = RNFetchBlob.fs;
    const dirToSave =
      Platform.OS === 'ios' ? dirs.DocumentDir : dirs.DownloadDir;
    const fileName = url.split('/').pop();
    const filePath = `${dirToSave}/${fileName}`;

    const config = {
      fileCache: true,
      path: filePath,
      addAndroidDownloads: {
        useDownloadManager: true,
        notification: true,
        mediaScannable: true,
        title: fileName,
        path: filePath,
      },
    };

    const configOptions = Platform.select({
      ios: config,
      android: config,
    });

    try {
      const res = await RNFetchBlob.config(configOptions || {}).fetch(
        'GET',
        url,
      );
      if (Platform.OS === 'ios') {
        RNFetchBlob.fs.writeFile(filePath, res.data, 'base64');
        RNFetchBlob.ios.previewDocument(filePath);
      } else {
        console.log('first');
        console.log('File downloaded to:', filePath);
        Alert.alert('Download', `File downloaded successfully: ${filePath}`);
      }
    } catch (e) {
      console.error('Download error:', e);
      Alert.alert(
        'Download Error',
        'An error occurred while downloading the file.',
      );
    }
  };

  const notifeeNotification = async () => {
    // Request permissions (required for iOS)
    await notifee.requestPermission();

    // Create a channel (required for Android)
    const channelId = await notifee.createChannel({
      id: 'default',
      name: 'Default Channel',
      sound: 'default',
      
    });

    // Display a notification
    await notifee.displayNotification({
      title: 'Small Icon',
      body: 'A notification using the small icon!',
      android: {
        channelId,
        smallIcon: 'ic_launcher',
        sound: 'default',
        pressAction: {
          id: 'default',
        },
      },
      ios: {
        sound: 'default',
       
      },
    });
  };

  useEffect(() => {
    return notifee.onForegroundEvent(({type, detail}) => {
      switch (type) {
        case EventType.DISMISSED:
          console.log('User dismissed notification', detail.notification);
          break;
        case EventType.PRESS:
          console.log('User pressed notification', detail.notification);
          break;
      }
    });
  }, []);
  return (
    <SafeAreaView style={styles.container}>
      <Text>hellow this is the data without any fontFamily</Text>
      <Text style={{fontFamily: fonts.semiBold, fontSize: 20}}>
        hellow this is the data with fontFamily
      </Text>
      <TouchableOpacity
        onPress={notifeeNotification}
        style={styles.createFileBtn}>
        <Text style={styles.createFileBtnTxt}>Display Notification</Text>
      </TouchableOpacity>
      <TextInput
        style={styles.input}
        placeholder="Enter file URL"
        value={url}
        onChangeText={setUrl}
      />

      <TouchableOpacity
        onPress={() => actualDownload(url)}
        style={styles.createFileBtn}>
        <Text style={styles.createFileBtnTxt}>Download</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    fontSize: 20,
    justifyContent: 'center',
    margin: 16,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 16,
    paddingHorizontal: 8,
  },
  createFileBtn: {
    backgroundColor: 'rgb(0,163,224)',
    padding: 10,
    borderRadius: 8,
  },
  createFileBtnTxt: {
    textAlign: 'center',
    color: '#fff',
    fontWeight: '600',
    letterSpacing: 2,
    textTransform: 'capitalize',
  },
});

export default Download;

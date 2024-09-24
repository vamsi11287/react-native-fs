import { CameraRoll } from '@react-native-camera-roll/camera-roll';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import React, { useEffect, useState } from 'react';
import { Alert, PermissionsAndroid, Platform, StyleSheet, Linking } from 'react-native';
import ReactNativeBiometrics, { BiometryTypes } from 'react-native-biometrics';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ImageScreen from './ImageScreen';
import VideoScreen from './VideoScreen';

const Tab = createMaterialTopTabNavigator();

const TopTab = () => {
    const [images, setImages] = useState<any>();
    const [videos, setVideos] = useState<any>();

    const requestStoragePermission = async () => {
        if (Platform.OS === 'android') {
            const granted = await PermissionsAndroid.requestMultiple([
                PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES,
                PermissionsAndroid.PERMISSIONS.READ_MEDIA_VIDEO,
            ]);
            return (
                granted[PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES] === PermissionsAndroid.RESULTS.GRANTED &&
                granted[PermissionsAndroid.PERMISSIONS.READ_MEDIA_VIDEO] === PermissionsAndroid.RESULTS.GRANTED
            );
        } else {
            return true; 
        }
    };

    const handleButtonPress = async () => {
        const hasPermission = await requestStoragePermission();

        if (!hasPermission) {
            Alert.alert(
                'Permission Denied',
                'This app requires access to your media library. Please enable it in the app settings.',
                [
                    {
                        text: 'Go to Settings',
                        onPress: () => Linking.openSettings(),
                    },
                    {
                        text: 'Cancel',
                        style: 'cancel',
                    },
                ]
            );
            return;
        }

        CameraRoll.getPhotos({
            first: 10,
            assetType: 'Photos',
        })
            .then(photo => {
                setImages({ photos: photo.edges });
                console.log(photo, 'photo');
            })
            .catch(err => {
                console.log('Error fetching photos:', err);
            });

        CameraRoll.getPhotos({
            first: 20,
            assetType: 'Videos',
        })
            .then(video => {
                setVideos({ videos: video.edges });
                console.log(video, 'vid');
            })
            .catch(err => {
                console.log('Error fetching videos:', err);
            });
    };

    useEffect(() => {
        handleButtonPress();
    }, []);

    const handleBiometricAuth = async () => {
      try {
        const rnBiometrics = new ReactNativeBiometrics();
        const {success, error} = await rnBiometrics.simplePrompt({
          promptMessage: 'Authenticate to continue',
        });
  
        if (success) {
          Alert.alert('Success', 'Biometric authentication successful');
          return true;
        } else {
          Alert.alert('Authentication failed', 'Biometric authentication failed');
          return false;
        }
      } catch (error) {
        console.error('[handleBiometricAuth] Error:', error);
        Alert.alert('Error', 'Biometric authentication failed from device');
        return false;
      }
    };
    const enableBiometricAuth = () => {
      const rnBiometrics = new ReactNativeBiometrics();
      rnBiometrics
        .isSensorAvailable()
        .then(resultObject => {
          const {available, biometryType} = resultObject;
  
          if (available && biometryType === BiometryTypes.TouchID) {
            Alert.alert(
              'TouchID',
              'Would you like to enable TouchID authentication for the next time?',
              [
                {
                  text: 'Yes please',
                  onPress: async () => {
                    Alert.alert(
                      'Success!',
                      'TouchID authentication enabled successfully!',
                    );
                  },
                },
                {text: 'Cancel', style: 'cancel'},
              ],
            );
          } else if (available && biometryType === BiometryTypes.FaceID) {
            Alert.alert(
              'FaceID',
              'Would you like to enable FaceID authentication for the next time?',
              [
                {
                  text: 'Yes please',
                  onPress: async () => {
                    Alert.alert(
                      'Success!',
                      'FaceID authentication enabled successfully!',
                    );
                  },
                },
                {text: 'Cancel', style: 'cancel'},
              ],
            );
          } else if (available && biometryType === BiometryTypes.Biometrics) {
            Alert.alert(
              'Device Supported Biometrics',
              'Biometrics authentication is supported.',
            );
          } else {
            Alert.alert(
              'Biometrics not supported',
              'This device does not support biometric authentication.',
            );
          }
        })
        .catch(error => {
          console.error('Error:', error);
          Alert.alert(
            'Error',
            'An error occurred while checking biometrics availability.',
          );
        });
    };
  

    useEffect(() => {
        // handleBiometricAuth();
        // enableBiometricAuth();
    }, []);

    const insets = useSafeAreaInsets();
    return (
        <Tab.Navigator style={{ paddingTop: insets.top }}>
            <Tab.Screen name="Videos">
                {props => <VideoScreen {...props} videos={videos} />}
            </Tab.Screen>
            <Tab.Screen name="Images">
                {props => <ImageScreen {...props} images={images} />}
            </Tab.Screen>
        </Tab.Navigator>
    );
};

export default TopTab;

const styles = StyleSheet.create({});

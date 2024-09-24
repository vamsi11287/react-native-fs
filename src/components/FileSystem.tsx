import React, {useEffect, useState} from 'react';
import {
  Alert,
  FlatList,
  Modal,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import RNFS from 'react-native-fs';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {IFolder_FIle, IPath_FileName, IpopupModel} from '../config/Interfaces';

const FileSystem = () => {
  const [folderName, setFolderName] = useState('');
  const [name, setName] = useState('');
  const [fileName, setFileName] = useState('');
  const [isUpdate, setIsUpdate] = useState(false);
  const [pathFolder, setPathFolder] = useState<{name: string; path: string}>();
  const [files, setFiles] = useState<IFolder_FIle | undefined>();
  const [folders, setFolders] = useState<IFolder_FIle | undefined>();
  const [allFiles, setAllFiles] = useState<IFolder_FIle | undefined>();

  const createFolder = async () => {
    if (!folderName.trim()) {
      Alert.alert('Error', 'Folder name cannot be empty.');
      return;
    }
    const folderPath = `${RNFS.DocumentDirectoryPath}/${folderName}`;
    console.log(folderPath, 'folder');

    try {
      await RNFS.mkdir(folderPath);
      setIsUpdate(!isUpdate);
      Alert.alert('Success', 'Folder created successfully!');
      setFolderName('');
    } catch (error) {
      console.error('Error creating folder:', error);
      Alert.alert('Error', 'Failed to create folder.');
    }
  };

  const createFile = async () => {
    const folderPath = `${RNFS.DocumentDirectoryPath}/${folderName}`;
    if (!fileName.trim()) {
      Alert.alert('Error', 'File name cannot be empty.');
      return;
    }
    const filePath = `${folderPath}/${fileName}.txt`;

    try {
      await RNFS.writeFile(filePath, '', 'utf8');
      Alert.alert('Success', 'File created successfully!');
      setFileName('');
      setIsUpdate(!isUpdate);
    } catch (error) {
      console.error('Error creating file:', error);
      Alert.alert('Error', 'Failed to create file.');
    }
  };

  const removeFolder = async (folderPath: string) => {
    try {
      await RNFS.unlink(folderPath);
      setIsUpdate(!isUpdate);
      // Alert.alert('Success', 'Folder removed successfully!');
    } catch (error) {
      console.error('Error removing folder:', error);
      Alert.alert('Error', 'Failed to remove folder.');
    }
  };

  const removeFile = async (filePath: string) => {
    try {
      await RNFS.unlink(filePath);
      setIsUpdate(!isUpdate);
    } catch (error) {
      console.error('Error removing folder:', error);
      Alert.alert('Error', 'Failed to remove folder.');
    }
  };

  const fetchItems = async () => {
    const existingItems = await RNFS.readDir(RNFS.DocumentDirectoryPath);
    const folders = existingItems.filter(item => item.isDirectory());

    const foldersArray = folders.map(item => ({
      name: item.name,
      path: item.path,
    }));

    const filesArray = existingItems
      .filter(item => !item.isDirectory())
      .map(item => ({
        name: item.name,
        path: item.path,
      }));

    setFolders(foldersArray);
    setFiles(filesArray);
  };

  const fetchItemsInFolder = async (path: string) => {
    const existingItems = await RNFS.readDir(path);
    const items = existingItems.map(item => ({
      name: item.name,
      path: item.path,
    }));

    setAllFiles(items);
  };

  const openFolder = (path: {name: string; path: string}) => {
    setPathFolder(path);
  };

  const setModalVisible = () => {
    setPathFolder({name: '', path: ''});
    setName('');
  };

  const createFileInFolder = async (path?: string, name?: string) => {
    if (!path || !name) {
      Alert.alert('Error', 'Path or file name cannot be empty.');
      return;
    }
    const filePath = `${path}/${name}.txt`;
    try {
      await RNFS.writeFile(filePath, 'Default file content goes here.', 'utf8');
      Alert.alert('Success', 'File created successfully!');
      fetchItemsInFolder(path);
      // setIsUpdate(prev => !prev);
      // Clear the name input field if you're using state to manage it
      setName('');
    } catch (error) {
      console.error('Error creating file in folder:', error);
      Alert.alert('Error', 'Failed to create file.');
    }
  };

  useEffect(() => {
    fetchItems();
  }, [isUpdate]);

  useEffect(() => {
    pathFolder?.path && fetchItemsInFolder(pathFolder?.path);
  }, [pathFolder?.path]);

  const renderFolderItem = ({item}: IPath_FileName) => {
    return (
      <TouchableOpacity
        onLongPress={() => removeFolder(item.path)}
        onPress={() => openFolder(item)}
        style={styles.folderItem}>
        <FontAwesome name="folder" size={60} color={'rgb(0,163,224)'} />
        <Text style={styles.folderName}>{item.name}</Text>
      </TouchableOpacity>
    );
  };

  const renderFileItem = ({item}: IPath_FileName) => {
    return (
      <TouchableOpacity
        onLongPress={() => removeFile(item.path)}
        style={styles.folderItem}>
        <FontAwesome name="file" size={50} color={'rgb(153,195,205)'} />
        <Text style={styles.folderName}>{item.name}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>React Native Folders and File Collection</Text>
      <TextInput
        style={styles.input}
        placeholder="Folder Name"
        value={folderName}
        onChangeText={setFolderName}
      />
      <TouchableOpacity onPress={createFolder} style={styles.createFileBtn}>
        <Text style={styles.createFileBtnTxt}>Create Folder</Text>
      </TouchableOpacity>

      <TextInput
        style={styles.input}
        placeholder="file Name"
        value={fileName}
        onChangeText={setFileName}
      />
      <TouchableOpacity onPress={createFile} style={styles.createFileBtn}>
        <Text style={styles.createFileBtnTxt}>Create file</Text>
      </TouchableOpacity>

      <Text style={styles.createdFoldersTitle}>Folders:</Text>
      <View style={styles.folderContainer}>
        <FlatList
          data={folders}
          renderItem={renderFolderItem}
          keyExtractor={(item, index) => index}
          numColumns={3}
          scrollEnabled={false}
        />
      </View>

      <Text style={styles.createdFoldersTitle}>files:</Text>
      <View style={styles.folderContainer}>
        <FlatList
          data={files}
          renderItem={renderFileItem}
          keyExtractor={(item, index) => index}
          numColumns={3}
          scrollEnabled={false}
        />
      </View>
      <PopupModelFolder
        name={name}
        setName={setName}
        path={pathFolder}
        isVisible={pathFolder?.name ? true : false}
        setModalVisible={setModalVisible}
        createFileInFolder={createFileInFolder}
        allFiles={allFiles}
      />
    </SafeAreaView>
  );
};

const PopupModelFolder = ({
  path,
  name,
  setName,
  isVisible,
  setModalVisible,
  createFileInFolder,
  allFiles,
}: IpopupModel) => {
  return (
    <Modal transparent={true} visible={isVisible} animationType="slide">
      <View style={styles1.modalContainer}>
        <Text style={styles1.modalTitle}>
          Folder: {path?.name ? path.name : 'no'}
        </Text>
        <TextInput
          style={styles.input}
          placeholder="File Name"
          value={name}
          onChangeText={setName}
        />

        <TouchableOpacity
          onPress={() => createFileInFolder(path.path, name)}
          style={styles.createFileBtn}>
          <Text style={styles.createFileBtnTxt}>Create File</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setModalVisible(false)}
          style={styles.createFileBtn}>
          <Text style={styles.createFileBtnTxt}>Close</Text>
        </TouchableOpacity>

        <Text style={styles.createdFoldersTitle}>Files:</Text>
        <FlatList
          data={allFiles}
          renderItem={({item}) => (
            <TouchableOpacity>
              <Text style={styles.folderName}>{item.name}</Text>
            </TouchableOpacity>
          )}
          keyExtractor={item => item.path}
        />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 20,
    flex: 1,
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
  title: {
    fontSize: 20,
    marginBottom: 10,
    fontWeight: '600',
    color: 'black',
  },
  input: {
    borderWidth: 1.6,
    marginBottom: 10,
    marginTop: 10,
    padding: 10,
    borderRadius: 8,
  },
  createdFoldersTitle: {
    marginTop: 20,
    fontWeight: '600',
    padding: 5,
    fontSize: 18,
  },
  folderContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
  },
  folderItem: {
    padding: 12,
    margin: 1,
    width: 110,
    alignItems: 'center',
    borderColor: 'rgb(0,163,224)',
    borderRadius: 5,
  },
  folderName: {
    fontSize: 17,
    fontWeight: '500',
    textAlign: 'center',
  },
});

const styles1 = StyleSheet.create({
  container: {
    margin: 20,
  },
  title: {
    fontSize: 20,
    marginBottom: 10,
    fontWeight: '600',
    color: 'black',
  },
  input: {
    borderWidth: 1,
    marginBottom: 10,
    marginTop: 10,
    padding: 10,
    borderColor: 'rgb(0,163,224)',
    borderRadius: 5,
  },
  createdFoldersTitle: {
    marginTop: 20,
    fontWeight: '600',
    padding: 5,
    fontSize: 18,
  },
  folderItem: {
    padding: 12,
    margin: 1,
    width: 110,
    alignItems: 'center',
    borderColor: 'rgb(0,163,224)',
    borderRadius: 5,
  },
  folderName: {
    fontSize: 17,
    fontWeight: '500',
    textAlign: 'center',
  },
  modalContainer: {
    flex: 1,
    gap: 10,
    padding: 20,
    backgroundColor: 'rgb(153,195,255)',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    marginBottom: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalButton: {
    marginVertical: 10,
  },
});

export default FileSystem;

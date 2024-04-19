// Home.js

import React, {useState} from 'react';
import DocumentPicker from 'react-native-document-picker';
import RNFS from 'react-native-fs';
import Papa from 'papaparse';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
} from 'react-native';

const Home = ({navigation}) => {
  const [tableHead, setTableHead] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [firstNameError, setFirstNameError] = useState('');
  const [lastNameError, setLastNameError] = useState('');
  const [fileName, setFileName] = useState('');
  const [fileSize, setFileSize] = useState('');
  const [fileSelected, setFileSelected] = useState(true);

  const handleFileSelect = async () => {
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles],
      });
      console.log('file', res);
      setFileName(res[0].name);
      setFileSize(res[0].size / 1000); // Converting to KB
      setFileSelected(true);
      const uri = res[0].uri;
      const filepath = uri.replace('file://', '');
      RNFS.readFile(filepath, 'utf8')
        .then(contents => {
          parseCSV(contents);
        })
        .catch(err => {
          console.log('Error reading file:', err);
        });
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        console.log('User cancelled the file picker');
        setFileSelected(false);
      } else {
        console.error('Unknown error: ', err);
      }
    }
  };

  const parseCSV = data => {
    Papa.parse(data, {
      complete: result => {
        setTableHead(result.data[0]);
        result.data.shift(); // Remove header
        setTableData(result.data);
      },
      header: false,
    });
  };

  const validateFirstName = () => {
    if (!firstName.trim()) {
      setFirstNameError('First Name is required');
      return false;
    } else if (firstName.length < 2) {
      setFirstNameError('First Name must be at least 2 characters');
      return false;
    } else {
      setFirstNameError('');
      return true;
    }
  };

  const validateLastName = () => {
    if (!lastName.trim()) {
      setLastNameError('Last Name is required');
      return false;
    } else if (lastName.length < 2) {
      setLastNameError('Last Name must be at least 2 characters');
      return false;
    } else {
      setLastNameError('');
      return true;
    }
  };

  const handleSubmit = () => {
    if (fileName.length == 0) {
      setFileSelected(false);
      return;
    }
    if (fileName.length == 0) {
      setFileSelected(true);
      return;
    }
    const isFirstNameValid = validateFirstName();
    const isLastNameValid = validateLastName();

    if (isFirstNameValid && isLastNameValid && fileSelected) {
      navigation.navigate('Update', {
        tableHead,
        tableData,
        firstName,
        lastName,
      });
    }
  };

  return (
    <View className="flex-1 justify-center p-5 bg-[#8B93FF]">
      <View className=" p-5 rounded-xl bg-[#FFF7FC]">
        <Text className="text-black text-2xl mx-auto mb-4">
          Report Upload Form
        </Text>
        <TextInput
          className="border border-gray-300 rounded-lg px-4 py-2 w-full mt-4 text-black"
          onChangeText={text => {
            setFirstName(text);
            validateFirstName();
          }}
          value={firstName}
          placeholder="eg. John"
          placeholderTextColor="grey"
        />
        {firstNameError ? (
          <Text className="text-red-500">{firstNameError}</Text>
        ) : null}
        <TextInput
          className="border border-gray-300 rounded-lg px-4 py-2 w-full mt-4 text-black"
          onChangeText={text => {
            setLastName(text);
            validateLastName();
          }}
          value={lastName}
          placeholder="eg. Doe"
          placeholderTextColor="grey"
        />
        {lastNameError ? (
          <Text className="text-red-500">{lastNameError}</Text>
        ) : null}
        <TouchableOpacity
          className="bg-blue-500 mx-auto flex flex-row px-10 py-3 my-4 rounded-3xl w-[80%] justify-center"
          onPress={handleFileSelect}>
          <Text>Select CSV File</Text>
        </TouchableOpacity>
        {tableHead.length > 0 && (
          <ScrollView className="w-[80%] border-black border ml-10 p-2 rounded-xl">
            <Text style={{color: 'black'}}>File Name: {fileName}</Text>
            <Text style={{color: 'black'}}>File Size: {fileSize} Kb</Text>
          </ScrollView>
        )}
        <TouchableOpacity
          className="bg-blue-500 mx-auto flex flex-row px-10 py-3 my-4 rounded-3xl w-[80%] justify-center"
          onPress={handleSubmit}
          disabled={!fileSelected}>
          <Text>Preview</Text>
        </TouchableOpacity>
        {!fileSelected && (
          <Text className="text-red-500 text-center mt-2">
            Please select a file first
          </Text>
        )}
      </View>
    </View>
  );
};

export default Home;

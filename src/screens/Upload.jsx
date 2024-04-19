import React, {useState} from 'react';
import {View, Text, TouchableOpacity, Modal, Button} from 'react-native';

const Upload = ({route, navigation}) => {
  const {tableHead, editableData} = route.params;
  const [dialogVisible, setDialogVisible] = useState(false);
  const [dialogMessage, setDialogMessage] = useState('');
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const handleUpload = async () => {
    console.log('Received data:', tableHead, editableData);
    if (!tableHead || !editableData) {
      console.error('Data is missing');
      setDialogMessage('Data is missing. Please try again.');
      setUploadSuccess(false);
      setDialogVisible(true);
      return;
    }

    try {
      const response = await fetch(
        'http://192.168.29.107:5000/api/user/entry',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            heading: tableHead,
            data: editableData,
          }),
        },
      );
      if (response.ok) {
        let data = await response.json();
        console.log('Data uploaded successfully:', data);
        setDialogMessage('Upload successful!');
        setUploadSuccess(true);
        setDialogVisible(true);
      } else {
        throw new Error('Failed to upload data: ' + response.status);
      }
    } catch (error) {
      console.error('Error uploading data:', error);
      setDialogMessage(`Upload failed: ${error.message}`);
      setUploadSuccess(false);
      setDialogVisible(true);
    }
  };

  return (
    <View className="flex-1 justify-center items-center p-5 bg-[#8B93FF]">
      <View className="p-5 rounded-xl bg-[#FFF7FC]">
        <Text className="text-black text-2xl mb-4">Upload Data to Cloud</Text>
        <TouchableOpacity
          className="bg-[#FF71CD] py-3 px-10 rounded-full my-4"
          onPress={handleUpload}>
          <Text className="text-white font-bold">Upload File</Text>
        </TouchableOpacity>
        <Modal
          animationType="slide"
          transparent={true}
          visible={dialogVisible}
          onRequestClose={() => {
            setDialogVisible(!dialogVisible);
          }}>
          <View className="flex-1 justify-center items-center mt-10">
            <View className="m-20 bg-white rounded-2xl p-10 shadow-lg shadow-[#000]">
              <Text className="text-center mb-5" style={{color: 'black'}}>
                {dialogMessage}
              </Text>
              {uploadSuccess ? (
                <Button title="OK" onPress={() => setDialogVisible(false)} />
              ) : (
                <Button
                  title="Retry"
                  onPress={() => {
                    setDialogVisible(false);
                    handleUpload();
                  }}
                />
              )}
            </View>
          </View>
        </Modal>
        {uploadSuccess && (
          <TouchableOpacity
            className="bg-[#5755FE] py-3 px-10 rounded-full my-4"
            onPress={() => navigation.navigate('Home')}>
            <Text className="text-white font-bold">Go to Home</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default Upload;

import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Modal,
} from 'react-native';
import {Table, Row} from 'react-native-table-component';

const Update = ({route, navigation}) => {
  const {tableHead, tableData, firstName, lastName} = route.params;
  const [editableData, setEditableData] = useState(
    tableData.map(row => [...row]),
  );
  const [updatedFields, setUpdatedFields] = useState({});
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    setUpdatedFields({});
  }, [editableData]);

  const handleCellChange = (text, rowIndex, columnIndex) => {
    const newData = [...editableData];
    newData[rowIndex][columnIndex] = text;
    setEditableData(newData);
    setUpdatedFields({
      ...updatedFields,
      [`${rowIndex}-${columnIndex}`]: true,
    });
  };

  const handleSave = () => {
    console.log('Saved data:', editableData);
    setModalVisible(true);
    setTimeout(() => {
      setModalVisible(false);
    }, 1500);
  };

  const handleUpload = () => {
    handleSave(); // Save changes first
    navigation.navigate('Upload', {tableHead, editableData});
  };

  return (
    <View className="flex-1 justify-center items-center  bg-[#8B93FF]">
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}>
        <View className="flex-1 justify-center items-center bg-[#8B93FF] bg-opacity-50">
          <View className="bg-white p-16 rounded-lg ">
            <Text style={{color: 'black', fontSize: 20}}>
              Data saved successfully!
            </Text>
          </View>
        </View>
      </Modal>

      <View className=" rounded-xl  w-[90%] p-5 bg-[#FFF7FC]">
        <Text className="text-2xl text-black mb-4 text-center">
          Update Page
        </Text>
        <Text className="text-lg text-black mb-4 text-center">
          Name: {firstName} {lastName}
        </Text>

        <View className="relative w-full max-w-4xl">
          <ScrollView horizontal={true}>
            <Table borderStyle="border-2 border-gray-500">
              <Row
                data={tableHead}
                className="bg-[#FFF7FC] h-10 border-b border-gray-500"
                textStyle={{color: 'black'}} // Ensure text color is black
              />
              {editableData.map((rowData, rowIndex) => (
                <Row
                  key={rowIndex}
                  data={rowData.map((cellData, columnIndex) => (
                    <TextInput
                      key={columnIndex}
                      className={`p-2 text-black h-10 min-w-100 border-r border-gray-500 rounded-md ${
                        updatedFields[`${rowIndex}-${columnIndex}`]
                          ? 'bg-yellow-100'
                          : 'bg-[#FFF7FC]'
                      }`}
                      value={cellData}
                      onChangeText={text =>
                        handleCellChange(text, rowIndex, columnIndex)
                      }
                      style={{width: 100}} // Fixed width for each column
                    />
                  ))}
                  className="h-8 min-w-100"
                  textStyle="m-1 text-black" // This ensures all text in the rows is black
                />
              ))}
            </Table>
          </ScrollView>
        </View>
        <TouchableOpacity
          className="bg-[#5755FE] py-3 px-10 rounded-full my-4"
          onPress={handleSave}>
          <Text className="text-white text-center font-bold">Save Changes</Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="bg-[#FF71CD] py-3 px-10 rounded-full my-4"
          onPress={handleUpload}>
          <Text className="text-white text-center font-bold">
            Upload Changes
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Update;

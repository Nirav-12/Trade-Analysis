import React, {useState, useEffect} from 'react';
import DocumentPicker, {types} from 'react-native-document-picker';
import * as XLSX from 'xlsx';
import {FileSystem} from 'react-native-file-access';
import NaviButton from '../components/NaviButton';
import {
  StyleSheet,
  TouchableOpacity,
  View,
  Image,
  BackHandler,
} from 'react-native';
import auth from '@react-native-firebase/auth';

function FileUpload({navigation}) {
  useEffect(() => {
    const backAction = () => {
      BackHandler.exitApp();
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, []);

  useEffect(() => {
    navigation.setOptions({
      headerRight: props => (
        <View>
          <TouchableOpacity onPress={() => logout()}>
            <Image
              style={{width: 25, height: 25}}
              source={require('../asset/logout.png')}
            />
          </TouchableOpacity>
        </View>
      ),
    });
  });

  const logout = () => {
    auth()
      .signOut()
      .then(() => {
        console.log('user log out ');
        navigation.navigate('Home');
      })
      .catch(error => {
        console.log(error);
      });
  };
  const [file, setFile] = useState();
  const [data, setData] = useState();
  const [startPoint, setStartPoint] = useState(null);
  const [keyWord, setKeyWord] = useState([]);

  const column = [
    'B',
    'C',
    'D',
    'E',
    'F',
    'G',
    'H',
    'I',
    'J',
    'K',
    'L',
    'M',
    'N',
  ];

  const getData = async () => {
    try {
      let response = await DocumentPicker.pick({
        type: [types.xlsx, types.xls],
      });
      setFile(response);
    } catch (error) {
      console.log('error', error);
    }
  };

  useEffect(() => {
    if (file) {
      const readFile = async () => {
        const b64 = await FileSystem.readFile(file[0].uri, 'base64');
        const workbook = XLSX.read(b64, {type: 'base64'});
        setData(workbook.Sheets['F&O']);
      };
      readFile();
    }
  }, [file]);

  useEffect(() => {
    if (data) {
      const tradeObjectStart = () => {
        let obj = {};
        let noOfRow = data['!ref'].split(':')[1].match(/\d+/)[0];
        for (let row = 1; row <= noOfRow; row++) {
          if (data[`${column[0]}${row}`]) {
            if (data[`${column[0]}${row}`]['v'] === 'Symbol') {
              obj['tradeDetails'] = row;
            }
            if (data[`${column[0]}${row}`]['v'].slice(0, 3) === 'P&L') {
              obj['description'] = data[`${column[0]}${row}`]['v'];
            }
            if (data[`${column[0]}${row}`]['v'] === 'Summary') {
              obj['Summary'] = row;
            }
            if (data[`${column[0]}${row}`]['v'] === 'Account Head') {
              obj['Account Head'] = row;
            }
          }
        }
        setStartPoint(obj);
      };
      tradeObjectStart();
    }
  }, [data]);

  const tradeDetailsObj = () => {
    let arr = [];
    let keyWordArr = [];
    let noOfRow = data['!ref'].split(':')[1].match(/\d+/)[0];
    let tradeObjColumn = startPoint.tradeDetails;
    for (let i = tradeObjColumn + 1; i <= noOfRow; i++) {
      let obj = {};
      for (let col = 0; col < column.length; col++) {
        if (col == 0 && !keyWordArr.includes(data[`${column[col]}${i}`]['v'])) {
          keyWordArr.push(data[`${column[col]}${i}`]['v']);
        }
        obj[data[`${column[col]}${tradeObjColumn}`]['v']] =
          data[`${column[col]}${i}`]['v'];
      }
      arr.push(obj);
    }
    setKeyWord(keyWordArr);
    return arr;
  };

  const Charges = () => {
    let obj = {};
    let ChargesObjColumn = startPoint['Account Head'];
    for (let i = ChargesObjColumn + 1; i <= 100; i++) {
      if (!data[`${column[0]}${i}`]) {
        return obj;
      }
      obj[data[`${column[0]}${i}`]['v']] = data[`${column[1]}${i}`]['v'];
    }
    return obj;
  };

  const Summary = () => {
    let obj = {};
    let startcol = startPoint['Summary'];
    for (let i = startcol + 1; i < 25; i++) {
      if (data[`${column[0]}${i}`]) {
        if (
          data[`${column[0]}${i}`]['v'] == 'Charges' &&
          obj['Unrealized P&L'] != undefined
        ) {
          return obj;
        }
        let key = data[`${column[0]}${i}`]['v'];
        let val = data[`${column[1]}${i}`]['v'];
        obj[key] = val;
      }
    }
  };

  const finalObj = async () => {
    let final = {
      fileName: file[0].name,
      tradeDetails: tradeDetailsObj(),
      description: startPoint.description,
      fromDate: startPoint.description.split(' ')[5],
      toDate: startPoint.description.split(' ')[7],
      charges: Charges(),
      summary: Summary(),
      keyWord: keyWord.sort(),
    };
    navigation.navigate('Detail', (params = final));
    console.log('final object', final);
  };

  const keyWordCompile = () => {
    let mainObj = tradeDetailsObj();
    let obj = {};

    for (let i = 0; i < mainObj.length; i++) {
      if (!obj[mainObj[i].Symbol]) {
        let valForSymbol = {
          'Buy Value': mainObj[i]['Buy Value'],
          Quantity: mainObj[i]['Quantity'],
          'Sell Value': mainObj[i]['Sell Value'],
          'Realized P&L': mainObj[i]['Realized P&L'],
        };
        obj[mainObj[i].Symbol] = valForSymbol;
      } else {
        obj[mainObj[i].Symbol]['Buy Value'] =
          obj[mainObj[i].Symbol]['Buy Value'] + mainObj[i]['Buy Value'];
        obj[mainObj[i].Symbol]['Quantity'] =
          obj[mainObj[i].Symbol]['Quantity'] + mainObj[i]['Quantity'];
        obj[mainObj[i].Symbol]['Sell Value'] =
          obj[mainObj[i].Symbol]['Sell Value'] + mainObj[i]['Sell Value'];
        obj[mainObj[i].Symbol]['Realized P&L'] =
          obj[mainObj[i].Symbol]['Realized P&L'] + mainObj[i]['Realized P&L'];
      }
    }

    console.log('keyWordCompile', obj);
    navigation.navigate('KeywordDetail', (params = obj));
  };

  return (
    <View style={styles.container}>
      <NaviButton title="Upload File" onPress={() => getData()} />

      <NaviButton
        title="Final object"
        onPress={() => {
          if (startPoint) {
            finalObj();
          } else {
            alert('Please upload file first');
          }
        }}
      />

      <NaviButton
        title="keyword compile"
        onPress={() => {
          if (startPoint) {
            keyWordCompile();
          } else {
            alert('Please upload file first');
          }
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e9fffd',
  },
});

export default FileUpload;

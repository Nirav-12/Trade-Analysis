import React, {Component} from 'react';
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

export default class FileUpload extends Component {
  constructor(props) {
    console.log(props);
    super(props);
    this.state = {
      file: null,
      data: null,
      startPoint: null,
      keyWord: [],
    };
  }

  logout = () => {
    auth()
      .signOut()
      .then(() => {
        console.log('user log out ');
        this.props.navigation.navigate('Home');
      })
      .catch(error => {
        console.log(error);
      });
  };

  getData = async () => {
    try {
      let response = await DocumentPicker.pick({
        type: [types.xlsx, types.xls],
      });
      this.setState({file: response});
    } catch (error) {
      console.log('error', error);
    }
  };

  column = ['B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N'];

  tradeDetailsObj = () => {
    let arr = [];
    let keyWordArr = [];
    let noOfRow = this.state.data['!ref'].split(':')[1].match(/\d+/)[0];
    let tradeObjColumn = this.state.startPoint.tradeDetails;
    for (let i = tradeObjColumn + 1; i <= noOfRow; i++) {
      let obj = {};
      for (let col = 0; col < this.column.length; col++) {
        if (
          col == 0 &&
          !keyWordArr.includes(this.state.data[`${this.column[col]}${i}`]['v'])
        ) {
          keyWordArr.push(this.state.data[`${this.column[col]}${i}`]['v']);
        }
        obj[this.state.data[`${this.column[col]}${tradeObjColumn}`]['v']] =
          this.state.data[`${this.column[col]}${i}`]['v'];
      }
      arr.push(obj);
    }
    this.setState({
      keyWord: keyWordArr,
    });
    return arr;
  };
  Charges = () => {
    let obj = {};
    let ChargesObjColumn = this.state.startPoint['Account Head'];
    for (let i = ChargesObjColumn + 1; i <= 100; i++) {
      if (!this.state.data[`${this.column[0]}${i}`]) {
        return obj;
      }
      obj[this.state.data[`${this.column[0]}${i}`]['v']] =
        this.state.data[`${this.column[1]}${i}`]['v'];
    }
    return obj;
  };

  Summary = () => {
    let obj = {};
    let startcol = this.state.startPoint['Summary'];
    for (let i = startcol + 1; i < 25; i++) {
      if (this.state.data[`${this.column[0]}${i}`]) {
        if (
          this.state.data[`${this.column[0]}${i}`]['v'] == 'Charges' &&
          obj['Unrealized P&L'] != undefined
        ) {
          return obj;
        }
        let key = this.state.data[`${this.column[0]}${i}`]['v'];
        let val = this.state.data[`${this.column[1]}${i}`]['v'];
        obj[key] = val;
      }
    }
  };

  finalObj = async () => {
    let final = {
      fileName: this.state.file[0].name,
      tradeDetails: this.tradeDetailsObj(),
      description: this.state.startPoint.description,
      fromDate: this.state.startPoint.description.split(' ')[5],
      toDate: this.state.startPoint.description.split(' ')[7],
      charges: this.Charges(),
      summary: this.Summary(),
      keyWord: this.state.keyWord.sort(),
    };
    this.props.navigation.navigate('Detail', (params = final));
    console.log('final object', final);
  };

  keyWordCompile = () => {
    let mainObj = this.tradeDetailsObj();
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
    this.props.navigation.navigate('KeywordDetail', (params = obj));
  };

  componentDidMount() {
    console.log('componentDidMount');
    this.props.navigation.setOptions({
      headerRight: () => (
        <View>
          <TouchableOpacity
            onPress={() => {
              this.logout();
            }}>
            <Image
              style={{width: 25, height: 25}}
              source={require('../asset/logout.png')}
            />
          </TouchableOpacity>
        </View>
      ),
    });

    BackHandler.addEventListener('hardwareBackPress', () =>
      BackHandler.exitApp(),
    );
  }
  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', () =>
      BackHandler.exitApp(),
    );
  }
  componentDidUpdate(prevProps, prevState) {
    if (this.state.file != prevState.file) {
      readFile = async () => {
        const b64 = await FileSystem.readFile(this.state.file[0].uri, 'base64');
        const workbook = XLSX.read(b64, {type: 'base64'});
        this.setState({data: workbook.Sheets['F&O']});
      };
      readFile();
    }
    if (this.state.data != prevState.data) {
      tradeObjectStart = () => {
        let obj = {};
        let noOfRow = this.state.data['!ref'].split(':')[1].match(/\d+/)[0];
        for (let row = 1; row <= noOfRow; row++) {
          if (this.state.data[`${this.column[0]}${row}`]) {
            if (this.state.data[`${this.column[0]}${row}`]['v'] === 'Symbol') {
              obj['tradeDetails'] = row;
            }
            if (
              this.state.data[`${this.column[0]}${row}`]['v'].slice(0, 3) ===
              'P&L'
            ) {
              obj['description'] =
                this.state.data[`${this.column[0]}${row}`]['v'];
            }
            if (this.state.data[`${this.column[0]}${row}`]['v'] === 'Summary') {
              obj['Summary'] = row;
            }
            if (
              this.state.data[`${this.column[0]}${row}`]['v'] === 'Account Head'
            ) {
              obj['Account Head'] = row;
            }
          }
        }
        this.setState({
          startPoint: obj,
        });
      };
      tradeObjectStart();
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <NaviButton title="Upload File" onPress={() => this.getData()} />

        <NaviButton
          title="Final object"
          onPress={() => {
            if (this.state.startPoint) {
              this.finalObj();
            } else {
              alert('Please upload file first');
            }
          }}
        />

        <NaviButton
          title="keyword compile"
          onPress={() => {
            if (this.state.startPoint) {
              this.keyWordCompile();
            } else {
              alert('Please upload file first');
            }
          }}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e9fffd',
  },
});

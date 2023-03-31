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
import {fieldName} from '../constant/fieldNames';
import {images} from '../constant/image';
import firestore from '@react-native-firebase/firestore';
import {screen} from '../constant/screens';

export default class FileUpload extends Component {
  user = auth().currentUser;

  constructor(props) {
    super(props);
    this.state = {
      file: null,
      data: null,
      startPoint: null,
      keyWord: [],
      finalObject: {},
      excle: null,
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
      let [response] = await DocumentPicker.pick({
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

  setfFinalObj = async () => {
    let final = {
      fileName: this.state.file.name,
      tradeDetails: this.tradeDetailsObj(),
      description: this.state.startPoint.description,
      fromDate: this.state.startPoint.description.split(' ')[5],
      toDate: this.state.startPoint.description.split(' ')[7],
      charges: this.Charges(),
      summary: this.Summary(),
      keyWord: this.state.keyWord.sort(),
    };
    this.setState({finalObject: final});

    let exist = null;
    compare = firestore().collection('trades');
    await compare
      .where('finalObject.description', '==', final.description)
      .get()
      .then(val => {
        val._docs.map(obj => {
          if (obj._data.uid == this.user.uid) {
            this.exist = true;
          }
        });
      });

    if (!this.exist) {
      console.log('data not exist');
      ref = firestore().collection('trades').doc();
      ref.set({
        file: this.state.excle,
        id: ref._documentPath._parts[1],
        uid: this.user.uid,
        finalObject: final,
      });
    } else {
      console.log('data exist ');
    }
  };

  keyWordCompile = () => {
    let mainObj = this.state.finalObject.tradeDetails;
    let obj = {};

    for (let i = 0; i < mainObj.length; i++) {
      if (!obj[mainObj[i].Symbol]) {
        let valForSymbol = {
          'Buy Value': mainObj[i][fieldName.BUY_VALUE],
          Quantity: mainObj[i][fieldName.QUANTITY],
          'Sell Value': mainObj[i][fieldName.SELL_VALUE],
          'Realized P&L': mainObj[i][fieldName.REALIZED_P_L],
        };
        obj[mainObj[i].Symbol] = valForSymbol;
      } else {
        obj[mainObj[i].Symbol][fieldName.BUY_VALUE] =
          obj[mainObj[i].Symbol][fieldName.BUY_VALUE] +
          mainObj[i][fieldName.BUY_VALUE];
        obj[mainObj[i].Symbol][fieldName.QUANTITY] =
          obj[mainObj[i].Symbol][fieldName.QUANTITY] +
          mainObj[i][fieldName.QUANTITY];
        obj[mainObj[i].Symbol][fieldName.SELL_VALUE] =
          obj[mainObj[i].Symbol][fieldName.SELL_VALUE] +
          mainObj[i][fieldName.SELL_VALUE];
        obj[mainObj[i].Symbol][fieldName.REALIZED_P_L] =
          obj[mainObj[i].Symbol][fieldName.REALIZED_P_L] +
          mainObj[i][fieldName.REALIZED_P_L];
      }
    }

    console.log('keyWordCompile', obj);
    this.props.navigation.navigate(screen.KEYWORD_DETAIL, (params = obj));
  };

  componentDidMount() {
    this.props.navigation.setOptions({
      headerRight: () => (
        <View>
          <TouchableOpacity
            onPress={() => {
              this.logout();
            }}>
            <Image style={{width: 25, height: 25}} source={images.LOGOUT} />
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
        const b64 = await FileSystem.readFile(this.state.file.uri, 'base64');
        const workbook = XLSX.read(b64, {type: 'base64'});
        this.setState({data: workbook.Sheets['F&O'], excle: workbook});
      };
      readFile();
    }
    if (this.state.data != prevState.data) {
      tradeObjectStart = () => {
        let obj = {};
        let noOfRow = this.state.data['!ref'].split(':')[1].match(/\d+/)[0];
        for (let row = 1; row <= noOfRow; row++) {
          if (this.state.data[`${this.column[0]}${row}`]) {
            if (
              this.state.data[`${this.column[0]}${row}`]['v'] ===
              fieldName.SYMBOL
            ) {
              obj[fieldName.TRADE_DETAILS] = row;
            }
            if (
              this.state.data[`${this.column[0]}${row}`]['v'].slice(0, 3) ===
              fieldName.P_L
            ) {
              obj[fieldName.DESCRIPTION] =
                this.state.data[`${this.column[0]}${row}`]['v'];
            }
            if (
              this.state.data[`${this.column[0]}${row}`]['v'] ===
              fieldName.SUMMARY
            ) {
              obj[fieldName.SUMMARY] = row;
            }
            if (
              this.state.data[`${this.column[0]}${row}`]['v'] ===
              fieldName.ACCOUNT_HEAD
            ) {
              obj[fieldName.ACCOUNT_HEAD] = row;
            }
          }
        }
        this.setState({
          startPoint: obj,
        });
      };
      tradeObjectStart();
    }

    if (this.state.startPoint != prevState.startPoint) {
      this.setfFinalObj();
    }
  }

  render() {
    return (
      <View>
        <NaviButton title="Upload File" onPress={() => this.getData()} />

        <NaviButton
          title="Final object"
          onPress={() => {
            if (this.state.finalObject) {
              console.log(this.state.finalObject);
            } else {
              alert('Please upload file first');
            }
          }}
        />

        <NaviButton
          title="keyword compile"
          onPress={() => {
            if (this.state.finalObject) {
              this.keyWordCompile(screen.KEYWORD_DETAIL);
            } else {
              alert('Please upload file first');
            }
          }}
        />

        <NaviButton
          title="Filter"
          onPress={() => {
            if (this.state.data) {
              this.props.navigation.navigate(screen.FILTER, {
                params: this.state.finalObject,
              });
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

import React, {FC, useRef, useEffect, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  FlatList,
  Dimensions,
  StyleSheet,
} from 'react-native';
import {StackNavigationProp} from '@react-navigation/stack';

import Colors from '../../constants/Color';
import Button from '../../components/UI/Button';
import {users} from '../../Data/UserData';
import {AppNavigatorParamsList} from '../../types/NavigationTypes';
import FloatButton from '../../components/UI/Buttons/FloatButton';
import PostModal from '../../components/UI/Modal/PostModal';
import firebase from '../../constants/firebase';

export interface HomeProps {
  navigation: StackNavigationProp<AppNavigatorParamsList, 'home'>;
}

const Screen = {
  width: Dimensions.get('window').width,
  height: Dimensions.get('window').height,
};
const snapPoints = [0, Screen.height / 1, '100%', '100%'];
const HomeScreen: FC<HomeProps> = props => {
  const openRef = useRef<number | null>(null);
  const [departs, setDeparts] = useState([]);
  const [like, setLike] = useState(false);

  const isTraveling: boolean = false;
  const {navigation} = props;

  useEffect(() => {
    firebase
      .firestore()
      .collection('departs')
      .onSnapshot(querySnapshot => {
        const departs = [];
        querySnapshot.docs.forEach(doc => {
          const {date, profileImage, username, destination} = doc.data();
          departs.push({
            id: doc.id,
            date,
            profileImage,
            username,
            destination,
          });
        });
        setDeparts(departs);
      });
  }, []);

  // const likeHandler = () => {
  //   setLike(true);
  // };
  // const nonLikeHandler = () => {
  //   setLike(false);
  // };
  // const postLikeHandler = async () => {
  //   await firebase.firestore().collection('likes').add({
  //     date: firebase.firestore.FieldValue.serverTimestamp(), // 登録日時
  //     uid: uid,
  //     like: like,
  //   });
  // };

  return (
    <>
      {/* isTravelingのbooleanで表示変更 */}
      <View style={styles.container}>
        <Text style={styles.textTop}>バックパッカーならではの</Text>
        <Text style={styles.textBottom}>経験を共有しよう！</Text>
        {isTraveling !== true ? (
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('depart');
            }}>
            <Button style={styles.departButton}>
              <Text style={styles.buttonText}>出発する</Text>
            </Button>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('depart');
            }}>
            <Button style={styles.departingButton}>
              <Text style={styles.buttonText}>{users[0].place[0]}</Text>
              <View style={styles.gtButton}>
                <Text style={styles.gtButtonText}>GT</Text>
              </View>
              <Text style={styles.gtCount}>4</Text>
            </Button>
          </TouchableOpacity>
        )}
      </View>

      {/* ここからはリスト部分の画面 */}
      <View style={styles.listContainer}>
        <View>
          <Text style={styles.listTitleText}>現在旅しているユーザー</Text>
        </View>
        {/* firebaseのデータに変更必要あり */}
        <FlatList
          data={departs}
          renderItem={({item}) => (
            <View style={styles.listItemContainer}>
              <TouchableOpacity style={styles.listUserContainer}>
                <Image style={styles.image} source={{uri: item.profileImage}} />
                <View>
                  <Text style={styles.listName}>{item.username}</Text>
                  <Text style={styles.listPlace}>{item.destination}</Text>
                </View>
              </TouchableOpacity>

              {like === false ? (
                <TouchableOpacity>
                  <Button style={styles.listButtonNon}>
                    <Text style={styles.listButtonTextNon}>GT</Text>
                  </Button>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity>
                  <Button style={styles.listButton}>
                    <Text style={styles.listButtonText}>GT</Text>
                  </Button>
                </TouchableOpacity>
              )}
            </View>
          )}
        />
        <View style={styles.fab}>
          <FloatButton openRef={openRef} />
        </View>
      </View>
      <PostModal snapPoints={snapPoints} openRef={openRef} />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: Colors.primaryColor,
    height: '26%',
  },
  textTop: {
    fontSize: 20,
    fontWeight: '700',
    paddingTop: '20%',
    paddingBottom: 10,
    color: 'white',
  },
  textBottom: {
    fontSize: 20,
    fontWeight: '700',
    paddingBottom: 10,
    color: 'white',
  },
  departButton: {
    width: 160,
    height: 40,
    backgroundColor: 'white',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  departingButton: {
    width: 260,
    height: 40,
    backgroundColor: 'white',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  gtButton: {
    width: 35,
    height: 35,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 0.5,
    borderColor: Colors.primaryColor,
    backgroundColor: Colors.primaryColor,
    marginLeft: 15,
  },
  gtButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  gtCount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.primaryColor,
    marginLeft: 7,
  },
  buttonText: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.primaryColor,
  },
  listTitleText: {
    fontSize: 20,
    fontWeight: '700',
    padding: 25,
  },

  // ここから下はリスト部分,後々FlatListに変更
  listContainer: {
    backgroundColor: 'white',
    height: '100%',
  },
  listItemContainer: {
    flexDirection: 'row',
    marginBottom: 10,
    marginHorizontal: 15,
    justifyContent: 'space-between',
  },
  listUserContainer: {
    flexDirection: 'row',
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 50,
    marginRight: 20,
  },
  listName: {
    fontSize: 18,
  },
  listPlace: {
    fontSize: 16,
    fontWeight: '500',
    marginTop: 5,
  },
  listButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 15,
    borderWidth: 0.5,
    backgroundColor: Colors.primaryColor,
    borderColor: Colors.primaryColor,
    marginLeft: 15,
  },
  listButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  listButtonNon: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 15,
    borderWidth: 0.5,
    borderColor: Colors.primaryColor,
    marginLeft: 15,
  },
  listButtonTextNon: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.primaryColor,
  },
  fab: {
    position: 'absolute',
    right: 15,
    top: 500,
  },
});

export default HomeScreen;

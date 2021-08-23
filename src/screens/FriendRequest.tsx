import React, { useState, useEffect } from 'react'
import { View, Text, TextInput, TouchableOpacity, Image, FlatList } from 'react-native'
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import firebase from "@react-native-firebase/app";
interface requetsIF {
  accept: boolean,
  idReceiver: string,
  idSender: string,
  _iddocument: string,
}
const FriendRequest = () => {
  const [onClick, setOnClick] = useState(false);
  const [requests, setRequests] = useState([]);
  const [authID, setAuthId] = useState();
  const [authUserName, setAuthUserName] = useState();
  const [data, setData] = useState([]);
  useEffect(() => {
    auth()
    const authCurrent: any = firebase.auth().currentUser?.uid;
    const authCurrentName: any = firebase.auth().currentUser?.displayName;
    setAuthId(authCurrent);
    setAuthUserName(authCurrentName);
    firestore()
      .collection('users')
      .get()
      .then(querySnapshot => {
        const newData: any = querySnapshot.docs.map(doc => ({
          _iddocument: doc.id,
          ...doc.data(),
        }));
        setData(newData);
      })
      .catch(error => {
        console.log('Error getting documents: ', error);
      });
  }, []);

  useEffect(() => {
    firestore()
      .collection('RequestFriend')
      .where('accept', '==', false)
      .get()
      .then(querySnapshot => {
        const newData: any = querySnapshot.docs.map(doc => ({
          _iddocument: doc.id,
          ...doc.data(),
        }));
        setRequests(newData);
      })
      .catch(error => {
        console.log('Error getting documents: ', error);
      });
  }, [onClick]);
  const onAccept = (_iddocument: string, idFriend: string, idUser: string, displayName: string, img: string) => {
    firestore()
      .collection('RequestFriend').doc(_iddocument).update({
        accept: true,
      });
    firestore()
      .collection('Friends')
      .doc(authID)
      .collection('List')
      .add({
        idReceiver: idFriend,
        idSender: idUser,
        idBoxChat: idFriend.slice(14) + idUser.slice(14),
        userName: authUserName,
        friendName: displayName,
        img: img,
      });
    // firestore()
    //   .collection('Friends')
    //   .doc(idUser)
    //   .collection('List')
    //   .add({
    //     idReceiver: idFriend,
    //     idSender: idUser,
    //     idBoxChat: Math.floor(Math.random()),
    //     userName: authUserName,
    //     friendName: displayName,
    //     img: img,
    //   });
    setOnClick(!onClick);
  };
  const renderItem: any = ({ item }: { item: any }) => {
    return requests.map((e: requetsIF) => {
      if (e.idSender == item.id && authID !== e.idSender && authID == e.idReceiver)
        return (
          <View key={item.id}>
            <Text>{item.displayName}</Text>
            <Image source={{ uri: item.ImgUrl }} style={{ height: 100, width: 100 }} />
            <TouchableOpacity onPress={() => {
              onAccept(e._iddocument,
                e.idReceiver,
                e.idSender,
                item.displayName,
                item.ImgUrl)
            }}>
              <Text>Chấp nhận</Text>
            </TouchableOpacity>
          </View>
        )
    });
  }
  return (
    <View>
      <FlatList
        data={data}
        renderItem={renderItem}
      />
    </View>
  )
}

export default FriendRequest

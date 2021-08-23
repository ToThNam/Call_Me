import React, { useState, useEffect } from 'react'
import { View, Text, TextInput, TouchableOpacity, Image, FlatList } from 'react-native'
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import firebase from "@react-native-firebase/app";
interface FriendIF {
  _iddocument: string,
  id: string,
}
export default function FirstScreen({ navigation }: { navigation: any }) {
  const [data, setData] = useState([]);
  const [authID, setAuthId] = useState();
  useEffect(() => {
    auth()
    const authCurrent: any = firebase.auth().currentUser?.uid;
    setAuthId(authCurrent);
    firestore()
      .collection('users')
      .get()
      // .then(querySnapshot => {
      //   console.log('Total users: ', querySnapshot.size);
      //   querySnapshot.forEach(documentSnapshot => {
      //     console.log('User ID: ', documentSnapshot.id, documentSnapshot.data());
      //   });
      // });
      .then(querySnapshot => {
        const docsData: any = querySnapshot.docs.map(doc => ({
          // _iddocument: doc.id,
          ...doc.data(),

        }));
        setData(docsData);
      })
      .catch(error => {
        console.log('Error getting documents: ', error);
      });
  }, []);

  const addFriend = (idFriend: string,) => {
    firestore()
      .collection('RequestFriend').add({
        idSender: authID,
        idReceiver: idFriend,
        accept: false,
      });
  }
  const SignOut = () => {
    auth()
      .signOut()
      .then(() => {
        // Sign-out successful.
        navigation.replace('Login');
      })
      .catch(error => {
        console.log('Error getting documents: ', error);
      });
  };
  return (
    <View>
      <TouchableOpacity onPress={SignOut}>
        <Text>Log out</Text>
      </TouchableOpacity>
      <FlatList
        data={data}
        renderItem={(item: any) => {
          return (
            authID !== item.item.id ?
              <View>
                <Text>{item.item.displayName}</Text>
                <Image source={{ uri: item.item.ImgUrl }} style={{ height: 100, width: 100 }} />
                <TouchableOpacity onPress={() => addFriend(item.item.id)}>
                  <Text>Thêm bạn bè</Text>
                </TouchableOpacity>
              </View> :
              <View></View>
          )
        }}
      />
      <TouchableOpacity onPress={() => navigation.navigate('FriendRequest')}>
        <Text>Frend request</Text>
      </TouchableOpacity>
    </View>
  )
}


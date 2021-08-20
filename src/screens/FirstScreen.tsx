import React, { useState, useEffect } from 'react'
import { View, Text, TextInput, TouchableOpacity, Image, FlatList } from 'react-native'
import { auth, authCurrent } from '../components/FireConect';
import firestore, { firebase } from '@react-native-firebase/firestore';

export default function FirstScreen({ navigation }: { navigation: any }) {
  const [data, setData] = useState();
  useEffect(() => {
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
        const docsData = querySnapshot.docs.map(doc => ({
          // _iddocument: doc.id,
          ...doc.data(),

        }));
        setData(docsData);
        console.log('docsData ', docsData);
      })
      .catch(error => {
        console.log('Error getting documents: ', error);
      });
  }, []);

  const addFriend = (idFriend: any) => {
    console.log('checkk');
    firestore()
      .collection('RequestFriend').add({
        idSender: authCurrent.uid,
        idReceiver: idFriend,
        accept: false,
      });
  }
  const SignOut = () => {
    auth
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
        renderItem={({ item }) => {
          return (
            <View>
              <Text>{item.displayName}</Text>
              <Image source={{ uri: item.ImgUrl }} style={{ height: 100, width: 100 }} />
              <TouchableOpacity onPress={() => addFriend(item.id)}>
                <Text>Thêm bạn bè</Text>
              </TouchableOpacity>
            </View>
          )
        }}
      />

    </View>
  )
}

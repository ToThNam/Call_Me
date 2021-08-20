import firebase from "@react-native-firebase/app"

const auth = firebase.auth();
const authCurrent = auth.currentUser;
export { auth, authCurrent };
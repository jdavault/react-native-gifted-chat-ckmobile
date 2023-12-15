import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Input, Button } from 'react-native-elements'
import { auth } from '../firebase'

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      if (user) {
        navigation.replace('Chat');
      } else {
        navigation.canGoBack() &&
          navigation.popToTop()
      }
    });
    return unsubscribe
  }, [])

  const signIn = () => {
    auth.signInWithEmailAndPassword(email, password)
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        alert(errorMessage)
      });
    navigation.replace("Chat")
  }

  return (
    <View style={styles.container}>
      <Input
        placeholder='Enter your email'
        label="Email"
        leftIcon={{ type: 'material', name: 'email' }}
        value={email}
        onChangeText={text => setEmail(text)}
      />
      <Input
        placeholder='Enter your password'
        label="Password"
        leftIcon={{ type: 'material', name: 'lock' }}
        value={password}
        secureTextEntry
        onChangeText={text => setPassword(text)}
      />
      <Button title="Sign In" style={styles.button} onPress={signIn} />
      <Button title="Register" style={styles.button} onPress={() => navigation.navigate("Register")} />
    </View>
  )
}

export default LoginScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    padding: 20
  },
  button: {
    marginTop: 10,
    width: 200,
  }
})
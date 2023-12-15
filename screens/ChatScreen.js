import { Button, StyleSheet, Text, View, Dimensions } from 'react-native'
import React, { useLayoutEffect, useEffect, useCallback, useState } from 'react'
import { auth, db } from "../firebase"
import { AntDesign } from "@expo/vector-icons"
import { TouchableOpacity } from 'react-native-gesture-handler'
import { Avatar } from 'react-native-elements'
import { GiftedChat } from 'react-native-gifted-chat'

const ChatScreen = ({ navigation }) => {
  const [messages, setMessages] = useState([
    {
      _id: 123,
      text:
        'This is a test of Gifted Chat for the WEB 🎉 \n https://github.com/FaridSafi/react-native-gifted-chat ',
      user: {
        _id: 1,
        name: 'you',
        avatar: '/me.jpg',
      },
      createdAt: new Date(),
    },
    {
      _id: 456,
      text:
        'Find source code here: \n https://github.com/xcarpentier/gifted-chat-web-demo',
      user: {
        _id: 2,
        name: 'you',
        avatar: '/me.jpg',
      },
      createdAt: new Date(),
    },
  ])

  // useEffect(() => {
  //   setMessages([
  //     {
  //       _id: 1,
  //       text: 'Hi Joe',
  //       createdAt: new Date(),
  //       user: {
  //         _id: 2,
  //         name: 'Sarah',
  //         avatar: 'https://t4.ftcdn.net/jpg/02/15/84/43/360_F_215844325_ttX9YiIIyeaR7Ne6EaLLjMAmy4GvPC69.jpg',
  //       },
  //     },
  //     {
  //       _id: 2,
  //       text: 'Dad',
  //       createdAt: new Date(),
  //       user: {
  //         _id: 2,
  //         name: 'Janelle',
  //         avatar: 'https://placeimg.com/140/140/any',
  //       },
  //     }
  //   ])
  // }, [])

  useLayoutEffect(() => {

    const unsubscribe = db.collection('chats').orderBy('createdAt', 'desc').
      onSnapshot(snapshot => setMessages(
        snapshot.docs.map(doc => ({
          _id: doc.data()._id,
          createdAt: doc.data().createdAt.toDate(),
          text: doc.data().text,
          user: doc.data().user
        }))
      ))

    navigation.setOptions({
      headerLeft: () => (
        <View style={{ marginLeft: 20, marginTop: 5 }}>
          <Avatar style={{ height: 30, width: 30 }}
            rounded
            source={{
              uri: auth?.currentUser?.photoURL
            }}
          />
        </View>
      ),
      headerRight: () => (
        <TouchableOpacity
          onPress={signout}
          style={{ marginRight: 20, marginTop: 5 }}>
          <AntDesign name="logout" size={24} color="black" />
        </TouchableOpacity>
      )
    })
    return unsubscribe
  }, [])

  const onSend = useCallback((messages = []) => {
    setMessages(previousMessages => GiftedChat.append(previousMessages, messages))
    const { _id, createdAt, text, user } = messages[0];
    db.collection('chats').add({
      _id, createdAt, text, user
    })
  }, [])

  //const onSend = (newMsg) => setMessages([...messages, ...newMsg])

  const signout = () => {
    auth.signOut().then(() => {
      navigation.replace("Login")
    }).catch((error) => {
      alert("ERROR: " + error)
    });
  }

  const user = { _id: 1, name: 'me' }
  const inverted = false
  const { width, height } = Dimensions.get('window')

  return (
    <View style={{ width: 370, margin: 10 }}>
      <View style={{ width: "100%", height: 700 }}>
        <GiftedChat
          messages={messages}
          onSend={messages => onSend(messages)}
          messagesContainerStyle={styles.messagesBox}
          user={{
            _id: auth?.currentUser?.email,
            name: auth?.currentUser?.displayName,
            avatar: auth?.currentUser?.photoURL ? auth?.currentUser?.photoURL : "https://t4.ftcdn.net/jpg/02/15/84/43/360_F_215844325_ttX9YiIIyeaR7Ne6EaLLjMAmy4GvPC69.jpg"
          }}
          renderUsernameOnMessage={true}
          // loadEarlier={showLoadEarlier}
          // isLoadingEarlier={isLoadingEarlier}
          infiniteScroll={true}
          alwaysShowSend={true}
          // onLoadEarlier={onLoadEarlier}
          //renderBubble={newProps => renderBubble(newProps)}
          inverted={false}
          showAvatarForEveryMessage={true}
          //renderAvatar={null as never}
          scrollToBottom={true}
        />
        <Button title="Sign Out" style={styles.button} onPress={signout} />
      </View>
    </View>
  )
}

export default ChatScreen

const styles = StyleSheet.create({})
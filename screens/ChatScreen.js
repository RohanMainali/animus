"use client"

import { Ionicons } from "@expo/vector-icons"
import { useTheme } from "@react-navigation/native"
import { useEffect, useRef, useState } from "react"
import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native"
import { Colors } from "../constants/colors"
import { chatWithAnimus } from "../utils/chatApi"

const ChatScreen = ({ route }) => {
  const { colors } = useTheme()
  const [messages, setMessages] = useState([])
  const [inputText, setInputText] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const flatListRef = useRef(null)

  useEffect(() => {
    // Initial welcome message or prompt from route params
    const initialPrompt = route.params?.initialPrompt
    setMessages([
      {
        id: "1",
        text: "Hello! I am Animus, your AI-powered health assistant. How can I help you today?",
        sender: "bot",
      },
    ])
    if (initialPrompt) {
      setTimeout(() => handleSendMessage(initialPrompt), 500)
    }
  }, [route.params?.initialPrompt])

  useEffect(() => {
    if (flatListRef.current) {
      flatListRef.current.scrollToEnd({ animated: true })
    }
  }, [messages])

  const handleSendMessage = async (text = inputText) => {
    if (text.trim() === "") return

    const newMessage = { id: Date.now().toString(), text: text, sender: "user" }
    setMessages((prevMessages) => [...prevMessages, newMessage])
    setInputText("")
    setIsTyping(true)

    try {
      // In a real production app, this would involve calling a backend API
      // that integrates with a large language model (LLM) like OpenAI's GPT-4o
      // to generate dynamic chat responses.
      const response = await chatWithAnimus(text)
      const botMessage = { id: Date.now().toString() + "_bot", text: response.response, sender: "bot" }
      setMessages((prevMessages) => [...prevMessages, botMessage])
    } catch (error) {
      console.error("Chat API error:", error)
      const errorMessage = {
        id: Date.now().toString() + "_error",
        text: "Sorry, I could not process your request. Please try again.",
        sender: "bot",
      }
      setMessages((prevMessages) => [...prevMessages, errorMessage])
    } finally {
      setIsTyping(false)
    }
  }

  const renderMessage = ({ item }) => (
    <View
      style={[
        styles.messageBubble,
        item.sender === "user" ? styles.userMessage : styles.botMessage,
        {
          backgroundColor: item.sender === "user" ? Colors.primary : colors.card,
          borderColor: item.sender === "user" ? Colors.primary : colors.borderColorLight,
        },
      ]}
    >
      <Text style={[styles.messageText, { color: item.sender === "user" ? Colors.textLight : colors.text }]}>
        {item.text}
      </Text>
    </View>
  )

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.background }]}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
    >
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.messagesContainer}
      />
      {isTyping && (
        <View style={styles.typingIndicator}>
          <ActivityIndicator size="small" color={Colors.primary} />
          <Text style={[styles.typingText, { color: colors.text }]}>Animus is typing...</Text>
        </View>
      )}
      <View style={[styles.inputContainer, { borderTopColor: colors.borderColorLight }]}>
        <TextInput
          style={[styles.textInput, { backgroundColor: colors.card, color: colors.text }]}
          value={inputText}
          onChangeText={setInputText}
          placeholder="Ask Animus a question..."
          placeholderTextColor={colors.text + "80"}
          multiline
          returnKeyType="send"
          onSubmitEditing={() => handleSendMessage()}
          blurOnSubmit={false}
        />
        <TouchableOpacity
          style={[styles.sendButton, { backgroundColor: Colors.primary }]}
          onPress={() => handleSendMessage()}
          disabled={inputText.trim() === "" || isTyping}
          accessibilityLabel="Send message"
        >
          <Ionicons name="send" size={24} color={Colors.textLight} />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  messagesContainer: {
    paddingVertical: 15,
    paddingHorizontal: 15,
  },
  messageBubble: {
    maxWidth: "80%",
    padding: 14,
    borderRadius: 20,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
    borderWidth: 1,
  },
  userMessage: {
    alignSelf: "flex-end",
    borderBottomRightRadius: 5,
  },
  botMessage: {
    alignSelf: "flex-start",
    borderBottomLeftRadius: 5,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  typingIndicator: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    marginBottom: 10,
  },
  typingText: {
    marginLeft: 10,
    fontStyle: "italic",
    opacity: 0.7,
    fontSize: 14,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderTopWidth: 1,
  },
  textInput: {
    flex: 1,
    borderRadius: 25,
    paddingHorizontal: 18,
    paddingVertical: 12,
    minHeight: 50,
    maxHeight: 120, // Limit height for multiline input
    marginRight: 10,
    fontSize: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  sendButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  sendButtonText: {
    color: Colors.textLight,
    fontSize: 17,
    fontWeight: "bold",
  },
})

export default ChatScreen

import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Image,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Modal,
  Dimensions,
  SafeAreaView,
  Keyboard,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import { GiftedChat } from "react-native-gifted-chat";
import axios from "axios";

const { width } = Dimensions.get("window");

export default function DetailKonseling({ route, navigation }) {
  // Destructure params dengan default values untuk menghindari error
  const {
    user = {},
    userData = {},
    targetUsername = "",
    targetDisplay = "User",
  } = route?.params || {};

  // Gunakan userData jika ada, jika tidak gunakan user sebagai fallback
  const currentUser = userData?.username ? userData : user;

  const flatListRef = useRef(null);

  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [input, setInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [filteredMessages, setFilteredMessages] = useState([]);

  const emojis = [
    "😊",
    "😂",
    "❤️",
    "👍",
    "😢",
    "😮",
    "😡",
    "🤔",
    "👋",
    "🙏",
    "💪",
    "🎉",
    "🔥",
    "💯",
    "🌟",
    "✨",
  ];

  // Validasi parameter yang diperlukan
  useEffect(() => {
    console.log("Current user:", currentUser);
    console.log("Target username:", targetUsername);
    console.log("Route params:", route?.params);

    if (!currentUser?.username || !targetUsername) {
      console.log(
        "Missing data - currentUser:",
        currentUser,
        "targetUsername:",
        targetUsername
      );
      Alert.alert("Error", "Data pengguna tidak lengkap", [
        { text: "OK", onPress: () => navigation.goBack() },
      ]);
      return;
    }
  }, [currentUser, targetUsername, navigation]);

  // Fetch messages
  useEffect(() => {
    const fetchMessages = async () => {
      // Jika data user tidak lengkap, jangan fetch
      if (!currentUser?.username || !targetUsername) {
        return;
      }

      setIsLoading(true);
      try {
        const response = await axios.get("http://10.1.47.159:8080/messages", {
          params: {
            user1: currentUser.username,
            user2: targetUsername,
          },
          timeout: 10000, // 10 second timeout
        });

        if (response.data && Array.isArray(response.data)) {
          const fetched = response.data.map((msg) => ({
            _id: msg.msgId || `msg_${Date.now()}_${Math.random()}`,
            text: msg.messageContent || "",
            createdAt: msg.createdAt ? new Date(msg.createdAt) : new Date(),
            user: {
              _id: msg.senderUsername || "unknown",
              name: msg.senderUsername || "Unknown",
            },
          }));

          setMessages(fetched.reverse());
        } else {
          setMessages([]);
        }
      } catch (error) {
        console.error("Error fetching messages:", error);
        // Jangan tampilkan alert untuk error fetch, biarkan chat kosong
        setMessages([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMessages();
  }, [currentUser, targetUsername]);

  // Handle keyboard dismiss when screen loses focus
  useFocusEffect(
    React.useCallback(() => {
      return () => {
        Keyboard.dismiss();
      };
    }, [])
  );

  // Filter messages based on search
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredMessages(messages);
    } else {
      const filtered = messages.filter((message) =>
        message.text.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredMessages(filtered);
    }
  }, [searchQuery, messages]);

  const onSend = useCallback(
    async (newMessages = []) => {
      if (!currentUser?.username || !targetUsername) {
        Alert.alert("Error", "Data pengguna tidak lengkap");
        return;
      }

      // Optimistically update UI
      setMessages((prev) => GiftedChat.append(prev, newMessages));

      const msg = newMessages[0];
      if (!msg || !msg.text?.trim()) {
        return;
      }

      try {
        await axios.post(
          "http://10.1.47.159:8080/messages",
          {
            senderUsername: currentUser.username,
            receiverUsername: targetUsername,
            messageContent: msg.text,
          },
          {
            timeout: 10000, // 10 second timeout
          }
        );
      } catch (error) {
        console.error("Error sending message:", error);
        // Rollback optimistic update
        setMessages((prev) => prev.filter((m) => m._id !== msg._id));
        Alert.alert("Error", "Gagal mengirim pesan. Silakan coba lagi.");
      }
    },
    [currentUser, targetUsername]
  );

  const sendMessage = (
    messageText = input,
    messageType = "text",
    imageUri = null
  ) => {
    if ((!messageText?.trim() && !imageUri) || !currentUser?.username) return;

    const newMessage = [
      {
        _id: `${Date.now()}_${Math.random()}`,
        text: messageText,
        createdAt: new Date(),
        user: {
          _id: currentUser.username,
          name: currentUser.username,
        },
      },
    ];

    onSend(newMessage);
    setInput("");
    setShowEmojiPicker(false);
  };

  const pickImage = async () => {
    try {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission needed",
          "Izin akses galeri diperlukan untuk mengirim gambar"
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets?.[0]?.uri) {
        sendMessage("📷 Foto", "image", result.assets[0].uri);
      }
    } catch (error) {
      console.error("Error picking image:", error);
      Alert.alert("Error", "Gagal memilih gambar");
    }
  };

  const addEmoji = (emoji) => {
    setInput((prev) => prev + emoji);
  };

  // Empty State Component
  const renderEmptyState = () => (
    <View style={styles.emptyStateContainer}>
      <View style={styles.emptyStateIcon}>
        <Ionicons name="chatbubbles-outline" size={80} color="#D6385E" />
      </View>
      <Text style={styles.emptyStateTitle}>Belum ada pesan</Text>
      <Text style={styles.emptyStateSubtitle}>
        Mulai percakapan dengan {targetDisplay}
      </Text>
      <View style={styles.emptyStateActions}>
        <TouchableOpacity
          style={styles.quickActionBtn}
          onPress={() => sendMessage("Halo! 👋")}>
          <Ionicons name="hand-left-outline" size={20} color="#D6385E" />
          <Text style={styles.quickActionText}>Sapa</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.quickActionBtn}
          onPress={() => sendMessage("Bagaimana kabarmu?")}>
          <Ionicons name="help-circle-outline" size={20} color="#D6385E" />
          <Text style={styles.quickActionText}>Tanya Kabar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  // Loading State Component
  const renderLoadingState = () => (
    <View style={styles.loadingContainer}>
      <View style={styles.loadingDots}>
        <View style={[styles.dot, styles.dot1]} />
        <View style={[styles.dot, styles.dot2]} />
        <View style={[styles.dot, styles.dot3]} />
      </View>
      <Text style={styles.loadingText}>Memuat pesan...</Text>
    </View>
  );

  // Jika data user tidak valid, tampilkan error state
  if (!currentUser?.username || !targetUsername) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle-outline" size={60} color="#D6385E" />
          <Text style={styles.errorTitle}>Terjadi Kesalahan</Text>
          <Text style={styles.errorMessage}>
            Data pengguna tidak lengkap{"\n"}
            User: {currentUser?.username || "tidak ada"}
            {"\n"}
            Target: {targetUsername || "tidak ada"}
          </Text>
          <TouchableOpacity
            style={styles.errorButton}
            onPress={() => navigation.goBack()}>
            <Text style={styles.errorButtonText}>Kembali</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backBtn}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerText}>{targetDisplay}</Text>
          <TouchableOpacity
            onPress={() => {
              setShowSearch(!showSearch);
              if (showSearch) {
                Keyboard.dismiss();
              }
            }}>
            <Ionicons name="search" size={24} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        {showSearch && (
          <View style={styles.searchContainer}>
            <TextInput
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Cari pesan..."
              style={styles.searchInput}
              autoFocus
            />
            <TouchableOpacity
              onPress={() => {
                setShowSearch(false);
                setSearchQuery("");
                Keyboard.dismiss();
              }}>
              <Ionicons name="close" size={24} color="#666" />
            </TouchableOpacity>
          </View>
        )}

        {/* Chat Area */}
        <View style={styles.chatArea}>
          {isLoading ? (
            renderLoadingState()
          ) : messages.length === 0 ? (
            renderEmptyState()
          ) : (
            <GiftedChat
              messages={messages}
              onSend={onSend}
              user={{
                _id: currentUser.username,
                name: currentUser.username,
              }}
              placeholder="Ketik pesan..."
              showUserAvatar={false}
              renderAvatar={null}
              messagesContainerStyle={styles.messagesContainer}
              textInputStyle={styles.giftedTextInput}
              sendButtonProps={{
                containerStyle: styles.giftedSendButton,
              }}
            />
          )}
        </View>

        {/* Emoji Picker Modal */}
        <Modal
          visible={showEmojiPicker}
          transparent
          animationType="slide"
          onRequestClose={() => setShowEmojiPicker(false)}>
          <TouchableOpacity
            style={styles.emojiModalOverlay}
            onPress={() => setShowEmojiPicker(false)}>
            <View style={styles.emojiPicker}>
              <FlatList
                data={emojis}
                numColumns={8}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    onPress={() => addEmoji(item)}
                    style={styles.emojiItem}>
                    <Text style={styles.emoji}>{item}</Text>
                  </TouchableOpacity>
                )}
                keyExtractor={(item, index) => index.toString()}
              />
            </View>
          </TouchableOpacity>
        </Modal>

        {/* Custom Input (for empty state) */}
        {messages.length === 0 && (
          <View style={styles.inputContainer}>
            <View style={styles.inputRow}>
              <TouchableOpacity
                onPress={() => setShowEmojiPicker(true)}
                style={styles.actionBtn}>
                <Ionicons name="happy-outline" size={24} color="#666" />
              </TouchableOpacity>

              <TextInput
                value={input}
                onChangeText={setInput}
                placeholder="Ketik pesan..."
                style={styles.input}
                multiline
                maxLength={1000}
              />

              <TouchableOpacity onPress={pickImage} style={styles.actionBtn}>
                <Ionicons name="camera-outline" size={24} color="#666" />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => sendMessage()}
                style={[styles.sendBtn, { opacity: input.trim() ? 1 : 0.5 }]}
                disabled={!input.trim()}>
                <Ionicons name="send" size={20} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: Platform.OS === "ios" ? 0 : 10,
    padding: 15,
    backgroundColor: "#D6385E",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  backBtn: {
    padding: 5,
  },
  headerText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
    flex: 1,
    textAlign: "center",
    marginHorizontal: 10,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e1e1e1",
  },
  searchInput: {
    flex: 1,
    backgroundColor: "#f0f0f0",
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
  },
  chatArea: {
    flex: 1,
  },
  messagesContainer: {
    backgroundColor: "#f5f5f5",
  },
  giftedTextInput: {
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#e1e1e1",
    paddingHorizontal: 15,
    paddingTop: 10,
    paddingBottom: 10,
    marginRight: 10,
  },
  giftedSendButton: {
    backgroundColor: "#D6385E",
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  // Error State Styles
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 30,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginTop: 15,
    marginBottom: 8,
    textAlign: "center",
  },
  errorMessage: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 30,
  },
  errorButton: {
    backgroundColor: "#D6385E",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
  },
  errorButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
  // Empty State Styles
  emptyStateContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 30,
    backgroundColor: "#f5f5f5",
  },
  emptyStateIcon: {
    marginBottom: 20,
    opacity: 0.7,
  },
  emptyStateTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
    textAlign: "center",
  },
  emptyStateSubtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 30,
    lineHeight: 22,
  },
  emptyStateActions: {
    flexDirection: "row",
    gap: 15,
  },
  quickActionBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: "#D6385E",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  quickActionText: {
    color: "#D6385E",
    fontWeight: "600",
    marginLeft: 8,
  },
  // Loading State Styles
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
  loadingDots: {
    flexDirection: "row",
    marginBottom: 20,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#D6385E",
    marginHorizontal: 3,
  },
  dot1: { opacity: 1 },
  dot2: { opacity: 0.7 },
  dot3: { opacity: 0.5 },
  loadingText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
  },
  // Custom Input Styles
  inputContainer: {
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#e1e1e1",
    paddingVertical: 8,
    paddingHorizontal: 10,
    paddingBottom: Platform.OS === "ios" ? 34 : 20,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "flex-end",
  },
  actionBtn: {
    padding: 8,
    marginHorizontal: 4,
  },
  input: {
    flex: 1,
    backgroundColor: "#f0f0f0",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 24,
    marginHorizontal: 8,
    maxHeight: 100,
    fontSize: 16,
  },
  sendBtn: {
    backgroundColor: "#D6385E",
    borderRadius: 24,
    padding: 12,
    marginLeft: 4,
    justifyContent: "center",
    alignItems: "center",
  },
  // Emoji Picker Styles
  emojiModalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  emojiPicker: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: 300,
  },
  emojiItem: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 10,
    marginHorizontal: 5,
  },
  emoji: {
    fontSize: 24,
  },
});

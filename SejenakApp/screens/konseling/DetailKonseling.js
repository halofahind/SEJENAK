import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  ScrollView,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { API_BASE_URL } from "../../utils/constants";
import dayjs from "dayjs";

import AsyncStorage from "@react-native-async-storage/async-storage";

const formatDateToReadable = (dateStr) => {
  const date = dayjs(dateStr, "DD/MM/YY");
  const today = dayjs();
  const yesterday = today.subtract(1, "day");

  if (date.isSame(today, "day")) return "Hari Ini";
  if (date.isSame(yesterday, "day")) return "Kemarin";
  return date.format("D MMMM YYYY");
};

const DetailKonseling = ({ navigation, route }) => {
  const { topic, msg1, msg2, isHistory, status, konId } = route.params;
  const [currentRole, setCurrentRole] = useState("user");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: msg1,
      isAdmin: true,
      time: "05:44",
      date: "24/06/22",
    },
  ]);

  const scrollViewRef = useRef();

  useEffect(() => {
    let intervalId;

    const fetchMessages = async () => {
      const userData = await AsyncStorage.getItem("userData");
      const parsedUserData = JSON.parse(userData);
      setCurrentRole(parsedUserData.role);

      console.log("refresh");

      try {
        const res = await fetch(`${API_BASE_URL}/konselingbykonid?id=${konId}`);
        const data = await res.json();

        console.log("data:", data);

        const filtered = data
          .filter((msg) => msg.konId === konId)
          .map((msg, index) => ({
            id: msg.id || index + 1,
            text: msg.pesan,
            isAdmin: msg.pengirim === "admin",
            time: dayjs(msg.waktu).format("HH:mm"),
            date: dayjs(msg.waktu).format("DD/MM/YY"),
          }));

        if (status === "Selesai") {
          setMessages([
            {
              id: 0,
              text: msg1,
              isAdmin: true,
              time: getCurrentTime(),
              date: getCurrentDate(),
            },
            ...filtered,
            {
              id: -1,
              text: msg2,
              isAdmin: true,
              time: getCurrentTime(),
              date: getCurrentDate(),
            },
          ]);
        } else {
          setMessages([
            {
              id: 0,
              text: msg1,
              isAdmin: true,
              time: getCurrentTime(),
              date: getCurrentDate(),
            },
            ...filtered,
          ]);
        }
      } catch (error) {
        console.error("Gagal mengambil pesan:", error.message);
      }
    };

    // ⏱ Panggil pertama kali
    fetchMessages();

    // ⏱ Lalu buat polling setiap 3 detik
    intervalId = setInterval(fetchMessages, 3000); // 3 detik

    // 🧹 Bersihkan interval saat unmount
    return () => clearInterval(intervalId);
  }, [konId]);

  const groupMessagesByDate = (messages) => {
    const grouped = {};

    messages.forEach((msg) => {
      if (!grouped[msg.date]) {
        grouped[msg.date] = [];
      }
      grouped[msg.date].push(msg);
    });

    return Object.entries(grouped).map(([date, msgs]) => ({
      date,
      messages: msgs,
    }));
  };

  const getCurrentTime = () => {
    const now = new Date();
    return now.toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  const getCurrentDate = () => {
    const now = new Date();
    return now.toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "2-digit",
      year: "2-digit",
    });
  };

  const sendMessage = async () => {
    if (message.trim()) {
      const currentDateTime = new Date();
      const waktuISO = currentDateTime.toISOString();

      const newMessage = {
        id: messages.length + 1,
        text: message.trim(),
        isAdmin: currentRole === "admin",
        time: getCurrentTime(),
        date: getCurrentDate(),
      };

      try {
        await fetch(`${API_BASE_URL}/detailKonseling`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            konId: konId,
            pengirim: currentRole,
            pesan: message.trim(),
            waktu: waktuISO,
          }),
        });
      } catch (error) {
        console.error("Gagal simpan pesan ke DB:", error.message);
      }

      setMessages((prev) => [...prev, newMessage]);
      setMessage("");
    }
  };

  const handleBack = () => {
    navigation.reset({
      index: 0,
      routes: [
        {
          name: "MainTabs",
          state: {
            routes: [{ name: "Konseling" }],
          },
        },
      ],
    });
  };

  const showMenu = () => {
    Alert.alert("Akhiri Sesi?", "", [
      {
        text: "Akhiri Sesi",
        onPress: () => {
          Alert.alert(
            "Akhiri Sesi",
            "Apakah Anda yakin ingin mengakhiri sesi konseling ini?",
            [
              { text: "Batal", style: "cancel" },
              {
                text: "Ya",
                onPress: async () => {
                  try {
                    const response = await fetch(
                      `${API_BASE_URL}/finishKonseling?id=${konId}`,
                      {
                        method: "DELETE",
                      }
                    );

                    if (response.ok) {
                      Alert.alert("Berhasil", "Sesi konseling telah diakhiri.");
                      navigation.reset({
                        index: 0,
                        routes: [
                          {
                            name: "MainTabs",
                            state: {
                              routes: [{ name: "Konseling" }],
                            },
                          },
                        ],
                      });
                    } else {
                      Alert.alert("Gagal", "Gagal mengakhiri sesi konseling.");
                    }
                  } catch (error) {
                    console.error("Error:", error);
                    Alert.alert(
                      "Error",
                      "Terjadi kesalahan saat mengakhiri sesi."
                    );
                  }
                },
              },
            ]
          );
        },
      },
      {
        text: "Batal",
        style: "cancel",
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View style={styles.chatContainer}>
          {/* Chat Header */}
          <View style={styles.chatHeader}>
            <TouchableOpacity onPress={handleBack} style={styles.backButton}>
              <Text style={styles.backButtonText}>←</Text>
            </TouchableOpacity>
            <View style={styles.adminInfo}>
              <View style={styles.adminAvatar}>
                <Text style={styles.adminAvatarText}>👤</Text>
              </View>
              <View style={styles.adminDetails}>
                <Text style={styles.adminName}>Topik : {topic}</Text>
              </View>
            </View>
            {status != "Selesai" && (
              <TouchableOpacity style={styles.menuButton} onPress={showMenu}>
                <Text style={styles.menuButtonText}>⋮</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Messages with grouped date headers */}
          <ScrollView
            ref={scrollViewRef}
            style={styles.messagesContainer}
            contentContainerStyle={styles.messagesContent}
            showsVerticalScrollIndicator={false}
          >
            {groupMessagesByDate(messages).map((group, index) => (
              <View key={index}>
                {/* Tanggal dinamis */}
                <View style={styles.dateSeparator}>
                  <Text style={styles.dateText}>
                    {formatDateToReadable(group.key)}
                  </Text>
                </View>

                {/* Semua pesan di tanggal ini */}
                {group.messages.map((msg) => {
                  const isSender = msg.isAdmin === (currentRole === "admin"); // ⬅️ true jika pengirim = yang login
                  return (
                    <View
                      key={msg.id}
                      style={[
                        styles.messageWrapper,
                        isSender
                          ? styles.userMessageWrapper // ⬅️ di kanan (yang sedang login)
                          : styles.adminMessageWrapper, // ⬅️ di kiri (lawan bicara)
                      ]}
                    >
                      <View style={styles.messageContainer}>
                        <View
                          style={[
                            styles.messageBubble,
                            isSender ? styles.userMessage : styles.adminMessage,
                          ]}
                        >
                          <Text
                            style={[
                              styles.messageText,
                              isSender
                                ? styles.userMessageText
                                : styles.adminMessageText,
                            ]}
                          >
                            {msg.text}
                          </Text>
                        </View>
                        <Text
                          style={[
                            styles.messageTime,
                            isSender
                              ? styles.userMessageTime
                              : styles.adminMessageTime,
                          ]}
                        >
                          {msg.time}
                        </Text>
                      </View>
                    </View>
                  );
                })}
              </View>
            ))}
          </ScrollView>

          {/* Input Area */}
          {status != "Selesai" && (
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.textInput}
                placeholder="Type here"
                placeholderTextColor="#999"
                value={message}
                onChangeText={setMessage}
                multiline
                maxLength={1000}
                onSubmitEditing={sendMessage}
                blurOnSubmit={false}
              />
              <TouchableOpacity
                style={[
                  styles.sendButton,
                  !message.trim() && styles.sendButtonDisabled,
                ]}
                onPress={sendMessage}
                disabled={!message.trim()}
              >
                <Text style={styles.sendButtonText}>→</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  chatContainer: {
    flex: 1,
    backgroundColor: "white",
  },
  chatHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    paddingTop: 20,
  },
  backButton: {
    marginRight: 16,
    padding: 4,
  },
  backButtonText: {
    fontSize: 20,
    color: "#333",
    fontWeight: "600",
  },
  adminInfo: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  adminAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#e91e63",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  adminAvatarText: {
    fontSize: 16,
    color: "white",
  },
  adminDetails: {
    flex: 1,
  },
  adminName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  adminStatus: {
    fontSize: 12,
    color: "#4CAF50",
    fontWeight: "500",
  },
  menuButton: {
    padding: 8,
  },
  menuButtonText: {
    fontSize: 20,
    color: "#333",
  },
  dateSeparator: {
    alignItems: "center",
    paddingVertical: 16,
    backgroundColor: "#f8f9fa",
  },
  dateText: {
    fontSize: 12,
    color: "#666",
    backgroundColor: "#e0e0e0",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  messagesContainer: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  messagesContent: {
    padding: 16,
    paddingBottom: 20,
  },
  messageWrapper: {
    flexDirection: "row",
    marginBottom: 16,
    alignItems: "flex-end",
  },
  adminMessageWrapper: {
    justifyContent: "flex-start",
  },
  userMessageWrapper: {
    justifyContent: "flex-end",
  },
  messageAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#e91e63",
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 8,
  },
  messageAvatarText: {
    fontSize: 12,
    color: "white",
  },
  messageContainer: {
    maxWidth: "70%",
  },
  messageBubble: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 16,
  },
  adminMessage: {
    backgroundColor: "#e0e0e0",
    borderBottomLeftRadius: 4,
  },
  userMessage: {
    backgroundColor: "#e91e63",
    borderBottomRightRadius: 4,
  },
  messageText: {
    fontSize: 14,
    lineHeight: 18,
  },
  adminMessageText: {
    color: "#333",
  },
  userMessageText: {
    color: "white",
  },
  messageTime: {
    fontSize: 10,
    color: "#666",
    marginTop: 4,
  },
  adminMessageTime: {
    alignSelf: "flex-start",
  },
  userMessageTime: {
    alignSelf: "flex-end",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    padding: 16,
    backgroundColor: "white",
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginRight: 12,
    maxHeight: 100,
    fontSize: 14,
    backgroundColor: "#f8f9fa",
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#e91e63",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#e91e63",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  sendButtonDisabled: {
    backgroundColor: "#ccc",
    shadowOpacity: 0,
    elevation: 0,
  },
  sendButtonText: {
    fontSize: 18,
    color: "white",
    fontWeight: "600",
  },
});

export default DetailKonseling;

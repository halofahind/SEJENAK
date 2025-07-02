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

const DetailKonseling = ({ navigation, route }) => {
  const { topic, isHistory, konId } = route.params;
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: `Halo! Saya siap membantu Anda dengan topik ${topic}. Silakan ceritakan apa yang ingin Anda diskusikan.`,
      isAdmin: true,
      time: "05:44",
      date: "24/06/22",
    },
  ]);

  const scrollViewRef = useRef();

  useEffect(() => {
    // Auto scroll to bottom when new message is added
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, [messages]);

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
        isAdmin: false,
        time: getCurrentTime(),
        date: getCurrentDate(),
      };

      // ⬇️ Simpan ke database lewat API
      try {
        await fetch(`${API_BASE_URL}/detailKonseling`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            konId: konId,
            pengirim: "user",
            pesan: message.trim(),
            waktu: waktuISO,
          }),
        });
      } catch (error) {
        console.error("Gagal simpan pesan ke DB:", error.message);
      }

      setMessages((prev) => [...prev, newMessage]);
      setMessage("");

      // Simulasi balasan admin
      setTimeout(async () => {
        const responses = [
          "Terima kasih sudah berbagi. Saya memahami perasaan Anda. Bisakah Anda ceritakan lebih detail?",
          "Itu adalah hal yang wajar untuk dirasakan. Bagaimana Anda biasanya mengatasi situasi seperti ini?",
          "Saya mendengarkan Anda. Apakah ada hal spesifik yang membuat Anda merasa seperti itu?",
          "Pengalaman yang Anda ceritakan pasti tidak mudah. Apa yang paling mengganggu pikiran Anda saat ini?",
          "Terima kasih telah mempercayai saya. Mari kita coba eksplorasi lebih dalam tentang hal ini.",
        ];

        const randomResponse =
          responses[Math.floor(Math.random() * responses.length)];

        const adminMessage = {
          id: messages.length + 2,
          text: randomResponse,
          isAdmin: true,
          time: getCurrentTime(),
          date: getCurrentDate(),
        };

        // ⬇️ Simpan balasan admin ke DB juga
        try {
          await fetch(`${API_BASE_URL}/detailKonseling`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              konId: konId,
              pengirim: "admin",
              pesan: randomResponse,
              waktu: new Date().toISOString(),
            }),
          });
        } catch (error) {
          console.error("Gagal simpan balasan admin ke DB:", error.message);
        }

        setMessages((prev) => [...prev, adminMessage]);
      }, Math.random() * 1000 + 1000);
    }
  };

  const handleBack = () => {
    Alert.alert(
      "Keluar dari Chat",
      "Apakah Anda yakin ingin keluar dari sesi konseling ini?",
      [
        {
          text: "Batal",
          style: "cancel",
        },
        {
          text: "Ya",
          onPress: () => navigation.goBack(),
        },
      ]
    );
  };

  const showMenu = () => {
    Alert.alert("Menu", "Pilih opsi:", [
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
                onPress: () => navigation.navigate("Konseling"),
              },
            ]
          );
        },
      },
      {
        text: "Hapus Chat",
        style: "destructive",
        onPress: () => {
          Alert.alert("Hapus Chat", "Semua pesan akan dihapus. Lanjutkan?", [
            { text: "Batal", style: "cancel" },
            {
              text: "Hapus",
              style: "destructive",
              onPress: () => setMessages([messages[0]]), // Keep only first message
            },
          ]);
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
        behavior={Platform.OS === "ios" ? "padding" : "height"}>
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
                <Text style={styles.adminName}>Admin Konseling</Text>
                <Text style={styles.adminStatus}>Online</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.menuButton} onPress={showMenu}>
              <Text style={styles.menuButtonText}>⋮</Text>
            </TouchableOpacity>
          </View>

          {/* Date Separator */}
          <View style={styles.dateSeparator}>
            <Text style={styles.dateText}>24 Juni 2025</Text>
          </View>

          {/* Messages */}
          <ScrollView
            ref={scrollViewRef}
            style={styles.messagesContainer}
            contentContainerStyle={styles.messagesContent}
            showsVerticalScrollIndicator={false}>
            {messages.map((msg) => (
              <View
                key={msg.id}
                style={[
                  styles.messageWrapper,
                  msg.isAdmin
                    ? styles.adminMessageWrapper
                    : styles.userMessageWrapper,
                ]}>
                {msg.isAdmin && (
                  <View style={styles.messageAvatar}>
                    <Text style={styles.messageAvatarText}>👤</Text>
                  </View>
                )}

                <View style={styles.messageContainer}>
                  <View
                    style={[
                      styles.messageBubble,
                      msg.isAdmin ? styles.adminMessage : styles.userMessage,
                    ]}>
                    <Text
                      style={[
                        styles.messageText,
                        msg.isAdmin
                          ? styles.adminMessageText
                          : styles.userMessageText,
                      ]}>
                      {msg.text}
                    </Text>
                  </View>

                  <Text
                    style={[
                      styles.messageTime,
                      msg.isAdmin
                        ? styles.adminMessageTime
                        : styles.userMessageTime,
                    ]}>
                    {msg.date} {msg.time}
                  </Text>
                </View>

                {!msg.isAdmin && (
                  <View style={styles.messageAvatar}>
                    <Text style={styles.messageAvatarText}>👤</Text>
                  </View>
                )}
              </View>
            ))}
          </ScrollView>

          {/* Input Area */}
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
              disabled={!message.trim()}>
              <Text style={styles.sendButtonText}>→</Text>
            </TouchableOpacity>
          </View>
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
    paddingTop: 40,
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

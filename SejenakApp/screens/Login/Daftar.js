import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  Platform,
  Keyboard,
  Dimensions,
  Vibration,
  ActivityIndicator,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import Icon from "react-native-vector-icons/MaterialIcons";

const { height: screenHeight } = Dimensions.get("window");

export default function Daftar({ navigation }) {
  const [nama, setNama] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [gender, setGender] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [dob, setDob] = useState("");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  // Validation states
  const [validationMessage, setValidationMessage] = useState("");
  const [validationType, setValidationType] = useState("error"); // 'error' atau 'success'
  const [showValidation, setShowValidation] = useState(false);

  // Refs untuk setiap input
  const scrollViewRef = useRef(null);
  const emailRef = useRef(null);
  const usernameRef = useRef(null);
  const namaRef = useRef(null);
  const passwordRef = useRef(null);
  const confirmPasswordRef = useRef(null);
  const phoneRef = useRef(null);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      (e) => setKeyboardHeight(e.endCoordinates.height)
    );
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => setKeyboardHeight(0)
    );

    return () => {
      keyboardDidShowListener?.remove();
      keyboardDidHideListener?.remove();
    };
  }, []);

  // Fungsi untuk menampilkan pesan validasi
  const showValidationMessage = (message, type = "error") => {
    setValidationMessage(message);
    setValidationType(type);
    setShowValidation(true);

    if (type === "error") {
      Vibration.vibrate(400); // Getaran saat error
    } else if (type === "success") {
      Vibration.vibrate(200); // Getaran sukses (lebih pendek)
    }

    // Auto hide setelah 5 detik
    setTimeout(() => {
      setShowValidation(false);
    }, 5000);
  };

  // Fungsi untuk menutup pesan validasi
  const closeValidationMessage = () => {
    setShowValidation(false);
  };

  // Validasi form
  const validateForm = () => {
    if (!email.trim()) {
      showValidationMessage("Email tidak boleh kosong!");
      return false;
    }

    if (!username.trim()) {
      showValidationMessage("Username tidak boleh kosong!");
      return false;
    }

    if (!nama.trim()) {
      showValidationMessage("Nama lengkap tidak boleh kosong!");
      return false;
    }

    if (!password.trim()) {
      showValidationMessage("Password tidak boleh kosong!");
      return false;
    }

    if (!confirmPassword.trim()) {
      showValidationMessage("Konfirmasi password tidak boleh kosong!");
      return false;
    }

    if (!gender) {
      showValidationMessage("Jenis kelamin harus dipilih!");
      return false;
    }

    if (!phone.trim()) {
      showValidationMessage("Nomor telepon tidak boleh kosong!");
      return false;
    }

    if (!dob) {
      showValidationMessage("Tanggal lahir harus dipilih!");
      return false;
    }

    // Validasi email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showValidationMessage("Format email tidak valid!");
      return false;
    }

    // Validasi password minimum 6 karakter
    if (password.length < 6) {
      showValidationMessage("Password minimal 6 karakter!");
      return false;
    }

    // Validasi konfirmasi password
    if (password !== confirmPassword) {
      showValidationMessage("Password dan Konfirmasi Password tidak sama!");
      return false;
    }

    // Validasi nomor telepon (hanya angka dan minimal 10 digit)
    const phoneRegex = /^\d{10,15}$/;
    if (!phoneRegex.test(phone)) {
      showValidationMessage("Nomor telepon harus berisi 10-15 digit angka!");
      return false;
    }

    return true;
  };

  // Fungsi untuk register dengan API
  const handleRegister = async () => {
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // Format tanggal untuk backend (YYYY-MM-DD)
      const formattedDob = formatDateForBackend(dob);

      const userData = {
        email: email.trim(),
        username: username.trim(),
        nama: nama.trim(),
        password: password,
        gender: gender,
        phone: phone.trim(),
        tanggalLahir: formattedDob,
        address: address.trim() || null,
      };

      const response = await fetch("http://10.1.47.159:8080/Pengguna", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(userData),
      });

      const responseData = await response.json();

      if (response.ok) {
        // Registrasi berhasil
        showValidationMessage("Registrasi berhasil! Silakan login.", "success");

        // Redirect ke login setelah 2 detik
        setTimeout(() => {
          navigation.navigate("Login");
        }, 2000);
      } else {
        // Handle error dari backend
        let errorMessage = "Registrasi gagal!";

        if (response.status === 400) {
          // Bad request - biasanya validasi error
          if (responseData.message) {
            errorMessage = responseData.message;
          } else if (responseData.error) {
            errorMessage = responseData.error;
          } else {
            errorMessage = "Data yang dimasukkan tidak valid!";
          }
        } else if (response.status === 409) {
          // Conflict - email atau username sudah ada
          errorMessage = "Email atau Username sudah terdaftar!";
        } else if (response.status === 500) {
          errorMessage = "Terjadi kesalahan server. Silakan coba lagi.";
        }

        showValidationMessage(errorMessage);
      }
    } catch (error) {
      console.error("Registration error:", error);
      showValidationMessage(
        "Tidak dapat terhubung ke server. Periksa koneksi internet Anda."
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Fungsi untuk format tanggal ke format backend (DD/MM/YYYY -> YYYY-MM-DD)
  const formatDateForBackend = (dateString) => {
    if (!dateString) return null;

    const parts = dateString.split("/");
    if (parts.length === 3) {
      const day = parts[0].padStart(2, "0");
      const month = parts[1].padStart(2, "0");
      const year = parts[2];
      return `${year}-${month}-${day}`;
    }
    return dateString;
  };

  // Fungsi untuk scroll ke input yang sedang fokus
  const scrollToInput = (inputRef) => {
    setTimeout(() => {
      inputRef.current?.measureLayout(
        scrollViewRef.current,
        (x, y) => {
          const scrollY = y - 150;
          scrollViewRef.current?.scrollTo({
            y: Math.max(0, scrollY),
            animated: true,
          });
        },
        () => {}
      );
    }, 150);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header} />

      {/* Validation Message */}
      {showValidation && (
        <View style={styles.validationContainer}>
          <View
            style={[
              styles.validationBox,
              validationType === "success"
                ? styles.validationBoxSuccess
                : styles.validationBoxError,
            ]}>
            <Icon
              name={validationType === "success" ? "check-circle" : "error"}
              size={20}
              color="#fff"
              style={{ marginRight: 10 }}
            />
            <Text style={styles.validationText}>{validationMessage}</Text>
            <TouchableOpacity
              onPress={closeValidationMessage}
              style={styles.closeButton}>
              <Icon name="close" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
      )}

      <View
        style={[
          styles.registerBox,
          { marginBottom: keyboardHeight > 0 ? keyboardHeight - 20 : 0 },
        ]}>
        <ScrollView
          ref={scrollViewRef}
          showsVerticalScrollIndicator={false}
          style={{ width: "100%" }}
          contentContainerStyle={{
            paddingBottom: keyboardHeight > 0 ? 100 : 50,
            minHeight: screenHeight * 0.8,
          }}
          keyboardShouldPersistTaps="handled"
          bounces={false}>
          <View style={styles.innerContent}>
            <Image
              source={require("../../assets/OnBoarding/o2.png")}
              style={styles.logoImage}
            />

            <Text style={styles.registerTitle}>Daftar</Text>

            {/* Email */}
            <View style={styles.inputWrapper} ref={emailRef}>
              <Icon name="mail-outline" size={20} color="#333" />
              <TextInput
                style={styles.input}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                returnKeyType="next"
                onFocus={() => scrollToInput(emailRef)}
                onSubmitEditing={() => usernameRef.current?.focus()}
                editable={!isLoading}
              />
            </View>

            {/* Username */}
            <View style={styles.inputWrapper} ref={usernameRef}>
              <Icon name="person-outline" size={20} color="#333" />
              <TextInput
                ref={usernameRef}
                style={styles.input}
                placeholder="Username"
                value={username}
                onChangeText={setUsername}
                returnKeyType="next"
                onFocus={() => scrollToInput(usernameRef)}
                onSubmitEditing={() => namaRef.current?.focus()}
                editable={!isLoading}
              />
            </View>

            {/* Nama Lengkap */}
            <View style={styles.inputWrapper} ref={namaRef}>
              <Icon name="person-outline" size={20} color="#333" />
              <TextInput
                ref={namaRef}
                style={styles.input}
                placeholder="Nama Lengkap"
                value={nama}
                onChangeText={setNama}
                returnKeyType="next"
                onFocus={() => scrollToInput(namaRef)}
                onSubmitEditing={() => passwordRef.current?.focus()}
                editable={!isLoading}
              />
            </View>

            {/* Password */}
            <View style={styles.inputWrapper} ref={passwordRef}>
              <Icon name="lock-outline" size={20} color="#333" />
              <TextInput
                ref={passwordRef}
                style={styles.input}
                placeholder="Password (minimal 6 karakter)"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                returnKeyType="next"
                onFocus={() => scrollToInput(passwordRef)}
                onSubmitEditing={() => confirmPasswordRef.current?.focus()}
                editable={!isLoading}
              />
            </View>

            {/* Konfirmasi Password */}
            <View style={styles.inputWrapper} ref={confirmPasswordRef}>
              <Icon name="lock-outline" size={20} color="#333" />
              <TextInput
                ref={confirmPasswordRef}
                style={styles.input}
                placeholder="Konfirmasi Password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
                returnKeyType="next"
                onFocus={() => scrollToInput(confirmPasswordRef)}
                onSubmitEditing={() => {
                  setTimeout(() => {
                    scrollViewRef.current?.scrollTo({
                      y: 450,
                      animated: true,
                    });
                  }, 100);
                }}
                editable={!isLoading}
              />
            </View>

            {/* Tanggal Lahir */}
            <View style={styles.inputWrapper}>
              <Icon name="calendar-today" size={20} color="#333" />
              <TouchableOpacity
                onPress={() => !isLoading && setShowDatePicker(true)}
                style={{ flex: 1 }}
                disabled={isLoading}>
                <Text style={[styles.input, !dob && { color: "#999" }]}>
                  {dob ? dob : "Tanggal Lahir (DD/MM/YYYY)"}
                </Text>
              </TouchableOpacity>
            </View>

            {showDatePicker && (
              <DateTimePicker
                value={new Date()}
                mode="date"
                display={Platform.OS === "ios" ? "spinner" : "default"}
                maximumDate={new Date()} // Tidak bisa pilih tanggal masa depan
                onChange={(event, selectedDate) => {
                  setShowDatePicker(false);
                  if (selectedDate) {
                    const formattedDate =
                      selectedDate.toLocaleDateString("id-ID");
                    setDob(formattedDate);
                  }
                }}
              />
            )}

            {/* Gender Selection */}
            <View style={styles.genderButtonContainer}>
              <TouchableOpacity
                style={[
                  styles.genderButton,
                  gender === "Laki-laki" && styles.genderButtonLaki,
                ]}
                onPress={() => !isLoading && setGender("Laki-laki")}
                disabled={isLoading}>
                <Icon
                  name="male"
                  size={18}
                  color={gender === "Laki-laki" ? "#fff" : "#555"}
                />
                <Text
                  style={[
                    styles.genderButtonText,
                    gender === "Laki-laki" && styles.genderButtonTextActive,
                  ]}>
                  Laki-laki
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.genderButton,
                  gender === "Perempuan" && styles.genderButtonPerempuan,
                ]}
                onPress={() => !isLoading && setGender("Perempuan")}
                disabled={isLoading}>
                <Icon
                  name="female"
                  size={18}
                  color={gender === "Perempuan" ? "#fff" : "#555"}
                />
                <Text
                  style={[
                    styles.genderButtonText,
                    gender === "Perempuan" && styles.genderButtonTextActive,
                  ]}>
                  Perempuan
                </Text>
              </TouchableOpacity>
            </View>

            {/* Nomor Telepon */}
            <View style={styles.inputWrapper} ref={phoneRef}>
              <Icon name="phone" size={20} color="#333" />
              <TextInput
                ref={phoneRef}
                style={styles.input}
                placeholder="Nomor Telepon (contoh: 08123456789)"
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
                returnKeyType="done"
                onFocus={() => scrollToInput(phoneRef)}
                editable={!isLoading}
              />
            </View>

            {/* Alamat (Optional) */}
            <View style={styles.inputWrapper}>
              <Icon name="location-on" size={20} color="#333" />
              <TextInput
                style={styles.input}
                placeholder="Alamat (opsional)"
                value={address}
                onChangeText={setAddress}
                multiline
                numberOfLines={2}
                returnKeyType="done"
                editable={!isLoading}
              />
            </View>

            {/* Tombol Daftar */}
            <TouchableOpacity
              style={[
                styles.registerButton,
                isLoading && styles.registerButtonDisabled,
              ]}
              onPress={handleRegister}
              disabled={isLoading}>
              {isLoading ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <Text style={styles.registerButtonText}>Daftar</Text>
              )}
            </TouchableOpacity>

            {/* Link ke Login */}
            <Text style={styles.loginText}>
              Sudah punya akun?{" "}
              <Text
                style={{
                  color: "#EF6A6A",
                  fontWeight: "bold",
                  opacity: isLoading ? 0.5 : 1,
                }}
                onPress={() => !isLoading && navigation.navigate("Login")}>
                Login
              </Text>
            </Text>
          </View>
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#D6385E",
  },
  header: {
    height: 200,
    backgroundColor: "#D6385E",
  },
  validationContainer: {
    position: "absolute",
    top: 50,
    left: 20,
    right: 20,
    zIndex: 1000,
  },
  validationBox: {
    borderRadius: 10,
    padding: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  validationBoxError: {
    backgroundColor: "#ff4444",
  },
  validationBoxSuccess: {
    backgroundColor: "#4CAF50",
  },
  validationText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "500",
    flex: 1,
  },
  closeButton: {
    marginLeft: 10,
    padding: 2,
  },
  registerBox: {
    flex: 1,
    backgroundColor: "#fff",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: -30,
    paddingTop: 20,
    paddingHorizontal: 20,
    alignItems: "center",
  },
  innerContent: {
    paddingBottom: 40,
    alignItems: "center",
  },
  logoImage: {
    width: 100,
    height: 100,
    marginBottom: 10,
    resizeMode: "contain",
    borderRadius: 20,
  },
  registerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 30,
    color: "#222",
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F9F9F9",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 14,
    width: "100%",
    borderWidth: 1,
    borderColor: "#E3E3E3",
  },
  input: {
    flex: 1,
    marginLeft: 10,
    fontSize: 15,
    color: "#333",
  },
  registerButton: {
    backgroundColor: "#D6385E",
    paddingVertical: 14,
    paddingHorizontal: 155,
    borderRadius: 30,
    marginTop: 16,
    marginBottom: 20,
    shadowColor: "#D6385E",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
  },
  registerButtonDisabled: {
    backgroundColor: "#999",
    shadowOpacity: 0.1,
  },
  registerButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    letterSpacing: 0.5,
    textAlign: "center",
  },
  loginText: {
    fontSize: 14,
    color: "#666",
    marginTop: 10,
  },
  genderButtonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  genderButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: "#fff",
    marginHorizontal: 4,
  },
  genderButtonLaki: {
    backgroundColor: "#2196F3",
    borderColor: "#2196F3",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  genderButtonPerempuan: {
    backgroundColor: "#D6385E",
    borderColor: "#D6385E",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  genderButtonText: {
    marginLeft: 6,
    fontSize: 14,
    color: "#555",
  },
  genderButtonTextActive: {
    color: "#fff",
    fontWeight: "bold",
  },
  label: {
    fontSize: 15,
    color: "#333",
    marginBottom: 8,
  },
});

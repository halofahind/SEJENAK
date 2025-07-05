// screens/mood/EmosiScreen.js
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";

const emosiPositif = [
  "Antusias",
  "Gembira",
  "Takjub",
  "Semangat",
  "Bangga",
  "Penuh Cinta",
  "Santai",
  "Tenang",
  "Puas",
  "Lega",
  "Senang",
];

const emosiNegatif = [
  "Marah",
  "Takut",
  "Stres",
  "Waspada",
  "Kewalahan",
  "Kesal",
  "Malu",
  "Cemas",
  "Lesu",
  "Sedih",
  "Duka",
  "Bosan",
  "Apatis",
  "Kesepian",
  "Bingung",
  "Gelisah",
  "Murung",
  "Berduka",
  "Patah Hati",
  "Kecewa",
  "Hyperactive",
];

export default function MoodTracker({ route, navigation }) {
  const { selectedMood } = route.params;
  const [selectedEmosi, setSelectedEmosi] = useState([]);

  const toggleEmosi = (emosi) => {
    if (selectedEmosi.includes(emosi)) {
      setSelectedEmosi(selectedEmosi.filter((e) => e !== emosi));
    } else {
      setSelectedEmosi([...selectedEmosi, emosi]);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        <Text style={styles.title}>
          Apa saja emosi yang sedang kamu rasakan sekarang?
        </Text>

        <Text style={styles.section}>Emosi Positif</Text>
        <View style={styles.wrap}>
          {emosiPositif.map((emosi, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.chip,
                selectedEmosi.includes(emosi) && styles.chipSelected,
              ]}
              onPress={() => toggleEmosi(emosi)}
            >
              <Text
                style={[
                  styles.chipText,
                  selectedEmosi.includes(emosi) && styles.chipTextSelected,
                ]}
              >
                {emosi}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.section}>Emosi Negatif</Text>
        <View style={styles.wrap}>
          {emosiNegatif.map((emosi, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.chip,
                selectedEmosi.includes(emosi) && styles.chipSelected,
              ]}
              onPress={() => toggleEmosi(emosi)}
            >
              <Text
                style={[
                  styles.chipText,
                  selectedEmosi.includes(emosi) && styles.chipTextSelected,
                ]}
              >
                {emosi}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      <TouchableOpacity
        style={[
          styles.button,
          selectedEmosi.length === 0 && { backgroundColor: "#ccc" },
        ]}
        onPress={() => {
          if (selectedEmosi.length > 0) {
            navigation.navigate("NextScreen", {
              mood: selectedMood,
              emosi: selectedEmosi,
            });
          }
        }}
        disabled={selectedEmosi.length === 0}
      >
        <Text style={styles.buttonText}>Lanjutkan</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 20, marginTop: 60, },
  title: { fontSize: 18, fontWeight: "bold", marginBottom: 16 },
  section: { fontSize: 14, fontWeight: "bold", color: "#444", marginTop: 10 },
  wrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginVertical: 10,
    marginTop:30
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#ccc",
    marginBottom: 8,
  },
  chipSelected: {
    backgroundColor: "#007AFF",
    borderColor: "#007AFF",
  },
  chipText: {
    color: "#444",
    fontSize: 13,
  },
  chipTextSelected: {
    color: "#fff",
  },
  button: {
    backgroundColor: "#007AFF",
    padding: 14,
    borderRadius: 30,
    alignItems: "center",
    marginVertical: 10,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

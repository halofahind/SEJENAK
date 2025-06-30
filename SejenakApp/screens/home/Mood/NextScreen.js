// screens/mood/EmosiScreen.js
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";

const sumberEmosi = [
  "Keluarga",
  "Pekerjaan",
  "Teman",
  "Percintaan",
  "Kesehatan",
  "Pendidikan",
  "Tidur",
  "Perjalanan",
  "Bersantai",
  "Makanan",
  "Olahraga",
  "Seni",
  "Hobi",
  "Cuaca",
  "Belanja",
  "Hiburan",
  "Keuangan",
  "Ibadah",
  "Refleksi Diri",
];

export default function EmosiScreen({ route, navigation }) {
  const { emosi } = route.params;
  const [selectedSources, setSelectedSources] = useState([]);

  const toggleSource = (item) => {
    if (selectedSources.includes(item)) {
      setSelectedSources(selectedSources.filter((e) => e !== item));
    } else {
      setSelectedSources([...selectedSources, item]);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        <Text style={styles.title}>
          Menurut kamu, emosi tersebut datang dari mana?
        </Text>

        <View style={styles.wrap}>
          {sumberEmosi.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.chip,
                selectedSources.includes(item) && styles.chipSelected,
              ]}
              onPress={() => toggleSource(item)}
            >
              <Text
                style={[
                  styles.chipText,
                  selectedSources.includes(item) && styles.chipTextSelected,
                ]}
              >
                {item}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      <TouchableOpacity
        style={[
          styles.button,
          selectedSources.length === 0 && styles.buttonDisabled,
        ]}
        onPress={() => {
          if (selectedSources.length > 0) {
            navigation.navigate("MoodSummary", {
              date: "Senin, 30 Juni 2025",
              mood: { emoji: "😐", label: "Netral" }, // ubah sesuai data mood user
              emosi: emosi,
              sumberEmosi: selectedSources,
            });
          }
        }}
        disabled={selectedSources.length === 0}
      >
        <Text style={styles.buttonText}>Lanjutkan</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 20, marginTop: 60 },
  title: { fontSize: 18, fontWeight: "bold", marginBottom: 16 },
  section: { fontSize: 14, fontWeight: "bold", color: "#444", marginTop: 10 },
  wrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginVertical: 10,
    marginTop: 30,
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

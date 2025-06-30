import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";

export default function MoodSummary({ route }) {
  const { date, mood, emosi, sumberEmosi } = route.params;

  const days = ["S", "S", "R", "K", "J", "S", "M"]; // Dummy data minggu
  const moodData = [mood.emoji]; // Dummy mood minggu ini

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.period}>30 Jun – 06 Jul</Text>
      <Text style={styles.title}>Mood Mingguanmu</Text>

      <View style={styles.card}>
        <View style={styles.rowBetween}>
          <Text style={styles.checkIn}>
            Total <Text style={{ color: "#FF8C00" }}>check-in</Text> kamu:
            <Text style={{ color: "#FF8C00", fontWeight: "bold" }}>
              {" "}
              1 hari
            </Text>
          </Text>
          <Text style={styles.link}>Lihat Semua</Text>
        </View>

        <View style={styles.dayRow}>
          {days.map((day, index) => (
            <View key={index} style={styles.dayItem}>
              <Text style={styles.dayText}>{day}</Text>
              {index === 0 ? (
                <Text style={styles.moodEmoji}>{mood.emoji}</Text>
              ) : (
                <View style={styles.emptyCircle}></View>
              )}
            </View>
          ))}
        </View>

        <View style={styles.currentDateRow}>
          <Text style={styles.currentDate}>Senin, {date}</Text>
          <Text style={styles.editText}>✏️ Edit</Text>
        </View>

        <View style={styles.moodRow}>
          <Text style={styles.moodEmoji}>{mood.emoji}</Text>
          <Text style={styles.label}>{mood.label}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Emosi</Text>
          <View style={styles.wrap}>
            {emosi.map((item, index) => (
              <View key={index} style={styles.chip}>
                <Text style={styles.chipText}>{item}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Faktor</Text>
          <View style={styles.wrap}>
            {sumberEmosi.map((item, index) => (
              <View key={index} style={styles.chip}>
                <Text style={styles.chipText}>{item}</Text>
              </View>
            ))}
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    padding: 20,
    marginTop: 40,
  },
  period: {
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 8,
    borderBottomWidth: 2,
    borderBottomColor: "#007AFF",
    paddingBottom: 4,
    width: "60%",
    alignSelf: "center",
  },
  title: {
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 18,
    marginBottom: 16,
  },
  card: {
    borderWidth: 1,
    borderColor: "#eee",
    borderRadius: 10,
    padding: 16,
  },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  checkIn: {
    fontSize: 14,
    color: "#333",
  },
  link: {
    color: "#007AFF",
    fontSize: 14,
  },
  dayRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 10,
  },
  dayItem: {
    alignItems: "center",
  },
  dayText: {
    fontSize: 14,
    color: "#666",
    marginBottom: 6,
  },
  emptyCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  currentDateRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
    marginBottom: 10,
  },
  currentDate: {
    fontSize: 14,
    color: "#333",
  },
  editText: {
    fontSize: 14,
    color: "#007AFF",
  },
  moodRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    gap: 10,
  },
  moodEmoji: {
    fontSize: 28,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#007AFF",
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  wrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#00BFFF",
    marginBottom: 8,
  },
  chipText: {
    color: "#00BFFF",
    fontSize: 13,
  },
});

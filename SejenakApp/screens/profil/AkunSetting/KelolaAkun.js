import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { Icon } from "react-native-elements";
import { API_BASE_URL } from "../../../utils/constants";
import { useTranslation } from "react-i18next";
export default function KelolaAkun({ navigation }) {
  const [pengguna, setPengguna] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { t } = useTranslation();
  const GENDER = {
    MALE: "male",
    FEMALE: "female",
    OTHER: "other",
  };

  const fetchPengguna = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/penggunas`);
      const json = await response.json();
      setPengguna(Array.isArray(json) ? json : []);
    } catch (error) {
      Alert.alert("Error", "Gagal memuat data pengguna");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchPengguna();
    }, [])
  );

  const handleRefresh = () => {
    setRefreshing(true);
    fetchPengguna();
  };
  // Function to get appropriate profile image based on gender
  const getProfileImage = (user) => {
    if (user.profilePic) {
      return { uri: user.profilePic };
    }

    switch (user.gender?.toLowerCase()) {
      case GENDER.FEMALE:
        return require("../../../assets/User/female.png");
      case GENDER.MALE:
        return require("../../../assets/User/male.png");
      default:
        return require("../../../assets/Profil/Profil.png");
    }
  };
  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate("DetailAkun", { data: item })}>
      <View style={styles.cardContent}>
        <Image source={getProfileImage(item)} style={styles.profileImage} />
        <View style={styles.textContainer}>
          <Text style={styles.nameText}>
            {item.nama || "Nama tidak tersedia"}
          </Text>
          <View style={styles.detailRow}>
            <Icon name="person" size={16} color="#888" />
            <Text style={styles.detailText}>{item.username || "-"}</Text>
          </View>
          <View style={styles.detailRow}>
            <Icon name="mail" size={16} color="#888" />
            <Text style={styles.detailText}>{item.email || "-"}</Text>
          </View>
        </View>
        <View style={styles.statusContainer}>
          <View
            style={[
              styles.statusBadge,
              item.usrStatus === "Aktif"
                ? styles.activeBadge
                : styles.inactiveBadge,
            ]}>
            <Text style={styles.statusText}>{item.usrStatus || "-"}</Text>
          </View>
          <Icon name="chevron-right" size={24} color="#ccc" />
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}>
          <Icon name="arrow-back" size={28} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t("ProfilMenuManageAcc")}</Text>
      </View>

      {/* Content */}
      <ScrollView style={styles.content}>
        <View style={styles.summaryContainer}>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryNumber}>{pengguna.length}</Text>
            <Text style={styles.summaryLabel}>{t("CountTotalUser")}</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryNumber}>
              {pengguna.filter((u) => u.usrStatus === "Aktif").length}
            </Text>
            <Text style={styles.summaryLabel}>{t("ActiveStatus")}</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryNumber}>
              {pengguna.filter((u) => u.usrStatus !== "Aktif").length}
            </Text>
            <Text style={styles.summaryLabel}>{t("NonActiveStatus")}</Text>
          </View>
        </View>

        {loading ? (
          <ActivityIndicator
            size="large"
            color="#D7385E"
            style={styles.loader}
          />
        ) : (
          <FlatList
            data={pengguna}
            renderItem={renderItem}
            keyExtractor={(item) =>
              item.id?.toString() || Math.random().toString()
            }
            refreshing={refreshing}
            onRefresh={handleRefresh}
            scrollEnabled={false} // Karena sudah dalam ScrollView
          />
        )}
      </ScrollView>

      {/* Floating Action Button */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate("TambahAkun")}>
        <Icon name="add" size={30} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    backgroundColor: "#D7385E",
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 14,
    borderBottomRightRadius: 14,
    flexDirection: "row",
    alignItems: "center",
  },
  backButton: {
    marginRight: 15,
  },
  headerTitle: {
    fontSize: 20,
    color: "#fff",
    fontWeight: "bold",
  },
  content: {
    flex: 1,
    padding: 15,
  },
  summaryContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 15,
    elevation: 2,
  },
  summaryItem: {
    alignItems: "center",
    flex: 1,
  },
  summaryNumber: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#D7385E",
  },
  summaryLabel: {
    fontSize: 14,
    color: "#666",
    marginTop: 5,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    elevation: 2,
  },
  cardContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: "#D7385E",
  },
  textContainer: {
    flex: 1,
    marginLeft: 15,
  },
  nameText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 3,
  },
  detailText: {
    fontSize: 14,
    color: "#666",
    marginLeft: 5,
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 15,
    marginRight: 10,
  },
  activeBadge: {
    backgroundColor: "rgba(76, 175, 80, 0.2)",
  },
  inactiveBadge: {
    backgroundColor: "rgba(252, 8, 20, 0.2)",
  },
  statusText: {
    fontSize: 12,
    fontWeight: "bold",
  },
  fab: {
    position: "absolute",
    right: 25,
    bottom: 25,
    backgroundColor: "#D7385E",
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
  },
  loader: {
    marginTop: 50,
  },
});

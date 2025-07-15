import React from "react";
import { View, Text, ScrollView, StyleSheet, Linking } from "react-native";
import { Icon } from "react-native-elements";
import { useTranslation } from "react-i18next";
const SyaratKetentuan = ({ navigation }) => {
  const { t } = useTranslation();
  const handleBack = () => {
    navigation.goBack();
  };

  const openWhatsApp = () => {
    const nomorWA = "6282118028300";
    const pesan =
      "Hai, saya ingin bertanya tentang syarat dan ketentuan aplikasi ini";
    const url = `https://wa.me/${nomorWA}?text=${encodeURIComponent(pesan)}`;

    Linking.openURL(url).catch((err) =>
      console.error("Gagal membuka WhatsApp", err)
    );
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Icon
            name="arrow-left"
            type="font-awesome"
            color="#fff"
            size={20}
            onPress={handleBack}
            containerStyle={styles.backButton}
          />
          <Text style={styles.headerTitle}>{t("terms.headerTitle")}</Text>
        </View>
      </View>

      {/* Content */}
      <View style={styles.contentContainer}>
        <Text style={styles.sectionTitle}>
          {t("terms.section.usage.title")}
        </Text>
        <Text style={styles.sectionText}>
          1. {t("terms.section.usage.text1")}
        </Text>
        <Text style={styles.sectionText}>
          2. {t("terms.section.usage.text2")}
        </Text>

        <Text style={styles.sectionTitle}>
          {t("terms.section.account.title")}
        </Text>
        <Text style={styles.sectionText}>
          1. {t("terms.section.account.text1")}
        </Text>
        <Text style={styles.sectionText}>
          2. {t("terms.section.account.text2")}
        </Text>

        <Text style={styles.sectionTitle}>
          {t("terms.section.content.title")}
        </Text>
        <Text style={styles.sectionText}>
          1. {t("terms.section.content.text1")}
        </Text>
        <Text style={styles.sectionText}>
          2. {t("terms.section.content.text2")}
        </Text>

        <Text style={styles.sectionTitle}>
          {t("terms.section.privacy.title")}
        </Text>
        <Text style={styles.sectionText}>
          1. {t("terms.section.privacy.text1")}
        </Text>
        <Text style={styles.sectionText}>
          2. {t("terms.section.privacy.text2")}
        </Text>

        <Text style={styles.sectionTitle}>
          {t("terms.section.changes.title")}
        </Text>
        <Text style={styles.sectionText}>
          {t("terms.section.changes.text")}
        </Text>

        <Text style={styles.sectionTitle}>
          {t("terms.section.contact.title")}
        </Text>
        <Text style={styles.sectionText}>
          {t("terms.section.contact.text")}
        </Text>
        <View style={styles.contactButton}>
          <Icon
            name="whatsapp"
            type="font-awesome"
            color="#fff"
            size={16}
            onPress={openWhatsApp}
          />
          <Text style={styles.contactText} onPress={openWhatsApp}>
            {t("terms.section.contact.button")}
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  header: {
    backgroundColor: "#D7385E",
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 14,
    borderBottomRightRadius: 14,
  },
  headerContent: {
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
  contentContainer: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#D7385E",
    marginTop: 15,
    marginBottom: 10,
  },
  sectionText: {
    fontSize: 14,
    color: "#333",
    marginBottom: 8,
    lineHeight: 20,
  },
  contactButton: {
    backgroundColor: "#25D366",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 15,
  },
  contactText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
    marginLeft: 10,
  },
});

export default SyaratKetentuan;

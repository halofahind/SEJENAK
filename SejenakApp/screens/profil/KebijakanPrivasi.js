import React from "react";
import { View, Text, ScrollView, StyleSheet, Linking } from "react-native";
import { Icon } from "react-native-elements";
import { useTranslation } from "react-i18next";
const KebijakanPrivasi = ({ navigation }) => {
  const { t } = useTranslation();
  const handleBack = () => {
    navigation.goBack();
  };

  const openWhatsApp = () => {
    const nomorWA = "6282118028300";
    const pesan =
      "Hai, saya ingin bertanya tentang kebijakan privasi aplikasi ini";
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
          <Text style={styles.headerTitle}>{t("privacy.headerTitle")}</Text>
        </View>
      </View>

      {/* Content */}
      <View style={styles.contentContainer}>
        <Text style={styles.introText}>{t("privacy.intro")}</Text>

        <Text style={styles.sectionTitle}>
          {t("privacy.section.collect.title")}
        </Text>
        <Text style={styles.sectionText}>
          1. {t("privacy.section.collect.text1")}
        </Text>
        <Text style={styles.sectionText}>
          2. {t("privacy.section.collect.text2")}
        </Text>
        <Text style={styles.sectionText}>
          3. {t("privacy.section.collect.text3")}
        </Text>

        <Text style={styles.sectionTitle}>
          {t("privacy.section.use.title")}
        </Text>
        <Text style={styles.sectionText}>
          1. {t("privacy.section.use.text1")}
        </Text>
        <Text style={styles.sectionText}>
          2. {t("privacy.section.use.text2")}
        </Text>
        <Text style={styles.sectionText}>
          3. {t("privacy.section.use.text3")}
        </Text>
        <Text style={styles.sectionText}>
          4. {t("privacy.section.use.text4")}
        </Text>

        <Text style={styles.sectionTitle}>
          {t("privacy.section.protect.title")}
        </Text>
        <Text style={styles.sectionText}>
          1. {t("privacy.section.protect.text1")}
        </Text>
        <Text style={styles.sectionText}>
          2. {t("privacy.section.protect.text2")}
        </Text>
        <Text style={styles.sectionText}>
          3. {t("privacy.section.protect.text3")}
        </Text>

        <Text style={styles.sectionTitle}>
          {t("privacy.section.share.title")}
        </Text>
        <Text style={styles.sectionText}>
          {t("privacy.section.share.text1")}
        </Text>
        <Text style={styles.sectionText}>
          1. {t("privacy.section.share.text2")}
        </Text>
        <Text style={styles.sectionText}>
          2. {t("privacy.section.share.text3")}
        </Text>
        <Text style={styles.sectionText}>
          3. {t("privacy.section.share.text4")}
        </Text>

        <Text style={styles.sectionTitle}>
          {t("privacy.section.rights.title")}
        </Text>
        <Text style={styles.sectionText}>
          1. {t("privacy.section.rights.text1")}
        </Text>
        <Text style={styles.sectionText}>
          2. {t("privacy.section.rights.text2")}
        </Text>
        <Text style={styles.sectionText}>
          3. {t("privacy.section.rights.text3")}
        </Text>

        <Text style={styles.sectionTitle}>
          {t("privacy.section.changes.title")}
        </Text>
        <Text style={styles.sectionText}>
          {t("privacy.section.changes.text")}
        </Text>

        <Text style={styles.sectionTitle}>
          {t("privacy.section.contact.title")}
        </Text>
        <Text style={styles.sectionText}>
          {t("privacy.section.contact.text")}
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
            {t("privacy.section.contact.button")}
          </Text>
        </View>

        <Text style={styles.lastUpdated}>
          {t("lastUpdated")}: {new Date().toLocaleDateString("id-ID")}
        </Text>
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
  introText: {
    fontSize: 14,
    color: "#333",
    marginBottom: 20,
    lineHeight: 20,
    textAlign: "justify",
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
    marginBottom: 20,
  },
  contactText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
    marginLeft: 10,
  },
  lastUpdated: {
    fontSize: 12,
    color: "#888",
    textAlign: "center",
    marginTop: 10,
  },
});

export default KebijakanPrivasi;

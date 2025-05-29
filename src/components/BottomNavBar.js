import React, { useState } from "react";
import { StyleSheet, View, Text, TouchableOpacity, Image } from "react-native";
import { useRouter, usePathname } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// Import constants
import Colors from "../constants/Colors";
import Fonts from "../constants/Fonts";
import Layout from "../constants/Layout";

/**
 * Bottom Navigation Bar Component
 */
export default function BottomNavBar({ onLayout }) {
  const router = useRouter();
  const pathname = usePathname();
  const insets = useSafeAreaInsets();

  // Navigation items with their icons and routes
  const navItems = [
    {
      label: "Home",
      icon: require("../../assets/home-icon.png"),
      route: "/",
    },
    {
      label: "About",
      icon: require("../../assets/about-icon.png"),
      route: "/about",
    },
    {
      label: "Treatment",
      icon: require("../../assets/treatment-icon.png"),
      route: "/treatment",
    },
    {
      label: "New Patients",
      icon: require("../../assets/new-patient-icon.png"),
      route: "/new-patients",
    },
    {
      label: "Contact",
      icon: require("../../assets/phone-icon.png"),
      route: "/contact",
    },
  ];

  // Check if a route is active
  const isActive = (route) => {
    if (route === "/" && pathname === "/") return true;
    if (route !== "/" && pathname.startsWith(route)) return true;
    return false;
  };

  return (
    <View
      style={[styles.container, { paddingBottom: Math.max(insets.bottom - 5, 0) }]}
      onLayout={onLayout}
    >
      {navItems.map((item) => (
        <TouchableOpacity
          key={item.label}
          style={styles.navItem}
          onPress={() => router.push(item.route)}
          activeOpacity={0.7}
        >
          <Image
            source={item.icon}
            style={[
              styles.navIcon,
              {
                tintColor: isActive(item.route) ? Colors.primary : Colors.lightText,
              },
            ]}
            resizeMode="contain"
          />
          <Text
            style={[
              styles.navLabel,
              isActive(item.route) && styles.activeNavLabel,
            ]}
          >
            {item.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: "#eee",
    paddingVertical: 6,
    paddingHorizontal: 5,
    justifyContent: "space-between",
    elevation: 10,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  navItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 6,
  },
  navIcon: {
    width: 24,
    height: 24,
  },
  navLabel: {
    fontSize: Layout.isSmallDevice ? 11 : 13,
    marginTop: 4,
    color: Colors.lightText,
    textAlign: "center",
  },
  activeNavLabel: {
    color: Colors.primary,
    fontWeight: Fonts.weights.bold,
  },
});

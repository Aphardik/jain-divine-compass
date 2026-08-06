import React from 'react';
import { ImageBackground, Modal, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { translate } from '../i18n';

const TIRTH_IMAGE = require('../../assets/tirth.jpeg');

// Full-screen prayer reveal — shown once the compass aligns with the chosen
// tirth. The compass view is replaced entirely (rather than a translucent
// overlay) so the moment of prayer isn't cluttered by the dial.
// `praiseVerse` is an optional tirth-specific devotional verse (e.g.
// Shatrunjaya's Giriraj Vandana).
export default function PrayerOverlay({
  visible,
  tirthName,
  praiseVerse,
  language,
  styles,
  onClose,
}) {
  const verseLines = praiseVerse && (praiseVerse.lines[language] || praiseVerse.lines.en);
  const verseTitle = praiseVerse && (praiseVerse.title[language] || praiseVerse.title.en);

  return (
    <Modal visible={visible} animationType="fade" transparent={false} onRequestClose={onClose}>
      <ImageBackground source={TIRTH_IMAGE} resizeMode="cover" style={styles.prayerContainer}>
        <StatusBar style="light" />

        <View style={styles.prayerScrim} pointerEvents="none" />

        <ScrollView
          contentContainerStyle={styles.prayerScrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.prayerContent}>
            <Text style={styles.prayerFacingLine}>
              🙏 {translate(language, 'facingTirth', { name: tirthName })} 🙏
            </Text>

            {!!verseLines && (
              <>
                <Text style={styles.prayerMantraTitle}>॥ {verseTitle} ॥</Text>
                <View style={styles.prayerMantraBlock}>
                  {verseLines.map((line, i) => (
                    <Text key={i} style={styles.prayerVerseLine}>
                      {line}
                    </Text>
                  ))}
                </View>
              </>
            )}

            <Text style={styles.prayerPranamLine}>🙏 {translate(language, 'pranam')} 🙏</Text>
          </View>
        </ScrollView>

        {/* Rendered last so it stacks above the ScrollView (which otherwise
            paints over — and swallows taps on — anything before it). */}
        <TouchableOpacity
          style={styles.prayerCloseBtn}
          onPress={onClose}
          hitSlop={16}
          activeOpacity={0.7}
        >
          <Text style={styles.prayerCloseIcon}>✕</Text>
        </TouchableOpacity>
      </ImageBackground>
    </Modal>
  );
}

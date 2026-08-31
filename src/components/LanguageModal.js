import React from 'react';
import { Modal, Text, TouchableOpacity, View } from 'react-native';
import { BlurView } from 'expo-blur';
import { LANGUAGES } from '../i18n';
import TempleGlyph from './TempleGlyph';

// First-launch language chooser. Shown as a centered dialog over a blurred
// view of the compass beneath it (rather than a full-screen gate) so the app
// still feels alive behind the prompt. No language is known yet, so the
// title/subtitle are hardcoded trilingual rather than run through `t()`.
export default function LanguageModal({ visible, colors, styles, onSelect }) {
  return (
    <Modal visible={visible} animationType="fade" transparent statusBarTranslucent onRequestClose={() => {}}>
      <BlurView
        intensity={45}
        tint={colors.isDark ? 'dark' : 'light'}
        style={styles.languageBackdrop}
      >
        <View style={styles.languageCard}>
          <View style={styles.milestoneIconWrap}>
            <View style={styles.milestoneIconBadge}>
              <TempleGlyph size={48} color={colors.gold} />
            </View>
          </View>
          <Text style={styles.languageTitle}>Select Language</Text>
          <Text style={styles.languageSubtitle}>भाषा चुनें · ભાષા પસંદ કરો</Text>
          <View style={styles.languageOptions}>
            {LANGUAGES.map((l) => (
              <TouchableOpacity
                key={l.code}
                style={styles.languageOptionBtn}
                activeOpacity={0.8}
                onPress={() => onSelect(l.code)}
              >
                <Text style={styles.languageOptionText}>{l.native}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </BlurView>
    </Modal>
  );
}

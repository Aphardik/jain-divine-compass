import React from 'react';
import { Modal, ScrollView, Switch, Text, TouchableOpacity, View } from 'react-native';
import { LANGUAGES } from '../i18n';
import { formatTime12h } from '../geo';

export default function SettingsModal({
  visible,
  onClose,
  language,
  theme,
  onLanguage,
  onTheme,
  prayerTimes,
  onTogglePrayerTime,
  onRemovePrayerTime,
  onAddPrayerTime,
  onTestNotification,
  colors,
  styles,
  t,
}) {
  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.modalBackdrop}>
        <View style={styles.modalSheet}>
          <View style={styles.modalHandle} />
          <View style={styles.modalHeaderRow}>
            <Text style={styles.modalTitle}>{t('settings')}</Text>
            <TouchableOpacity onPress={onClose} hitSlop={12} style={styles.modalCloseBtn}>
              <Text style={styles.modalClose}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            <Text style={styles.settingLabel}>{t('prayerTimes')}</Text>
            {prayerTimes.map((entry) => (
              <View key={entry.id} style={styles.prayerRow}>
                <Text style={styles.prayerRowTime}>
                  {formatTime12h(entry.hour, entry.minute)}
                </Text>
                <View style={styles.prayerRowActions}>
                  <Switch
                    value={entry.enabled}
                    onValueChange={() => onTogglePrayerTime(entry.id)}
                    trackColor={{ false: colors.toggleOffBg, true: colors.toggleOnBg }}
                    thumbColor={colors.toggleOnDot}
                    ios_backgroundColor={colors.toggleOffBg}
                  />
                  <TouchableOpacity
                    onPress={() => onRemovePrayerTime(entry.id)}
                    hitSlop={10}
                    style={styles.prayerRowRemove}
                  >
                    <Text style={styles.prayerRowRemoveIcon}>✕</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
            <TouchableOpacity style={styles.addPrayerBtn} onPress={onAddPrayerTime}>
              <Text style={styles.addPrayerBtnText}>{t('addPrayerTime')}</Text>
            </TouchableOpacity>

            {/* Temporary debug aid — fires a test notification in ~2s to
                check the custom sound without waiting for a real reminder. */}
            <TouchableOpacity style={styles.addPrayerBtn} onPress={onTestNotification}>
              <Text style={styles.addPrayerBtnText}>Test Notification Sound</Text>
            </TouchableOpacity>

            <Text style={styles.settingLabel}>{t('language')}</Text>
            <View style={styles.segment}>
              {LANGUAGES.map((l) => {
                const on = l.code === language;
                return (
                  <TouchableOpacity
                    key={l.code}
                    onPress={() => onLanguage(l.code)}
                    style={[styles.segmentBtn, on && styles.segmentBtnOn]}
                  >
                    <Text style={[styles.segmentText, on && styles.segmentTextOn]}>{l.native}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <Text style={styles.settingLabel}>{t('theme')}</Text>
            <View style={styles.segment}>
              {[
                { key: 'dark', label: `☾ ${t('dark')}` },
                { key: 'light', label: `☀ ${t('light')}` },
              ].map((opt) => {
                const on = opt.key === theme;
                return (
                  <TouchableOpacity
                    key={opt.key}
                    onPress={() => onTheme(opt.key)}
                    style={[styles.segmentBtn, on && styles.segmentBtnOn]}
                  >
                    <Text style={[styles.segmentText, on && styles.segmentTextOn]}>{opt.label}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <TouchableOpacity style={styles.doneBtn} onPress={onClose}>
              <Text style={styles.doneBtnText}>{t('done')}</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

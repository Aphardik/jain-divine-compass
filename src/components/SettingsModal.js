import React from 'react';
import { Modal, ScrollView, Switch, Text, TouchableOpacity, View } from 'react-native';
import { DAYS, LANGUAGES } from '../i18n';
import { formatTime12h } from '../geo';

function daysLabel(days, language, t) {
  if (!days || days.length === 0 || days.length === 7) return t('daily');
  return days
    .map((key) => {
      const d = DAYS.find((x) => x.key === key);
      return d ? d.short[language] || d.short.en : '';
    })
    .join(', ');
}

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
  onEditPrayerTime,
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
              <TouchableOpacity
                key={entry.id}
                style={styles.prayerRow}
                activeOpacity={0.7}
                onPress={() => onEditPrayerTime && onEditPrayerTime(entry)}
              >
                <View>
                  <Text style={styles.prayerRowTime}>
                    {formatTime12h(entry.hour, entry.minute)}
                  </Text>
                  <Text style={styles.prayerRowDays}>{daysLabel(entry.days, language, t)}</Text>
                </View>
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
              </TouchableOpacity>
            ))}
            <TouchableOpacity style={styles.addPrayerBtn} onPress={onAddPrayerTime}>
              <Text style={styles.addPrayerBtnText}>{t('addPrayerTime')}</Text>
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

import React from 'react';
import { Modal, Text, TouchableOpacity, View } from 'react-native';
import TempleGlyph from './TempleGlyph';

// Anniversary / milestone banner — e.g. Shatrunjaya's 500-year Mahotsav —
// shown once per tirth, offering to set a prayer-time reminder.
export default function MilestoneSheet({ visible, tirth, language, colors, styles, t, onDecline, onAccept }) {
  if (!tirth || !tirth.milestone) return null;
  const { milestone } = tirth;
  const title = milestone.title[language] || milestone.title.en;
  const message = milestone.message[language] || milestone.message.en;

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onDecline}>
      <View style={styles.modalBackdrop}>
        <View style={styles.modalSheet}>
          <View style={styles.modalHandle} />
          <View style={styles.milestoneIconWrap}>
            <View style={styles.milestoneIconBadge}>
              <TempleGlyph size={60} color={colors.gold} />
            </View>
          </View>
          <Text style={styles.milestoneTitle}>{title}</Text>
          <Text style={styles.milestoneMessage}>{message}</Text>
          <View style={styles.milestoneActions}>
            <TouchableOpacity style={styles.milestoneNoBtn} onPress={onDecline}>
              <Text style={styles.milestoneNoText}>{t('no')}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.milestoneYesBtn} onPress={onAccept}>
              <Text style={styles.milestoneYesText}>{t('yes')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

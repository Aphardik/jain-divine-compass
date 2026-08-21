import React from 'react';
import { Modal, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import TempleGlyph from './TempleGlyph';

// Anniversary / milestone banner — shown once, the first time the app is
// opened after install, listing every tirth's milestone occasion together
// (e.g. Shatrunjaya's 500th, Girnar's 600th, Shree Abu's 900th) rather than
// one at a time per selected tirth. Offers to set a prayer-time reminder.
export default function MilestoneSheet({ visible, tirths, language, colors, styles, t, onDecline, onAccept }) {
  const withMilestone = (tirths || []).filter((tt) => tt.milestone);
  if (!withMilestone.length) return null;

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
          <ScrollView showsVerticalScrollIndicator={false}>
            {withMilestone.map((tt, i) => {
              const { milestone } = tt;
              const name = tt.name[language] || tt.name.en;
              const title = milestone.title[language] || milestone.title.en;
              const message = milestone.message[language] || milestone.message.en;
              return (
                <View key={tt.id}>
                  <Text style={styles.milestoneTirthName}>{name}</Text>
                  <Text style={styles.milestoneTitle}>{title}</Text>
                  <Text style={styles.milestoneMessage}>{message}</Text>
                  {i < withMilestone.length - 1 && <View style={styles.milestoneDivider} />}
                </View>
              );
            })}
          </ScrollView>
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

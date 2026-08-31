import React from 'react';
import { Modal, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import TempleGlyph from './TempleGlyph';

// Icon shown next to every entry in `intro.anniversaries`.
const ANNIVERSARY_ICON = 'star-outline';

// Icons for `intro.instructions`, matched to that array by index.
const INSTRUCTION_ICONS = ['options-outline', 'time-outline', 'alarm-outline', 'compass-outline'];

function BulletRow({ icon, text, styles, colors }) {
  return (
    <View style={styles.milestoneBulletRow}>
      <View style={styles.milestoneBulletIconWrap}>{icon}</View>
      <Text style={styles.milestoneBulletText}>{text}</Text>
    </View>
  );
}

// Anniversary / milestone banner — shown once, the first time the app is
// opened after install. `intro` (see tirths.js `MILESTONES_INTRO`) is a
// title, a bulleted list of the three tirths' anniversaries, a prayer-note
// paragraph, and a bulleted list of reminder instructions.
export default function MilestoneSheet({ visible, intro, language, colors, styles, t, onDecline, onAccept }) {
  if (!intro) return null;
  const title = intro.title[language] || intro.title.en;
  const prayerNote = intro.prayerNote[language] || intro.prayerNote.en;
  const anniversaries = intro.anniversaries.map((item) => item[language] || item.en);
  const instructions = intro.instructions.map((item) => item[language] || item.en);

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onDecline}>
      <View style={styles.modalBackdrop}>
        <View style={styles.modalSheet}>
          <View style={styles.modalHandle} />
          <ScrollView showsVerticalScrollIndicator={false} style={styles.milestoneScroll}>
            <View style={styles.milestoneIconWrap}>
              <View style={styles.milestoneIconBadge}>
                <TempleGlyph size={60} color={colors.gold} />
              </View>
            </View>
            <Text style={styles.milestoneTitle}>{title}</Text>

            <View style={styles.milestoneBulletGroup}>
              {anniversaries.map((text, i) => (
                <BulletRow
                  key={`ann-${i}`}
                  icon={<Ionicons name={ANNIVERSARY_ICON} size={16} color={colors.gold} />}
                  text={text}
                  styles={styles}
                  colors={colors}
                />
              ))}
            </View>

            <Text style={styles.milestoneMessage}>{prayerNote}</Text>

            <View style={styles.milestoneBulletGroup}>
              {instructions.map((text, i) => (
                <BulletRow
                  key={`ins-${i}`}
                  icon={
                    INSTRUCTION_ICONS[i] ? (
                      <Ionicons name={INSTRUCTION_ICONS[i]} size={16} color={colors.gold} />
                    ) : (
                      <MaterialCommunityIcons name="meditation" size={17} color={colors.gold} />
                    )
                  }
                  text={text}
                  styles={styles}
                  colors={colors}
                />
              ))}
            </View>
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

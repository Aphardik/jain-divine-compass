import React from 'react';
import { Modal, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { REGIONS } from '../i18n';

// Dropdown-style sheet for switching which tirth the compass points at.
export default function TirthPickerModal({
  visible,
  tirths,
  selectedId,
  language,
  onSelect,
  onClose,
  styles,
  t,
}) {
  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.modalBackdrop}>
        <View style={styles.modalSheet}>
          <View style={styles.modalHandle} />
          <View style={styles.modalHeaderRow}>
            <Text style={styles.modalTitle}>{t('chooseTirth')}</Text>
            <TouchableOpacity onPress={onClose} hitSlop={12} style={styles.modalCloseBtn}>
              <Text style={styles.modalClose}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            {tirths.map((tirth) => {
              const on = tirth.id === selectedId;
              const name = tirth.name[language] || tirth.name.en;
              const place = tirth.place && (tirth.place[language] || tirth.place.en);
              const region = tirth.region && REGIONS[tirth.region];
              const rg = region && (region[language] || region.en);
              return (
                <TouchableOpacity
                  key={tirth.id}
                  style={[styles.tirthOptionRow, on && styles.tirthOptionRowOn]}
                  onPress={() => onSelect(tirth.id)}
                >
                  <View>
                    <Text style={[styles.tirthOptionName, on && styles.tirthOptionNameOn]}>
                      {name}
                    </Text>
                    {!!place && (
                      <Text style={styles.tirthOptionPlace}>
                        {place} · {rg}
                      </Text>
                    )}
                  </View>
                  {on && <Text style={styles.tirthOptionCheck}>✓</Text>}
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

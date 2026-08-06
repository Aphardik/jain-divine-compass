import React, { useEffect, useState } from 'react';
import { Modal, Text, TouchableOpacity, View } from 'react-native';
import { formatTime12h } from '../geo';

// Custom hour/minute stepper — avoids pulling in a native date-picker module.
// Hour is kept in 24h internally so stepping past 12 flips AM/PM on its own,
// matching the reference design (no separate AM/PM control).
export default function TimePickerModal({
  visible,
  initialHour = 7,
  initialMinute = 0,
  onCancel,
  onSave,
  styles,
  t,
}) {
  const [hour, setHour] = useState(initialHour);
  const [minute, setMinute] = useState(initialMinute);

  useEffect(() => {
    if (visible) {
      setHour(initialHour);
      setMinute(initialMinute);
    }
  }, [visible, initialHour, initialMinute]);

  const stepHour = (delta) => setHour((h) => (h + delta + 24) % 24);
  const stepMinute = (delta) => setMinute((m) => (m + delta + 60) % 60);
  const hour12 = hour % 12 === 0 ? 12 : hour % 12;

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onCancel}>
      <View style={styles.modalBackdrop}>
        <View style={styles.modalSheet}>
          <View style={styles.modalHandle} />
          <Text style={styles.timePickerTitle}>{formatTime12h(hour, minute)}</Text>

          <View style={styles.timePickerRow}>
            <View style={styles.timePickerCol}>
              <Text style={styles.timePickerColLabel}>{t('hourLabel')}</Text>
              <TouchableOpacity
                style={styles.stepperBtn}
                onPress={() => stepHour(1)}
                hitSlop={8}
              >
                <Text style={styles.stepperIcon}>▲</Text>
              </TouchableOpacity>
              <Text style={styles.timePickerValue}>{String(hour12).padStart(2, '0')}</Text>
              <TouchableOpacity
                style={styles.stepperBtn}
                onPress={() => stepHour(-1)}
                hitSlop={8}
              >
                <Text style={styles.stepperIcon}>▼</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.timePickerColon}>:</Text>

            <View style={styles.timePickerCol}>
              <Text style={styles.timePickerColLabel}>{t('minuteLabel')}</Text>
              <TouchableOpacity
                style={styles.stepperBtn}
                onPress={() => stepMinute(1)}
                hitSlop={8}
              >
                <Text style={styles.stepperIcon}>▲</Text>
              </TouchableOpacity>
              <Text style={styles.timePickerValue}>{String(minute).padStart(2, '0')}</Text>
              <TouchableOpacity
                style={styles.stepperBtn}
                onPress={() => stepMinute(-1)}
                hitSlop={8}
              >
                <Text style={styles.stepperIcon}>▼</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.timePickerActions}>
            <TouchableOpacity style={styles.cancelBtn} onPress={onCancel}>
              <Text style={styles.cancelBtnText}>{t('cancel')}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.timePickerSaveBtn} onPress={() => onSave(hour, minute)}>
              <Text style={styles.timePickerSaveBtnText}>{t('saveBtn')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

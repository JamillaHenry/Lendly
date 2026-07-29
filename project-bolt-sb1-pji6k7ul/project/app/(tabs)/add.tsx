import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  ScrollView,
  SafeAreaView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Image as ImageIcon, Clock, MapPin } from 'lucide-react-native';
import { supabase } from '@/lib/supabase';
import { Category, ListingType, ItemInput } from '@/lib/types';
import { colors, spacing, typography, radius } from '@/lib/theme';
import { CATEGORIES, DEFAULT_LOCATION } from '@/lib/constants';

export default function AddItemScreen() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<Category>('Tools');
  const [listingType, setListingType] = useState<ListingType>('lend');
  const [imageUrl, setImageUrl] = useState('');
  const [housePhotoUrl, setHousePhotoUrl] = useState('');
  const [lenderName, setLenderName] = useState('');
  const [address, setAddress] = useState('');
  const [borrowDuration, setBorrowDuration] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!title || !description || !lenderName || !address) {
      Alert.alert('Missing Info', 'Please fill in all required fields.');
      return;
    }
    if (!imageUrl) {
      Alert.alert('Missing Photo', 'Please add a photo URL for the item or room.');
      return;
    }
    if (!housePhotoUrl) {
      Alert.alert(
        'Missing House Photo',
        'Please add a photo URL of your house so borrowers can find it.'
      );
      return;
    }

    setSaving(true);
    const payload: ItemInput = {
      title,
      description,
      category,
      listing_type: listingType,
      image_url: imageUrl,
      house_photo_url: housePhotoUrl,
      lender_name: lenderName,
      address,
      latitude: DEFAULT_LOCATION.latitude + (Math.random() - 0.5) * 0.02,
      longitude: DEFAULT_LOCATION.longitude + (Math.random() - 0.5) * 0.02,
      borrow_duration_days:
        listingType === 'borrow' && borrowDuration
          ? parseInt(borrowDuration, 10)
          : null,
    };

    const { error } = await supabase.from('items').insert(payload);

    if (error) {
      Alert.alert('Error', 'Could not save your listing. Please try again.');
      setSaving(false);
      return;
    }

    Alert.alert('Success', 'Your item has been listed!', [
      { text: 'OK', onPress: () => router.push('/(tabs)/index') },
    ]);
    setSaving(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>List an Item</Text>
          <Text style={styles.headerSubtitle}>
            Share an item or a space with your neighbors
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Listing Type</Text>
          <View style={styles.typeToggle}>
            <Pressable
              style={[
                styles.typeButton,
                listingType === 'lend' && styles.activeLend,
              ]}
              onPress={() => setListingType('lend')}>
              <Text
                style={[
                  styles.typeButtonText,
                  listingType === 'lend' && styles.activeTypeText,
                ]}>
                I'm Lending
              </Text>
            </Pressable>
            <Pressable
              style={[
                styles.typeButton,
                listingType === 'borrow' && styles.activeBorrow,
              ]}
              onPress={() => setListingType('borrow')}>
              <Text
                style={[
                  styles.typeButtonText,
                  listingType === 'borrow' && styles.activeTypeText,
                ]}>
                I Want to Borrow
              </Text>
            </Pressable>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Item or Space Name</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. Cordless Drill, Guest Room, Camping Tent"
            value={title}
            onChangeText={setTitle}
            placeholderTextColor={colors.neutral[400]}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Description</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Describe the item or space, its condition, and any instructions..."
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={4}
            placeholderTextColor={colors.neutral[400]}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Category</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoryScroll}>
            {CATEGORIES.map((cat) => (
              <Pressable
                key={cat.label}
                style={[
                  styles.categoryChip,
                  category === cat.label && styles.activeChip,
                ]}
                onPress={() => setCategory(cat.label)}>
                <Text
                  style={[
                    styles.chipText,
                    category === cat.label && styles.activeChipText,
                  ]}>
                  {cat.label}
                </Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>
            <ImageIcon size={14} color={colors.neutral[500]} /> Photo URL
          </Text>
          <TextInput
            style={styles.input}
            placeholder="https://... (photo of the item or room)"
            value={imageUrl}
            onChangeText={setImageUrl}
            placeholderTextColor={colors.neutral[400]}
            autoCapitalize="none"
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>
            <MapPin size={14} color={colors.neutral[500]} /> House Photo URL
          </Text>
          <TextInput
            style={styles.input}
            placeholder="https://... (photo of your house)"
            value={housePhotoUrl}
            onChangeText={setHousePhotoUrl}
            placeholderTextColor={colors.neutral[400]}
            autoCapitalize="none"
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Your Name</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. Jane Smith"
            value={lenderName}
            onChangeText={setLenderName}
            placeholderTextColor={colors.neutral[400]}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Your Address</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. 142 Maple Street, Springfield"
            value={address}
            onChangeText={setAddress}
            placeholderTextColor={colors.neutral[400]}
          />
        </View>

        {listingType === 'borrow' && (
          <View style={styles.section}>
            <Text style={styles.label}>
              <Clock size={14} color={colors.neutral[500]} /> How many days do
              you need it for?
            </Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. 3"
              value={borrowDuration}
              onChangeText={setBorrowDuration}
              keyboardType="numeric"
              placeholderTextColor={colors.neutral[400]}
            />
          </View>
        )}

        <Pressable
          style={({ pressed }) => [
            styles.saveButton,
            pressed && styles.pressed,
            saving && styles.saveButtonDisabled,
          ]}
          onPress={handleSave}
          disabled={saving}>
          {saving ? (
            <ActivityIndicator color={colors.neutral[0]} />
          ) : (
            <Text style={styles.saveButtonText}>Post Listing</Text>
          )}
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.neutral[50],
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  header: {
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
  },
  headerTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 28,
    color: colors.neutral[900],
  },
  headerSubtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: typography.body,
    color: colors.neutral[500],
    marginTop: 2,
  },
  section: {
    marginBottom: spacing.md,
  },
  label: {
    fontFamily: 'Inter-SemiBold',
    fontSize: typography.caption,
    color: colors.neutral[700],
    marginBottom: spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  input: {
    fontFamily: 'Inter-Regular',
    fontSize: typography.body,
    color: colors.neutral[900],
    backgroundColor: colors.neutral[0],
    borderWidth: 1,
    borderColor: colors.neutral[200],
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md - 2,
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  typeToggle: {
    flexDirection: 'row',
    gap: 8,
  },
  typeButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: radius.md,
    backgroundColor: colors.neutral[0],
    borderWidth: 1,
    borderColor: colors.neutral[200],
    alignItems: 'center',
  },
  activeLend: {
    backgroundColor: colors.primary[500],
    borderColor: colors.primary[500],
  },
  activeBorrow: {
    backgroundColor: colors.secondary[500],
    borderColor: colors.secondary[500],
  },
  typeButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: typography.caption,
    color: colors.neutral[500],
  },
  activeTypeText: {
    color: colors.neutral[0],
  },
  categoryScroll: {
    gap: 8,
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: radius.pill,
    backgroundColor: colors.neutral[100],
    borderWidth: 1,
    borderColor: colors.neutral[200],
  },
  activeChip: {
    backgroundColor: colors.primary[500],
    borderColor: colors.primary[500],
  },
  chipText: {
    fontFamily: 'Inter-Medium',
    fontSize: typography.caption,
    color: colors.neutral[600],
  },
  activeChipText: {
    color: colors.neutral[0],
  },
  saveButton: {
    backgroundColor: colors.primary[600],
    borderRadius: radius.lg,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  saveButtonDisabled: {
    opacity: 0.6,
  },
  saveButtonText: {
    fontFamily: 'Inter-Bold',
    fontSize: typography.body,
    color: colors.neutral[0],
  },
  pressed: {
    transform: [{ scale: 0.98 }],
  },
});

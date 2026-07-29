import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Pressable,
  ActivityIndicator,
  Image,
  Alert,
  Linking,
} from 'react-native';
import {
  ArrowLeft,
  MapPin,
  Navigation,
  Clock,
  Package,
  User,
  FileText,
  Home,
  X,
} from 'lucide-react-native';
import { supabase } from '@/lib/supabase';
import { Item } from '@/lib/types';
import { colors, spacing, typography, radius } from '@/lib/theme';
import { DEFAULT_LOCATION } from '@/lib/constants';

export default function ItemDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [item, setItem] = useState<Item | null>(null);
  const [loading, setLoading] = useState(true);
  const [showRoute, setShowRoute] = useState(false);

  const fetchItem = useCallback(async () => {
    if (!id) return;
    const { data, error } = await supabase
      .from('items')
      .select('*')
      .eq('id', id)
      .maybeSingle();
    if (error) console.error(error);
    if (data) setItem(data as Item);
    setLoading(false);
  }, [id]);

  useEffect(() => {
    fetchItem();
  }, [fetchItem]);

  const getDistance = (lat: number, lng: number) => {
    const dLat = (lat - DEFAULT_LOCATION.latitude) * 111000;
    const dLng =
      (lng - DEFAULT_LOCATION.longitude) *
      111000 *
      Math.cos((DEFAULT_LOCATION.latitude * Math.PI) / 180);
    return Math.sqrt(dLat * dLat + dLng * dLng);
  };

  const getPosition = (lat: number, lng: number) => {
    const range = 0.01;
    const left = ((lng - DEFAULT_LOCATION.longitude + range) / (range * 2)) * 100;
    const top = ((DEFAULT_LOCATION.latitude + range - lat) / (range * 2)) * 100;
    return {
      left: Math.max(5, Math.min(95, left)),
      top: Math.max(10, Math.min(90, top)),
    };
  };

  const openInMaps = () => {
    if (!item) return;
    const url = `https://www.google.com/maps/dir/?api=1&destination=${item.latitude},${item.longitude}`;
    Linking.openURL(url).catch(() =>
      Alert.alert('Error', 'Could not open maps.')
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary[500]} />
      </SafeAreaView>
    );
  }

  if (!item) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <Text style={styles.errorText}>Item not found.</Text>
        <Pressable
          style={styles.backButton}
          onPress={() => router.back()}>
          <Text style={styles.backButtonText}>Go Back</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  const isBorrow = item.listing_type === 'borrow';
  const dist = getDistance(item.latitude, item.longitude);
  const distText = dist < 1000
    ? `${Math.round(dist)} m away`
    : `${(dist / 1000).toFixed(1)} km away`;
  const userPos = getPosition(DEFAULT_LOCATION.latitude, DEFAULT_LOCATION.longitude);
  const itemPos = getPosition(item.latitude, item.longitude);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>
        <View style={styles.topBar}>
          <Pressable
            style={({ pressed }) => [styles.iconButton, pressed && styles.pressed]}
            onPress={() => router.back()}>
            <ArrowLeft size={22} color={colors.neutral[700]} strokeWidth={2} />
          </Pressable>
        </View>

        <View style={styles.imageContainer}>
          <Image source={{ uri: item.image_url }} style={styles.itemImage} />
          <View
            style={[
              styles.typeBadge,
              isBorrow ? styles.borrowBadge : styles.lendBadge,
            ]}>
            <Text style={styles.typeBadgeText}>
              {isBorrow ? 'Borrowing Request' : 'Available to Lend'}
            </Text>
          </View>
        </View>

        <View style={styles.content}>
          <Text style={styles.title}>{item.title}</Text>
          <View style={styles.metaRow}>
            <View style={styles.categoryTag}>
              <Text style={styles.categoryText}>{item.category}</Text>
            </View>
            <View style={styles.distanceTag}>
              <MapPin size={13} color={colors.primary[600]} strokeWidth={2} />
              <Text style={styles.distanceText}>{distText}</Text>
            </View>
          </View>

          {isBorrow && item.borrow_duration_days && (
            <View style={styles.durationBanner}>
              <Clock size={20} color={colors.secondary[700]} strokeWidth={2} />
              <View style={styles.durationInfo}>
                <Text style={styles.durationLabel}>Borrow Duration</Text>
                <Text style={styles.durationValue}>
                  {item.borrow_duration_days} day
                  {item.borrow_duration_days > 1 ? 's' : ''}
                </Text>
              </View>
            </View>
          )}

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <FileText size={18} color={colors.neutral[700]} strokeWidth={2} />
              <Text style={styles.sectionTitle}>Description</Text>
            </View>
            <Text style={styles.descriptionText}>{item.description}</Text>
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <User size={18} color={colors.neutral[700]} strokeWidth={2} />
              <Text style={styles.sectionTitle}>Listed By</Text>
            </View>
            <Text style={styles.lenderName}>{item.lender_name}</Text>
            <Text style={styles.addressText}>{item.address}</Text>
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Home size={18} color={colors.neutral[700]} strokeWidth={2} />
              <Text style={styles.sectionTitle}>What the House Looks Like</Text>
            </View>
            <View style={styles.housePhotoContainer}>
              <Image
                source={{ uri: item.house_photo_url }}
                style={styles.housePhoto}
              />
              <Text style={styles.houseCaption}>
                Look for this house when you arrive
              </Text>
            </View>
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <MapPin size={18} color={colors.neutral[700]} strokeWidth={2} />
              <Text style={styles.sectionTitle}>Location & Route</Text>
            </View>

            <View style={styles.routeMap}>
              <View style={styles.routeGrid}>
                {Array.from({ length: 5 }).map((_, i) => (
                  <View
                    key={`h-${i}`}
                    style={[styles.routeGridH, { top: `${(i + 1) * 20}%` }]}
                  />
                ))}
                {Array.from({ length: 5 }).map((_, i) => (
                  <View
                    key={`v-${i}`}
                    style={[styles.routeGridV, { left: `${(i + 1) * 20}%` }]}
                  />
                ))}

                {/* Dashed route line approximation */}
                <View
                  style={[
                    styles.routeLine,
                    {
                      left: `${Math.min(userPos.left, itemPos.left)}%`,
                      top: `${Math.min(userPos.top, itemPos.top)}%`,
                      width: `${Math.abs(itemPos.left - userPos.left)}%`,
                      height: `${Math.abs(itemPos.top - userPos.top)}%`,
                    },
                  ]}
                />

                {/* You marker */}
                <View
                  style={[styles.routeMarkerWrap, { left: `${userPos.left}%`, top: `${userPos.top}%` }]}>
                  <View style={styles.youMarker}>
                    <Text style={styles.youMarkerText}>You</Text>
                  </View>
                </View>

                {/* Item marker */}
                <View
                  style={[styles.routeMarkerWrap, { left: `${itemPos.left}%`, top: `${itemPos.top}%` }]}>
                  <View
                    style={[
                      styles.itemMarker,
                      isBorrow ? styles.itemMarkerBorrow : styles.itemMarkerLend,
                    ]}>
                    <MapPin size={20} color={colors.neutral[0]} strokeWidth={2} />
                  </View>
                </View>
              </View>
            </View>

            <View style={styles.routeInfo}>
              <View style={styles.routeInfoRow}>
                <View style={[styles.routeDot, styles.routeDotStart]} />
                <View style={styles.routeInfoText}>
                  <Text style={styles.routeLabel}>From</Text>
                  <Text style={styles.routeValue}>Your location</Text>
                </View>
              </View>
              <View style={styles.routeConnector} />
              <View style={styles.routeInfoRow}>
                <View style={[styles.routeDot, styles.routeDotEnd]} />
                <View style={styles.routeInfoText}>
                  <Text style={styles.routeLabel}>To</Text>
                  <Text style={styles.routeValue}>{item.address}</Text>
                </View>
                <Text style={styles.routeDistance}>{distText}</Text>
              </View>
            </View>

            <Pressable
              style={({ pressed }) => [
                styles.directionsButton,
                pressed && styles.pressed,
              ]}
              onPress={openInMaps}>
              <Navigation size={20} color={colors.neutral[0]} strokeWidth={2} />
              <Text style={styles.directionsButtonText}>
                Get Directions
              </Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.neutral[0],
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.neutral[50],
    gap: 16,
  },
  errorText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: typography.body,
    color: colors.neutral[600],
  },
  backButton: {
    backgroundColor: colors.primary[600],
    borderRadius: radius.md,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  backButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: typography.caption,
    color: colors.neutral[0],
  },
  scrollContent: {
    paddingBottom: spacing.xxl,
  },
  topBar: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
    paddingBottom: spacing.sm,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.neutral[100],
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    height: 260,
  },
  itemImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  typeBadge: {
    position: 'absolute',
    bottom: 12,
    left: 16,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: radius.pill,
  },
  lendBadge: { backgroundColor: colors.primary[500] },
  borrowBadge: { backgroundColor: colors.secondary[500] },
  typeBadgeText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 12,
    color: colors.neutral[0],
  },
  content: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
  },
  title: {
    fontFamily: 'Inter-Bold',
    fontSize: typography.heading,
    color: colors.neutral[900],
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 8,
  },
  categoryTag: {
    backgroundColor: colors.primary[50],
    borderRadius: radius.pill,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: colors.primary[200],
  },
  categoryText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: typography.small,
    color: colors.primary[700],
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  distanceTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  distanceText: {
    fontFamily: 'Inter-Medium',
    fontSize: typography.caption,
    color: colors.primary[600],
  },
  durationBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: colors.secondary[50],
    borderRadius: radius.lg,
    padding: spacing.md,
    marginTop: spacing.md,
    borderWidth: 1,
    borderColor: colors.secondary[200],
  },
  durationInfo: {
    flex: 1,
  },
  durationLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: typography.small,
    color: colors.secondary[700],
  },
  durationValue: {
    fontFamily: 'Inter-Bold',
    fontSize: typography.title,
    color: colors.secondary[800],
  },
  section: {
    marginTop: spacing.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: spacing.sm,
  },
  sectionTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: typography.body,
    color: colors.neutral[900],
  },
  descriptionText: {
    fontFamily: 'Inter-Regular',
    fontSize: typography.body,
    color: colors.neutral[600],
    lineHeight: 24,
  },
  lenderName: {
    fontFamily: 'Inter-SemiBold',
    fontSize: typography.body,
    color: colors.neutral[900],
  },
  addressText: {
    fontFamily: 'Inter-Regular',
    fontSize: typography.caption,
    color: colors.neutral[500],
    marginTop: 2,
  },
  housePhotoContainer: {
    borderRadius: radius.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.neutral[200],
  },
  housePhoto: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  houseCaption: {
    fontFamily: 'Inter-Regular',
    fontSize: typography.small,
    color: colors.neutral[400],
    textAlign: 'center',
    paddingVertical: 8,
    backgroundColor: colors.neutral[50],
  },
  routeMap: {
    borderRadius: radius.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.neutral[200],
    marginBottom: spacing.md,
  },
  routeGrid: {
    width: '100%',
    height: 220,
    position: 'relative',
    backgroundColor: colors.primary[50],
  },
  routeGridH: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: colors.neutral[200],
  },
  routeGridV: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 1,
    backgroundColor: colors.neutral[200],
  },
  routeLine: {
    position: 'absolute',
    borderTopWidth: 2,
    borderLeftWidth: 2,
    borderStyle: 'dashed',
    borderColor: colors.accent[400],
  },
  routeMarkerWrap: {
    position: 'absolute',
    transform: [{ translateX: -14 }, { translateY: -14 }],
  },
  youMarker: {
    backgroundColor: colors.accent[500],
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  youMarkerText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 11,
    color: colors.neutral[0],
  },
  itemMarker: {
    borderRadius: 999,
    padding: 6,
    shadowColor: colors.neutral[900],
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
  },
  itemMarkerLend: { backgroundColor: colors.primary[500] },
  itemMarkerBorrow: { backgroundColor: colors.secondary[500] },
  routeInfo: {
    backgroundColor: colors.neutral[50],
    borderRadius: radius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.neutral[200],
  },
  routeInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  routeDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  routeDotStart: { backgroundColor: colors.accent[500] },
  routeDotEnd: { backgroundColor: colors.primary[500] },
  routeInfoText: {
    flex: 1,
  },
  routeLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: typography.small,
    color: colors.neutral[400],
  },
  routeValue: {
    fontFamily: 'Inter-SemiBold',
    fontSize: typography.caption,
    color: colors.neutral[800],
  },
  routeConnector: {
    width: 2,
    height: 20,
    backgroundColor: colors.neutral[300],
    marginLeft: 5,
    marginVertical: 4,
  },
  routeDistance: {
    fontFamily: 'Inter-SemiBold',
    fontSize: typography.caption,
    color: colors.primary[600],
  },
  directionsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: colors.primary[600],
    borderRadius: radius.lg,
    paddingVertical: 16,
    marginTop: spacing.md,
  },
  directionsButtonText: {
    fontFamily: 'Inter-Bold',
    fontSize: typography.body,
    color: colors.neutral[0],
  },
  pressed: {
    transform: [{ scale: 0.98 }],
  },
});

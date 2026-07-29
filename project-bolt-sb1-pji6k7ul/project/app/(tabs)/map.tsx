import { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Pressable,
  ActivityIndicator,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import { MapPin, Navigation, Clock, Package } from 'lucide-react-native';
import { supabase } from '@/lib/supabase';
import { Item } from '@/lib/types';
import { colors, spacing, typography, radius } from '@/lib/theme';
import { DEFAULT_LOCATION } from '@/lib/constants';

export default function MapScreen() {
  const router = useRouter();
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Item | null>(null);

  const fetchItems = useCallback(async () => {
    const { data, error } = await supabase
      .from('items')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) console.error(error);
    if (data) setItems(data as Item[]);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  // Convert lat/long to relative position on the map view
  const getPosition = (lat: number, lng: number) => {
    const range = 0.03;
    const left = ((lng - DEFAULT_LOCATION.longitude + range) / (range * 2)) * 100;
    const top = ((DEFAULT_LOCATION.latitude + range - lat) / (range * 2)) * 100;
    return {
      left: Math.max(5, Math.min(95, left)),
      top: Math.max(5, Math.min(95, top)),
    };
  };

  const getDistance = (lat: number, lng: number) => {
    const dLat = (lat - DEFAULT_LOCATION.latitude) * 111000;
    const dLng =
      (lng - DEFAULT_LOCATION.longitude) *
      111000 *
      Math.cos((DEFAULT_LOCATION.latitude * Math.PI) / 180);
    return Math.sqrt(dLat * dLat + dLng * dLng);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Neighborhood Map</Text>
        <Text style={styles.headerSubtitle}>
          See what's available near you
        </Text>
      </View>

      {loading ? (
        <View style={styles.centerContent}>
          <ActivityIndicator size="large" color={colors.primary[500]} />
        </View>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}>
          <View style={styles.mapContainer}>
            <View style={styles.mapGrid}>
              {Array.from({ length: 6 }).map((_, i) => (
                <View
                  key={`h-${i}`}
                  style={[styles.gridLineH, { top: `${(i + 1) * 16.66}%` }]}
                />
              ))}
              {Array.from({ length: 6 }).map((_, i) => (
                <View
                  key={`v-${i}`}
                  style={[styles.gridLineV, { left: `${(i + 1) * 16.66}%` }]}
                />
              ))}
              {/* "You are here" marker */}
              <View
                style={[
                  styles.pinWrap,
                  getPosition(DEFAULT_LOCATION.latitude, DEFAULT_LOCATION.longitude),
                ]}>
                <View style={styles.youHere}>
                  <Text style={styles.youHereText}>You</Text>
                </View>
              </View>
              {/* Item pins */}
              {items.map((item) => {
                const pos = getPosition(item.latitude, item.longitude);
                const isActive = selected?.id === item.id;
                return (
                  <Pressable
                    key={item.id}
                    style={[styles.pinWrap, { left: pos.left, top: pos.top }]}
                    onPress={() => setSelected(item)}>
                    <View
                      style={[
                        styles.pin,
                        isActive && styles.pinActive,
                        item.listing_type === 'borrow'
                          ? styles.pinBorrow
                          : styles.pinLend,
                      ]}>
                      <MapPin
                        size={isActive ? 28 : 22}
                        color={colors.neutral[0]}
                        strokeWidth={2}
                      />
                    </View>
                  </Pressable>
                );
              })}
            </View>
          </View>

          {selected ? (
            <View style={styles.selectedCard}>
              <Image
                source={{ uri: selected.image_url }}
                style={styles.selectedImage}
              />
              <View style={styles.selectedContent}>
                <View style={styles.selectedHeader}>
                  <Text style={styles.selectedTitle}>{selected.title}</Text>
                  <View
                    style={[
                      styles.typeBadge,
                      selected.listing_type === 'borrow'
                        ? styles.borrowBadge
                        : styles.lendBadge,
                    ]}>
                    <Text style={styles.typeBadgeText}>
                      {selected.listing_type === 'borrow'
                        ? 'Borrowing'
                        : 'Lending'}
                    </Text>
                  </View>
                </View>
                <Text style={styles.selectedAddress}>{selected.address}</Text>
                <Text style={styles.selectedLender}>
                  Listed by {selected.lender_name}
                </Text>
                {selected.listing_type === 'borrow' &&
                  selected.borrow_duration_days && (
                    <View style={styles.durationRow}>
                      <Clock size={14} color={colors.secondary[700]} strokeWidth={2} />
                      <Text style={styles.durationText}>
                        Needs for {selected.borrow_duration_days} day
                        {selected.borrow_duration_days > 1 ? 's' : ''}
                      </Text>
                    </View>
                  )}
                <Pressable
                  style={({ pressed }) => [
                    styles.directionsButton,
                    pressed && styles.pressed,
                  ]}
                  onPress={() => router.push(`/item/${selected.id}`)}>
                  <Navigation size={16} color={colors.neutral[0]} strokeWidth={2} />
                  <Text style={styles.directionsText}>View Details & Route</Text>
                </Pressable>
              </View>
            </View>
          ) : (
            <View style={styles.hintCard}>
              <Package size={24} color={colors.neutral[400]} strokeWidth={2} />
              <Text style={styles.hintText}>
                Tap a pin to see item details and get directions
              </Text>
            </View>
          )}

          <Text style={styles.listTitle}>All Locations</Text>
          {items.map((item) => {
            const dist = getDistance(item.latitude, item.longitude);
            return (
              <Pressable
                key={item.id}
                style={({ pressed }) => [
                  styles.locationRow,
                  pressed && styles.pressed,
                ]}
                onPress={() => router.push(`/item/${item.id}`)}>
                <Image
                  source={{ uri: item.image_url }}
                  style={styles.locationImage}
                />
                <View style={styles.locationInfo}>
                  <Text style={styles.locationTitle} numberOfLines={1}>
                    {item.title}
                  </Text>
                  <Text style={styles.locationAddress} numberOfLines={1}>
                    {item.address}
                  </Text>
                  <View style={styles.locationMeta}>
                    <MapPin size={12} color={colors.primary[600]} strokeWidth={2} />
                    <Text style={styles.distanceText}>
                      {dist < 1000
                        ? `${Math.round(dist)} m away`
                        : `${(dist / 1000).toFixed(1)} km away`}
                    </Text>
                  </View>
                </View>
              </Pressable>
            );
          })}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.neutral[50],
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.sm,
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
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  mapContainer: {
    borderRadius: radius.xl,
    overflow: 'hidden',
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.neutral[200],
    backgroundColor: colors.primary[50],
  },
  mapGrid: {
    width: '100%',
    height: 320,
    position: 'relative',
  },
  gridLineH: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: colors.neutral[200],
  },
  gridLineV: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 1,
    backgroundColor: colors.neutral[200],
  },
  pinWrap: {
    position: 'absolute',
    transform: [{ translateX: -14 }, { translateY: -14 }],
  },
  pin: {
    borderRadius: 999,
    padding: 6,
    shadowColor: colors.neutral[900],
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
  },
  pinLend: {
    backgroundColor: colors.primary[500],
  },
  pinBorrow: {
    backgroundColor: colors.secondary[500],
  },
  pinActive: {
    padding: 8,
  shadowOpacity: 0.4,
    elevation: 6,
  zIndex: 10,
  borderWidth: 2,
    borderColor: colors.neutral[0],
  },
  youHere: {
    backgroundColor: colors.accent[500],
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 5,
    shadowColor: colors.neutral[900],
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  youHereText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 11,
    color: colors.neutral[0],
  },
  selectedCard: {
    flexDirection: 'row',
    backgroundColor: colors.neutral[0],
    borderRadius: radius.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.neutral[200],
    marginBottom: spacing.md,
    shadowColor: colors.neutral[900],
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 5,
  },
  selectedImage: {
    width: 110,
    height: '100%',
    minHeight: 140,
    resizeMode: 'cover',
  },
  selectedContent: {
    flex: 1,
    padding: spacing.md,
    gap: 4,
  },
  selectedHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 8,
  },
  selectedTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: typography.body,
    color: colors.neutral[900],
    flex: 1,
  },
  typeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radius.pill,
  },
  lendBadge: { backgroundColor: colors.primary[500] },
  borrowBadge: { backgroundColor: colors.secondary[500] },
  typeBadgeText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 10,
    color: colors.neutral[0],
  },
  selectedAddress: {
    fontFamily: 'Inter-Regular',
    fontSize: typography.caption,
    color: colors.neutral[500],
  },
  selectedLender: {
    fontFamily: 'Inter-Medium',
    fontSize: typography.small,
    color: colors.neutral[400],
  },
  durationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  durationText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: typography.small,
    color: colors.secondary[700],
  },
  directionsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.primary[600],
    borderRadius: radius.md,
    paddingVertical: 10,
    paddingHorizontal: 14,
    marginTop: 8,
    alignSelf: 'flex-start',
  },
  directionsText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: typography.caption,
    color: colors.neutral[0],
  },
  hintCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: colors.neutral[100],
    borderRadius: radius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  hintText: {
    fontFamily: 'Inter-Regular',
    fontSize: typography.caption,
    color: colors.neutral[500],
    flex: 1,
  },
  listTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: typography.title,
    color: colors.neutral[900],
    marginBottom: spacing.sm,
  },
  locationRow: {
    flexDirection: 'row',
    backgroundColor: colors.neutral[0],
    borderRadius: radius.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.neutral[200],
    marginBottom: spacing.sm,
  },
  locationImage: {
    width: 72,
    height: 72,
    resizeMode: 'cover',
  },
  locationInfo: {
    flex: 1,
    padding: spacing.sm + 2,
    justifyContent: 'center',
    gap: 2,
  },
  locationTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: typography.body,
    color: colors.neutral[900],
  },
  locationAddress: {
    fontFamily: 'Inter-Regular',
    fontSize: typography.caption,
    color: colors.neutral[500],
  },
  locationMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  distanceText: {
    fontFamily: 'Inter-Medium',
    fontSize: typography.small,
    color: colors.primary[600],
  },
  centerContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: {
    transform: [{ scale: 0.98 }],
  },
});

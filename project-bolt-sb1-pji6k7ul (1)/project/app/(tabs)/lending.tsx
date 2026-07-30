import { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  SafeAreaView,
  RefreshControl,
  Pressable,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Handshake, Trash2, Clock, Package } from 'lucide-react-native';
import { supabase } from '@/lib/supabase';
import { Item } from '@/lib/types';
import { colors, spacing, typography, radius } from '@/lib/theme';
import { ItemCard } from '@/components/ItemCard';

export default function LendingScreen() {
  const router = useRouter();
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchItems = useCallback(async () => {
    const { data, error } = await supabase
      .from('items')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) console.error(error);
    if (data) setItems(data as Item[]);
    setLoading(false);
    setRefreshing(false);
  }, []);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchItems();
  }, [fetchItems]);

  const handleDelete = (item: Item) => {
    Alert.alert(
      'Remove Listing',
      `Are you sure you want to remove "${item.title}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: async () => {
            const { error } = await supabase
              .from('items')
              .delete()
              .eq('id', item.id);
            if (error) {
              Alert.alert('Error', 'Could not remove the listing.');
              return;
            }
            fetchItems();
          },
        },
      ]
    );
  };

  const handlePress = (id: string) => {
    router.push(`/item/${id}`);
  };

  const lendingCount = items.filter((i) => i.listing_type === 'lend').length;
  const borrowingCount = items.filter((i) => i.listing_type === 'borrow').length;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Lending</Text>
        <Text style={styles.headerSubtitle}>
          Manage your listings and requests
        </Text>
      </View>

      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <View style={[styles.statIcon, styles.lendIcon]}>
            <Package size={20} color={colors.primary[700]} strokeWidth={2} />
          </View>
          <Text style={styles.statNumber}>{lendingCount}</Text>
          <Text style={styles.statLabel}>Lending Out</Text>
        </View>
        <View style={styles.statCard}>
          <View style={[styles.statIcon, styles.borrowIcon]}>
            <Clock size={20} color={colors.secondary[700]} strokeWidth={2} />
          </View>
          <Text style={styles.statNumber}>{borrowingCount}</Text>
          <Text style={styles.statLabel}>Want to Borrow</Text>
        </View>
      </View>

      {loading ? (
        <View style={styles.centerContent}>
          <ActivityIndicator size="large" color={colors.primary[500]} />
        </View>
      ) : (
        <FlatList
          data={items}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.cardWrapper}>
              <ItemCard item={item} onPress={handlePress} />
              <Pressable
                style={({ pressed }) => [
                  styles.deleteButton,
                  pressed && styles.pressed,
                ]}
                onPress={() => handleDelete(item)}>
                <Trash2 size={16} color={colors.error[600]} strokeWidth={2} />
                <Text style={styles.deleteText}>Remove</Text>
              </Pressable>
            </View>
          )}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[colors.primary[500]]}
              tintColor={colors.primary[500]}
            />
          }
          ListEmptyComponent={
            <View style={styles.centerContent}>
              <Handshake size={48} color={colors.neutral[300]} strokeWidth={1.5} />
              <Text style={styles.emptyTitle}>No listings yet</Text>
              <Text style={styles.emptySubtitle}>
                Tap "List Item" to share something with your neighbors
              </Text>
              <Pressable
                style={styles.addButton}
                onPress={() => router.push('/(tabs)/add')}>
                <Text style={styles.addButtonText}>List an Item</Text>
              </Pressable>
            </View>
          }
        />
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
  statsRow: {
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.neutral[0],
    borderRadius: radius.lg,
    padding: spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.neutral[200],
    gap: 4,
  },
  statIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  lendIcon: {
    backgroundColor: colors.primary[100],
  },
  borrowIcon: {
    backgroundColor: colors.secondary[100],
  },
  statNumber: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    color: colors.neutral[900],
  },
  statLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: typography.small,
    color: colors.neutral[500],
  },
  list: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
  },
  cardWrapper: {
    marginBottom: spacing.md,
  position: 'relative',
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    position: 'absolute',
    bottom: spacing.md,
    right: spacing.md,
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: colors.error[50],
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.error[200],
  },
  deleteText: {
    fontFamily: 'Inter-Medium',
    fontSize: typography.small,
    color: colors.error[600],
  },
  centerContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xxl,
    gap: 8,
  },
  emptyTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: typography.body,
    color: colors.neutral[600],
    marginTop: 8,
  },
  emptySubtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: typography.caption,
    color: colors.neutral[400],
    textAlign: 'center',
  },
  addButton: {
    backgroundColor: colors.primary[600],
    borderRadius: radius.md,
    paddingHorizontal: 20,
    paddingVertical: 12,
    marginTop: 12,
  },
  addButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: typography.caption,
    color: colors.neutral[0],
  },
  pressed: {
    transform: [{ scale: 0.95 }],
  },
});

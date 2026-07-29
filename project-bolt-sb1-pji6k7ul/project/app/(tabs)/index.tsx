import { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  Pressable,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Search, SlidersHorizontal } from 'lucide-react-native';
import { supabase } from '@/lib/supabase';
import { Item, Category } from '@/lib/types';
import { colors, spacing, typography, radius } from '@/lib/theme';
import { CATEGORIES } from '@/lib/constants';
import { ItemCard } from '@/components/ItemCard';

export default function BrowseScreen() {
  const router = useRouter();
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeCategory, setActiveCategory] = useState<Category | 'All'>('All');
  const [filterType, setFilterType] = useState<'all' | 'lend' | 'borrow'>('all');

  const fetchItems = useCallback(async () => {
    const { data, error } = await supabase
      .from('items')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) {
      console.error(error);
    }
    if (data) {
      setItems(data as Item[]);
    }
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

  const filtered = items.filter((item) => {
    const catMatch =
      activeCategory === 'All' || item.category === activeCategory;
    const typeMatch =
      filterType === 'all' || item.listing_type === filterType;
    return catMatch && typeMatch;
  });

  const handlePress = (id: string) => {
    router.push(`/item/${id}`);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Lendly</Text>
        <Text style={styles.headerSubtitle}>
          Borrow, lend, and stay with your neighbors
        </Text>
      </View>

      <Pressable
        style={styles.searchBar}
        onPress={() => router.push('/(tabs)/search')}>
        <Search size={20} color={colors.neutral[400]} strokeWidth={2} />
        <Text style={styles.searchPlaceholder}>Search for an item...</Text>
      </Pressable>

      <View style={styles.filterRow}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryScroll}>
          <Pressable
            style={[
              styles.categoryChip,
              activeCategory === 'All' && styles.activeChip,
            ]}
            onPress={() => setActiveCategory('All')}>
            <Text
              style={[
                styles.chipText,
                activeCategory === 'All' && styles.activeChipText,
              ]}>
              All
            </Text>
          </Pressable>
          {CATEGORIES.map((cat) => (
            <Pressable
              key={cat.label}
              style={[
                styles.categoryChip,
                activeCategory === cat.label && styles.activeChip,
              ]}
              onPress={() => setActiveCategory(cat.label)}>
              <Text
                style={[
                  styles.chipText,
                  activeCategory === cat.label && styles.activeChipText,
                ]}>
                {cat.label}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      <View style={styles.typeFilterRow}>
        {(['all', 'lend', 'borrow'] as const).map((type) => (
          <Pressable
            key={type}
            style={[
              styles.typeChip,
              filterType === type && styles.activeTypeChip,
            ]}
            onPress={() => setFilterType(type)}>
            <Text
              style={[
                styles.typeChipText,
                filterType === type && styles.activeTypeChipText,
              ]}>
              {type === 'all' ? 'All Listings' : type === 'lend' ? 'Lending' : 'Borrowing'}
            </Text>
          </Pressable>
        ))}
      </View>

      {loading ? (
        <View style={styles.centerContent}>
          <ActivityIndicator size="large" color={colors.primary[500]} />
        </View>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <ItemCard item={item} onPress={handlePress} />
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
              <Text style={styles.emptyTitle}>No items found</Text>
              <Text style={styles.emptySubtitle}>
                Try a different category or filter
              </Text>
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
    fontSize: 32,
    color: colors.primary[700],
  },
  headerSubtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: typography.body,
    color: colors.neutral[500],
    marginTop: 2,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: spacing.lg,
    marginVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md - 2,
    backgroundColor: colors.neutral[0],
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.neutral[200],
    gap: 10,
  },
  searchPlaceholder: {
    fontFamily: 'Inter-Regular',
    fontSize: typography.body,
    color: colors.neutral[400],
  },
  filterRow: {
    paddingVertical: spacing.sm,
  },
  categoryScroll: {
    paddingHorizontal: spacing.lg,
    gap: 8,
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
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
  typeFilterRow: {
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.sm,
    gap: 8,
  },
  typeChip: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: radius.md,
    backgroundColor: colors.neutral[0],
    borderWidth: 1,
    borderColor: colors.neutral[200],
    alignItems: 'center',
  },
  activeTypeChip: {
    backgroundColor: colors.primary[50],
    borderColor: colors.primary[400],
  },
  typeChipText: {
    fontFamily: 'Inter-Medium',
    fontSize: typography.caption,
    color: colors.neutral[500],
  },
  activeTypeChipText: {
    color: colors.primary[700],
  },
  list: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
  },
  centerContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xxl,
  },
  emptyTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: typography.body,
    color: colors.neutral[600],
  },
  emptySubtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: typography.caption,
    color: colors.neutral[400],
    marginTop: 4,
  },
});

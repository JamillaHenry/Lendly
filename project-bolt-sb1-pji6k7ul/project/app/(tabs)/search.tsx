import { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  ActivityIndicator,
  SafeAreaView,
  Pressable,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Search, X } from 'lucide-react-native';
import { supabase } from '@/lib/supabase';
import { Item, Category } from '@/lib/types';
import { colors, spacing, typography, radius } from '@/lib/theme';
import { CATEGORIES } from '@/lib/constants';
import { ItemCard } from '@/components/ItemCard';

export default function SearchScreen() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<Category | 'All'>('All');
  const [filterType, setFilterType] = useState<'all' | 'lend' | 'borrow'>('all');

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

  const filtered = items.filter((item) => {
    const q = query.toLowerCase().trim();
    const queryMatch =
      !q ||
      item.title.toLowerCase().includes(q) ||
      item.description.toLowerCase().includes(q) ||
      item.lender_name.toLowerCase().includes(q);
    const catMatch =
      activeCategory === 'All' || item.category === activeCategory;
    const typeMatch =
      filterType === 'all' || item.listing_type === filterType;
    return queryMatch && catMatch && typeMatch;
  });

  const handlePress = (id: string) => {
    router.push(`/item/${id}`);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Search</Text>
        <Text style={styles.headerSubtitle}>
          Find exactly what you need
        </Text>
      </View>

      <View style={styles.searchRow}>
        <View style={styles.searchInputWrap}>
          <Search size={20} color={colors.neutral[400]} strokeWidth={2} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search items, descriptions, or people..."
            value={query}
            onChangeText={setQuery}
            placeholderTextColor={colors.neutral[400]}
          />
          {query.length > 0 && (
            <Pressable onPress={() => setQuery('')}>
              <X size={18} color={colors.neutral[400]} strokeWidth={2} />
            </Pressable>
          )}
        </View>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoryScroll}
        style={styles.categoryRow}>
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
            All Categories
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
              {type === 'all' ? 'All' : type === 'lend' ? 'Lending' : 'Borrowing'}
            </Text>
          </Pressable>
        ))}
      </View>

      <Text style={styles.resultCount}>
        {filtered.length} {filtered.length === 1 ? 'result' : 'results'}
      </Text>

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
          ListEmptyComponent={
            <View style={styles.centerContent}>
              <Text style={styles.emptyTitle}>No items found</Text>
              <Text style={styles.emptySubtitle}>
                Try different keywords or filters
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
    fontSize: 28,
    color: colors.neutral[900],
  },
  headerSubtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: typography.body,
    color: colors.neutral[500],
    marginTop: 2,
  },
  searchRow: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.sm,
  },
  searchInputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md - 2,
    backgroundColor: colors.neutral[0],
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.neutral[200],
    gap: 10,
  },
  searchInput: {
    flex: 1,
    fontFamily: 'Inter-Regular',
    fontSize: typography.body,
    color: colors.neutral[900],
    paddingVertical: 2,
  },
  categoryRow: {
    maxHeight: 50,
  },
  categoryScroll: {
    paddingHorizontal: spacing.lg,
    gap: 8,
    alignItems: 'center',
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
    paddingVertical: spacing.sm,
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
  resultCount: {
    fontFamily: 'Inter-Medium',
    fontSize: typography.caption,
    color: colors.neutral[500],
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.sm,
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

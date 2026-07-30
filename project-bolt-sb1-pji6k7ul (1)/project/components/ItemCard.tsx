import { Pressable, StyleSheet, Text, View, Image } from 'react-native';
import { Clock, Package } from 'lucide-react-native';
import { Item } from '@/lib/types';
import { colors, radius, spacing, typography } from '@/lib/theme';

interface ItemCardProps {
  item: Item;
  onPress: (id: string) => void;
}

export function ItemCard({ item, onPress }: ItemCardProps) {
  const isBorrow = item.listing_type === 'borrow';

  return (
    <Pressable
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
      onPress={() => onPress(item.id)}>
      <View style={styles.imageContainer}>
        <Image source={{ uri: item.image_url }} style={styles.image} />
        <View
          style={[
            styles.badge,
            isBorrow ? styles.borrowBadge : styles.lendBadge,
          ]}>
          <Text style={styles.badgeText}>
            {isBorrow ? 'Borrowing' : 'Lending'}
          </Text>
        </View>
      </View>
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={1}>
          {item.title}
        </Text>
        <Text style={styles.category}>{item.category}</Text>
        <Text style={styles.description} numberOfLines={2}>
          {item.description}
        </Text>
        <View style={styles.footer}>
          <Text style={styles.lender}>{item.lender_name}</Text>
          {isBorrow && item.borrow_duration_days ? (
            <View style={styles.duration}>
              <Clock size={13} color={colors.secondary[700]} strokeWidth={2} />
              <Text style={styles.durationText}>
                {item.borrow_duration_days}d
              </Text>
            </View>
          ) : (
            <View style={styles.duration}>
              <Package size={13} color={colors.primary[600]} strokeWidth={2} />
              <Text style={styles.lendText}>Available</Text>
            </View>
          )}
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.neutral[0],
    borderRadius: radius.lg,
    overflow: 'hidden',
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.neutral[200],
    shadowColor: colors.neutral[900],
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  pressed: {
    transform: [{ scale: 0.98 }],
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    height: 180,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  badge: {
    position: 'absolute',
    top: 10,
    right: 10,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: radius.pill,
  },
  lendBadge: {
    backgroundColor: colors.primary[500],
  },
  borrowBadge: {
    backgroundColor: colors.secondary[500],
  },
  badgeText: {
    color: colors.neutral[0],
    fontFamily: 'Inter-SemiBold',
    fontSize: 12,
  },
  content: {
    padding: spacing.md,
  gap: 4,
  },
  title: {
    fontFamily: 'Inter-SemiBold',
    fontSize: typography.body,
    color: colors.neutral[900],
  },
  category: {
    fontFamily: 'Inter-Medium',
    fontSize: typography.small,
    color: colors.primary[600],
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  description: {
    fontFamily: 'Inter-Regular',
    fontSize: typography.caption,
    color: colors.neutral[500],
    lineHeight: 20,
    marginTop: 2,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  lender: {
    fontFamily: 'Inter-Medium',
    fontSize: typography.caption,
    color: colors.neutral[600],
  },
  duration: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  durationText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: typography.small,
    color: colors.secondary[700],
  },
  lendText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: typography.small,
    color: colors.primary[600],
  },
});

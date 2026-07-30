import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import { colors, spacing, typography, radius } from '@/lib/theme';

const LINKS = [
  { label: 'Divine Egbe', href: '/portfolios/divine' },
  { label: 'Michael Onu', href: '/portfolios/michael' },
  { label: 'Jamila Henry', href: '/portfolios/jamila' },
];

export function PortfolioNav() {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <View style={styles.container}>
      <View style={styles.inner}>
        <Pressable onPress={() => router.push('/portfolios')}>
          <Text style={styles.logo}>Portfolios</Text>
        </Pressable>
        <View style={styles.links}>
          {LINKS.map((link) => {
            const active = pathname === link.href;
            return (
              <Pressable
                key={link.href}
                style={styles.link}
                onPress={() => router.push(link.href)}
              >
                <Text
                  style={[styles.linkText, active && styles.activeLinkText]}
                  numberOfLines={1}
                >
                  {link.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.neutral[0],
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral[200],
  },
  inner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md - 4,
  },
  logo: {
    fontFamily: 'Inter-SemiBold',
    fontSize: typography.body,
    color: colors.neutral[900],
  },
  links: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  link: {
    paddingVertical: 4,
    paddingHorizontal: 2,
  },
  linkText: {
    fontFamily: 'Inter-Medium',
    fontSize: typography.caption,
    color: colors.neutral[400],
  },
  activeLinkText: {
    color: colors.neutral[900],
  },
});

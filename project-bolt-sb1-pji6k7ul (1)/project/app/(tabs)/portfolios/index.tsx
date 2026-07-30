import { View, Text, StyleSheet, Pressable, SafeAreaView, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowRight } from 'lucide-react-native';
import { PortfolioNav } from '@/components/PortfolioNav';
import { colors, spacing, typography, radius } from '@/lib/theme';

type Portfolio = {
  name: string;
  tagline: string;
  description: string;
  href: string;
};

const PORTFOLIOS: Portfolio[] = [
  {
    name: 'Divine Egbe',
    tagline: 'Aspiring Full-Stack Web Developer',
    description:
      'Originally from Nigeria, living in New Jersey. Class of 2027. Passionate about technology and web development.',
    href: '/portfolios/divine',
  },
  {
    name: 'Michael Onu',
    tagline: 'Aspiring Developer',
    description:
      'Originally from Nigeria, senior in the Class of 2027. Passionate about technology and learning how to create things.',
    href: '/portfolios/michael',
  },
  {
    name: 'Jamila Henry',
    tagline: 'Creative & Developer',
    description:
      'Born and raised in Guyana, South America. Passionate about art, music, and using code to help people.',
    href: '/portfolios/jamila',
  },
];

export default function PortfoliosIndex() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <PortfolioNav />
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Student Portfolios</Text>
        <Text style={styles.subtitle}>
          A collection of portfolios from three aspiring developers and creators. Explore their projects, skills, and stories.
        </Text>
        <View style={styles.grid}>
          {PORTFOLIOS.map((p) => (
            <Pressable
              key={p.href}
              style={styles.card}
              onPress={() => router.push(p.href)}
            >
              <Text style={styles.cardName}>{p.name}</Text>
              <Text style={styles.cardTagline}>{p.tagline}</Text>
              <Text style={styles.cardDesc}>{p.description}</Text>
              <View style={styles.cardFooter}>
                <Text style={styles.cardLink}>View portfolio</Text>
                <ArrowRight size={16} color={colors.primary[600]} strokeWidth={2} />
              </View>
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.neutral[50],
  },
  content: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xl,
  },
  title: {
    fontFamily: 'Inter-Bold',
    fontSize: 30,
    color: colors.neutral[900],
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  subtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: typography.body,
    color: colors.neutral[500],
    textAlign: 'center',
    lineHeight: 24,
    maxWidth: 480,
    alignSelf: 'center',
    marginBottom: spacing.xl,
  },
  grid: {
    gap: spacing.md,
    maxWidth: 880,
    alignSelf: 'center',
    width: '100%',
  },
  card: {
    backgroundColor: colors.neutral[0],
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.neutral[200],
    padding: spacing.lg,
    gap: 6,
  },
  cardName: {
    fontFamily: 'Inter-Bold',
    fontSize: typography.title,
    color: colors.neutral[900],
  },
  cardTagline: {
    fontFamily: 'Inter-Regular',
    fontSize: typography.caption,
    color: colors.neutral[400],
    fontStyle: 'italic',
  },
  cardDesc: {
    fontFamily: 'Inter-Regular',
    fontSize: typography.body,
    color: colors.neutral[600],
    lineHeight: 24,
    marginTop: 4,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: spacing.sm,
  },
  cardLink: {
    fontFamily: 'Inter-SemiBold',
    fontSize: typography.caption,
    color: colors.primary[600],
  },
});

import { View, Text, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { Github } from 'lucide-react-native';
import { PortfolioNav } from '@/components/PortfolioNav';
import { colors, spacing, typography, radius } from '@/lib/theme';

export default function JamilaPortfolio() {
  return (
    <SafeAreaView style={styles.container}>
      <PortfolioNav />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.aboutSection}>
          <Text style={styles.aboutTitle}>A Little About Me</Text>
          <View style={styles.aboutGrid}>
            <View style={styles.photo} />
            <View style={styles.aboutText}>
              <Text style={styles.aboutPara}>
                My name is Jamila. I was born and raised in Guyana, a Caribbean country in South America. Some of my favorite things to do are to read, watch anything interesting on tv, listen to all types of music, explore new places, have self care days, and have fun with the people I care about. One of my passions is art. Art in all forms whether it is dance, ceramics, movies, etc. I love to see how people think and how it is transformed into something physical.
              </Text>
              <Text style={styles.aboutPara}>
                I plan on doing some form of nursing in the future and using code to help with that.
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.quoteCard}>
          <Text style={styles.quoteText}>
            This is my first app and I hope to improve drastically on my skills by the time I make another
          </Text>
        </View>

        <View style={styles.ctaRow}>
          <View style={styles.btnDark}>
            <Github size={16} color={colors.neutral[0]} strokeWidth={2} />
            <Text style={styles.btnDarkText}>Github</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Here is where you can find my old and new projects</Text>
        <View style={styles.projects}>
          <View style={styles.projectCard}>
            <View style={[styles.projectImage, { backgroundColor: colors.secondary[100] }]} />
            <View style={styles.projectInfo}>
              <Text style={styles.projectName}>Creative Arts Project</Text>
              <Text style={styles.projectDesc}>
                A project combining art and code — exploring how technology can be used to express creativity and connect people.
              </Text>
            </View>
          </View>
          <View style={styles.projectCard}>
            <View style={[styles.projectImage, { backgroundColor: colors.success[100] }]} />
            <View style={styles.projectInfo}>
              <Text style={styles.projectName}>Health & Tech App</Text>
              <Text style={styles.projectDesc}>
                An early-stage app concept exploring how coding can support nursing and healthcare, bridging her two passions.
              </Text>
            </View>
          </View>
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
    maxWidth: 880,
    alignSelf: 'center',
    width: '100%',
  },
  aboutSection: {
    backgroundColor: colors.secondary[50],
    borderWidth: 1,
    borderColor: colors.secondary[100],
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginBottom: spacing.lg,
  },
  aboutTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: typography.body,
    color: colors.neutral[900],
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  aboutGrid: {
    flexDirection: 'row',
    gap: spacing.lg,
    alignItems: 'flex-start',
  },
  photo: {
    width: 160,
    height: 160,
    borderRadius: radius.sm,
    backgroundColor: colors.secondary[200],
    flexShrink: 0,
  },
  aboutText: {
    flex: 1,
    gap: 10,
  },
  aboutPara: {
    fontFamily: 'Inter-Regular',
    fontSize: typography.caption,
    color: colors.neutral[700],
    lineHeight: 22,
  },
  quoteCard: {
    backgroundColor: colors.neutral[100],
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  quoteText: {
    fontFamily: 'Inter-Regular',
    fontSize: typography.body,
    color: colors.neutral[800],
    lineHeight: 26,
  },
  ctaRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: spacing.xl,
  },
  btnDark: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.neutral[900],
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: radius.sm,
  },
  btnDarkText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: typography.caption,
    color: colors.neutral[0],
  },
  sectionTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: typography.caption,
    color: colors.neutral[400],
    letterSpacing: 1.4,
    textTransform: 'uppercase',
    marginBottom: spacing.md,
    paddingBottom: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral[200],
  },
  projects: {
    gap: spacing.md,
  },
  projectCard: {
    backgroundColor: colors.neutral[0],
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.neutral[200],
    overflow: 'hidden',
  },
  projectImage: {
    width: '100%',
    height: 160,
    backgroundColor: colors.primary[100],
  },
  projectInfo: {
    padding: spacing.md,
    gap: 6,
  },
  projectName: {
    fontFamily: 'Inter-Bold',
    fontSize: typography.body,
    color: colors.neutral[900],
  },
  projectDesc: {
    fontFamily: 'Inter-Regular',
    fontSize: typography.caption,
    color: colors.neutral[500],
    lineHeight: 20,
  },
});

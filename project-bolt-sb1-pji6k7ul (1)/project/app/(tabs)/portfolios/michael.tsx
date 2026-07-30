import { View, Text, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { Github } from 'lucide-react-native';
import { PortfolioNav } from '@/components/PortfolioNav';
import { colors, spacing, typography, radius } from '@/lib/theme';

export default function MichaelPortfolio() {
  return (
    <SafeAreaView style={styles.container}>
      <PortfolioNav />
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.heading}>Hello My name{'\n'}is Michael Onu</Text>

        <View style={styles.body}>
          <Text style={styles.bio}>
            I am originally from Nigeria and currently live in New Jersey. I am entering a senior in the Class of 2027. I have a passion for technology and learning how to create things. I am actively seeking internships, jobs, or programs that will help me develop my skills and gain real world experience.
          </Text>
          <Text style={styles.bio}>
            Outside of school, I enjoy playing games, watching fiction movies and shows, and staying active through soccer and any sports I find interesting.
          </Text>

          <View style={styles.ctaRow}>
            <View style={styles.btnDark}>
              <Github size={16} color={colors.neutral[0]} strokeWidth={2} />
              <Text style={styles.btnDarkText}>Github</Text>
            </View>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Activities</Text>
        <View style={styles.list}>
          <Text style={styles.listItem}>— Volunteer at a non-profit organization Upchieve</Text>
          <Text style={styles.listItem}>— Joined robotics club</Text>
        </View>

        <Text style={styles.sectionTitle}>Projects</Text>
        <View style={styles.projects}>
          <View style={styles.projectCard}>
            <View style={[styles.projectImage, { backgroundColor: colors.accent[100] }]} />
            <View style={styles.projectInfo}>
              <Text style={styles.projectName}>Technology Project</Text>
              <Text style={styles.projectDesc}>
                A project exploring technology concepts and practical programming to solve real-world problems.
              </Text>
            </View>
          </View>
          <View style={styles.projectCard}>
            <View style={[styles.projectImage, { backgroundColor: colors.secondary[100] }]} />
            <View style={styles.projectInfo}>
              <Text style={styles.projectName}>Robotics Club Build</Text>
              <Text style={styles.projectDesc}>
                A robotics project built with the school club, applying engineering and programming skills in a team setting.
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
  heading: {
    fontFamily: 'Inter-Bold',
    fontSize: 34,
    color: colors.neutral[900],
    lineHeight: 42,
    marginBottom: spacing.lg,
  },
  body: {
    gap: 12,
    marginBottom: spacing.lg,
  },
  bio: {
    fontFamily: 'Inter-Regular',
    fontSize: typography.body,
    color: colors.neutral[700],
    lineHeight: 26,
  },
  ctaRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: spacing.sm,
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
  list: {
    gap: 10,
    marginBottom: spacing.xl,
  },
  listItem: {
    fontFamily: 'Inter-Regular',
    fontSize: typography.body,
    color: colors.neutral[700],
    lineHeight: 24,
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

import React from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Animated,
  Platform,
  Linking,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import {
  TrendingUp,
  Sparkles,
  Clock,
  ArrowRight,
  Music4,
  Camera,
  Youtube,
  Newspaper,
  Share2,
  Headphones,
  Hash,
} from 'lucide-react-native';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { TRENDING_TOPICS } from '@/constants/mockData';
import { TrendingTopic } from '@/types';

const categoryColors: Record<TrendingTopic['category'], readonly [string, string]> = {
  tiktok: ['#FF0050', '#00F2EA'],
  instagram: ['#F58529', '#DD2A7B'],
  youtube: ['#FF0000', '#CC0000'],
  news: ['#3B82F6', '#1D4ED8'],
  x: ['#0F172A', '#38BDF8'],
  spotify: ['#15803D', '#22C55E'],
  instagramHashtags: ['#F59E0B', '#E11D48'],
  tiktokHashtags: ['#8B5CF6', '#0EA5E9'],
};

type IconComponent = (props: { color?: string; size?: number }) => JSX.Element;

const categoryIconMap: Record<TrendingTopic['category'], IconComponent> = {
  tiktok: Music4,
  instagram: Camera,
  youtube: Youtube,
  news: Newspaper,
  x: Share2,
  spotify: Headphones,
  instagramHashtags: Sparkles,
  tiktokHashtags: Hash,
};

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const scaleAnim = React.useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 3,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  const navigateToGenerate = () => {
    router.push('/generate');
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#0F172A', '#1E293B', '#0F172A']}
        style={styles.gradient}
      >
        <View style={[styles.safeArea, { paddingTop: insets.top }]}>
          <ScrollView 
            style={styles.scrollView}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.header}>
              <View style={styles.headerTop}>
                <Text style={styles.headerTitle}>Tendências</Text>
                <View style={styles.liveIndicator}>
                  <View style={styles.liveDot} />
                  <Text style={styles.liveText}>AO VIVO</Text>
                </View>
              </View>
              <Text style={styles.headerSubtitle}>
                O que está bombando agora nas redes sociais
              </Text>
            </View>

            <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
              <TouchableOpacity
                activeOpacity={1}
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                onPress={navigateToGenerate}
              >
                <LinearGradient
                  colors={['#A855F7', '#EC4899']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.ctaButton}
                >
                  <View style={styles.ctaContent}>
                    <View style={styles.ctaLeft}>
                      <Sparkles size={24} color="#FFF" />
                      <View style={styles.ctaTexts}>
                        <Text style={styles.ctaTitle}>Criar Ideias de Conteúdo</Text>
                        <Text style={styles.ctaSubtitle}>
                          IA personalizada para o seu nicho
                        </Text>
                      </View>
                    </View>
                    <ArrowRight size={24} color="#FFF" />
                  </View>
                </LinearGradient>
              </TouchableOpacity>
            </Animated.View>

            <View style={styles.trendingSection}>
              <View style={styles.sectionHeader}>
                <TrendingUp size={20} color="#A855F7" />
                <Text style={styles.sectionTitle}>Em Alta Agora</Text>
              </View>

              {TRENDING_TOPICS.map((topic) => (
                <TrendingCard key={topic.id} topic={topic} />
              ))}
            </View>

            <View style={styles.bottomSpacer} />
          </ScrollView>
        </View>
      </LinearGradient>
    </View>
  );
}

function TrendingCard({ topic }: { topic: TrendingTopic }) {
  const colors = categoryColors[topic.category] ?? (['#334155', '#1E293B'] as const);
  const CategoryIcon = categoryIconMap[topic.category];

  const handleOpenLink = React.useCallback(async () => {
    console.log('[Trending] Opening source', topic.domain);
    try {
      await Linking.openURL(topic.link);
    } catch (error) {
      console.error('[Trending] Failed to open link', error);
    }
  }, [topic.domain, topic.link]);

  return (
    <View style={styles.card} testID={`trending-card-${topic.id}`}>
      <View style={styles.cardHeader}>
        <LinearGradient
          colors={colors}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.cardBadge}
        >
          <CategoryIcon size={20} color="#FFFFFF" />
        </LinearGradient>
        <View style={styles.cardHeaderInfo}>
          <Text style={styles.cardSourceLabel}>{topic.source}</Text>
          <Text style={styles.cardDomain}>{topic.domain}</Text>
        </View>
      </View>

      <View style={styles.previewWrapper}>
        <Image
          source={{ uri: topic.previewImage }}
          style={styles.previewImage}
          contentFit="cover"
          transition={120}
        />
        <LinearGradient
          colors={['rgba(15,23,42,0)', 'rgba(15,23,42,0.9)']}
          start={{ x: 0, y: 0.3 }}
          end={{ x: 0, y: 1 }}
          style={styles.previewOverlay}
        >
          <View style={styles.previewMeta}>
            <View style={styles.previewRow}>
              <TrendingUp size={14} color="#F8FAFC" />
              <Text style={styles.previewMetaText}>{topic.engagement}</Text>
            </View>
            <View style={styles.previewRow}>
              <Clock size={14} color="#E2E8F0" />
              <Text style={styles.previewMetaText}>{topic.timeAgo}</Text>
            </View>
          </View>
        </LinearGradient>
      </View>

      <View style={styles.cardContent}>
        <Text style={styles.cardTitle}>{topic.title}</Text>
        <Text style={styles.cardDescription}>{topic.description}</Text>

        <View style={styles.cardChips}>
          {topic.highlights.map((highlight, index) => (
            <View key={`${topic.id}-${index}`} style={styles.chip}>
              <Text style={styles.chipText}>{highlight}</Text>
            </View>
          ))}
        </View>

        <TouchableOpacity
          style={styles.cardAction}
          activeOpacity={0.85}
          onPress={handleOpenLink}
          testID={`trending-card-action-${topic.id}`}
        >
          <Text style={styles.cardActionText}>Ver tendência</Text>
          <ArrowRight size={18} color="#0EA5E9" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  gradient: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 24,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: '#FFF',
  },
  liveIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E293B',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 6,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#EF4444',
  },
  liveText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#EF4444',
  },
  headerSubtitle: {
    fontSize: 15,
    color: '#94A3B8',
    lineHeight: 22,
  },
  ctaButton: {
    marginHorizontal: 20,
    marginBottom: 32,
    borderRadius: 16,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#A855F7',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 16,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  ctaContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
  },
  ctaLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    flex: 1,
  },
  ctaTexts: {
    flex: 1,
    gap: 4,
  },
  ctaTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#FFF',
  },
  ctaSubtitle: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  trendingSection: {
    paddingHorizontal: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFF',
  },
  card: {
    backgroundColor: '#111C2E',
    borderRadius: 24,
    marginBottom: 28,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.18)',
    ...Platform.select({
      ios: {
        shadowColor: '#0EA5E9',
        shadowOffset: { width: 0, height: 16 },
        shadowOpacity: 0.16,
        shadowRadius: 24,
      },
      android: {
        elevation: 6,
      },
      default: {},
    }),
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  cardBadge: {
    width: 48,
    height: 48,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardHeaderInfo: {
    flex: 1,
    gap: 4,
  },
  cardSourceLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#E2E8F0',
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
  cardDomain: {
    fontSize: 12,
    color: 'rgba(148, 163, 184, 0.9)',
  },
  previewWrapper: {
    marginTop: 16,
    marginHorizontal: 20,
    borderRadius: 18,
    overflow: 'hidden',
    backgroundColor: '#0F172A',
    height: 160,
  },
  previewImage: {
    width: '100%',
    height: '100%',
  },
  previewOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    padding: 16,
  },
  previewMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  previewRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(15, 23, 42, 0.55)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
  },
  previewMetaText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#F8FAFC',
  },
  cardContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 22,
    gap: 14,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    lineHeight: 26,
  },
  cardDescription: {
    fontSize: 14,
    color: 'rgba(226, 232, 240, 0.9)',
    lineHeight: 22,
  },
  cardChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: 'rgba(148, 163, 184, 0.15)',
  },
  chipText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#94A3B8',
  },
  cardAction: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(14, 165, 233, 0.12)',
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 999,
  },
  cardActionText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#38BDF8',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  bottomSpacer: {
    height: 20,
  },
});

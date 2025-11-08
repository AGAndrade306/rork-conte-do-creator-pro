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
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { TrendingUp, Sparkles, Clock, ArrowRight } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { TRENDING_TOPICS } from '@/constants/mockData';
import { TrendingTopic } from '@/types';

const categoryColors: Record<string, readonly [string, string]> = {
  tiktok: ['#FF0050', '#00F2EA'],
  instagram: ['#F58529', '#DD2A7B'],
  youtube: ['#FF0000', '#CC0000'],
  news: ['#3B82F6', '#1D4ED8'],
};

const categoryIcons = {
  tiktok: '🎵',
  instagram: '📸',
  youtube: '▶️',
  news: '📰',
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
  const colors = categoryColors[topic.category];
  
  return (
    <View style={styles.card}>
      <LinearGradient
        colors={colors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.cardBadge}
      >
        <Text style={styles.cardBadgeIcon}>{categoryIcons[topic.category]}</Text>
      </LinearGradient>

      <View style={styles.cardContent}>
        <Text style={styles.cardTitle}>{topic.title}</Text>
        
        <View style={styles.cardMeta}>
          <View style={styles.cardMetaItem}>
            <TrendingUp size={14} color="#A855F7" />
            <Text style={styles.cardMetaText}>{topic.engagement}</Text>
          </View>
          <View style={styles.cardMetaItem}>
            <Clock size={14} color="#64748B" />
            <Text style={styles.cardMetaText}>{topic.timeAgo}</Text>
          </View>
        </View>

        <View style={styles.cardSource}>
          <Text style={styles.cardSourceText}>Fonte: {topic.source}</Text>
        </View>
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
    backgroundColor: '#1E293B',
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#334155',
  },
  cardBadge: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  cardBadgeIcon: {
    fontSize: 20,
  },
  cardContent: {
    padding: 16,
    gap: 12,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFF',
    lineHeight: 24,
  },
  cardMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  cardMetaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  cardMetaText: {
    fontSize: 13,
    color: '#94A3B8',
    fontWeight: '500',
  },
  cardSource: {
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#334155',
  },
  cardSourceText: {
    fontSize: 12,
    color: '#64748B',
  },
  bottomSpacer: {
    height: 20,
  },
});

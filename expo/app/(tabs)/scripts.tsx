import React from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';

import { LinearGradient } from 'expo-linear-gradient';
import {
  BookOpen,
  TrendingUp,
  Trash2,
  Edit3,
  Target,
  Zap,
} from 'lucide-react-native';
import { useContent } from '@/context/ContentContext';
import { ContentIdea } from '@/types';

export default function ScriptsScreen() {
  const insets = useSafeAreaInsets();
  const { savedScripts, isLoading, deleteScript } = useContent();

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#A855F7" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#0F172A', '#1E293B']} style={styles.gradient}>
        <View style={[styles.safeArea, { paddingTop: insets.top }]}>
          <ScrollView
            style={styles.scrollView}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.header}>
              <View style={styles.headerIcon}>
                <BookOpen size={28} color="#A855F7" />
              </View>
              <Text style={styles.headerTitle}>Meus Roteiros</Text>
              <Text style={styles.headerSubtitle}>
                {savedScripts.length} roteiro{savedScripts.length !== 1 ? 's' : ''} salvo{savedScripts.length !== 1 ? 's' : ''}
              </Text>
            </View>

            {savedScripts.length === 0 ? (
              <View style={styles.emptyState}>
                <View style={styles.emptyIcon}>
                  <BookOpen size={48} color="#475569" />
                </View>
                <Text style={styles.emptyTitle}>Nenhum roteiro salvo</Text>
                <Text style={styles.emptySubtitle}>
                  Vá para &quot;Criar Ideias&quot; e comece a gerar conteúdo incrível!
                </Text>
              </View>
            ) : (
              <View style={styles.scripts}>
                {savedScripts.map((script) => (
                  <ScriptCard
                    key={script.id}
                    script={script}
                    onDelete={deleteScript}
                  />
                ))}
              </View>
            )}

            <View style={styles.bottomSpacer} />
          </ScrollView>
        </View>
      </LinearGradient>
    </View>
  );
}

function ScriptCard({
  script,
  onDelete,
}: {
  script: ContentIdea;
  onDelete: (id: string) => void;
}) {
  const [expanded, setExpanded] = React.useState(false);

  const getScoreColor = (score: number) => {
    if (score >= 80) return '#10B981';
    if (score >= 60) return '#F59E0B';
    return '#EF4444';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return 'Alto';
    if (score >= 60) return 'Médio';
    return 'Baixo';
  };

  return (
    <View style={styles.card}>
      <TouchableOpacity
        onPress={() => setExpanded(!expanded)}
        activeOpacity={0.9}
      >
        <View style={styles.cardHeader}>
          <View style={styles.cardHeaderLeft}>
            <View style={styles.cardIcon}>
              <Zap size={20} color="#A855F7" />
            </View>
            <View style={styles.cardHeaderTexts}>
              <Text style={styles.cardTitle} numberOfLines={2}>
                {script.title}
              </Text>
              {script.niche && (
                <View style={styles.cardNiche}>
                  <Target size={12} color="#64748B" />
                  <Text style={styles.cardNicheText}>{script.niche}</Text>
                </View>
              )}
            </View>
          </View>
        </View>

        {script.viralScore !== undefined && (
          <View style={styles.viralScore}>
            <LinearGradient
              colors={['rgba(168, 85, 247, 0.1)', 'rgba(236, 72, 153, 0.1)']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.viralScoreGradient}
            >
              <View style={styles.viralScoreContent}>
                <TrendingUp size={16} color={getScoreColor(script.viralScore)} />
                <Text style={styles.viralScoreLabel}>Potencial Viral</Text>
                <View
                  style={[
                    styles.viralScoreBadge,
                    { backgroundColor: getScoreColor(script.viralScore) },
                  ]}
                >
                  <Text style={styles.viralScoreValue}>
                    {script.viralScore}% - {getScoreLabel(script.viralScore)}
                  </Text>
                </View>
              </View>
            </LinearGradient>
          </View>
        )}
      </TouchableOpacity>

      {expanded && (
        <View style={styles.cardExpanded}>
          <View style={styles.divider} />

          <View style={styles.section}>
            <Text style={styles.sectionLabel}>🎣 Hook</Text>
            <Text style={styles.sectionText}>{script.hook}</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionLabel}>📝 Roteiro</Text>
            <Text style={styles.sectionText}>{script.script}</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionLabel}>📣 CTA</Text>
            <Text style={styles.sectionText}>{script.cta}</Text>
          </View>

          {script.viralAnalysis && (
            <>
              <View style={styles.divider} />
              <View style={styles.analysisSection}>
                <Text style={styles.analysisSectionTitle}>
                  💡 Análise de Potencial Viral
                </Text>

                <View style={styles.analysisMetrics}>
                  <View style={styles.metric}>
                    <Text style={styles.metricLabel}>Força do Hook</Text>
                    <View style={styles.metricBar}>
                      <View
                        style={[
                          styles.metricBarFill,
                          {
                            width: `${script.viralAnalysis.hookStrength}%`,
                            backgroundColor: getScoreColor(
                              script.viralAnalysis.hookStrength
                            ),
                          },
                        ]}
                      />
                    </View>
                    <Text style={styles.metricValue}>
                      {script.viralAnalysis.hookStrength}%
                    </Text>
                  </View>

                  <View style={styles.metric}>
                    <Text style={styles.metricLabel}>Impacto Emocional</Text>
                    <View style={styles.metricBar}>
                      <View
                        style={[
                          styles.metricBarFill,
                          {
                            width: `${script.viralAnalysis.emotionalImpact}%`,
                            backgroundColor: getScoreColor(
                              script.viralAnalysis.emotionalImpact
                            ),
                          },
                        ]}
                      />
                    </View>
                    <Text style={styles.metricValue}>
                      {script.viralAnalysis.emotionalImpact}%
                    </Text>
                  </View>

                  <View style={styles.metric}>
                    <Text style={styles.metricLabel}>Similaridade com Virais</Text>
                    <View style={styles.metricBar}>
                      <View
                        style={[
                          styles.metricBarFill,
                          {
                            width: `${script.viralAnalysis.formatSimilarity}%`,
                            backgroundColor: getScoreColor(
                              script.viralAnalysis.formatSimilarity
                            ),
                          },
                        ]}
                      />
                    </View>
                    <Text style={styles.metricValue}>
                      {script.viralAnalysis.formatSimilarity}%
                    </Text>
                  </View>
                </View>

                <View style={styles.suggestions}>
                  <Text style={styles.suggestionsTitle}>✨ Sugestões</Text>
                  {script.viralAnalysis.suggestions.hook && (
                    <Text style={styles.suggestionText}>
                      • {script.viralAnalysis.suggestions.hook}
                    </Text>
                  )}
                  {script.viralAnalysis.suggestions.visual && (
                    <Text style={styles.suggestionText}>
                      • {script.viralAnalysis.suggestions.visual}
                    </Text>
                  )}
                  {script.viralAnalysis.suggestions.cta && (
                    <Text style={styles.suggestionText}>
                      • {script.viralAnalysis.suggestions.cta}
                    </Text>
                  )}
                </View>
              </View>
            </>
          )}

          <View style={styles.divider} />

          <View style={styles.actions}>
            <TouchableOpacity style={styles.actionButton}>
              <Edit3 size={18} color="#64748B" />
              <Text style={styles.actionButtonText}>Editar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionButton, styles.deleteButton]}
              onPress={() => onDelete(script.id)}
            >
              <Trash2 size={18} color="#EF4444" />
              <Text style={[styles.actionButtonText, styles.deleteButtonText]}>
                Excluir
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#0F172A',
    alignItems: 'center',
    justifyContent: 'center',
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
    alignItems: 'center',
    gap: 12,
  },
  headerIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(168, 85, 247, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFF',
  },
  headerSubtitle: {
    fontSize: 15,
    color: '#94A3B8',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
    paddingTop: 80,
    gap: 16,
  },
  emptyIcon: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: '#1E293B',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFF',
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 15,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 22,
  },
  scripts: {
    paddingHorizontal: 20,
    gap: 16,
  },
  card: {
    backgroundColor: '#1E293B',
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#334155',
  },
  cardHeader: {
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  cardIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(168, 85, 247, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardHeaderTexts: {
    flex: 1,
    gap: 4,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFF',
  },
  cardNiche: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  cardNicheText: {
    fontSize: 13,
    color: '#64748B',
  },
  viralScore: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  viralScoreGradient: {
    borderRadius: 12,
    padding: 12,
  },
  viralScoreContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  viralScoreLabel: {
    fontSize: 13,
    color: '#94A3B8',
    flex: 1,
  },
  viralScoreBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  viralScoreValue: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFF',
  },
  cardExpanded: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  divider: {
    height: 1,
    backgroundColor: '#334155',
    marginVertical: 16,
  },
  section: {
    gap: 8,
    marginBottom: 16,
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#A855F7',
  },
  sectionText: {
    fontSize: 14,
    color: '#CBD5E1',
    lineHeight: 20,
  },
  analysisSection: {
    gap: 16,
  },
  analysisSectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFF',
  },
  analysisMetrics: {
    gap: 16,
  },
  metric: {
    gap: 6,
  },
  metricLabel: {
    fontSize: 13,
    color: '#94A3B8',
    fontWeight: '500',
  },
  metricBar: {
    height: 6,
    backgroundColor: '#334155',
    borderRadius: 3,
    overflow: 'hidden',
  },
  metricBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  metricValue: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '600',
  },
  suggestions: {
    backgroundColor: 'rgba(168, 85, 247, 0.05)',
    padding: 12,
    borderRadius: 12,
    gap: 8,
  },
  suggestionsTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#A855F7',
  },
  suggestionText: {
    fontSize: 13,
    color: '#CBD5E1',
    lineHeight: 18,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#334155',
    paddingVertical: 12,
    borderRadius: 10,
    gap: 8,
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#94A3B8',
  },
  deleteButton: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
  },
  deleteButtonText: {
    color: '#EF4444',
  },
  bottomSpacer: {
    height: 40,
  },
});

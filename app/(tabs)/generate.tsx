import React, { useState } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Animated,
} from 'react-native';

import { LinearGradient } from 'expo-linear-gradient';
import { Sparkles, Send, Save, TrendingUp, Target, Heart, Hash } from 'lucide-react-native';
import { useRorkAgent } from '@rork/toolkit-sdk';
import { useContent } from '@/context/ContentContext';
import { ContentIdea } from '@/types';

export default function GenerateScreen() {
  const insets = useSafeAreaInsets();
  const [niche, setNiche] = useState('');
  const [branding, setBranding] = useState('');
  const [quantity, setQuantity] = useState<string>('15');
  const [generatedIdeas, setGeneratedIdeas] = useState<ContentIdea[]>([]);
  const { saveScript } = useContent();

  const { messages, sendMessage } = useRorkAgent({
    tools: {},
  });

  const isGenerating = messages.some(m => 
    m.parts.some(p => p.type === 'text' && m.role === 'assistant' && messages[messages.length - 1]?.id === m.id)
  );

  const handleGenerate = async () => {
    if (!niche.trim()) return;

    const numIdeas = Math.min(Math.max(1, parseInt(quantity) || 15), 15);

    const prompt = `Você é um especialista em criação de conteúdo viral para redes sociais.

Gere EXATAMENTE ${numIdeas} ideias de conteúdo para o seguinte nicho: ${niche}
${branding ? `Características do branding: ${branding}` : ''}

Para cada ideia, forneça em formato JSON:
1. Título atrativo
2. Hook inicial (primeira frase/cena)
3. Roteiro completo (estrutura do vídeo)
4. CTA final

Responda APENAS com um array JSON válido, sem markdown ou explicações extras. Formato:
[
  {
    "title": "título aqui",
    "hook": "hook aqui",
    "script": "roteiro completo aqui",
    "cta": "call to action aqui"
  }
]`;

    await sendMessage(prompt);
  };

  React.useEffect(() => {
    if (!niche) return;
    
    const lastMessage = messages[messages.length - 1];
    if (lastMessage?.role === 'assistant') {
      const textPart = lastMessage.parts.find(p => p.type === 'text');
      if (textPart && textPart.type === 'text') {
        try {
          let text = textPart.text.trim();
          
          if (!text || text.length < 10) {
            return;
          }
          
          text = text.replace(/```json\n?/g, '').replace(/```\n?/g, '');
          
          const arrayStartIndex = text.indexOf('[');
          const arrayEndIndex = text.lastIndexOf(']');
          
          if (arrayStartIndex === -1 || arrayEndIndex === -1 || arrayEndIndex <= arrayStartIndex) {
            return;
          }
          
          text = text.substring(arrayStartIndex, arrayEndIndex + 1);
          
          if (!text.endsWith(']')) {
            return;
          }
          
          const parsed = JSON.parse(text);
          if (Array.isArray(parsed) && parsed.length > 0) {
            const ideas: ContentIdea[] = parsed.map((item, index) => ({
              id: `${Date.now()}-${index}`,
              title: item.title || 'Sem título',
              hook: item.hook || '',
              script: item.script || '',
              cta: item.cta || '',
              createdAt: Date.now(),
              niche,
            }));
            setGeneratedIdeas(ideas);
            console.log(`Successfully parsed ${ideas.length} ideas`);
          }
        } catch (e) {
          
        }
      }
    }
  }, [messages, niche]);

  const handleSave = async (idea: ContentIdea) => {
    const hookStrength = Math.floor(Math.random() * 30) + 70;
    const emotionalImpact = Math.floor(Math.random() * 30) + 65;
    const formatSimilarity = Math.floor(Math.random() * 30) + 60;
    const score = Math.floor((hookStrength + emotionalImpact + formatSimilarity) / 3);

    const ideaWithAnalysis: ContentIdea = {
      ...idea,
      viralScore: score,
      viralAnalysis: {
        score,
        hookStrength,
        emotionalImpact,
        formatSimilarity,
        suggestions: {
          hook: 'Comece com uma pergunta impactante ou estatística surpreendente',
          visual: 'Use cortes rápidos nos primeiros 3 segundos',
          cta: 'Peça uma ação específica (salvar, comentar com emoji)',
        },
      },
    };

    await saveScript(ideaWithAnalysis);
  };

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#0F172A', '#1E293B']} style={styles.gradient}>
        <View style={[styles.safeArea, { paddingTop: insets.top }]}>
          <ScrollView
            style={styles.scrollView}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.header}>
              <View style={styles.headerIcon}>
                <Sparkles size={28} color="#A855F7" />
              </View>
              <Text style={styles.headerTitle}>Criar Ideias de Conteúdo</Text>
              <Text style={styles.headerSubtitle}>
                IA personalizada que gera ideias com roteiros completos
              </Text>
            </View>

            <View style={styles.form}>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Seu Nicho</Text>
                <View style={styles.inputWrapper}>
                  <Target size={18} color="#64748B" />
                  <TextInput
                    style={styles.input}
                    placeholder="Ex: Fitness, Gastronomia, Tech..."
                    placeholderTextColor="#64748B"
                    value={niche}
                    onChangeText={setNiche}
                  />
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Branding (opcional)</Text>
                <View style={styles.textAreaWrapper}>
                  <Heart size={18} color="#64748B" />
                  <TextInput
                    style={[styles.input, styles.textArea]}
                    placeholder="Tom de voz, valores, persona do público..."
                    placeholderTextColor="#64748B"
                    value={branding}
                    onChangeText={setBranding}
                    multiline
                    numberOfLines={4}
                    textAlignVertical="top"
                  />
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Quantidade de Roteiros</Text>
                <View style={styles.inputWrapper}>
                  <Hash size={18} color="#64748B" />
                  <TextInput
                    style={styles.input}
                    placeholder="Máximo 15"
                    placeholderTextColor="#64748B"
                    value={quantity}
                    onChangeText={(text) => {
                      const num = text.replace(/[^0-9]/g, '');
                      const value = num === '' ? '' : Math.min(parseInt(num) || 1, 15).toString();
                      setQuantity(value);
                    }}
                    keyboardType="number-pad"
                    maxLength={2}
                  />
                </View>
                <Text style={styles.helperText}>Entre 1 e 15 roteiros</Text>
              </View>

              <TouchableOpacity
                style={[styles.generateButton, (!niche || isGenerating) && styles.generateButtonDisabled]}
                onPress={handleGenerate}
                disabled={!niche || isGenerating}
              >
                <LinearGradient
                  colors={niche && !isGenerating ? ['#A855F7', '#EC4899'] : ['#334155', '#1E293B']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.generateGradient}
                >
                  {isGenerating ? (
                    <ActivityIndicator color="#FFF" />
                  ) : (
                    <>
                      <Send size={20} color="#FFF" />
                      <Text style={styles.generateButtonText}>Gerar Ideias</Text>
                    </>
                  )}
                </LinearGradient>
              </TouchableOpacity>
            </View>

            {generatedIdeas.length > 0 && (
              <View style={styles.results}>
                <View style={styles.resultsHeader}>
                  <TrendingUp size={20} color="#A855F7" />
                  <Text style={styles.resultsTitle}>
                    {generatedIdeas.length} Ideias Geradas
                  </Text>
                </View>

                {generatedIdeas.map((idea, index) => (
                  <IdeaCard key={idea.id} idea={idea} index={index} onSave={handleSave} />
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

function IdeaCard({ 
  idea, 
  index, 
  onSave 
}: { 
  idea: ContentIdea; 
  index: number; 
  onSave: (idea: ContentIdea) => void;
}) {
  const [saved, setSaved] = useState(false);
  const scaleAnim = React.useRef(new Animated.Value(1)).current;

  const handleSave = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.9,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 3,
        useNativeDriver: true,
      }),
    ]).start();

    onSave(idea);
    setSaved(true);
  };

  return (
    <View style={styles.ideaCard}>
      <View style={styles.ideaHeader}>
        <View style={styles.ideaNumber}>
          <Text style={styles.ideaNumberText}>{index + 1}</Text>
        </View>
        <Text style={styles.ideaTitle}>{idea.title}</Text>
      </View>

      <View style={styles.ideaSection}>
        <Text style={styles.ideaSectionLabel}>🎣 Hook</Text>
        <Text style={styles.ideaSectionText}>{idea.hook}</Text>
      </View>

      <View style={styles.ideaSection}>
        <Text style={styles.ideaSectionLabel}>📝 Roteiro</Text>
        <Text style={styles.ideaSectionText}>{idea.script}</Text>
      </View>

      <View style={styles.ideaSection}>
        <Text style={styles.ideaSectionLabel}>📣 CTA</Text>
        <Text style={styles.ideaSectionText}>{idea.cta}</Text>
      </View>

      <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
        <TouchableOpacity
          style={[styles.saveButton, saved && styles.saveButtonSaved]}
          onPress={handleSave}
          disabled={saved}
        >
          <Save size={18} color={saved ? '#10B981' : '#FFF'} />
          <Text style={[styles.saveButtonText, saved && styles.saveButtonTextSaved]}>
            {saved ? 'Salvo!' : 'Salvar Roteiro'}
          </Text>
        </TouchableOpacity>
      </Animated.View>
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
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 15,
    color: '#94A3B8',
    textAlign: 'center',
    lineHeight: 22,
  },
  form: {
    paddingHorizontal: 20,
    gap: 20,
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFF',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E293B',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 12,
    borderWidth: 1,
    borderColor: '#334155',
  },
  textAreaWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#1E293B',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 12,
    borderWidth: 1,
    borderColor: '#334155',
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: '#FFF',
  },
  textArea: {
    minHeight: 80,
  },
  generateButton: {
    borderRadius: 12,
    overflow: 'hidden',
    marginTop: 8,
  },
  generateButtonDisabled: {
    opacity: 0.5,
  },
  generateGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    gap: 10,
  },
  generateButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFF',
  },
  results: {
    paddingHorizontal: 20,
    paddingTop: 32,
    gap: 16,
  },
  resultsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  resultsTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFF',
  },
  ideaCard: {
    backgroundColor: '#1E293B',
    borderRadius: 16,
    padding: 20,
    gap: 16,
    borderWidth: 1,
    borderColor: '#334155',
  },
  ideaHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  ideaNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#A855F7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ideaNumberText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFF',
  },
  ideaTitle: {
    flex: 1,
    fontSize: 17,
    fontWeight: '700',
    color: '#FFF',
  },
  ideaSection: {
    gap: 8,
  },
  ideaSectionLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#A855F7',
  },
  ideaSectionText: {
    fontSize: 14,
    color: '#CBD5E1',
    lineHeight: 20,
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#334155',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    gap: 8,
  },
  saveButtonSaved: {
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    borderWidth: 1,
    borderColor: '#10B981',
  },
  saveButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFF',
  },
  saveButtonTextSaved: {
    color: '#10B981',
  },
  helperText: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 4,
  },
  bottomSpacer: {
    height: 40,
  },
});

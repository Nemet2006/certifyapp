import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useEffect, useMemo, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CertificateCard } from '../../components/cert/CertificateCard';
import { ScreenHeader } from '../../components/ui/ScreenHeader';
import { useCertificateStore } from '../../store/certificateStore';
import { colors } from '../../theme/colors';
import { spacing, radius } from '../../theme/spacing';
import { fonts } from '../../theme/typography';
import type { MainStackParamList } from '../../navigation/types';

type Nav = NativeStackNavigationProp<MainStackParamList>;
type Filter = 'all' | 'printed' | 'scan';

export function LibraryScreen() {
  const navigation = useNavigation<Nav>();
  const items = useCertificateStore((s) => s.items);
  const load = useCertificateStore((s) => s.load);
  const [filter, setFilter] = useState<Filter>('all');

  useEffect(() => {
    load();
  }, [load]);

  const filtered = useMemo(() => {
    if (filter === 'printed') return items.filter((c) => c.printedAt);
    if (filter === 'scan') return items.filter((c) => c.source === 'scan' || c.source === 'gallery');
    return items;
  }, [items, filter]);

  const tabs: { key: Filter; label: string }[] = [
    { key: 'all', label: 'Hamısı' },
    { key: 'scan', label: 'Skan' },
    { key: 'printed', label: 'Çap edilib' },
  ];

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScreenHeader title="Arxivim" subtitle={`${items.length} sertifikat`} />
      <View style={styles.tabs}>
        {tabs.map((t) => (
          <Pressable
            key={t.key}
            onPress={() => setFilter(t.key)}
            style={[styles.tab, filter === t.key && styles.tabActive]}
          >
            <Text style={[styles.tabText, filter === t.key && styles.tabTextActive]}>{t.label}</Text>
          </Pressable>
        ))}
      </View>
      <FlatList
        data={filtered}
        keyExtractor={(c) => c.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyTitle}>Arxiv boşdur</Text>
            <Text style={styles.emptySub}>Skan tabından ilk sertifikatınızı əlavə edin</Text>
          </View>
        }
        renderItem={({ item }) => (
          <CertificateCard cert={item} onPress={() => navigation.navigate('CertDetail', { id: item.id })} />
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.parchment },
  tabs: { flexDirection: 'row', paddingHorizontal: spacing.lg, gap: spacing.sm, marginBottom: spacing.md },
  tab: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.full,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
  },
  tabActive: { backgroundColor: colors.ink, borderColor: colors.ink },
  tabText: { fontSize: 13, fontFamily: fonts.bodyMedium, color: colors.inkMuted },
  tabTextActive: { color: colors.parchment },
  list: { padding: spacing.lg, gap: spacing.md, paddingBottom: spacing.xxl },
  empty: { padding: spacing.xxl, alignItems: 'center' },
  emptyTitle: { fontSize: 18, fontFamily: fonts.display, color: colors.ink },
  emptySub: { fontSize: 14, fontFamily: fonts.body, color: colors.inkMuted, marginTop: spacing.sm, textAlign: 'center' },
});

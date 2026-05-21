/// F08: Offline sync service — syncs pending local sessions to backend when online.
import 'package:connectivity_plus/connectivity_plus.dart';
import 'api_service.dart';
import 'local_db_service.dart';

class SyncService {
  static final SyncService _instance = SyncService._internal();
  factory SyncService() => _instance;
  SyncService._internal();

  final _localDb = LocalDatabase();
  final _api = ApiService();
  String? _deviceId;

  void setDeviceId(String id) => _deviceId = id;

  /// Start watching connectivity and auto-sync when online.
  void startAutoSync() {
    Connectivity().onConnectivityChanged.listen((results) {
      final isOnline = results.any((r) => r != ConnectivityResult.none);
      if (isOnline) {
        syncPendingData();
      }
    });
  }

  Future<SyncResult> syncPendingData() async {
    if (_deviceId == null) return SyncResult(synced: 0, failed: 0);

    final pending = <Map<String, dynamic>>[];

    // Collect pending counting sessions
    final countSessions = await _localDb.getPendingCountingSessions();
    for (final s in countSessions) {
      pending.add({
        'type': 'counting',
        'local_id': s.id,
        'batch_id': s.batchId,
        'live_count': s.liveCount,
        'dead_count': s.deadCount,
        'total_count': s.totalCount,
        'mortality_pct': s.mortalityPct,
        'cv_pct': s.cvPct,
        'created_at': s.createdAt.toIso8601String(),
      });
    }

    // Collect pending diagnosis sessions
    final diagSessions = await _localDb.getPendingDiagnosisSessions();
    for (final s in diagSessions) {
      pending.add({
        'type': 'diagnosis',
        'local_id': s.id,
        'batch_id': s.batchId,
        'ehp_prob': s.ehpProb,
        'is_hard_fail': s.isHardFail,
        'risk_level': s.riskLevel,
        'created_at': s.createdAt.toIso8601String(),
      });
    }

    if (pending.isEmpty) return SyncResult(synced: 0, failed: 0);

    try {
      await _api.syncOfflineData(_deviceId!, pending);

      // Mark all as synced
      for (final s in countSessions) {
        await _localDb.markCountingSessionSynced(s.id);
      }

      return SyncResult(synced: pending.length, failed: 0);
    } catch (e) {
      return SyncResult(synced: 0, failed: pending.length, error: e.toString());
    }
  }

  Future<int> pendingSyncCount() => _localDb.countPendingSyncs();
}

class SyncResult {
  final int synced;
  final int failed;
  final String? error;
  SyncResult({required this.synced, required this.failed, this.error});
}

final syncService = SyncService();

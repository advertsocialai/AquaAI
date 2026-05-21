/// Local SQLite database using drift — F08 Offline-First Architecture
import 'dart:io';
import 'package:drift/drift.dart';
import 'package:drift/native.dart';
import 'package:path_provider/path_provider.dart';
import 'package:path/path.dart' as p;

part 'local_db_service.g.dart';

// Local tables matching the backend schema (for offline-first operation)

class LocalCountingSessions extends Table {
  IntColumn get id => integer().autoIncrement()();
  IntColumn get batchId => integer()();
  TextColumn get imagePaths => text().withDefault(const Constant('[]'))();
  IntColumn get liveCount => integer().nullable()();
  IntColumn get deadCount => integer().nullable()();
  IntColumn get totalCount => integer().nullable()();
  RealColumn get mortalityPct => real().nullable()();
  TextColumn get mortalityAlert => text().nullable()();
  RealColumn get cvPct => real().nullable()();
  TextColumn get cvFlag => text().nullable()();
  IntColumn get confidenceInterval => integer().nullable()();
  RealColumn get sampleVolumeMl => real().nullable()();
  RealColumn get totalVolumeMl => real().nullable()();
  IntColumn get extrapolatedCount => integer().nullable()();
  TextColumn get syncStatus => text().withDefault(const Constant('pending'))();
  DateTimeColumn get createdAt => dateTime().withDefault(currentDateAndTime)();
}

class LocalDiagnosisSessions extends Table {
  IntColumn get id => integer().autoIncrement()();
  IntColumn get batchId => integer()();
  RealColumn get ehpProb => real().nullable()();
  RealColumn get ehpPositiveProb => real().nullable()();
  BoolColumn get wssVPositive => boolean().withDefault(const Constant(false))();
  BoolColumn get isHardFail => boolean().withDefault(const Constant(false))();
  TextColumn get hardFailDisease => text().nullable()();
  TextColumn get riskLevel => text().nullable()();
  TextColumn get riskActionText => text().nullable()();
  TextColumn get syncStatus => text().withDefault(const Constant('pending'))();
  DateTimeColumn get createdAt => dateTime().withDefault(currentDateAndTime)();
}

class LocalGradingSessions extends Table {
  IntColumn get id => integer().autoIncrement()();
  IntColumn get batchId => integer()();
  RealColumn get compositeScore => real().nullable()();
  TextColumn get compositeGrade => text().nullable()();
  BoolColumn get isHardFail => boolean().withDefault(const Constant(false))();
  TextColumn get detectedPlStage => text().nullable()();
  RealColumn get recommendedDensityPct => real().nullable()();
  TextColumn get stockingRecommendation => text().nullable()();
  TextColumn get syncStatus => text().withDefault(const Constant('pending'))();
  DateTimeColumn get createdAt => dateTime().withDefault(currentDateAndTime)();
}

@DriftDatabase(tables: [LocalCountingSessions, LocalDiagnosisSessions, LocalGradingSessions])
class LocalDatabase extends _$LocalDatabase {
  LocalDatabase() : super(_openConnection());

  @override
  int get schemaVersion => 1;

  // Counting sessions
  Future<int> insertCountingSession(LocalCountingSessionsCompanion entry) =>
      into(localCountingSessions).insert(entry);

  Future<List<LocalCountingSession>> getPendingCountingSessions() =>
      (select(localCountingSessions)
            ..where((t) => t.syncStatus.equals('pending')))
          .get();

  Future<void> markCountingSessionSynced(int id) =>
      (update(localCountingSessions)..where((t) => t.id.equals(id)))
          .write(const LocalCountingSessionsCompanion(syncStatus: Value('synced')));

  // Diagnosis sessions
  Future<int> insertDiagnosisSession(LocalDiagnosisSessionsCompanion entry) =>
      into(localDiagnosisSessions).insert(entry);

  Future<List<LocalDiagnosisSession>> getPendingDiagnosisSessions() =>
      (select(localDiagnosisSessions)
            ..where((t) => t.syncStatus.equals('pending')))
          .get();

  // Grading sessions
  Future<int> insertGradingSession(LocalGradingSessionsCompanion entry) =>
      into(localGradingSessions).insert(entry);

  Future<List<LocalGradingSession>> getPendingGradingSessions() =>
      (select(localGradingSessions)
            ..where((t) => t.syncStatus.equals('pending')))
          .get();

  Future<int> countPendingSyncs() async {
    final count1 = (await getPendingCountingSessions()).length;
    final count2 = (await getPendingDiagnosisSessions()).length;
    final count3 = (await getPendingGradingSessions()).length;
    return count1 + count2 + count3;
  }
}

LazyDatabase _openConnection() {
  return LazyDatabase(() async {
    final dbFolder = await getApplicationDocumentsDirectory();
    final file = File(p.join(dbFolder.path, 'aquaai.db'));
    return NativeDatabase(file);
  });
}

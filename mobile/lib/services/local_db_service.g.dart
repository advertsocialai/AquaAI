// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'local_db_service.dart';

// ignore_for_file: type=lint
class $LocalCountingSessionsTable extends LocalCountingSessions
    with TableInfo<$LocalCountingSessionsTable, LocalCountingSession> {
  @override
  final GeneratedDatabase attachedDatabase;
  final String? _alias;
  $LocalCountingSessionsTable(this.attachedDatabase, [this._alias]);
  static const VerificationMeta _idMeta = const VerificationMeta('id');
  @override
  late final GeneratedColumn<int> id = GeneratedColumn<int>(
      'id', aliasedName, false,
      hasAutoIncrement: true,
      type: DriftSqlType.int,
      requiredDuringInsert: false,
      defaultConstraints:
          GeneratedColumn.constraintIsAlways('PRIMARY KEY AUTOINCREMENT'));
  static const VerificationMeta _batchIdMeta =
      const VerificationMeta('batchId');
  @override
  late final GeneratedColumn<int> batchId = GeneratedColumn<int>(
      'batch_id', aliasedName, false,
      type: DriftSqlType.int, requiredDuringInsert: true);
  static const VerificationMeta _imagePathsMeta =
      const VerificationMeta('imagePaths');
  @override
  late final GeneratedColumn<String> imagePaths = GeneratedColumn<String>(
      'image_paths', aliasedName, false,
      type: DriftSqlType.string,
      requiredDuringInsert: false,
      defaultValue: const Constant('[]'));
  static const VerificationMeta _liveCountMeta =
      const VerificationMeta('liveCount');
  @override
  late final GeneratedColumn<int> liveCount = GeneratedColumn<int>(
      'live_count', aliasedName, true,
      type: DriftSqlType.int, requiredDuringInsert: false);
  static const VerificationMeta _deadCountMeta =
      const VerificationMeta('deadCount');
  @override
  late final GeneratedColumn<int> deadCount = GeneratedColumn<int>(
      'dead_count', aliasedName, true,
      type: DriftSqlType.int, requiredDuringInsert: false);
  static const VerificationMeta _totalCountMeta =
      const VerificationMeta('totalCount');
  @override
  late final GeneratedColumn<int> totalCount = GeneratedColumn<int>(
      'total_count', aliasedName, true,
      type: DriftSqlType.int, requiredDuringInsert: false);
  static const VerificationMeta _mortalityPctMeta =
      const VerificationMeta('mortalityPct');
  @override
  late final GeneratedColumn<double> mortalityPct = GeneratedColumn<double>(
      'mortality_pct', aliasedName, true,
      type: DriftSqlType.double, requiredDuringInsert: false);
  static const VerificationMeta _mortalityAlertMeta =
      const VerificationMeta('mortalityAlert');
  @override
  late final GeneratedColumn<String> mortalityAlert = GeneratedColumn<String>(
      'mortality_alert', aliasedName, true,
      type: DriftSqlType.string, requiredDuringInsert: false);
  static const VerificationMeta _cvPctMeta = const VerificationMeta('cvPct');
  @override
  late final GeneratedColumn<double> cvPct = GeneratedColumn<double>(
      'cv_pct', aliasedName, true,
      type: DriftSqlType.double, requiredDuringInsert: false);
  static const VerificationMeta _cvFlagMeta = const VerificationMeta('cvFlag');
  @override
  late final GeneratedColumn<String> cvFlag = GeneratedColumn<String>(
      'cv_flag', aliasedName, true,
      type: DriftSqlType.string, requiredDuringInsert: false);
  static const VerificationMeta _confidenceIntervalMeta =
      const VerificationMeta('confidenceInterval');
  @override
  late final GeneratedColumn<int> confidenceInterval = GeneratedColumn<int>(
      'confidence_interval', aliasedName, true,
      type: DriftSqlType.int, requiredDuringInsert: false);
  static const VerificationMeta _sampleVolumeMlMeta =
      const VerificationMeta('sampleVolumeMl');
  @override
  late final GeneratedColumn<double> sampleVolumeMl = GeneratedColumn<double>(
      'sample_volume_ml', aliasedName, true,
      type: DriftSqlType.double, requiredDuringInsert: false);
  static const VerificationMeta _totalVolumeMlMeta =
      const VerificationMeta('totalVolumeMl');
  @override
  late final GeneratedColumn<double> totalVolumeMl = GeneratedColumn<double>(
      'total_volume_ml', aliasedName, true,
      type: DriftSqlType.double, requiredDuringInsert: false);
  static const VerificationMeta _extrapolatedCountMeta =
      const VerificationMeta('extrapolatedCount');
  @override
  late final GeneratedColumn<int> extrapolatedCount = GeneratedColumn<int>(
      'extrapolated_count', aliasedName, true,
      type: DriftSqlType.int, requiredDuringInsert: false);
  static const VerificationMeta _syncStatusMeta =
      const VerificationMeta('syncStatus');
  @override
  late final GeneratedColumn<String> syncStatus = GeneratedColumn<String>(
      'sync_status', aliasedName, false,
      type: DriftSqlType.string,
      requiredDuringInsert: false,
      defaultValue: const Constant('pending'));
  static const VerificationMeta _createdAtMeta =
      const VerificationMeta('createdAt');
  @override
  late final GeneratedColumn<DateTime> createdAt = GeneratedColumn<DateTime>(
      'created_at', aliasedName, false,
      type: DriftSqlType.dateTime,
      requiredDuringInsert: false,
      defaultValue: currentDateAndTime);
  @override
  List<GeneratedColumn> get $columns => [
        id,
        batchId,
        imagePaths,
        liveCount,
        deadCount,
        totalCount,
        mortalityPct,
        mortalityAlert,
        cvPct,
        cvFlag,
        confidenceInterval,
        sampleVolumeMl,
        totalVolumeMl,
        extrapolatedCount,
        syncStatus,
        createdAt
      ];
  @override
  String get aliasedName => _alias ?? actualTableName;
  @override
  String get actualTableName => $name;
  static const String $name = 'local_counting_sessions';
  @override
  VerificationContext validateIntegrity(
      Insertable<LocalCountingSession> instance,
      {bool isInserting = false}) {
    final context = VerificationContext();
    final data = instance.toColumns(true);
    if (data.containsKey('id')) {
      context.handle(_idMeta, id.isAcceptableOrUnknown(data['id']!, _idMeta));
    }
    if (data.containsKey('batch_id')) {
      context.handle(_batchIdMeta,
          batchId.isAcceptableOrUnknown(data['batch_id']!, _batchIdMeta));
    } else if (isInserting) {
      context.missing(_batchIdMeta);
    }
    if (data.containsKey('image_paths')) {
      context.handle(
          _imagePathsMeta,
          imagePaths.isAcceptableOrUnknown(
              data['image_paths']!, _imagePathsMeta));
    }
    if (data.containsKey('live_count')) {
      context.handle(_liveCountMeta,
          liveCount.isAcceptableOrUnknown(data['live_count']!, _liveCountMeta));
    }
    if (data.containsKey('dead_count')) {
      context.handle(_deadCountMeta,
          deadCount.isAcceptableOrUnknown(data['dead_count']!, _deadCountMeta));
    }
    if (data.containsKey('total_count')) {
      context.handle(
          _totalCountMeta,
          totalCount.isAcceptableOrUnknown(
              data['total_count']!, _totalCountMeta));
    }
    if (data.containsKey('mortality_pct')) {
      context.handle(
          _mortalityPctMeta,
          mortalityPct.isAcceptableOrUnknown(
              data['mortality_pct']!, _mortalityPctMeta));
    }
    if (data.containsKey('mortality_alert')) {
      context.handle(
          _mortalityAlertMeta,
          mortalityAlert.isAcceptableOrUnknown(
              data['mortality_alert']!, _mortalityAlertMeta));
    }
    if (data.containsKey('cv_pct')) {
      context.handle(
          _cvPctMeta, cvPct.isAcceptableOrUnknown(data['cv_pct']!, _cvPctMeta));
    }
    if (data.containsKey('cv_flag')) {
      context.handle(_cvFlagMeta,
          cvFlag.isAcceptableOrUnknown(data['cv_flag']!, _cvFlagMeta));
    }
    if (data.containsKey('confidence_interval')) {
      context.handle(
          _confidenceIntervalMeta,
          confidenceInterval.isAcceptableOrUnknown(
              data['confidence_interval']!, _confidenceIntervalMeta));
    }
    if (data.containsKey('sample_volume_ml')) {
      context.handle(
          _sampleVolumeMlMeta,
          sampleVolumeMl.isAcceptableOrUnknown(
              data['sample_volume_ml']!, _sampleVolumeMlMeta));
    }
    if (data.containsKey('total_volume_ml')) {
      context.handle(
          _totalVolumeMlMeta,
          totalVolumeMl.isAcceptableOrUnknown(
              data['total_volume_ml']!, _totalVolumeMlMeta));
    }
    if (data.containsKey('extrapolated_count')) {
      context.handle(
          _extrapolatedCountMeta,
          extrapolatedCount.isAcceptableOrUnknown(
              data['extrapolated_count']!, _extrapolatedCountMeta));
    }
    if (data.containsKey('sync_status')) {
      context.handle(
          _syncStatusMeta,
          syncStatus.isAcceptableOrUnknown(
              data['sync_status']!, _syncStatusMeta));
    }
    if (data.containsKey('created_at')) {
      context.handle(_createdAtMeta,
          createdAt.isAcceptableOrUnknown(data['created_at']!, _createdAtMeta));
    }
    return context;
  }

  @override
  Set<GeneratedColumn> get $primaryKey => {id};
  @override
  LocalCountingSession map(Map<String, dynamic> data, {String? tablePrefix}) {
    final effectivePrefix = tablePrefix != null ? '$tablePrefix.' : '';
    return LocalCountingSession(
      id: attachedDatabase.typeMapping
          .read(DriftSqlType.int, data['${effectivePrefix}id'])!,
      batchId: attachedDatabase.typeMapping
          .read(DriftSqlType.int, data['${effectivePrefix}batch_id'])!,
      imagePaths: attachedDatabase.typeMapping
          .read(DriftSqlType.string, data['${effectivePrefix}image_paths'])!,
      liveCount: attachedDatabase.typeMapping
          .read(DriftSqlType.int, data['${effectivePrefix}live_count']),
      deadCount: attachedDatabase.typeMapping
          .read(DriftSqlType.int, data['${effectivePrefix}dead_count']),
      totalCount: attachedDatabase.typeMapping
          .read(DriftSqlType.int, data['${effectivePrefix}total_count']),
      mortalityPct: attachedDatabase.typeMapping
          .read(DriftSqlType.double, data['${effectivePrefix}mortality_pct']),
      mortalityAlert: attachedDatabase.typeMapping
          .read(DriftSqlType.string, data['${effectivePrefix}mortality_alert']),
      cvPct: attachedDatabase.typeMapping
          .read(DriftSqlType.double, data['${effectivePrefix}cv_pct']),
      cvFlag: attachedDatabase.typeMapping
          .read(DriftSqlType.string, data['${effectivePrefix}cv_flag']),
      confidenceInterval: attachedDatabase.typeMapping.read(
          DriftSqlType.int, data['${effectivePrefix}confidence_interval']),
      sampleVolumeMl: attachedDatabase.typeMapping.read(
          DriftSqlType.double, data['${effectivePrefix}sample_volume_ml']),
      totalVolumeMl: attachedDatabase.typeMapping
          .read(DriftSqlType.double, data['${effectivePrefix}total_volume_ml']),
      extrapolatedCount: attachedDatabase.typeMapping
          .read(DriftSqlType.int, data['${effectivePrefix}extrapolated_count']),
      syncStatus: attachedDatabase.typeMapping
          .read(DriftSqlType.string, data['${effectivePrefix}sync_status'])!,
      createdAt: attachedDatabase.typeMapping
          .read(DriftSqlType.dateTime, data['${effectivePrefix}created_at'])!,
    );
  }

  @override
  $LocalCountingSessionsTable createAlias(String alias) {
    return $LocalCountingSessionsTable(attachedDatabase, alias);
  }
}

class LocalCountingSession extends DataClass
    implements Insertable<LocalCountingSession> {
  final int id;
  final int batchId;
  final String imagePaths;
  final int? liveCount;
  final int? deadCount;
  final int? totalCount;
  final double? mortalityPct;
  final String? mortalityAlert;
  final double? cvPct;
  final String? cvFlag;
  final int? confidenceInterval;
  final double? sampleVolumeMl;
  final double? totalVolumeMl;
  final int? extrapolatedCount;
  final String syncStatus;
  final DateTime createdAt;
  const LocalCountingSession(
      {required this.id,
      required this.batchId,
      required this.imagePaths,
      this.liveCount,
      this.deadCount,
      this.totalCount,
      this.mortalityPct,
      this.mortalityAlert,
      this.cvPct,
      this.cvFlag,
      this.confidenceInterval,
      this.sampleVolumeMl,
      this.totalVolumeMl,
      this.extrapolatedCount,
      required this.syncStatus,
      required this.createdAt});
  @override
  Map<String, Expression> toColumns(bool nullToAbsent) {
    final map = <String, Expression>{};
    map['id'] = Variable<int>(id);
    map['batch_id'] = Variable<int>(batchId);
    map['image_paths'] = Variable<String>(imagePaths);
    if (!nullToAbsent || liveCount != null) {
      map['live_count'] = Variable<int>(liveCount);
    }
    if (!nullToAbsent || deadCount != null) {
      map['dead_count'] = Variable<int>(deadCount);
    }
    if (!nullToAbsent || totalCount != null) {
      map['total_count'] = Variable<int>(totalCount);
    }
    if (!nullToAbsent || mortalityPct != null) {
      map['mortality_pct'] = Variable<double>(mortalityPct);
    }
    if (!nullToAbsent || mortalityAlert != null) {
      map['mortality_alert'] = Variable<String>(mortalityAlert);
    }
    if (!nullToAbsent || cvPct != null) {
      map['cv_pct'] = Variable<double>(cvPct);
    }
    if (!nullToAbsent || cvFlag != null) {
      map['cv_flag'] = Variable<String>(cvFlag);
    }
    if (!nullToAbsent || confidenceInterval != null) {
      map['confidence_interval'] = Variable<int>(confidenceInterval);
    }
    if (!nullToAbsent || sampleVolumeMl != null) {
      map['sample_volume_ml'] = Variable<double>(sampleVolumeMl);
    }
    if (!nullToAbsent || totalVolumeMl != null) {
      map['total_volume_ml'] = Variable<double>(totalVolumeMl);
    }
    if (!nullToAbsent || extrapolatedCount != null) {
      map['extrapolated_count'] = Variable<int>(extrapolatedCount);
    }
    map['sync_status'] = Variable<String>(syncStatus);
    map['created_at'] = Variable<DateTime>(createdAt);
    return map;
  }

  LocalCountingSessionsCompanion toCompanion(bool nullToAbsent) {
    return LocalCountingSessionsCompanion(
      id: Value(id),
      batchId: Value(batchId),
      imagePaths: Value(imagePaths),
      liveCount: liveCount == null && nullToAbsent
          ? const Value.absent()
          : Value(liveCount),
      deadCount: deadCount == null && nullToAbsent
          ? const Value.absent()
          : Value(deadCount),
      totalCount: totalCount == null && nullToAbsent
          ? const Value.absent()
          : Value(totalCount),
      mortalityPct: mortalityPct == null && nullToAbsent
          ? const Value.absent()
          : Value(mortalityPct),
      mortalityAlert: mortalityAlert == null && nullToAbsent
          ? const Value.absent()
          : Value(mortalityAlert),
      cvPct:
          cvPct == null && nullToAbsent ? const Value.absent() : Value(cvPct),
      cvFlag:
          cvFlag == null && nullToAbsent ? const Value.absent() : Value(cvFlag),
      confidenceInterval: confidenceInterval == null && nullToAbsent
          ? const Value.absent()
          : Value(confidenceInterval),
      sampleVolumeMl: sampleVolumeMl == null && nullToAbsent
          ? const Value.absent()
          : Value(sampleVolumeMl),
      totalVolumeMl: totalVolumeMl == null && nullToAbsent
          ? const Value.absent()
          : Value(totalVolumeMl),
      extrapolatedCount: extrapolatedCount == null && nullToAbsent
          ? const Value.absent()
          : Value(extrapolatedCount),
      syncStatus: Value(syncStatus),
      createdAt: Value(createdAt),
    );
  }

  factory LocalCountingSession.fromJson(Map<String, dynamic> json,
      {ValueSerializer? serializer}) {
    serializer ??= driftRuntimeOptions.defaultSerializer;
    return LocalCountingSession(
      id: serializer.fromJson<int>(json['id']),
      batchId: serializer.fromJson<int>(json['batchId']),
      imagePaths: serializer.fromJson<String>(json['imagePaths']),
      liveCount: serializer.fromJson<int?>(json['liveCount']),
      deadCount: serializer.fromJson<int?>(json['deadCount']),
      totalCount: serializer.fromJson<int?>(json['totalCount']),
      mortalityPct: serializer.fromJson<double?>(json['mortalityPct']),
      mortalityAlert: serializer.fromJson<String?>(json['mortalityAlert']),
      cvPct: serializer.fromJson<double?>(json['cvPct']),
      cvFlag: serializer.fromJson<String?>(json['cvFlag']),
      confidenceInterval: serializer.fromJson<int?>(json['confidenceInterval']),
      sampleVolumeMl: serializer.fromJson<double?>(json['sampleVolumeMl']),
      totalVolumeMl: serializer.fromJson<double?>(json['totalVolumeMl']),
      extrapolatedCount: serializer.fromJson<int?>(json['extrapolatedCount']),
      syncStatus: serializer.fromJson<String>(json['syncStatus']),
      createdAt: serializer.fromJson<DateTime>(json['createdAt']),
    );
  }
  @override
  Map<String, dynamic> toJson({ValueSerializer? serializer}) {
    serializer ??= driftRuntimeOptions.defaultSerializer;
    return <String, dynamic>{
      'id': serializer.toJson<int>(id),
      'batchId': serializer.toJson<int>(batchId),
      'imagePaths': serializer.toJson<String>(imagePaths),
      'liveCount': serializer.toJson<int?>(liveCount),
      'deadCount': serializer.toJson<int?>(deadCount),
      'totalCount': serializer.toJson<int?>(totalCount),
      'mortalityPct': serializer.toJson<double?>(mortalityPct),
      'mortalityAlert': serializer.toJson<String?>(mortalityAlert),
      'cvPct': serializer.toJson<double?>(cvPct),
      'cvFlag': serializer.toJson<String?>(cvFlag),
      'confidenceInterval': serializer.toJson<int?>(confidenceInterval),
      'sampleVolumeMl': serializer.toJson<double?>(sampleVolumeMl),
      'totalVolumeMl': serializer.toJson<double?>(totalVolumeMl),
      'extrapolatedCount': serializer.toJson<int?>(extrapolatedCount),
      'syncStatus': serializer.toJson<String>(syncStatus),
      'createdAt': serializer.toJson<DateTime>(createdAt),
    };
  }

  LocalCountingSession copyWith(
          {int? id,
          int? batchId,
          String? imagePaths,
          Value<int?> liveCount = const Value.absent(),
          Value<int?> deadCount = const Value.absent(),
          Value<int?> totalCount = const Value.absent(),
          Value<double?> mortalityPct = const Value.absent(),
          Value<String?> mortalityAlert = const Value.absent(),
          Value<double?> cvPct = const Value.absent(),
          Value<String?> cvFlag = const Value.absent(),
          Value<int?> confidenceInterval = const Value.absent(),
          Value<double?> sampleVolumeMl = const Value.absent(),
          Value<double?> totalVolumeMl = const Value.absent(),
          Value<int?> extrapolatedCount = const Value.absent(),
          String? syncStatus,
          DateTime? createdAt}) =>
      LocalCountingSession(
        id: id ?? this.id,
        batchId: batchId ?? this.batchId,
        imagePaths: imagePaths ?? this.imagePaths,
        liveCount: liveCount.present ? liveCount.value : this.liveCount,
        deadCount: deadCount.present ? deadCount.value : this.deadCount,
        totalCount: totalCount.present ? totalCount.value : this.totalCount,
        mortalityPct:
            mortalityPct.present ? mortalityPct.value : this.mortalityPct,
        mortalityAlert:
            mortalityAlert.present ? mortalityAlert.value : this.mortalityAlert,
        cvPct: cvPct.present ? cvPct.value : this.cvPct,
        cvFlag: cvFlag.present ? cvFlag.value : this.cvFlag,
        confidenceInterval: confidenceInterval.present
            ? confidenceInterval.value
            : this.confidenceInterval,
        sampleVolumeMl:
            sampleVolumeMl.present ? sampleVolumeMl.value : this.sampleVolumeMl,
        totalVolumeMl:
            totalVolumeMl.present ? totalVolumeMl.value : this.totalVolumeMl,
        extrapolatedCount: extrapolatedCount.present
            ? extrapolatedCount.value
            : this.extrapolatedCount,
        syncStatus: syncStatus ?? this.syncStatus,
        createdAt: createdAt ?? this.createdAt,
      );
  LocalCountingSession copyWithCompanion(LocalCountingSessionsCompanion data) {
    return LocalCountingSession(
      id: data.id.present ? data.id.value : this.id,
      batchId: data.batchId.present ? data.batchId.value : this.batchId,
      imagePaths:
          data.imagePaths.present ? data.imagePaths.value : this.imagePaths,
      liveCount: data.liveCount.present ? data.liveCount.value : this.liveCount,
      deadCount: data.deadCount.present ? data.deadCount.value : this.deadCount,
      totalCount:
          data.totalCount.present ? data.totalCount.value : this.totalCount,
      mortalityPct: data.mortalityPct.present
          ? data.mortalityPct.value
          : this.mortalityPct,
      mortalityAlert: data.mortalityAlert.present
          ? data.mortalityAlert.value
          : this.mortalityAlert,
      cvPct: data.cvPct.present ? data.cvPct.value : this.cvPct,
      cvFlag: data.cvFlag.present ? data.cvFlag.value : this.cvFlag,
      confidenceInterval: data.confidenceInterval.present
          ? data.confidenceInterval.value
          : this.confidenceInterval,
      sampleVolumeMl: data.sampleVolumeMl.present
          ? data.sampleVolumeMl.value
          : this.sampleVolumeMl,
      totalVolumeMl: data.totalVolumeMl.present
          ? data.totalVolumeMl.value
          : this.totalVolumeMl,
      extrapolatedCount: data.extrapolatedCount.present
          ? data.extrapolatedCount.value
          : this.extrapolatedCount,
      syncStatus:
          data.syncStatus.present ? data.syncStatus.value : this.syncStatus,
      createdAt: data.createdAt.present ? data.createdAt.value : this.createdAt,
    );
  }

  @override
  String toString() {
    return (StringBuffer('LocalCountingSession(')
          ..write('id: $id, ')
          ..write('batchId: $batchId, ')
          ..write('imagePaths: $imagePaths, ')
          ..write('liveCount: $liveCount, ')
          ..write('deadCount: $deadCount, ')
          ..write('totalCount: $totalCount, ')
          ..write('mortalityPct: $mortalityPct, ')
          ..write('mortalityAlert: $mortalityAlert, ')
          ..write('cvPct: $cvPct, ')
          ..write('cvFlag: $cvFlag, ')
          ..write('confidenceInterval: $confidenceInterval, ')
          ..write('sampleVolumeMl: $sampleVolumeMl, ')
          ..write('totalVolumeMl: $totalVolumeMl, ')
          ..write('extrapolatedCount: $extrapolatedCount, ')
          ..write('syncStatus: $syncStatus, ')
          ..write('createdAt: $createdAt')
          ..write(')'))
        .toString();
  }

  @override
  int get hashCode => Object.hash(
      id,
      batchId,
      imagePaths,
      liveCount,
      deadCount,
      totalCount,
      mortalityPct,
      mortalityAlert,
      cvPct,
      cvFlag,
      confidenceInterval,
      sampleVolumeMl,
      totalVolumeMl,
      extrapolatedCount,
      syncStatus,
      createdAt);
  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      (other is LocalCountingSession &&
          other.id == this.id &&
          other.batchId == this.batchId &&
          other.imagePaths == this.imagePaths &&
          other.liveCount == this.liveCount &&
          other.deadCount == this.deadCount &&
          other.totalCount == this.totalCount &&
          other.mortalityPct == this.mortalityPct &&
          other.mortalityAlert == this.mortalityAlert &&
          other.cvPct == this.cvPct &&
          other.cvFlag == this.cvFlag &&
          other.confidenceInterval == this.confidenceInterval &&
          other.sampleVolumeMl == this.sampleVolumeMl &&
          other.totalVolumeMl == this.totalVolumeMl &&
          other.extrapolatedCount == this.extrapolatedCount &&
          other.syncStatus == this.syncStatus &&
          other.createdAt == this.createdAt);
}

class LocalCountingSessionsCompanion
    extends UpdateCompanion<LocalCountingSession> {
  final Value<int> id;
  final Value<int> batchId;
  final Value<String> imagePaths;
  final Value<int?> liveCount;
  final Value<int?> deadCount;
  final Value<int?> totalCount;
  final Value<double?> mortalityPct;
  final Value<String?> mortalityAlert;
  final Value<double?> cvPct;
  final Value<String?> cvFlag;
  final Value<int?> confidenceInterval;
  final Value<double?> sampleVolumeMl;
  final Value<double?> totalVolumeMl;
  final Value<int?> extrapolatedCount;
  final Value<String> syncStatus;
  final Value<DateTime> createdAt;
  const LocalCountingSessionsCompanion({
    this.id = const Value.absent(),
    this.batchId = const Value.absent(),
    this.imagePaths = const Value.absent(),
    this.liveCount = const Value.absent(),
    this.deadCount = const Value.absent(),
    this.totalCount = const Value.absent(),
    this.mortalityPct = const Value.absent(),
    this.mortalityAlert = const Value.absent(),
    this.cvPct = const Value.absent(),
    this.cvFlag = const Value.absent(),
    this.confidenceInterval = const Value.absent(),
    this.sampleVolumeMl = const Value.absent(),
    this.totalVolumeMl = const Value.absent(),
    this.extrapolatedCount = const Value.absent(),
    this.syncStatus = const Value.absent(),
    this.createdAt = const Value.absent(),
  });
  LocalCountingSessionsCompanion.insert({
    this.id = const Value.absent(),
    required int batchId,
    this.imagePaths = const Value.absent(),
    this.liveCount = const Value.absent(),
    this.deadCount = const Value.absent(),
    this.totalCount = const Value.absent(),
    this.mortalityPct = const Value.absent(),
    this.mortalityAlert = const Value.absent(),
    this.cvPct = const Value.absent(),
    this.cvFlag = const Value.absent(),
    this.confidenceInterval = const Value.absent(),
    this.sampleVolumeMl = const Value.absent(),
    this.totalVolumeMl = const Value.absent(),
    this.extrapolatedCount = const Value.absent(),
    this.syncStatus = const Value.absent(),
    this.createdAt = const Value.absent(),
  }) : batchId = Value(batchId);
  static Insertable<LocalCountingSession> custom({
    Expression<int>? id,
    Expression<int>? batchId,
    Expression<String>? imagePaths,
    Expression<int>? liveCount,
    Expression<int>? deadCount,
    Expression<int>? totalCount,
    Expression<double>? mortalityPct,
    Expression<String>? mortalityAlert,
    Expression<double>? cvPct,
    Expression<String>? cvFlag,
    Expression<int>? confidenceInterval,
    Expression<double>? sampleVolumeMl,
    Expression<double>? totalVolumeMl,
    Expression<int>? extrapolatedCount,
    Expression<String>? syncStatus,
    Expression<DateTime>? createdAt,
  }) {
    return RawValuesInsertable({
      if (id != null) 'id': id,
      if (batchId != null) 'batch_id': batchId,
      if (imagePaths != null) 'image_paths': imagePaths,
      if (liveCount != null) 'live_count': liveCount,
      if (deadCount != null) 'dead_count': deadCount,
      if (totalCount != null) 'total_count': totalCount,
      if (mortalityPct != null) 'mortality_pct': mortalityPct,
      if (mortalityAlert != null) 'mortality_alert': mortalityAlert,
      if (cvPct != null) 'cv_pct': cvPct,
      if (cvFlag != null) 'cv_flag': cvFlag,
      if (confidenceInterval != null) 'confidence_interval': confidenceInterval,
      if (sampleVolumeMl != null) 'sample_volume_ml': sampleVolumeMl,
      if (totalVolumeMl != null) 'total_volume_ml': totalVolumeMl,
      if (extrapolatedCount != null) 'extrapolated_count': extrapolatedCount,
      if (syncStatus != null) 'sync_status': syncStatus,
      if (createdAt != null) 'created_at': createdAt,
    });
  }

  LocalCountingSessionsCompanion copyWith(
      {Value<int>? id,
      Value<int>? batchId,
      Value<String>? imagePaths,
      Value<int?>? liveCount,
      Value<int?>? deadCount,
      Value<int?>? totalCount,
      Value<double?>? mortalityPct,
      Value<String?>? mortalityAlert,
      Value<double?>? cvPct,
      Value<String?>? cvFlag,
      Value<int?>? confidenceInterval,
      Value<double?>? sampleVolumeMl,
      Value<double?>? totalVolumeMl,
      Value<int?>? extrapolatedCount,
      Value<String>? syncStatus,
      Value<DateTime>? createdAt}) {
    return LocalCountingSessionsCompanion(
      id: id ?? this.id,
      batchId: batchId ?? this.batchId,
      imagePaths: imagePaths ?? this.imagePaths,
      liveCount: liveCount ?? this.liveCount,
      deadCount: deadCount ?? this.deadCount,
      totalCount: totalCount ?? this.totalCount,
      mortalityPct: mortalityPct ?? this.mortalityPct,
      mortalityAlert: mortalityAlert ?? this.mortalityAlert,
      cvPct: cvPct ?? this.cvPct,
      cvFlag: cvFlag ?? this.cvFlag,
      confidenceInterval: confidenceInterval ?? this.confidenceInterval,
      sampleVolumeMl: sampleVolumeMl ?? this.sampleVolumeMl,
      totalVolumeMl: totalVolumeMl ?? this.totalVolumeMl,
      extrapolatedCount: extrapolatedCount ?? this.extrapolatedCount,
      syncStatus: syncStatus ?? this.syncStatus,
      createdAt: createdAt ?? this.createdAt,
    );
  }

  @override
  Map<String, Expression> toColumns(bool nullToAbsent) {
    final map = <String, Expression>{};
    if (id.present) {
      map['id'] = Variable<int>(id.value);
    }
    if (batchId.present) {
      map['batch_id'] = Variable<int>(batchId.value);
    }
    if (imagePaths.present) {
      map['image_paths'] = Variable<String>(imagePaths.value);
    }
    if (liveCount.present) {
      map['live_count'] = Variable<int>(liveCount.value);
    }
    if (deadCount.present) {
      map['dead_count'] = Variable<int>(deadCount.value);
    }
    if (totalCount.present) {
      map['total_count'] = Variable<int>(totalCount.value);
    }
    if (mortalityPct.present) {
      map['mortality_pct'] = Variable<double>(mortalityPct.value);
    }
    if (mortalityAlert.present) {
      map['mortality_alert'] = Variable<String>(mortalityAlert.value);
    }
    if (cvPct.present) {
      map['cv_pct'] = Variable<double>(cvPct.value);
    }
    if (cvFlag.present) {
      map['cv_flag'] = Variable<String>(cvFlag.value);
    }
    if (confidenceInterval.present) {
      map['confidence_interval'] = Variable<int>(confidenceInterval.value);
    }
    if (sampleVolumeMl.present) {
      map['sample_volume_ml'] = Variable<double>(sampleVolumeMl.value);
    }
    if (totalVolumeMl.present) {
      map['total_volume_ml'] = Variable<double>(totalVolumeMl.value);
    }
    if (extrapolatedCount.present) {
      map['extrapolated_count'] = Variable<int>(extrapolatedCount.value);
    }
    if (syncStatus.present) {
      map['sync_status'] = Variable<String>(syncStatus.value);
    }
    if (createdAt.present) {
      map['created_at'] = Variable<DateTime>(createdAt.value);
    }
    return map;
  }

  @override
  String toString() {
    return (StringBuffer('LocalCountingSessionsCompanion(')
          ..write('id: $id, ')
          ..write('batchId: $batchId, ')
          ..write('imagePaths: $imagePaths, ')
          ..write('liveCount: $liveCount, ')
          ..write('deadCount: $deadCount, ')
          ..write('totalCount: $totalCount, ')
          ..write('mortalityPct: $mortalityPct, ')
          ..write('mortalityAlert: $mortalityAlert, ')
          ..write('cvPct: $cvPct, ')
          ..write('cvFlag: $cvFlag, ')
          ..write('confidenceInterval: $confidenceInterval, ')
          ..write('sampleVolumeMl: $sampleVolumeMl, ')
          ..write('totalVolumeMl: $totalVolumeMl, ')
          ..write('extrapolatedCount: $extrapolatedCount, ')
          ..write('syncStatus: $syncStatus, ')
          ..write('createdAt: $createdAt')
          ..write(')'))
        .toString();
  }
}

class $LocalDiagnosisSessionsTable extends LocalDiagnosisSessions
    with TableInfo<$LocalDiagnosisSessionsTable, LocalDiagnosisSession> {
  @override
  final GeneratedDatabase attachedDatabase;
  final String? _alias;
  $LocalDiagnosisSessionsTable(this.attachedDatabase, [this._alias]);
  static const VerificationMeta _idMeta = const VerificationMeta('id');
  @override
  late final GeneratedColumn<int> id = GeneratedColumn<int>(
      'id', aliasedName, false,
      hasAutoIncrement: true,
      type: DriftSqlType.int,
      requiredDuringInsert: false,
      defaultConstraints:
          GeneratedColumn.constraintIsAlways('PRIMARY KEY AUTOINCREMENT'));
  static const VerificationMeta _batchIdMeta =
      const VerificationMeta('batchId');
  @override
  late final GeneratedColumn<int> batchId = GeneratedColumn<int>(
      'batch_id', aliasedName, false,
      type: DriftSqlType.int, requiredDuringInsert: true);
  static const VerificationMeta _ehpProbMeta =
      const VerificationMeta('ehpProb');
  @override
  late final GeneratedColumn<double> ehpProb = GeneratedColumn<double>(
      'ehp_prob', aliasedName, true,
      type: DriftSqlType.double, requiredDuringInsert: false);
  static const VerificationMeta _ehpPositiveProbMeta =
      const VerificationMeta('ehpPositiveProb');
  @override
  late final GeneratedColumn<double> ehpPositiveProb = GeneratedColumn<double>(
      'ehp_positive_prob', aliasedName, true,
      type: DriftSqlType.double, requiredDuringInsert: false);
  static const VerificationMeta _wssVPositiveMeta =
      const VerificationMeta('wssVPositive');
  @override
  late final GeneratedColumn<bool> wssVPositive = GeneratedColumn<bool>(
      'wss_v_positive', aliasedName, false,
      type: DriftSqlType.bool,
      requiredDuringInsert: false,
      defaultConstraints: GeneratedColumn.constraintIsAlways(
          'CHECK ("wss_v_positive" IN (0, 1))'),
      defaultValue: const Constant(false));
  static const VerificationMeta _isHardFailMeta =
      const VerificationMeta('isHardFail');
  @override
  late final GeneratedColumn<bool> isHardFail = GeneratedColumn<bool>(
      'is_hard_fail', aliasedName, false,
      type: DriftSqlType.bool,
      requiredDuringInsert: false,
      defaultConstraints: GeneratedColumn.constraintIsAlways(
          'CHECK ("is_hard_fail" IN (0, 1))'),
      defaultValue: const Constant(false));
  static const VerificationMeta _hardFailDiseaseMeta =
      const VerificationMeta('hardFailDisease');
  @override
  late final GeneratedColumn<String> hardFailDisease = GeneratedColumn<String>(
      'hard_fail_disease', aliasedName, true,
      type: DriftSqlType.string, requiredDuringInsert: false);
  static const VerificationMeta _riskLevelMeta =
      const VerificationMeta('riskLevel');
  @override
  late final GeneratedColumn<String> riskLevel = GeneratedColumn<String>(
      'risk_level', aliasedName, true,
      type: DriftSqlType.string, requiredDuringInsert: false);
  static const VerificationMeta _riskActionTextMeta =
      const VerificationMeta('riskActionText');
  @override
  late final GeneratedColumn<String> riskActionText = GeneratedColumn<String>(
      'risk_action_text', aliasedName, true,
      type: DriftSqlType.string, requiredDuringInsert: false);
  static const VerificationMeta _syncStatusMeta =
      const VerificationMeta('syncStatus');
  @override
  late final GeneratedColumn<String> syncStatus = GeneratedColumn<String>(
      'sync_status', aliasedName, false,
      type: DriftSqlType.string,
      requiredDuringInsert: false,
      defaultValue: const Constant('pending'));
  static const VerificationMeta _createdAtMeta =
      const VerificationMeta('createdAt');
  @override
  late final GeneratedColumn<DateTime> createdAt = GeneratedColumn<DateTime>(
      'created_at', aliasedName, false,
      type: DriftSqlType.dateTime,
      requiredDuringInsert: false,
      defaultValue: currentDateAndTime);
  @override
  List<GeneratedColumn> get $columns => [
        id,
        batchId,
        ehpProb,
        ehpPositiveProb,
        wssVPositive,
        isHardFail,
        hardFailDisease,
        riskLevel,
        riskActionText,
        syncStatus,
        createdAt
      ];
  @override
  String get aliasedName => _alias ?? actualTableName;
  @override
  String get actualTableName => $name;
  static const String $name = 'local_diagnosis_sessions';
  @override
  VerificationContext validateIntegrity(
      Insertable<LocalDiagnosisSession> instance,
      {bool isInserting = false}) {
    final context = VerificationContext();
    final data = instance.toColumns(true);
    if (data.containsKey('id')) {
      context.handle(_idMeta, id.isAcceptableOrUnknown(data['id']!, _idMeta));
    }
    if (data.containsKey('batch_id')) {
      context.handle(_batchIdMeta,
          batchId.isAcceptableOrUnknown(data['batch_id']!, _batchIdMeta));
    } else if (isInserting) {
      context.missing(_batchIdMeta);
    }
    if (data.containsKey('ehp_prob')) {
      context.handle(_ehpProbMeta,
          ehpProb.isAcceptableOrUnknown(data['ehp_prob']!, _ehpProbMeta));
    }
    if (data.containsKey('ehp_positive_prob')) {
      context.handle(
          _ehpPositiveProbMeta,
          ehpPositiveProb.isAcceptableOrUnknown(
              data['ehp_positive_prob']!, _ehpPositiveProbMeta));
    }
    if (data.containsKey('wss_v_positive')) {
      context.handle(
          _wssVPositiveMeta,
          wssVPositive.isAcceptableOrUnknown(
              data['wss_v_positive']!, _wssVPositiveMeta));
    }
    if (data.containsKey('is_hard_fail')) {
      context.handle(
          _isHardFailMeta,
          isHardFail.isAcceptableOrUnknown(
              data['is_hard_fail']!, _isHardFailMeta));
    }
    if (data.containsKey('hard_fail_disease')) {
      context.handle(
          _hardFailDiseaseMeta,
          hardFailDisease.isAcceptableOrUnknown(
              data['hard_fail_disease']!, _hardFailDiseaseMeta));
    }
    if (data.containsKey('risk_level')) {
      context.handle(_riskLevelMeta,
          riskLevel.isAcceptableOrUnknown(data['risk_level']!, _riskLevelMeta));
    }
    if (data.containsKey('risk_action_text')) {
      context.handle(
          _riskActionTextMeta,
          riskActionText.isAcceptableOrUnknown(
              data['risk_action_text']!, _riskActionTextMeta));
    }
    if (data.containsKey('sync_status')) {
      context.handle(
          _syncStatusMeta,
          syncStatus.isAcceptableOrUnknown(
              data['sync_status']!, _syncStatusMeta));
    }
    if (data.containsKey('created_at')) {
      context.handle(_createdAtMeta,
          createdAt.isAcceptableOrUnknown(data['created_at']!, _createdAtMeta));
    }
    return context;
  }

  @override
  Set<GeneratedColumn> get $primaryKey => {id};
  @override
  LocalDiagnosisSession map(Map<String, dynamic> data, {String? tablePrefix}) {
    final effectivePrefix = tablePrefix != null ? '$tablePrefix.' : '';
    return LocalDiagnosisSession(
      id: attachedDatabase.typeMapping
          .read(DriftSqlType.int, data['${effectivePrefix}id'])!,
      batchId: attachedDatabase.typeMapping
          .read(DriftSqlType.int, data['${effectivePrefix}batch_id'])!,
      ehpProb: attachedDatabase.typeMapping
          .read(DriftSqlType.double, data['${effectivePrefix}ehp_prob']),
      ehpPositiveProb: attachedDatabase.typeMapping.read(
          DriftSqlType.double, data['${effectivePrefix}ehp_positive_prob']),
      wssVPositive: attachedDatabase.typeMapping
          .read(DriftSqlType.bool, data['${effectivePrefix}wss_v_positive'])!,
      isHardFail: attachedDatabase.typeMapping
          .read(DriftSqlType.bool, data['${effectivePrefix}is_hard_fail'])!,
      hardFailDisease: attachedDatabase.typeMapping.read(
          DriftSqlType.string, data['${effectivePrefix}hard_fail_disease']),
      riskLevel: attachedDatabase.typeMapping
          .read(DriftSqlType.string, data['${effectivePrefix}risk_level']),
      riskActionText: attachedDatabase.typeMapping.read(
          DriftSqlType.string, data['${effectivePrefix}risk_action_text']),
      syncStatus: attachedDatabase.typeMapping
          .read(DriftSqlType.string, data['${effectivePrefix}sync_status'])!,
      createdAt: attachedDatabase.typeMapping
          .read(DriftSqlType.dateTime, data['${effectivePrefix}created_at'])!,
    );
  }

  @override
  $LocalDiagnosisSessionsTable createAlias(String alias) {
    return $LocalDiagnosisSessionsTable(attachedDatabase, alias);
  }
}

class LocalDiagnosisSession extends DataClass
    implements Insertable<LocalDiagnosisSession> {
  final int id;
  final int batchId;
  final double? ehpProb;
  final double? ehpPositiveProb;
  final bool wssVPositive;
  final bool isHardFail;
  final String? hardFailDisease;
  final String? riskLevel;
  final String? riskActionText;
  final String syncStatus;
  final DateTime createdAt;
  const LocalDiagnosisSession(
      {required this.id,
      required this.batchId,
      this.ehpProb,
      this.ehpPositiveProb,
      required this.wssVPositive,
      required this.isHardFail,
      this.hardFailDisease,
      this.riskLevel,
      this.riskActionText,
      required this.syncStatus,
      required this.createdAt});
  @override
  Map<String, Expression> toColumns(bool nullToAbsent) {
    final map = <String, Expression>{};
    map['id'] = Variable<int>(id);
    map['batch_id'] = Variable<int>(batchId);
    if (!nullToAbsent || ehpProb != null) {
      map['ehp_prob'] = Variable<double>(ehpProb);
    }
    if (!nullToAbsent || ehpPositiveProb != null) {
      map['ehp_positive_prob'] = Variable<double>(ehpPositiveProb);
    }
    map['wss_v_positive'] = Variable<bool>(wssVPositive);
    map['is_hard_fail'] = Variable<bool>(isHardFail);
    if (!nullToAbsent || hardFailDisease != null) {
      map['hard_fail_disease'] = Variable<String>(hardFailDisease);
    }
    if (!nullToAbsent || riskLevel != null) {
      map['risk_level'] = Variable<String>(riskLevel);
    }
    if (!nullToAbsent || riskActionText != null) {
      map['risk_action_text'] = Variable<String>(riskActionText);
    }
    map['sync_status'] = Variable<String>(syncStatus);
    map['created_at'] = Variable<DateTime>(createdAt);
    return map;
  }

  LocalDiagnosisSessionsCompanion toCompanion(bool nullToAbsent) {
    return LocalDiagnosisSessionsCompanion(
      id: Value(id),
      batchId: Value(batchId),
      ehpProb: ehpProb == null && nullToAbsent
          ? const Value.absent()
          : Value(ehpProb),
      ehpPositiveProb: ehpPositiveProb == null && nullToAbsent
          ? const Value.absent()
          : Value(ehpPositiveProb),
      wssVPositive: Value(wssVPositive),
      isHardFail: Value(isHardFail),
      hardFailDisease: hardFailDisease == null && nullToAbsent
          ? const Value.absent()
          : Value(hardFailDisease),
      riskLevel: riskLevel == null && nullToAbsent
          ? const Value.absent()
          : Value(riskLevel),
      riskActionText: riskActionText == null && nullToAbsent
          ? const Value.absent()
          : Value(riskActionText),
      syncStatus: Value(syncStatus),
      createdAt: Value(createdAt),
    );
  }

  factory LocalDiagnosisSession.fromJson(Map<String, dynamic> json,
      {ValueSerializer? serializer}) {
    serializer ??= driftRuntimeOptions.defaultSerializer;
    return LocalDiagnosisSession(
      id: serializer.fromJson<int>(json['id']),
      batchId: serializer.fromJson<int>(json['batchId']),
      ehpProb: serializer.fromJson<double?>(json['ehpProb']),
      ehpPositiveProb: serializer.fromJson<double?>(json['ehpPositiveProb']),
      wssVPositive: serializer.fromJson<bool>(json['wssVPositive']),
      isHardFail: serializer.fromJson<bool>(json['isHardFail']),
      hardFailDisease: serializer.fromJson<String?>(json['hardFailDisease']),
      riskLevel: serializer.fromJson<String?>(json['riskLevel']),
      riskActionText: serializer.fromJson<String?>(json['riskActionText']),
      syncStatus: serializer.fromJson<String>(json['syncStatus']),
      createdAt: serializer.fromJson<DateTime>(json['createdAt']),
    );
  }
  @override
  Map<String, dynamic> toJson({ValueSerializer? serializer}) {
    serializer ??= driftRuntimeOptions.defaultSerializer;
    return <String, dynamic>{
      'id': serializer.toJson<int>(id),
      'batchId': serializer.toJson<int>(batchId),
      'ehpProb': serializer.toJson<double?>(ehpProb),
      'ehpPositiveProb': serializer.toJson<double?>(ehpPositiveProb),
      'wssVPositive': serializer.toJson<bool>(wssVPositive),
      'isHardFail': serializer.toJson<bool>(isHardFail),
      'hardFailDisease': serializer.toJson<String?>(hardFailDisease),
      'riskLevel': serializer.toJson<String?>(riskLevel),
      'riskActionText': serializer.toJson<String?>(riskActionText),
      'syncStatus': serializer.toJson<String>(syncStatus),
      'createdAt': serializer.toJson<DateTime>(createdAt),
    };
  }

  LocalDiagnosisSession copyWith(
          {int? id,
          int? batchId,
          Value<double?> ehpProb = const Value.absent(),
          Value<double?> ehpPositiveProb = const Value.absent(),
          bool? wssVPositive,
          bool? isHardFail,
          Value<String?> hardFailDisease = const Value.absent(),
          Value<String?> riskLevel = const Value.absent(),
          Value<String?> riskActionText = const Value.absent(),
          String? syncStatus,
          DateTime? createdAt}) =>
      LocalDiagnosisSession(
        id: id ?? this.id,
        batchId: batchId ?? this.batchId,
        ehpProb: ehpProb.present ? ehpProb.value : this.ehpProb,
        ehpPositiveProb: ehpPositiveProb.present
            ? ehpPositiveProb.value
            : this.ehpPositiveProb,
        wssVPositive: wssVPositive ?? this.wssVPositive,
        isHardFail: isHardFail ?? this.isHardFail,
        hardFailDisease: hardFailDisease.present
            ? hardFailDisease.value
            : this.hardFailDisease,
        riskLevel: riskLevel.present ? riskLevel.value : this.riskLevel,
        riskActionText:
            riskActionText.present ? riskActionText.value : this.riskActionText,
        syncStatus: syncStatus ?? this.syncStatus,
        createdAt: createdAt ?? this.createdAt,
      );
  LocalDiagnosisSession copyWithCompanion(
      LocalDiagnosisSessionsCompanion data) {
    return LocalDiagnosisSession(
      id: data.id.present ? data.id.value : this.id,
      batchId: data.batchId.present ? data.batchId.value : this.batchId,
      ehpProb: data.ehpProb.present ? data.ehpProb.value : this.ehpProb,
      ehpPositiveProb: data.ehpPositiveProb.present
          ? data.ehpPositiveProb.value
          : this.ehpPositiveProb,
      wssVPositive: data.wssVPositive.present
          ? data.wssVPositive.value
          : this.wssVPositive,
      isHardFail:
          data.isHardFail.present ? data.isHardFail.value : this.isHardFail,
      hardFailDisease: data.hardFailDisease.present
          ? data.hardFailDisease.value
          : this.hardFailDisease,
      riskLevel: data.riskLevel.present ? data.riskLevel.value : this.riskLevel,
      riskActionText: data.riskActionText.present
          ? data.riskActionText.value
          : this.riskActionText,
      syncStatus:
          data.syncStatus.present ? data.syncStatus.value : this.syncStatus,
      createdAt: data.createdAt.present ? data.createdAt.value : this.createdAt,
    );
  }

  @override
  String toString() {
    return (StringBuffer('LocalDiagnosisSession(')
          ..write('id: $id, ')
          ..write('batchId: $batchId, ')
          ..write('ehpProb: $ehpProb, ')
          ..write('ehpPositiveProb: $ehpPositiveProb, ')
          ..write('wssVPositive: $wssVPositive, ')
          ..write('isHardFail: $isHardFail, ')
          ..write('hardFailDisease: $hardFailDisease, ')
          ..write('riskLevel: $riskLevel, ')
          ..write('riskActionText: $riskActionText, ')
          ..write('syncStatus: $syncStatus, ')
          ..write('createdAt: $createdAt')
          ..write(')'))
        .toString();
  }

  @override
  int get hashCode => Object.hash(
      id,
      batchId,
      ehpProb,
      ehpPositiveProb,
      wssVPositive,
      isHardFail,
      hardFailDisease,
      riskLevel,
      riskActionText,
      syncStatus,
      createdAt);
  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      (other is LocalDiagnosisSession &&
          other.id == this.id &&
          other.batchId == this.batchId &&
          other.ehpProb == this.ehpProb &&
          other.ehpPositiveProb == this.ehpPositiveProb &&
          other.wssVPositive == this.wssVPositive &&
          other.isHardFail == this.isHardFail &&
          other.hardFailDisease == this.hardFailDisease &&
          other.riskLevel == this.riskLevel &&
          other.riskActionText == this.riskActionText &&
          other.syncStatus == this.syncStatus &&
          other.createdAt == this.createdAt);
}

class LocalDiagnosisSessionsCompanion
    extends UpdateCompanion<LocalDiagnosisSession> {
  final Value<int> id;
  final Value<int> batchId;
  final Value<double?> ehpProb;
  final Value<double?> ehpPositiveProb;
  final Value<bool> wssVPositive;
  final Value<bool> isHardFail;
  final Value<String?> hardFailDisease;
  final Value<String?> riskLevel;
  final Value<String?> riskActionText;
  final Value<String> syncStatus;
  final Value<DateTime> createdAt;
  const LocalDiagnosisSessionsCompanion({
    this.id = const Value.absent(),
    this.batchId = const Value.absent(),
    this.ehpProb = const Value.absent(),
    this.ehpPositiveProb = const Value.absent(),
    this.wssVPositive = const Value.absent(),
    this.isHardFail = const Value.absent(),
    this.hardFailDisease = const Value.absent(),
    this.riskLevel = const Value.absent(),
    this.riskActionText = const Value.absent(),
    this.syncStatus = const Value.absent(),
    this.createdAt = const Value.absent(),
  });
  LocalDiagnosisSessionsCompanion.insert({
    this.id = const Value.absent(),
    required int batchId,
    this.ehpProb = const Value.absent(),
    this.ehpPositiveProb = const Value.absent(),
    this.wssVPositive = const Value.absent(),
    this.isHardFail = const Value.absent(),
    this.hardFailDisease = const Value.absent(),
    this.riskLevel = const Value.absent(),
    this.riskActionText = const Value.absent(),
    this.syncStatus = const Value.absent(),
    this.createdAt = const Value.absent(),
  }) : batchId = Value(batchId);
  static Insertable<LocalDiagnosisSession> custom({
    Expression<int>? id,
    Expression<int>? batchId,
    Expression<double>? ehpProb,
    Expression<double>? ehpPositiveProb,
    Expression<bool>? wssVPositive,
    Expression<bool>? isHardFail,
    Expression<String>? hardFailDisease,
    Expression<String>? riskLevel,
    Expression<String>? riskActionText,
    Expression<String>? syncStatus,
    Expression<DateTime>? createdAt,
  }) {
    return RawValuesInsertable({
      if (id != null) 'id': id,
      if (batchId != null) 'batch_id': batchId,
      if (ehpProb != null) 'ehp_prob': ehpProb,
      if (ehpPositiveProb != null) 'ehp_positive_prob': ehpPositiveProb,
      if (wssVPositive != null) 'wss_v_positive': wssVPositive,
      if (isHardFail != null) 'is_hard_fail': isHardFail,
      if (hardFailDisease != null) 'hard_fail_disease': hardFailDisease,
      if (riskLevel != null) 'risk_level': riskLevel,
      if (riskActionText != null) 'risk_action_text': riskActionText,
      if (syncStatus != null) 'sync_status': syncStatus,
      if (createdAt != null) 'created_at': createdAt,
    });
  }

  LocalDiagnosisSessionsCompanion copyWith(
      {Value<int>? id,
      Value<int>? batchId,
      Value<double?>? ehpProb,
      Value<double?>? ehpPositiveProb,
      Value<bool>? wssVPositive,
      Value<bool>? isHardFail,
      Value<String?>? hardFailDisease,
      Value<String?>? riskLevel,
      Value<String?>? riskActionText,
      Value<String>? syncStatus,
      Value<DateTime>? createdAt}) {
    return LocalDiagnosisSessionsCompanion(
      id: id ?? this.id,
      batchId: batchId ?? this.batchId,
      ehpProb: ehpProb ?? this.ehpProb,
      ehpPositiveProb: ehpPositiveProb ?? this.ehpPositiveProb,
      wssVPositive: wssVPositive ?? this.wssVPositive,
      isHardFail: isHardFail ?? this.isHardFail,
      hardFailDisease: hardFailDisease ?? this.hardFailDisease,
      riskLevel: riskLevel ?? this.riskLevel,
      riskActionText: riskActionText ?? this.riskActionText,
      syncStatus: syncStatus ?? this.syncStatus,
      createdAt: createdAt ?? this.createdAt,
    );
  }

  @override
  Map<String, Expression> toColumns(bool nullToAbsent) {
    final map = <String, Expression>{};
    if (id.present) {
      map['id'] = Variable<int>(id.value);
    }
    if (batchId.present) {
      map['batch_id'] = Variable<int>(batchId.value);
    }
    if (ehpProb.present) {
      map['ehp_prob'] = Variable<double>(ehpProb.value);
    }
    if (ehpPositiveProb.present) {
      map['ehp_positive_prob'] = Variable<double>(ehpPositiveProb.value);
    }
    if (wssVPositive.present) {
      map['wss_v_positive'] = Variable<bool>(wssVPositive.value);
    }
    if (isHardFail.present) {
      map['is_hard_fail'] = Variable<bool>(isHardFail.value);
    }
    if (hardFailDisease.present) {
      map['hard_fail_disease'] = Variable<String>(hardFailDisease.value);
    }
    if (riskLevel.present) {
      map['risk_level'] = Variable<String>(riskLevel.value);
    }
    if (riskActionText.present) {
      map['risk_action_text'] = Variable<String>(riskActionText.value);
    }
    if (syncStatus.present) {
      map['sync_status'] = Variable<String>(syncStatus.value);
    }
    if (createdAt.present) {
      map['created_at'] = Variable<DateTime>(createdAt.value);
    }
    return map;
  }

  @override
  String toString() {
    return (StringBuffer('LocalDiagnosisSessionsCompanion(')
          ..write('id: $id, ')
          ..write('batchId: $batchId, ')
          ..write('ehpProb: $ehpProb, ')
          ..write('ehpPositiveProb: $ehpPositiveProb, ')
          ..write('wssVPositive: $wssVPositive, ')
          ..write('isHardFail: $isHardFail, ')
          ..write('hardFailDisease: $hardFailDisease, ')
          ..write('riskLevel: $riskLevel, ')
          ..write('riskActionText: $riskActionText, ')
          ..write('syncStatus: $syncStatus, ')
          ..write('createdAt: $createdAt')
          ..write(')'))
        .toString();
  }
}

class $LocalGradingSessionsTable extends LocalGradingSessions
    with TableInfo<$LocalGradingSessionsTable, LocalGradingSession> {
  @override
  final GeneratedDatabase attachedDatabase;
  final String? _alias;
  $LocalGradingSessionsTable(this.attachedDatabase, [this._alias]);
  static const VerificationMeta _idMeta = const VerificationMeta('id');
  @override
  late final GeneratedColumn<int> id = GeneratedColumn<int>(
      'id', aliasedName, false,
      hasAutoIncrement: true,
      type: DriftSqlType.int,
      requiredDuringInsert: false,
      defaultConstraints:
          GeneratedColumn.constraintIsAlways('PRIMARY KEY AUTOINCREMENT'));
  static const VerificationMeta _batchIdMeta =
      const VerificationMeta('batchId');
  @override
  late final GeneratedColumn<int> batchId = GeneratedColumn<int>(
      'batch_id', aliasedName, false,
      type: DriftSqlType.int, requiredDuringInsert: true);
  static const VerificationMeta _compositeScoreMeta =
      const VerificationMeta('compositeScore');
  @override
  late final GeneratedColumn<double> compositeScore = GeneratedColumn<double>(
      'composite_score', aliasedName, true,
      type: DriftSqlType.double, requiredDuringInsert: false);
  static const VerificationMeta _compositeGradeMeta =
      const VerificationMeta('compositeGrade');
  @override
  late final GeneratedColumn<String> compositeGrade = GeneratedColumn<String>(
      'composite_grade', aliasedName, true,
      type: DriftSqlType.string, requiredDuringInsert: false);
  static const VerificationMeta _isHardFailMeta =
      const VerificationMeta('isHardFail');
  @override
  late final GeneratedColumn<bool> isHardFail = GeneratedColumn<bool>(
      'is_hard_fail', aliasedName, false,
      type: DriftSqlType.bool,
      requiredDuringInsert: false,
      defaultConstraints: GeneratedColumn.constraintIsAlways(
          'CHECK ("is_hard_fail" IN (0, 1))'),
      defaultValue: const Constant(false));
  static const VerificationMeta _detectedPlStageMeta =
      const VerificationMeta('detectedPlStage');
  @override
  late final GeneratedColumn<String> detectedPlStage = GeneratedColumn<String>(
      'detected_pl_stage', aliasedName, true,
      type: DriftSqlType.string, requiredDuringInsert: false);
  static const VerificationMeta _recommendedDensityPctMeta =
      const VerificationMeta('recommendedDensityPct');
  @override
  late final GeneratedColumn<double> recommendedDensityPct =
      GeneratedColumn<double>('recommended_density_pct', aliasedName, true,
          type: DriftSqlType.double, requiredDuringInsert: false);
  static const VerificationMeta _stockingRecommendationMeta =
      const VerificationMeta('stockingRecommendation');
  @override
  late final GeneratedColumn<String> stockingRecommendation =
      GeneratedColumn<String>('stocking_recommendation', aliasedName, true,
          type: DriftSqlType.string, requiredDuringInsert: false);
  static const VerificationMeta _syncStatusMeta =
      const VerificationMeta('syncStatus');
  @override
  late final GeneratedColumn<String> syncStatus = GeneratedColumn<String>(
      'sync_status', aliasedName, false,
      type: DriftSqlType.string,
      requiredDuringInsert: false,
      defaultValue: const Constant('pending'));
  static const VerificationMeta _createdAtMeta =
      const VerificationMeta('createdAt');
  @override
  late final GeneratedColumn<DateTime> createdAt = GeneratedColumn<DateTime>(
      'created_at', aliasedName, false,
      type: DriftSqlType.dateTime,
      requiredDuringInsert: false,
      defaultValue: currentDateAndTime);
  @override
  List<GeneratedColumn> get $columns => [
        id,
        batchId,
        compositeScore,
        compositeGrade,
        isHardFail,
        detectedPlStage,
        recommendedDensityPct,
        stockingRecommendation,
        syncStatus,
        createdAt
      ];
  @override
  String get aliasedName => _alias ?? actualTableName;
  @override
  String get actualTableName => $name;
  static const String $name = 'local_grading_sessions';
  @override
  VerificationContext validateIntegrity(
      Insertable<LocalGradingSession> instance,
      {bool isInserting = false}) {
    final context = VerificationContext();
    final data = instance.toColumns(true);
    if (data.containsKey('id')) {
      context.handle(_idMeta, id.isAcceptableOrUnknown(data['id']!, _idMeta));
    }
    if (data.containsKey('batch_id')) {
      context.handle(_batchIdMeta,
          batchId.isAcceptableOrUnknown(data['batch_id']!, _batchIdMeta));
    } else if (isInserting) {
      context.missing(_batchIdMeta);
    }
    if (data.containsKey('composite_score')) {
      context.handle(
          _compositeScoreMeta,
          compositeScore.isAcceptableOrUnknown(
              data['composite_score']!, _compositeScoreMeta));
    }
    if (data.containsKey('composite_grade')) {
      context.handle(
          _compositeGradeMeta,
          compositeGrade.isAcceptableOrUnknown(
              data['composite_grade']!, _compositeGradeMeta));
    }
    if (data.containsKey('is_hard_fail')) {
      context.handle(
          _isHardFailMeta,
          isHardFail.isAcceptableOrUnknown(
              data['is_hard_fail']!, _isHardFailMeta));
    }
    if (data.containsKey('detected_pl_stage')) {
      context.handle(
          _detectedPlStageMeta,
          detectedPlStage.isAcceptableOrUnknown(
              data['detected_pl_stage']!, _detectedPlStageMeta));
    }
    if (data.containsKey('recommended_density_pct')) {
      context.handle(
          _recommendedDensityPctMeta,
          recommendedDensityPct.isAcceptableOrUnknown(
              data['recommended_density_pct']!, _recommendedDensityPctMeta));
    }
    if (data.containsKey('stocking_recommendation')) {
      context.handle(
          _stockingRecommendationMeta,
          stockingRecommendation.isAcceptableOrUnknown(
              data['stocking_recommendation']!, _stockingRecommendationMeta));
    }
    if (data.containsKey('sync_status')) {
      context.handle(
          _syncStatusMeta,
          syncStatus.isAcceptableOrUnknown(
              data['sync_status']!, _syncStatusMeta));
    }
    if (data.containsKey('created_at')) {
      context.handle(_createdAtMeta,
          createdAt.isAcceptableOrUnknown(data['created_at']!, _createdAtMeta));
    }
    return context;
  }

  @override
  Set<GeneratedColumn> get $primaryKey => {id};
  @override
  LocalGradingSession map(Map<String, dynamic> data, {String? tablePrefix}) {
    final effectivePrefix = tablePrefix != null ? '$tablePrefix.' : '';
    return LocalGradingSession(
      id: attachedDatabase.typeMapping
          .read(DriftSqlType.int, data['${effectivePrefix}id'])!,
      batchId: attachedDatabase.typeMapping
          .read(DriftSqlType.int, data['${effectivePrefix}batch_id'])!,
      compositeScore: attachedDatabase.typeMapping
          .read(DriftSqlType.double, data['${effectivePrefix}composite_score']),
      compositeGrade: attachedDatabase.typeMapping
          .read(DriftSqlType.string, data['${effectivePrefix}composite_grade']),
      isHardFail: attachedDatabase.typeMapping
          .read(DriftSqlType.bool, data['${effectivePrefix}is_hard_fail'])!,
      detectedPlStage: attachedDatabase.typeMapping.read(
          DriftSqlType.string, data['${effectivePrefix}detected_pl_stage']),
      recommendedDensityPct: attachedDatabase.typeMapping.read(
          DriftSqlType.double,
          data['${effectivePrefix}recommended_density_pct']),
      stockingRecommendation: attachedDatabase.typeMapping.read(
          DriftSqlType.string,
          data['${effectivePrefix}stocking_recommendation']),
      syncStatus: attachedDatabase.typeMapping
          .read(DriftSqlType.string, data['${effectivePrefix}sync_status'])!,
      createdAt: attachedDatabase.typeMapping
          .read(DriftSqlType.dateTime, data['${effectivePrefix}created_at'])!,
    );
  }

  @override
  $LocalGradingSessionsTable createAlias(String alias) {
    return $LocalGradingSessionsTable(attachedDatabase, alias);
  }
}

class LocalGradingSession extends DataClass
    implements Insertable<LocalGradingSession> {
  final int id;
  final int batchId;
  final double? compositeScore;
  final String? compositeGrade;
  final bool isHardFail;
  final String? detectedPlStage;
  final double? recommendedDensityPct;
  final String? stockingRecommendation;
  final String syncStatus;
  final DateTime createdAt;
  const LocalGradingSession(
      {required this.id,
      required this.batchId,
      this.compositeScore,
      this.compositeGrade,
      required this.isHardFail,
      this.detectedPlStage,
      this.recommendedDensityPct,
      this.stockingRecommendation,
      required this.syncStatus,
      required this.createdAt});
  @override
  Map<String, Expression> toColumns(bool nullToAbsent) {
    final map = <String, Expression>{};
    map['id'] = Variable<int>(id);
    map['batch_id'] = Variable<int>(batchId);
    if (!nullToAbsent || compositeScore != null) {
      map['composite_score'] = Variable<double>(compositeScore);
    }
    if (!nullToAbsent || compositeGrade != null) {
      map['composite_grade'] = Variable<String>(compositeGrade);
    }
    map['is_hard_fail'] = Variable<bool>(isHardFail);
    if (!nullToAbsent || detectedPlStage != null) {
      map['detected_pl_stage'] = Variable<String>(detectedPlStage);
    }
    if (!nullToAbsent || recommendedDensityPct != null) {
      map['recommended_density_pct'] = Variable<double>(recommendedDensityPct);
    }
    if (!nullToAbsent || stockingRecommendation != null) {
      map['stocking_recommendation'] = Variable<String>(stockingRecommendation);
    }
    map['sync_status'] = Variable<String>(syncStatus);
    map['created_at'] = Variable<DateTime>(createdAt);
    return map;
  }

  LocalGradingSessionsCompanion toCompanion(bool nullToAbsent) {
    return LocalGradingSessionsCompanion(
      id: Value(id),
      batchId: Value(batchId),
      compositeScore: compositeScore == null && nullToAbsent
          ? const Value.absent()
          : Value(compositeScore),
      compositeGrade: compositeGrade == null && nullToAbsent
          ? const Value.absent()
          : Value(compositeGrade),
      isHardFail: Value(isHardFail),
      detectedPlStage: detectedPlStage == null && nullToAbsent
          ? const Value.absent()
          : Value(detectedPlStage),
      recommendedDensityPct: recommendedDensityPct == null && nullToAbsent
          ? const Value.absent()
          : Value(recommendedDensityPct),
      stockingRecommendation: stockingRecommendation == null && nullToAbsent
          ? const Value.absent()
          : Value(stockingRecommendation),
      syncStatus: Value(syncStatus),
      createdAt: Value(createdAt),
    );
  }

  factory LocalGradingSession.fromJson(Map<String, dynamic> json,
      {ValueSerializer? serializer}) {
    serializer ??= driftRuntimeOptions.defaultSerializer;
    return LocalGradingSession(
      id: serializer.fromJson<int>(json['id']),
      batchId: serializer.fromJson<int>(json['batchId']),
      compositeScore: serializer.fromJson<double?>(json['compositeScore']),
      compositeGrade: serializer.fromJson<String?>(json['compositeGrade']),
      isHardFail: serializer.fromJson<bool>(json['isHardFail']),
      detectedPlStage: serializer.fromJson<String?>(json['detectedPlStage']),
      recommendedDensityPct:
          serializer.fromJson<double?>(json['recommendedDensityPct']),
      stockingRecommendation:
          serializer.fromJson<String?>(json['stockingRecommendation']),
      syncStatus: serializer.fromJson<String>(json['syncStatus']),
      createdAt: serializer.fromJson<DateTime>(json['createdAt']),
    );
  }
  @override
  Map<String, dynamic> toJson({ValueSerializer? serializer}) {
    serializer ??= driftRuntimeOptions.defaultSerializer;
    return <String, dynamic>{
      'id': serializer.toJson<int>(id),
      'batchId': serializer.toJson<int>(batchId),
      'compositeScore': serializer.toJson<double?>(compositeScore),
      'compositeGrade': serializer.toJson<String?>(compositeGrade),
      'isHardFail': serializer.toJson<bool>(isHardFail),
      'detectedPlStage': serializer.toJson<String?>(detectedPlStage),
      'recommendedDensityPct':
          serializer.toJson<double?>(recommendedDensityPct),
      'stockingRecommendation':
          serializer.toJson<String?>(stockingRecommendation),
      'syncStatus': serializer.toJson<String>(syncStatus),
      'createdAt': serializer.toJson<DateTime>(createdAt),
    };
  }

  LocalGradingSession copyWith(
          {int? id,
          int? batchId,
          Value<double?> compositeScore = const Value.absent(),
          Value<String?> compositeGrade = const Value.absent(),
          bool? isHardFail,
          Value<String?> detectedPlStage = const Value.absent(),
          Value<double?> recommendedDensityPct = const Value.absent(),
          Value<String?> stockingRecommendation = const Value.absent(),
          String? syncStatus,
          DateTime? createdAt}) =>
      LocalGradingSession(
        id: id ?? this.id,
        batchId: batchId ?? this.batchId,
        compositeScore:
            compositeScore.present ? compositeScore.value : this.compositeScore,
        compositeGrade:
            compositeGrade.present ? compositeGrade.value : this.compositeGrade,
        isHardFail: isHardFail ?? this.isHardFail,
        detectedPlStage: detectedPlStage.present
            ? detectedPlStage.value
            : this.detectedPlStage,
        recommendedDensityPct: recommendedDensityPct.present
            ? recommendedDensityPct.value
            : this.recommendedDensityPct,
        stockingRecommendation: stockingRecommendation.present
            ? stockingRecommendation.value
            : this.stockingRecommendation,
        syncStatus: syncStatus ?? this.syncStatus,
        createdAt: createdAt ?? this.createdAt,
      );
  LocalGradingSession copyWithCompanion(LocalGradingSessionsCompanion data) {
    return LocalGradingSession(
      id: data.id.present ? data.id.value : this.id,
      batchId: data.batchId.present ? data.batchId.value : this.batchId,
      compositeScore: data.compositeScore.present
          ? data.compositeScore.value
          : this.compositeScore,
      compositeGrade: data.compositeGrade.present
          ? data.compositeGrade.value
          : this.compositeGrade,
      isHardFail:
          data.isHardFail.present ? data.isHardFail.value : this.isHardFail,
      detectedPlStage: data.detectedPlStage.present
          ? data.detectedPlStage.value
          : this.detectedPlStage,
      recommendedDensityPct: data.recommendedDensityPct.present
          ? data.recommendedDensityPct.value
          : this.recommendedDensityPct,
      stockingRecommendation: data.stockingRecommendation.present
          ? data.stockingRecommendation.value
          : this.stockingRecommendation,
      syncStatus:
          data.syncStatus.present ? data.syncStatus.value : this.syncStatus,
      createdAt: data.createdAt.present ? data.createdAt.value : this.createdAt,
    );
  }

  @override
  String toString() {
    return (StringBuffer('LocalGradingSession(')
          ..write('id: $id, ')
          ..write('batchId: $batchId, ')
          ..write('compositeScore: $compositeScore, ')
          ..write('compositeGrade: $compositeGrade, ')
          ..write('isHardFail: $isHardFail, ')
          ..write('detectedPlStage: $detectedPlStage, ')
          ..write('recommendedDensityPct: $recommendedDensityPct, ')
          ..write('stockingRecommendation: $stockingRecommendation, ')
          ..write('syncStatus: $syncStatus, ')
          ..write('createdAt: $createdAt')
          ..write(')'))
        .toString();
  }

  @override
  int get hashCode => Object.hash(
      id,
      batchId,
      compositeScore,
      compositeGrade,
      isHardFail,
      detectedPlStage,
      recommendedDensityPct,
      stockingRecommendation,
      syncStatus,
      createdAt);
  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      (other is LocalGradingSession &&
          other.id == this.id &&
          other.batchId == this.batchId &&
          other.compositeScore == this.compositeScore &&
          other.compositeGrade == this.compositeGrade &&
          other.isHardFail == this.isHardFail &&
          other.detectedPlStage == this.detectedPlStage &&
          other.recommendedDensityPct == this.recommendedDensityPct &&
          other.stockingRecommendation == this.stockingRecommendation &&
          other.syncStatus == this.syncStatus &&
          other.createdAt == this.createdAt);
}

class LocalGradingSessionsCompanion
    extends UpdateCompanion<LocalGradingSession> {
  final Value<int> id;
  final Value<int> batchId;
  final Value<double?> compositeScore;
  final Value<String?> compositeGrade;
  final Value<bool> isHardFail;
  final Value<String?> detectedPlStage;
  final Value<double?> recommendedDensityPct;
  final Value<String?> stockingRecommendation;
  final Value<String> syncStatus;
  final Value<DateTime> createdAt;
  const LocalGradingSessionsCompanion({
    this.id = const Value.absent(),
    this.batchId = const Value.absent(),
    this.compositeScore = const Value.absent(),
    this.compositeGrade = const Value.absent(),
    this.isHardFail = const Value.absent(),
    this.detectedPlStage = const Value.absent(),
    this.recommendedDensityPct = const Value.absent(),
    this.stockingRecommendation = const Value.absent(),
    this.syncStatus = const Value.absent(),
    this.createdAt = const Value.absent(),
  });
  LocalGradingSessionsCompanion.insert({
    this.id = const Value.absent(),
    required int batchId,
    this.compositeScore = const Value.absent(),
    this.compositeGrade = const Value.absent(),
    this.isHardFail = const Value.absent(),
    this.detectedPlStage = const Value.absent(),
    this.recommendedDensityPct = const Value.absent(),
    this.stockingRecommendation = const Value.absent(),
    this.syncStatus = const Value.absent(),
    this.createdAt = const Value.absent(),
  }) : batchId = Value(batchId);
  static Insertable<LocalGradingSession> custom({
    Expression<int>? id,
    Expression<int>? batchId,
    Expression<double>? compositeScore,
    Expression<String>? compositeGrade,
    Expression<bool>? isHardFail,
    Expression<String>? detectedPlStage,
    Expression<double>? recommendedDensityPct,
    Expression<String>? stockingRecommendation,
    Expression<String>? syncStatus,
    Expression<DateTime>? createdAt,
  }) {
    return RawValuesInsertable({
      if (id != null) 'id': id,
      if (batchId != null) 'batch_id': batchId,
      if (compositeScore != null) 'composite_score': compositeScore,
      if (compositeGrade != null) 'composite_grade': compositeGrade,
      if (isHardFail != null) 'is_hard_fail': isHardFail,
      if (detectedPlStage != null) 'detected_pl_stage': detectedPlStage,
      if (recommendedDensityPct != null)
        'recommended_density_pct': recommendedDensityPct,
      if (stockingRecommendation != null)
        'stocking_recommendation': stockingRecommendation,
      if (syncStatus != null) 'sync_status': syncStatus,
      if (createdAt != null) 'created_at': createdAt,
    });
  }

  LocalGradingSessionsCompanion copyWith(
      {Value<int>? id,
      Value<int>? batchId,
      Value<double?>? compositeScore,
      Value<String?>? compositeGrade,
      Value<bool>? isHardFail,
      Value<String?>? detectedPlStage,
      Value<double?>? recommendedDensityPct,
      Value<String?>? stockingRecommendation,
      Value<String>? syncStatus,
      Value<DateTime>? createdAt}) {
    return LocalGradingSessionsCompanion(
      id: id ?? this.id,
      batchId: batchId ?? this.batchId,
      compositeScore: compositeScore ?? this.compositeScore,
      compositeGrade: compositeGrade ?? this.compositeGrade,
      isHardFail: isHardFail ?? this.isHardFail,
      detectedPlStage: detectedPlStage ?? this.detectedPlStage,
      recommendedDensityPct:
          recommendedDensityPct ?? this.recommendedDensityPct,
      stockingRecommendation:
          stockingRecommendation ?? this.stockingRecommendation,
      syncStatus: syncStatus ?? this.syncStatus,
      createdAt: createdAt ?? this.createdAt,
    );
  }

  @override
  Map<String, Expression> toColumns(bool nullToAbsent) {
    final map = <String, Expression>{};
    if (id.present) {
      map['id'] = Variable<int>(id.value);
    }
    if (batchId.present) {
      map['batch_id'] = Variable<int>(batchId.value);
    }
    if (compositeScore.present) {
      map['composite_score'] = Variable<double>(compositeScore.value);
    }
    if (compositeGrade.present) {
      map['composite_grade'] = Variable<String>(compositeGrade.value);
    }
    if (isHardFail.present) {
      map['is_hard_fail'] = Variable<bool>(isHardFail.value);
    }
    if (detectedPlStage.present) {
      map['detected_pl_stage'] = Variable<String>(detectedPlStage.value);
    }
    if (recommendedDensityPct.present) {
      map['recommended_density_pct'] =
          Variable<double>(recommendedDensityPct.value);
    }
    if (stockingRecommendation.present) {
      map['stocking_recommendation'] =
          Variable<String>(stockingRecommendation.value);
    }
    if (syncStatus.present) {
      map['sync_status'] = Variable<String>(syncStatus.value);
    }
    if (createdAt.present) {
      map['created_at'] = Variable<DateTime>(createdAt.value);
    }
    return map;
  }

  @override
  String toString() {
    return (StringBuffer('LocalGradingSessionsCompanion(')
          ..write('id: $id, ')
          ..write('batchId: $batchId, ')
          ..write('compositeScore: $compositeScore, ')
          ..write('compositeGrade: $compositeGrade, ')
          ..write('isHardFail: $isHardFail, ')
          ..write('detectedPlStage: $detectedPlStage, ')
          ..write('recommendedDensityPct: $recommendedDensityPct, ')
          ..write('stockingRecommendation: $stockingRecommendation, ')
          ..write('syncStatus: $syncStatus, ')
          ..write('createdAt: $createdAt')
          ..write(')'))
        .toString();
  }
}

abstract class _$LocalDatabase extends GeneratedDatabase {
  _$LocalDatabase(QueryExecutor e) : super(e);
  $LocalDatabaseManager get managers => $LocalDatabaseManager(this);
  late final $LocalCountingSessionsTable localCountingSessions =
      $LocalCountingSessionsTable(this);
  late final $LocalDiagnosisSessionsTable localDiagnosisSessions =
      $LocalDiagnosisSessionsTable(this);
  late final $LocalGradingSessionsTable localGradingSessions =
      $LocalGradingSessionsTable(this);
  @override
  Iterable<TableInfo<Table, Object?>> get allTables =>
      allSchemaEntities.whereType<TableInfo<Table, Object?>>();
  @override
  List<DatabaseSchemaEntity> get allSchemaEntities =>
      [localCountingSessions, localDiagnosisSessions, localGradingSessions];
}

typedef $$LocalCountingSessionsTableCreateCompanionBuilder
    = LocalCountingSessionsCompanion Function({
  Value<int> id,
  required int batchId,
  Value<String> imagePaths,
  Value<int?> liveCount,
  Value<int?> deadCount,
  Value<int?> totalCount,
  Value<double?> mortalityPct,
  Value<String?> mortalityAlert,
  Value<double?> cvPct,
  Value<String?> cvFlag,
  Value<int?> confidenceInterval,
  Value<double?> sampleVolumeMl,
  Value<double?> totalVolumeMl,
  Value<int?> extrapolatedCount,
  Value<String> syncStatus,
  Value<DateTime> createdAt,
});
typedef $$LocalCountingSessionsTableUpdateCompanionBuilder
    = LocalCountingSessionsCompanion Function({
  Value<int> id,
  Value<int> batchId,
  Value<String> imagePaths,
  Value<int?> liveCount,
  Value<int?> deadCount,
  Value<int?> totalCount,
  Value<double?> mortalityPct,
  Value<String?> mortalityAlert,
  Value<double?> cvPct,
  Value<String?> cvFlag,
  Value<int?> confidenceInterval,
  Value<double?> sampleVolumeMl,
  Value<double?> totalVolumeMl,
  Value<int?> extrapolatedCount,
  Value<String> syncStatus,
  Value<DateTime> createdAt,
});

class $$LocalCountingSessionsTableFilterComposer
    extends Composer<_$LocalDatabase, $LocalCountingSessionsTable> {
  $$LocalCountingSessionsTableFilterComposer({
    required super.$db,
    required super.$table,
    super.joinBuilder,
    super.$addJoinBuilderToRootComposer,
    super.$removeJoinBuilderFromRootComposer,
  });
  ColumnFilters<int> get id => $composableBuilder(
      column: $table.id, builder: (column) => ColumnFilters(column));

  ColumnFilters<int> get batchId => $composableBuilder(
      column: $table.batchId, builder: (column) => ColumnFilters(column));

  ColumnFilters<String> get imagePaths => $composableBuilder(
      column: $table.imagePaths, builder: (column) => ColumnFilters(column));

  ColumnFilters<int> get liveCount => $composableBuilder(
      column: $table.liveCount, builder: (column) => ColumnFilters(column));

  ColumnFilters<int> get deadCount => $composableBuilder(
      column: $table.deadCount, builder: (column) => ColumnFilters(column));

  ColumnFilters<int> get totalCount => $composableBuilder(
      column: $table.totalCount, builder: (column) => ColumnFilters(column));

  ColumnFilters<double> get mortalityPct => $composableBuilder(
      column: $table.mortalityPct, builder: (column) => ColumnFilters(column));

  ColumnFilters<String> get mortalityAlert => $composableBuilder(
      column: $table.mortalityAlert,
      builder: (column) => ColumnFilters(column));

  ColumnFilters<double> get cvPct => $composableBuilder(
      column: $table.cvPct, builder: (column) => ColumnFilters(column));

  ColumnFilters<String> get cvFlag => $composableBuilder(
      column: $table.cvFlag, builder: (column) => ColumnFilters(column));

  ColumnFilters<int> get confidenceInterval => $composableBuilder(
      column: $table.confidenceInterval,
      builder: (column) => ColumnFilters(column));

  ColumnFilters<double> get sampleVolumeMl => $composableBuilder(
      column: $table.sampleVolumeMl,
      builder: (column) => ColumnFilters(column));

  ColumnFilters<double> get totalVolumeMl => $composableBuilder(
      column: $table.totalVolumeMl, builder: (column) => ColumnFilters(column));

  ColumnFilters<int> get extrapolatedCount => $composableBuilder(
      column: $table.extrapolatedCount,
      builder: (column) => ColumnFilters(column));

  ColumnFilters<String> get syncStatus => $composableBuilder(
      column: $table.syncStatus, builder: (column) => ColumnFilters(column));

  ColumnFilters<DateTime> get createdAt => $composableBuilder(
      column: $table.createdAt, builder: (column) => ColumnFilters(column));
}

class $$LocalCountingSessionsTableOrderingComposer
    extends Composer<_$LocalDatabase, $LocalCountingSessionsTable> {
  $$LocalCountingSessionsTableOrderingComposer({
    required super.$db,
    required super.$table,
    super.joinBuilder,
    super.$addJoinBuilderToRootComposer,
    super.$removeJoinBuilderFromRootComposer,
  });
  ColumnOrderings<int> get id => $composableBuilder(
      column: $table.id, builder: (column) => ColumnOrderings(column));

  ColumnOrderings<int> get batchId => $composableBuilder(
      column: $table.batchId, builder: (column) => ColumnOrderings(column));

  ColumnOrderings<String> get imagePaths => $composableBuilder(
      column: $table.imagePaths, builder: (column) => ColumnOrderings(column));

  ColumnOrderings<int> get liveCount => $composableBuilder(
      column: $table.liveCount, builder: (column) => ColumnOrderings(column));

  ColumnOrderings<int> get deadCount => $composableBuilder(
      column: $table.deadCount, builder: (column) => ColumnOrderings(column));

  ColumnOrderings<int> get totalCount => $composableBuilder(
      column: $table.totalCount, builder: (column) => ColumnOrderings(column));

  ColumnOrderings<double> get mortalityPct => $composableBuilder(
      column: $table.mortalityPct,
      builder: (column) => ColumnOrderings(column));

  ColumnOrderings<String> get mortalityAlert => $composableBuilder(
      column: $table.mortalityAlert,
      builder: (column) => ColumnOrderings(column));

  ColumnOrderings<double> get cvPct => $composableBuilder(
      column: $table.cvPct, builder: (column) => ColumnOrderings(column));

  ColumnOrderings<String> get cvFlag => $composableBuilder(
      column: $table.cvFlag, builder: (column) => ColumnOrderings(column));

  ColumnOrderings<int> get confidenceInterval => $composableBuilder(
      column: $table.confidenceInterval,
      builder: (column) => ColumnOrderings(column));

  ColumnOrderings<double> get sampleVolumeMl => $composableBuilder(
      column: $table.sampleVolumeMl,
      builder: (column) => ColumnOrderings(column));

  ColumnOrderings<double> get totalVolumeMl => $composableBuilder(
      column: $table.totalVolumeMl,
      builder: (column) => ColumnOrderings(column));

  ColumnOrderings<int> get extrapolatedCount => $composableBuilder(
      column: $table.extrapolatedCount,
      builder: (column) => ColumnOrderings(column));

  ColumnOrderings<String> get syncStatus => $composableBuilder(
      column: $table.syncStatus, builder: (column) => ColumnOrderings(column));

  ColumnOrderings<DateTime> get createdAt => $composableBuilder(
      column: $table.createdAt, builder: (column) => ColumnOrderings(column));
}

class $$LocalCountingSessionsTableAnnotationComposer
    extends Composer<_$LocalDatabase, $LocalCountingSessionsTable> {
  $$LocalCountingSessionsTableAnnotationComposer({
    required super.$db,
    required super.$table,
    super.joinBuilder,
    super.$addJoinBuilderToRootComposer,
    super.$removeJoinBuilderFromRootComposer,
  });
  GeneratedColumn<int> get id =>
      $composableBuilder(column: $table.id, builder: (column) => column);

  GeneratedColumn<int> get batchId =>
      $composableBuilder(column: $table.batchId, builder: (column) => column);

  GeneratedColumn<String> get imagePaths => $composableBuilder(
      column: $table.imagePaths, builder: (column) => column);

  GeneratedColumn<int> get liveCount =>
      $composableBuilder(column: $table.liveCount, builder: (column) => column);

  GeneratedColumn<int> get deadCount =>
      $composableBuilder(column: $table.deadCount, builder: (column) => column);

  GeneratedColumn<int> get totalCount => $composableBuilder(
      column: $table.totalCount, builder: (column) => column);

  GeneratedColumn<double> get mortalityPct => $composableBuilder(
      column: $table.mortalityPct, builder: (column) => column);

  GeneratedColumn<String> get mortalityAlert => $composableBuilder(
      column: $table.mortalityAlert, builder: (column) => column);

  GeneratedColumn<double> get cvPct =>
      $composableBuilder(column: $table.cvPct, builder: (column) => column);

  GeneratedColumn<String> get cvFlag =>
      $composableBuilder(column: $table.cvFlag, builder: (column) => column);

  GeneratedColumn<int> get confidenceInterval => $composableBuilder(
      column: $table.confidenceInterval, builder: (column) => column);

  GeneratedColumn<double> get sampleVolumeMl => $composableBuilder(
      column: $table.sampleVolumeMl, builder: (column) => column);

  GeneratedColumn<double> get totalVolumeMl => $composableBuilder(
      column: $table.totalVolumeMl, builder: (column) => column);

  GeneratedColumn<int> get extrapolatedCount => $composableBuilder(
      column: $table.extrapolatedCount, builder: (column) => column);

  GeneratedColumn<String> get syncStatus => $composableBuilder(
      column: $table.syncStatus, builder: (column) => column);

  GeneratedColumn<DateTime> get createdAt =>
      $composableBuilder(column: $table.createdAt, builder: (column) => column);
}

class $$LocalCountingSessionsTableTableManager extends RootTableManager<
    _$LocalDatabase,
    $LocalCountingSessionsTable,
    LocalCountingSession,
    $$LocalCountingSessionsTableFilterComposer,
    $$LocalCountingSessionsTableOrderingComposer,
    $$LocalCountingSessionsTableAnnotationComposer,
    $$LocalCountingSessionsTableCreateCompanionBuilder,
    $$LocalCountingSessionsTableUpdateCompanionBuilder,
    (
      LocalCountingSession,
      BaseReferences<_$LocalDatabase, $LocalCountingSessionsTable,
          LocalCountingSession>
    ),
    LocalCountingSession,
    PrefetchHooks Function()> {
  $$LocalCountingSessionsTableTableManager(
      _$LocalDatabase db, $LocalCountingSessionsTable table)
      : super(TableManagerState(
          db: db,
          table: table,
          createFilteringComposer: () =>
              $$LocalCountingSessionsTableFilterComposer(
                  $db: db, $table: table),
          createOrderingComposer: () =>
              $$LocalCountingSessionsTableOrderingComposer(
                  $db: db, $table: table),
          createComputedFieldComposer: () =>
              $$LocalCountingSessionsTableAnnotationComposer(
                  $db: db, $table: table),
          updateCompanionCallback: ({
            Value<int> id = const Value.absent(),
            Value<int> batchId = const Value.absent(),
            Value<String> imagePaths = const Value.absent(),
            Value<int?> liveCount = const Value.absent(),
            Value<int?> deadCount = const Value.absent(),
            Value<int?> totalCount = const Value.absent(),
            Value<double?> mortalityPct = const Value.absent(),
            Value<String?> mortalityAlert = const Value.absent(),
            Value<double?> cvPct = const Value.absent(),
            Value<String?> cvFlag = const Value.absent(),
            Value<int?> confidenceInterval = const Value.absent(),
            Value<double?> sampleVolumeMl = const Value.absent(),
            Value<double?> totalVolumeMl = const Value.absent(),
            Value<int?> extrapolatedCount = const Value.absent(),
            Value<String> syncStatus = const Value.absent(),
            Value<DateTime> createdAt = const Value.absent(),
          }) =>
              LocalCountingSessionsCompanion(
            id: id,
            batchId: batchId,
            imagePaths: imagePaths,
            liveCount: liveCount,
            deadCount: deadCount,
            totalCount: totalCount,
            mortalityPct: mortalityPct,
            mortalityAlert: mortalityAlert,
            cvPct: cvPct,
            cvFlag: cvFlag,
            confidenceInterval: confidenceInterval,
            sampleVolumeMl: sampleVolumeMl,
            totalVolumeMl: totalVolumeMl,
            extrapolatedCount: extrapolatedCount,
            syncStatus: syncStatus,
            createdAt: createdAt,
          ),
          createCompanionCallback: ({
            Value<int> id = const Value.absent(),
            required int batchId,
            Value<String> imagePaths = const Value.absent(),
            Value<int?> liveCount = const Value.absent(),
            Value<int?> deadCount = const Value.absent(),
            Value<int?> totalCount = const Value.absent(),
            Value<double?> mortalityPct = const Value.absent(),
            Value<String?> mortalityAlert = const Value.absent(),
            Value<double?> cvPct = const Value.absent(),
            Value<String?> cvFlag = const Value.absent(),
            Value<int?> confidenceInterval = const Value.absent(),
            Value<double?> sampleVolumeMl = const Value.absent(),
            Value<double?> totalVolumeMl = const Value.absent(),
            Value<int?> extrapolatedCount = const Value.absent(),
            Value<String> syncStatus = const Value.absent(),
            Value<DateTime> createdAt = const Value.absent(),
          }) =>
              LocalCountingSessionsCompanion.insert(
            id: id,
            batchId: batchId,
            imagePaths: imagePaths,
            liveCount: liveCount,
            deadCount: deadCount,
            totalCount: totalCount,
            mortalityPct: mortalityPct,
            mortalityAlert: mortalityAlert,
            cvPct: cvPct,
            cvFlag: cvFlag,
            confidenceInterval: confidenceInterval,
            sampleVolumeMl: sampleVolumeMl,
            totalVolumeMl: totalVolumeMl,
            extrapolatedCount: extrapolatedCount,
            syncStatus: syncStatus,
            createdAt: createdAt,
          ),
          withReferenceMapper: (p0) => p0
              .map((e) => (e.readTable(table), BaseReferences(db, table, e)))
              .toList(),
          prefetchHooksCallback: null,
        ));
}

typedef $$LocalCountingSessionsTableProcessedTableManager
    = ProcessedTableManager<
        _$LocalDatabase,
        $LocalCountingSessionsTable,
        LocalCountingSession,
        $$LocalCountingSessionsTableFilterComposer,
        $$LocalCountingSessionsTableOrderingComposer,
        $$LocalCountingSessionsTableAnnotationComposer,
        $$LocalCountingSessionsTableCreateCompanionBuilder,
        $$LocalCountingSessionsTableUpdateCompanionBuilder,
        (
          LocalCountingSession,
          BaseReferences<_$LocalDatabase, $LocalCountingSessionsTable,
              LocalCountingSession>
        ),
        LocalCountingSession,
        PrefetchHooks Function()>;
typedef $$LocalDiagnosisSessionsTableCreateCompanionBuilder
    = LocalDiagnosisSessionsCompanion Function({
  Value<int> id,
  required int batchId,
  Value<double?> ehpProb,
  Value<double?> ehpPositiveProb,
  Value<bool> wssVPositive,
  Value<bool> isHardFail,
  Value<String?> hardFailDisease,
  Value<String?> riskLevel,
  Value<String?> riskActionText,
  Value<String> syncStatus,
  Value<DateTime> createdAt,
});
typedef $$LocalDiagnosisSessionsTableUpdateCompanionBuilder
    = LocalDiagnosisSessionsCompanion Function({
  Value<int> id,
  Value<int> batchId,
  Value<double?> ehpProb,
  Value<double?> ehpPositiveProb,
  Value<bool> wssVPositive,
  Value<bool> isHardFail,
  Value<String?> hardFailDisease,
  Value<String?> riskLevel,
  Value<String?> riskActionText,
  Value<String> syncStatus,
  Value<DateTime> createdAt,
});

class $$LocalDiagnosisSessionsTableFilterComposer
    extends Composer<_$LocalDatabase, $LocalDiagnosisSessionsTable> {
  $$LocalDiagnosisSessionsTableFilterComposer({
    required super.$db,
    required super.$table,
    super.joinBuilder,
    super.$addJoinBuilderToRootComposer,
    super.$removeJoinBuilderFromRootComposer,
  });
  ColumnFilters<int> get id => $composableBuilder(
      column: $table.id, builder: (column) => ColumnFilters(column));

  ColumnFilters<int> get batchId => $composableBuilder(
      column: $table.batchId, builder: (column) => ColumnFilters(column));

  ColumnFilters<double> get ehpProb => $composableBuilder(
      column: $table.ehpProb, builder: (column) => ColumnFilters(column));

  ColumnFilters<double> get ehpPositiveProb => $composableBuilder(
      column: $table.ehpPositiveProb,
      builder: (column) => ColumnFilters(column));

  ColumnFilters<bool> get wssVPositive => $composableBuilder(
      column: $table.wssVPositive, builder: (column) => ColumnFilters(column));

  ColumnFilters<bool> get isHardFail => $composableBuilder(
      column: $table.isHardFail, builder: (column) => ColumnFilters(column));

  ColumnFilters<String> get hardFailDisease => $composableBuilder(
      column: $table.hardFailDisease,
      builder: (column) => ColumnFilters(column));

  ColumnFilters<String> get riskLevel => $composableBuilder(
      column: $table.riskLevel, builder: (column) => ColumnFilters(column));

  ColumnFilters<String> get riskActionText => $composableBuilder(
      column: $table.riskActionText,
      builder: (column) => ColumnFilters(column));

  ColumnFilters<String> get syncStatus => $composableBuilder(
      column: $table.syncStatus, builder: (column) => ColumnFilters(column));

  ColumnFilters<DateTime> get createdAt => $composableBuilder(
      column: $table.createdAt, builder: (column) => ColumnFilters(column));
}

class $$LocalDiagnosisSessionsTableOrderingComposer
    extends Composer<_$LocalDatabase, $LocalDiagnosisSessionsTable> {
  $$LocalDiagnosisSessionsTableOrderingComposer({
    required super.$db,
    required super.$table,
    super.joinBuilder,
    super.$addJoinBuilderToRootComposer,
    super.$removeJoinBuilderFromRootComposer,
  });
  ColumnOrderings<int> get id => $composableBuilder(
      column: $table.id, builder: (column) => ColumnOrderings(column));

  ColumnOrderings<int> get batchId => $composableBuilder(
      column: $table.batchId, builder: (column) => ColumnOrderings(column));

  ColumnOrderings<double> get ehpProb => $composableBuilder(
      column: $table.ehpProb, builder: (column) => ColumnOrderings(column));

  ColumnOrderings<double> get ehpPositiveProb => $composableBuilder(
      column: $table.ehpPositiveProb,
      builder: (column) => ColumnOrderings(column));

  ColumnOrderings<bool> get wssVPositive => $composableBuilder(
      column: $table.wssVPositive,
      builder: (column) => ColumnOrderings(column));

  ColumnOrderings<bool> get isHardFail => $composableBuilder(
      column: $table.isHardFail, builder: (column) => ColumnOrderings(column));

  ColumnOrderings<String> get hardFailDisease => $composableBuilder(
      column: $table.hardFailDisease,
      builder: (column) => ColumnOrderings(column));

  ColumnOrderings<String> get riskLevel => $composableBuilder(
      column: $table.riskLevel, builder: (column) => ColumnOrderings(column));

  ColumnOrderings<String> get riskActionText => $composableBuilder(
      column: $table.riskActionText,
      builder: (column) => ColumnOrderings(column));

  ColumnOrderings<String> get syncStatus => $composableBuilder(
      column: $table.syncStatus, builder: (column) => ColumnOrderings(column));

  ColumnOrderings<DateTime> get createdAt => $composableBuilder(
      column: $table.createdAt, builder: (column) => ColumnOrderings(column));
}

class $$LocalDiagnosisSessionsTableAnnotationComposer
    extends Composer<_$LocalDatabase, $LocalDiagnosisSessionsTable> {
  $$LocalDiagnosisSessionsTableAnnotationComposer({
    required super.$db,
    required super.$table,
    super.joinBuilder,
    super.$addJoinBuilderToRootComposer,
    super.$removeJoinBuilderFromRootComposer,
  });
  GeneratedColumn<int> get id =>
      $composableBuilder(column: $table.id, builder: (column) => column);

  GeneratedColumn<int> get batchId =>
      $composableBuilder(column: $table.batchId, builder: (column) => column);

  GeneratedColumn<double> get ehpProb =>
      $composableBuilder(column: $table.ehpProb, builder: (column) => column);

  GeneratedColumn<double> get ehpPositiveProb => $composableBuilder(
      column: $table.ehpPositiveProb, builder: (column) => column);

  GeneratedColumn<bool> get wssVPositive => $composableBuilder(
      column: $table.wssVPositive, builder: (column) => column);

  GeneratedColumn<bool> get isHardFail => $composableBuilder(
      column: $table.isHardFail, builder: (column) => column);

  GeneratedColumn<String> get hardFailDisease => $composableBuilder(
      column: $table.hardFailDisease, builder: (column) => column);

  GeneratedColumn<String> get riskLevel =>
      $composableBuilder(column: $table.riskLevel, builder: (column) => column);

  GeneratedColumn<String> get riskActionText => $composableBuilder(
      column: $table.riskActionText, builder: (column) => column);

  GeneratedColumn<String> get syncStatus => $composableBuilder(
      column: $table.syncStatus, builder: (column) => column);

  GeneratedColumn<DateTime> get createdAt =>
      $composableBuilder(column: $table.createdAt, builder: (column) => column);
}

class $$LocalDiagnosisSessionsTableTableManager extends RootTableManager<
    _$LocalDatabase,
    $LocalDiagnosisSessionsTable,
    LocalDiagnosisSession,
    $$LocalDiagnosisSessionsTableFilterComposer,
    $$LocalDiagnosisSessionsTableOrderingComposer,
    $$LocalDiagnosisSessionsTableAnnotationComposer,
    $$LocalDiagnosisSessionsTableCreateCompanionBuilder,
    $$LocalDiagnosisSessionsTableUpdateCompanionBuilder,
    (
      LocalDiagnosisSession,
      BaseReferences<_$LocalDatabase, $LocalDiagnosisSessionsTable,
          LocalDiagnosisSession>
    ),
    LocalDiagnosisSession,
    PrefetchHooks Function()> {
  $$LocalDiagnosisSessionsTableTableManager(
      _$LocalDatabase db, $LocalDiagnosisSessionsTable table)
      : super(TableManagerState(
          db: db,
          table: table,
          createFilteringComposer: () =>
              $$LocalDiagnosisSessionsTableFilterComposer(
                  $db: db, $table: table),
          createOrderingComposer: () =>
              $$LocalDiagnosisSessionsTableOrderingComposer(
                  $db: db, $table: table),
          createComputedFieldComposer: () =>
              $$LocalDiagnosisSessionsTableAnnotationComposer(
                  $db: db, $table: table),
          updateCompanionCallback: ({
            Value<int> id = const Value.absent(),
            Value<int> batchId = const Value.absent(),
            Value<double?> ehpProb = const Value.absent(),
            Value<double?> ehpPositiveProb = const Value.absent(),
            Value<bool> wssVPositive = const Value.absent(),
            Value<bool> isHardFail = const Value.absent(),
            Value<String?> hardFailDisease = const Value.absent(),
            Value<String?> riskLevel = const Value.absent(),
            Value<String?> riskActionText = const Value.absent(),
            Value<String> syncStatus = const Value.absent(),
            Value<DateTime> createdAt = const Value.absent(),
          }) =>
              LocalDiagnosisSessionsCompanion(
            id: id,
            batchId: batchId,
            ehpProb: ehpProb,
            ehpPositiveProb: ehpPositiveProb,
            wssVPositive: wssVPositive,
            isHardFail: isHardFail,
            hardFailDisease: hardFailDisease,
            riskLevel: riskLevel,
            riskActionText: riskActionText,
            syncStatus: syncStatus,
            createdAt: createdAt,
          ),
          createCompanionCallback: ({
            Value<int> id = const Value.absent(),
            required int batchId,
            Value<double?> ehpProb = const Value.absent(),
            Value<double?> ehpPositiveProb = const Value.absent(),
            Value<bool> wssVPositive = const Value.absent(),
            Value<bool> isHardFail = const Value.absent(),
            Value<String?> hardFailDisease = const Value.absent(),
            Value<String?> riskLevel = const Value.absent(),
            Value<String?> riskActionText = const Value.absent(),
            Value<String> syncStatus = const Value.absent(),
            Value<DateTime> createdAt = const Value.absent(),
          }) =>
              LocalDiagnosisSessionsCompanion.insert(
            id: id,
            batchId: batchId,
            ehpProb: ehpProb,
            ehpPositiveProb: ehpPositiveProb,
            wssVPositive: wssVPositive,
            isHardFail: isHardFail,
            hardFailDisease: hardFailDisease,
            riskLevel: riskLevel,
            riskActionText: riskActionText,
            syncStatus: syncStatus,
            createdAt: createdAt,
          ),
          withReferenceMapper: (p0) => p0
              .map((e) => (e.readTable(table), BaseReferences(db, table, e)))
              .toList(),
          prefetchHooksCallback: null,
        ));
}

typedef $$LocalDiagnosisSessionsTableProcessedTableManager
    = ProcessedTableManager<
        _$LocalDatabase,
        $LocalDiagnosisSessionsTable,
        LocalDiagnosisSession,
        $$LocalDiagnosisSessionsTableFilterComposer,
        $$LocalDiagnosisSessionsTableOrderingComposer,
        $$LocalDiagnosisSessionsTableAnnotationComposer,
        $$LocalDiagnosisSessionsTableCreateCompanionBuilder,
        $$LocalDiagnosisSessionsTableUpdateCompanionBuilder,
        (
          LocalDiagnosisSession,
          BaseReferences<_$LocalDatabase, $LocalDiagnosisSessionsTable,
              LocalDiagnosisSession>
        ),
        LocalDiagnosisSession,
        PrefetchHooks Function()>;
typedef $$LocalGradingSessionsTableCreateCompanionBuilder
    = LocalGradingSessionsCompanion Function({
  Value<int> id,
  required int batchId,
  Value<double?> compositeScore,
  Value<String?> compositeGrade,
  Value<bool> isHardFail,
  Value<String?> detectedPlStage,
  Value<double?> recommendedDensityPct,
  Value<String?> stockingRecommendation,
  Value<String> syncStatus,
  Value<DateTime> createdAt,
});
typedef $$LocalGradingSessionsTableUpdateCompanionBuilder
    = LocalGradingSessionsCompanion Function({
  Value<int> id,
  Value<int> batchId,
  Value<double?> compositeScore,
  Value<String?> compositeGrade,
  Value<bool> isHardFail,
  Value<String?> detectedPlStage,
  Value<double?> recommendedDensityPct,
  Value<String?> stockingRecommendation,
  Value<String> syncStatus,
  Value<DateTime> createdAt,
});

class $$LocalGradingSessionsTableFilterComposer
    extends Composer<_$LocalDatabase, $LocalGradingSessionsTable> {
  $$LocalGradingSessionsTableFilterComposer({
    required super.$db,
    required super.$table,
    super.joinBuilder,
    super.$addJoinBuilderToRootComposer,
    super.$removeJoinBuilderFromRootComposer,
  });
  ColumnFilters<int> get id => $composableBuilder(
      column: $table.id, builder: (column) => ColumnFilters(column));

  ColumnFilters<int> get batchId => $composableBuilder(
      column: $table.batchId, builder: (column) => ColumnFilters(column));

  ColumnFilters<double> get compositeScore => $composableBuilder(
      column: $table.compositeScore,
      builder: (column) => ColumnFilters(column));

  ColumnFilters<String> get compositeGrade => $composableBuilder(
      column: $table.compositeGrade,
      builder: (column) => ColumnFilters(column));

  ColumnFilters<bool> get isHardFail => $composableBuilder(
      column: $table.isHardFail, builder: (column) => ColumnFilters(column));

  ColumnFilters<String> get detectedPlStage => $composableBuilder(
      column: $table.detectedPlStage,
      builder: (column) => ColumnFilters(column));

  ColumnFilters<double> get recommendedDensityPct => $composableBuilder(
      column: $table.recommendedDensityPct,
      builder: (column) => ColumnFilters(column));

  ColumnFilters<String> get stockingRecommendation => $composableBuilder(
      column: $table.stockingRecommendation,
      builder: (column) => ColumnFilters(column));

  ColumnFilters<String> get syncStatus => $composableBuilder(
      column: $table.syncStatus, builder: (column) => ColumnFilters(column));

  ColumnFilters<DateTime> get createdAt => $composableBuilder(
      column: $table.createdAt, builder: (column) => ColumnFilters(column));
}

class $$LocalGradingSessionsTableOrderingComposer
    extends Composer<_$LocalDatabase, $LocalGradingSessionsTable> {
  $$LocalGradingSessionsTableOrderingComposer({
    required super.$db,
    required super.$table,
    super.joinBuilder,
    super.$addJoinBuilderToRootComposer,
    super.$removeJoinBuilderFromRootComposer,
  });
  ColumnOrderings<int> get id => $composableBuilder(
      column: $table.id, builder: (column) => ColumnOrderings(column));

  ColumnOrderings<int> get batchId => $composableBuilder(
      column: $table.batchId, builder: (column) => ColumnOrderings(column));

  ColumnOrderings<double> get compositeScore => $composableBuilder(
      column: $table.compositeScore,
      builder: (column) => ColumnOrderings(column));

  ColumnOrderings<String> get compositeGrade => $composableBuilder(
      column: $table.compositeGrade,
      builder: (column) => ColumnOrderings(column));

  ColumnOrderings<bool> get isHardFail => $composableBuilder(
      column: $table.isHardFail, builder: (column) => ColumnOrderings(column));

  ColumnOrderings<String> get detectedPlStage => $composableBuilder(
      column: $table.detectedPlStage,
      builder: (column) => ColumnOrderings(column));

  ColumnOrderings<double> get recommendedDensityPct => $composableBuilder(
      column: $table.recommendedDensityPct,
      builder: (column) => ColumnOrderings(column));

  ColumnOrderings<String> get stockingRecommendation => $composableBuilder(
      column: $table.stockingRecommendation,
      builder: (column) => ColumnOrderings(column));

  ColumnOrderings<String> get syncStatus => $composableBuilder(
      column: $table.syncStatus, builder: (column) => ColumnOrderings(column));

  ColumnOrderings<DateTime> get createdAt => $composableBuilder(
      column: $table.createdAt, builder: (column) => ColumnOrderings(column));
}

class $$LocalGradingSessionsTableAnnotationComposer
    extends Composer<_$LocalDatabase, $LocalGradingSessionsTable> {
  $$LocalGradingSessionsTableAnnotationComposer({
    required super.$db,
    required super.$table,
    super.joinBuilder,
    super.$addJoinBuilderToRootComposer,
    super.$removeJoinBuilderFromRootComposer,
  });
  GeneratedColumn<int> get id =>
      $composableBuilder(column: $table.id, builder: (column) => column);

  GeneratedColumn<int> get batchId =>
      $composableBuilder(column: $table.batchId, builder: (column) => column);

  GeneratedColumn<double> get compositeScore => $composableBuilder(
      column: $table.compositeScore, builder: (column) => column);

  GeneratedColumn<String> get compositeGrade => $composableBuilder(
      column: $table.compositeGrade, builder: (column) => column);

  GeneratedColumn<bool> get isHardFail => $composableBuilder(
      column: $table.isHardFail, builder: (column) => column);

  GeneratedColumn<String> get detectedPlStage => $composableBuilder(
      column: $table.detectedPlStage, builder: (column) => column);

  GeneratedColumn<double> get recommendedDensityPct => $composableBuilder(
      column: $table.recommendedDensityPct, builder: (column) => column);

  GeneratedColumn<String> get stockingRecommendation => $composableBuilder(
      column: $table.stockingRecommendation, builder: (column) => column);

  GeneratedColumn<String> get syncStatus => $composableBuilder(
      column: $table.syncStatus, builder: (column) => column);

  GeneratedColumn<DateTime> get createdAt =>
      $composableBuilder(column: $table.createdAt, builder: (column) => column);
}

class $$LocalGradingSessionsTableTableManager extends RootTableManager<
    _$LocalDatabase,
    $LocalGradingSessionsTable,
    LocalGradingSession,
    $$LocalGradingSessionsTableFilterComposer,
    $$LocalGradingSessionsTableOrderingComposer,
    $$LocalGradingSessionsTableAnnotationComposer,
    $$LocalGradingSessionsTableCreateCompanionBuilder,
    $$LocalGradingSessionsTableUpdateCompanionBuilder,
    (
      LocalGradingSession,
      BaseReferences<_$LocalDatabase, $LocalGradingSessionsTable,
          LocalGradingSession>
    ),
    LocalGradingSession,
    PrefetchHooks Function()> {
  $$LocalGradingSessionsTableTableManager(
      _$LocalDatabase db, $LocalGradingSessionsTable table)
      : super(TableManagerState(
          db: db,
          table: table,
          createFilteringComposer: () =>
              $$LocalGradingSessionsTableFilterComposer($db: db, $table: table),
          createOrderingComposer: () =>
              $$LocalGradingSessionsTableOrderingComposer(
                  $db: db, $table: table),
          createComputedFieldComposer: () =>
              $$LocalGradingSessionsTableAnnotationComposer(
                  $db: db, $table: table),
          updateCompanionCallback: ({
            Value<int> id = const Value.absent(),
            Value<int> batchId = const Value.absent(),
            Value<double?> compositeScore = const Value.absent(),
            Value<String?> compositeGrade = const Value.absent(),
            Value<bool> isHardFail = const Value.absent(),
            Value<String?> detectedPlStage = const Value.absent(),
            Value<double?> recommendedDensityPct = const Value.absent(),
            Value<String?> stockingRecommendation = const Value.absent(),
            Value<String> syncStatus = const Value.absent(),
            Value<DateTime> createdAt = const Value.absent(),
          }) =>
              LocalGradingSessionsCompanion(
            id: id,
            batchId: batchId,
            compositeScore: compositeScore,
            compositeGrade: compositeGrade,
            isHardFail: isHardFail,
            detectedPlStage: detectedPlStage,
            recommendedDensityPct: recommendedDensityPct,
            stockingRecommendation: stockingRecommendation,
            syncStatus: syncStatus,
            createdAt: createdAt,
          ),
          createCompanionCallback: ({
            Value<int> id = const Value.absent(),
            required int batchId,
            Value<double?> compositeScore = const Value.absent(),
            Value<String?> compositeGrade = const Value.absent(),
            Value<bool> isHardFail = const Value.absent(),
            Value<String?> detectedPlStage = const Value.absent(),
            Value<double?> recommendedDensityPct = const Value.absent(),
            Value<String?> stockingRecommendation = const Value.absent(),
            Value<String> syncStatus = const Value.absent(),
            Value<DateTime> createdAt = const Value.absent(),
          }) =>
              LocalGradingSessionsCompanion.insert(
            id: id,
            batchId: batchId,
            compositeScore: compositeScore,
            compositeGrade: compositeGrade,
            isHardFail: isHardFail,
            detectedPlStage: detectedPlStage,
            recommendedDensityPct: recommendedDensityPct,
            stockingRecommendation: stockingRecommendation,
            syncStatus: syncStatus,
            createdAt: createdAt,
          ),
          withReferenceMapper: (p0) => p0
              .map((e) => (e.readTable(table), BaseReferences(db, table, e)))
              .toList(),
          prefetchHooksCallback: null,
        ));
}

typedef $$LocalGradingSessionsTableProcessedTableManager
    = ProcessedTableManager<
        _$LocalDatabase,
        $LocalGradingSessionsTable,
        LocalGradingSession,
        $$LocalGradingSessionsTableFilterComposer,
        $$LocalGradingSessionsTableOrderingComposer,
        $$LocalGradingSessionsTableAnnotationComposer,
        $$LocalGradingSessionsTableCreateCompanionBuilder,
        $$LocalGradingSessionsTableUpdateCompanionBuilder,
        (
          LocalGradingSession,
          BaseReferences<_$LocalDatabase, $LocalGradingSessionsTable,
              LocalGradingSession>
        ),
        LocalGradingSession,
        PrefetchHooks Function()>;

class $LocalDatabaseManager {
  final _$LocalDatabase _db;
  $LocalDatabaseManager(this._db);
  $$LocalCountingSessionsTableTableManager get localCountingSessions =>
      $$LocalCountingSessionsTableTableManager(_db, _db.localCountingSessions);
  $$LocalDiagnosisSessionsTableTableManager get localDiagnosisSessions =>
      $$LocalDiagnosisSessionsTableTableManager(
          _db, _db.localDiagnosisSessions);
  $$LocalGradingSessionsTableTableManager get localGradingSessions =>
      $$LocalGradingSessionsTableTableManager(_db, _db.localGradingSessions);
}

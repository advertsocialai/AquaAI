import 'package:flutter_test/flutter_test.dart';
import 'package:aquaai_mobile/services/ai_service.dart';
import 'package:aquaai_mobile/utils/constants.dart';

void main() {
  group('AIService result types', () {
    test('SeedCounterResult mortality alert thresholds', () {
      final green = SeedCounterResult(
        liveCount: 200, deadCount: 4, totalCount: 204,
        mortalityPct: 1.96, cvPct: 8, meanLengthMm: 10, stdLengthMm: 0.8,
        confidenceInterval: 7, boundingBoxes: [],
      );
      final yellow = SeedCounterResult(
        liveCount: 190, deadCount: 9, totalCount: 199,
        mortalityPct: 4.5, cvPct: 15, meanLengthMm: 10, stdLengthMm: 1.5,
        confidenceInterval: 7, boundingBoxes: [],
      );
      final red = SeedCounterResult(
        liveCount: 180, deadCount: 15, totalCount: 195,
        mortalityPct: 7.7, cvPct: 22, meanLengthMm: 10, stdLengthMm: 2.2,
        confidenceInterval: 7, boundingBoxes: [],
      );
      expect(green.mortalityAlert, 'green');
      expect(yellow.mortalityAlert, 'yellow');
      expect(red.mortalityAlert, 'red');
    });

    test('SeedCounterResult CV flag escalates past 25%', () {
      final r = SeedCounterResult(
        liveCount: 100, deadCount: 0, totalCount: 100,
        mortalityPct: 0, cvPct: 28, meanLengthMm: 10, stdLengthMm: 2.8,
        confidenceInterval: 4, boundingBoxes: [],
      );
      expect(r.cvFlag, 'red_escalate');
    });

    test('DiseaseResult hard-fails on WSSV positive', () {
      final r = DiseaseResult(
        ehpHealthyProb: 0.9, ehpSuspectedProb: 0.05, ehpPositiveProb: 0.05,
        wssVPositive: true, wssVConfidence: 0.95, ahpndProb: 0.02,
        sporeDetected: false, sporeCount: 0, sporeBoxes: [],
      );
      expect(r.isHardFail, true);
      expect(r.hardFailDisease, 'WSSV');
      expect(r.riskLevel, 'red');
    });

    test('DiseaseResult risk grades on EHP probability', () {
      final yellow = DiseaseResult(
        ehpHealthyProb: 0.4, ehpSuspectedProb: 0.05, ehpPositiveProb: 0.55,
        wssVPositive: false, wssVConfidence: 0.02, ahpndProb: 0.02,
        sporeDetected: false, sporeCount: 0, sporeBoxes: [],
      );
      final grey = DiseaseResult(
        ehpHealthyProb: 0.7, ehpSuspectedProb: 0.05, ehpPositiveProb: 0.25,
        wssVPositive: false, wssVConfidence: 0.02, ahpndProb: 0.02,
        sporeDetected: false, sporeCount: 0, sporeBoxes: [],
      );
      expect(yellow.riskLevel, 'yellow');
      expect(grey.riskLevel, 'grey');
    });
  });

  group('AppInfo / AppColors', () {
    test('app name and primary colour are set', () {
      expect(AppInfo.appName.isNotEmpty, true);
      expect(AppColors.primary, isNonZero);
    });
  });
}

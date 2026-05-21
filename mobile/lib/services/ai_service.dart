/// On-device TFLite AI inference service.
/// Place model files in assets/models/*.tflite
/// This service runs all 4 AI models entirely offline.
import 'dart:io';
import 'dart:typed_data';
import 'package:image/image.dart' as img;
import '../utils/constants.dart';

/// Stub implementation — replace body with tflite_flutter calls when model files are added.
/// Each method signature matches what the real model would return.
class AIService {
  static final AIService _instance = AIService._internal();
  factory AIService() => _instance;
  AIService._internal();

  bool _modelsLoaded = false;

  Future<void> loadModels() async {
    // TODO: load tflite models from assets
    // final interpreter = await Interpreter.fromAsset(ApiConfig.seedCounterModel);
    _modelsLoaded = true;
  }

  /// F01-F04: Seed Counter — YOLOv8 Nano
  /// Returns live count, dead count, bounding boxes, CV analysis
  Future<SeedCounterResult> runSeedCounter(List<File> images, int ledBrightness) async {
    await Future.delayed(const Duration(milliseconds: 500)); // simulate inference

    // Stub: realistic mock result
    final liveCount = 180 + (images.length * 20);
    final deadCount = 5 + images.length;
    final total = liveCount + deadCount;
    final mortalityPct = (deadCount / total) * 100;
    final cvPct = 12.5 + (images.length * 0.8);

    return SeedCounterResult(
      liveCount: liveCount,
      deadCount: deadCount,
      totalCount: total,
      mortalityPct: mortalityPct,
      cvPct: cvPct,
      meanLengthMm: 10.2,
      stdLengthMm: cvPct / 100 * 10.2,
      confidenceInterval: (total * 0.035).round(),
      boundingBoxes: List.generate(liveCount > 10 ? 10 : liveCount,
          (i) => BoundingBox(x: i * 30.0, y: i * 20.0, w: 15, h: 8, label: 'pl-alive', confidence: 0.92)),
    );
  }

  /// F10-F12: EHP Detection — EfficientNetB0 + YOLOv8
  /// Returns softmax probs for [healthy, suspected, ehp_positive] + spore boxes
  Future<DiseaseResult> runEHPDetection(File image, {bool monochrome = true}) async {
    await Future.delayed(const Duration(milliseconds: 300));

    final ehpProb = 0.05 + (image.lengthSync() % 100) / 1000.0;  // stub
    final sporeDetected = ehpProb > 0.55;

    return DiseaseResult(
      ehpHealthyProb: 1.0 - ehpProb - 0.05,
      ehpSuspectedProb: 0.05,
      ehpPositiveProb: ehpProb,
      wssVPositive: false,
      wssVConfidence: 0.02,
      ahpndProb: 0.03,
      sporeDetected: sporeDetected,
      sporeCount: sporeDetected ? 8 : 0,
      sporeSeverity: sporeDetected ? 'moderate' : null,
      sporeBoxes: sporeDetected
          ? List.generate(3, (i) => BoundingBox(x: i * 40.0, y: i * 40.0, w: 10, h: 10,
              label: 'spore', confidence: 0.85))
          : [],
    );
  }

  /// F18: Visual Health Assessment — EfficientNetB0 regression
  Future<VisualHealthResult> runVisualHealthAssessment(File image) async {
    await Future.delayed(const Duration(milliseconds: 400));
    return VisualHealthResult(
      totalScore: 23.5,
      bodyColourScore: 6.0,
      gutVisibilityScore: 4.5,
      tailMuscleScore: 5.0,
      appendageScore: 3.5,
      postureScore: 3.0,
      activityScore: 3.5,
    );
  }

  /// F19: PL Stage Identification — MobileNetV3
  Future<StageResult> runStageIdentification(File image) async {
    await Future.delayed(const Duration(milliseconds: 200));
    final stages = ['PL5', 'PL8', 'PL10', 'PL12', 'PL15+'];
    return StageResult(
      detectedStage: stages[2],
      confidence: 0.91,
      allProbs: {for (var s in stages) s: s == 'PL10' ? 0.91 : 0.02},
    );
  }

  /// Preprocess image for TFLite: resize + normalize
  Uint8List preprocessImage(File file, int width, int height,
      {bool grayscale = false}) {
    final bytes = file.readAsBytesSync();
    var image = img.decodeImage(bytes)!;
    image = img.copyResize(image, width: width, height: height);

    if (grayscale) {
      image = img.grayscale(image);
    }

    final Float32List input = Float32List(1 * height * width * (grayscale ? 1 : 3));
    int idx = 0;
    for (int y = 0; y < height; y++) {
      for (int x = 0; x < width; x++) {
        final pixel = image.getPixel(x, y);
        if (grayscale) {
          input[idx++] = pixel.r / 255.0;
        } else {
          input[idx++] = pixel.r / 255.0;
          input[idx++] = pixel.g / 255.0;
          input[idx++] = pixel.b / 255.0;
        }
      }
    }
    return input.buffer.asUint8List();
  }
}

class BoundingBox {
  final double x, y, w, h;
  final String label;
  final double confidence;
  BoundingBox({required this.x, required this.y, required this.w,
    required this.h, required this.label, required this.confidence});
}

class SeedCounterResult {
  final int liveCount, deadCount, totalCount, confidenceInterval;
  final double mortalityPct, cvPct, meanLengthMm, stdLengthMm;
  final List<BoundingBox> boundingBoxes;

  SeedCounterResult({required this.liveCount, required this.deadCount,
    required this.totalCount, required this.mortalityPct, required this.cvPct,
    required this.meanLengthMm, required this.stdLengthMm,
    required this.confidenceInterval, required this.boundingBoxes});

  String get mortalityAlert =>
      mortalityPct < 3 ? 'green' : mortalityPct <= 5 ? 'yellow' : 'red';

  String get cvFlag =>
      cvPct < 10 ? 'green' : cvPct <= 20 ? 'yellow' : cvPct <= 25 ? 'red' : 'red_escalate';
}

class DiseaseResult {
  final double ehpHealthyProb, ehpSuspectedProb, ehpPositiveProb;
  final bool wssVPositive, sporeDetected;
  final double wssVConfidence, ahpndProb;
  final int sporeCount;
  final String? sporeSeverity;
  final List<BoundingBox> sporeBoxes;

  DiseaseResult({required this.ehpHealthyProb, required this.ehpSuspectedProb,
    required this.ehpPositiveProb, required this.wssVPositive,
    required this.wssVConfidence, required this.ahpndProb,
    required this.sporeDetected, required this.sporeCount,
    this.sporeSeverity, required this.sporeBoxes});

  bool get isHardFail => ehpPositiveProb > 0.85 || wssVPositive;
  String get hardFailDisease => wssVPositive ? 'WSSV' : 'EHP';

  String get riskLevel {
    if (isHardFail) return 'red';
    if (ehpPositiveProb >= 0.55) return 'yellow';
    if (ehpPositiveProb < 0.30) return 'grey';
    return 'green';
  }

  String get actionText {
    switch (riskLevel) {
      case 'red': return 'Disease detected. Do not stock. Contact your aquaculture officer.';
      case 'yellow': return 'Possible disease. Retake sample or send to PCR lab.';
      case 'grey': return 'Image quality poor. Please retake with better focus.';
      default: return 'No disease detected. Safe to proceed.';
    }
  }
}

class VisualHealthResult {
  final double totalScore, bodyColourScore, gutVisibilityScore,
      tailMuscleScore, appendageScore, postureScore, activityScore;

  VisualHealthResult({required this.totalScore, required this.bodyColourScore,
    required this.gutVisibilityScore, required this.tailMuscleScore,
    required this.appendageScore, required this.postureScore,
    required this.activityScore});
}

class StageResult {
  final String detectedStage;
  final double confidence;
  final Map<String, double> allProbs;

  StageResult({required this.detectedStage, required this.confidence,
    required this.allProbs});
}

final aiService = AIService();

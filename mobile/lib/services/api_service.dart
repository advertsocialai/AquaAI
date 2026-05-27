import 'dart:io';
import 'package:dio/dio.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import '../utils/constants.dart';

class ApiService {
  static final ApiService _instance = ApiService._internal();
  factory ApiService() => _instance;
  ApiService._internal();

  final _storage = const FlutterSecureStorage();
  late final Dio _dio;

  void init() {
    _dio = Dio(BaseOptions(
      baseUrl: ApiConfig.baseUrl,
      connectTimeout: const Duration(seconds: 30),
      receiveTimeout: const Duration(seconds: 60),
    ));

    _dio.interceptors.add(InterceptorsWrapper(
      onRequest: (options, handler) async {
        final token = await _storage.read(key: 'access_token');
        if (token != null) {
          options.headers['Authorization'] = 'Bearer $token';
        }
        handler.next(options);
      },
      onError: (error, handler) {
        if (error.response?.statusCode == 401) {
          // Token expired — trigger logout
        }
        handler.next(error);
      },
    ));
  }

  // Auth
  Future<Map<String, dynamic>> login(String username, String password) async {
    final resp = await _dio.post('/auth/login',
        data: FormData.fromMap({'username': username, 'password': password}));
    final data = resp.data as Map<String, dynamic>;
    await _storage.write(key: 'access_token', value: data['access_token']);
    await _storage.write(key: 'user_id', value: data['user_id'].toString());
    await _storage.write(key: 'user_role', value: data['role']);
    return data;
  }

  Future<Map<String, dynamic>> register(Map<String, dynamic> payload) async {
    final resp = await _dio.post('/auth/register', data: payload);
    return resp.data;
  }

  Future<void> logout() async {
    await _storage.deleteAll();
  }

  Future<Map> forgotPassword(String email) async {
    final resp = await _dio.post('/auth/forgot-password', data: {'email': email});
    return resp.data as Map;
  }

  Future<Map> resetPassword(String email, String otp, String newPassword) async {
    final resp = await _dio.post('/auth/reset-password', data: {
      'email': email,
      'otp': otp,
      'new_password': newPassword,
    });
    return resp.data as Map;
  }

  // Farms & Batches
  Future<List> getFarms() async => (await _dio.get('/farms/')).data;
  Future<Map> createFarm(Map payload) async =>
      (await _dio.post('/farms/', data: payload)).data;
  Future<List> getBatches({int? farmId}) async =>
      (await _dio.get('/batches/', queryParameters: farmId != null ? {'farm_id': farmId} : {})).data;
  Future<Map> createBatch(Map payload) async =>
      (await _dio.post('/batches/', data: payload)).data;
  Future<List> getHatcheries() async => (await _dio.get('/hatcheries/')).data;

  // M1 — Seed Counter
  Future<Map> uploadImage(File file) async {
    final formData = FormData.fromMap({
      'file': await MultipartFile.fromFile(file.path, filename: file.path.split('/').last),
    });
    final resp = await _dio.post('/seed-counter/upload-image', data: formData);
    return resp.data;
  }

  Future<Map> createCountingSession(Map payload) async =>
      (await _dio.post('/seed-counter/sessions', data: payload)).data;

  /// F01: Camera scanner — count seeds in one photo, returns per-seed boxes.
  Future<Map> scanSeeds(File file) async {
    final formData = FormData.fromMap({
      'file': await MultipartFile.fromFile(file.path,
          filename: file.path.split('/').last),
    });
    final resp = await _dio.post('/seed-counter/scan', data: formData);
    return resp.data as Map;
  }

  Future<Map> extrapolateBatch(int sessionId, double sampleVolume,
      double totalVolume, int? invoiceQty) async =>
      (await _dio.post('/seed-counter/sessions/$sessionId/extrapolate', data: {
        'sample_volume_ml': sampleVolume,
        'total_volume_ml': totalVolume,
        if (invoiceQty != null) 'invoice_quantity': invoiceQty,
      })).data;

  Future<Map> splitCount(int sessionId, List<int> subCounts) async =>
      (await _dio.post('/seed-counter/sessions/$sessionId/split-count',
          data: {'sub_counts': subCounts})).data;

  Future<List> listCountingSessions({int? batchId}) async =>
      (await _dio.get('/seed-counter/sessions',
          queryParameters: batchId != null ? {'batch_id': batchId} : {})).data;

  Future<Map> generateCountingCertificate(int sessionId, String language) async =>
      (await _dio.post('/seed-counter/sessions/$sessionId/certificate',
          queryParameters: {'language': language})).data;

  // M2 — Disease Detector
  Future<Map> createDiagnosisSession(Map payload) async =>
      (await _dio.post('/disease/sessions', data: payload)).data;

  Future<Map> requestGradcam(int sessionId) async =>
      (await _dio.post('/disease/ehp/diagnose', queryParameters: {'session_id': sessionId})).data;

  Future<Map> submitPCRFeedback(int sessionId, String result,
      {double? ctValue, String? labName}) async =>
      (await _dio.post('/disease/sessions/$sessionId/pcr-feedback', data: {
        'pcr_result': result,
        if (ctValue != null) 'ct_value': ctValue,
        if (labName != null) 'lab_name': labName,
      })).data;

  Future<List> getOutbreakAlerts({String? district}) async =>
      (await _dio.get('/disease/outbreaks',
          queryParameters: district != null ? {'district': district} : {})).data;

  // M3 — Quality Grader
  Future<Map> createGradingSession(Map payload) async =>
      (await _dio.post('/quality/sessions', data: payload)).data;

  Future<Map> getStockingRecommendation(int sessionId) async =>
      (await _dio.get('/quality/sessions/$sessionId/stocking-recommendation')).data;

  Future<Map> generateGradingCertificate(int sessionId, String language) async =>
      (await _dio.post('/quality/sessions/$sessionId/certificate',
          queryParameters: {'language': language})).data;

  // M4 — Reports
  Future<List> getCertificates() async => (await _dio.get('/certificates')).data;

  Future<Map> verifyCertificate(String certId) async =>
      (await _dio.get('/verify/$certId')).data;

  Future<List> getLatestModels() async =>
      (await _dio.get('/model-updates/latest')).data;

  Future<Map> syncOfflineData(String deviceId, List<Map> sessions) async =>
      (await _dio.post('/sync/batch',
          data: {'device_id': deviceId, 'sessions': sessions})).data;

  // M4 — Analytics
  Future<Map> getDashboard() async =>
      (await _dio.get('/analytics/dashboard')).data;

  Future<List> getDiseaseTrends({int days = 30}) async =>
      (await _dio.get('/analytics/disease-trends',
          queryParameters: {'days': days})).data;

  // Water Quality
  Future<Map> logWaterQuality(Map payload) async =>
      (await _dio.post('/water-quality/', data: payload)).data;

  Future<List> getWaterQuality(int farmId, {int days = 7}) async =>
      (await _dio.get('/water-quality/farm/$farmId',
          queryParameters: {'days': days})).data;

  // Subscriptions
  Future<Map> getMyPlan() async =>
      (await _dio.get('/subscriptions/my-plan')).data;

  Future<Map> subscribe(String planType, int months) async =>
      (await _dio.post('/subscriptions/subscribe',
          data: {'plan_type': planType, 'duration_months': months})).data;

  // ─── AI Agent — Claude Opus 4 ────────────────────────────────────────────

  /// Check whether Claude Opus is configured on the backend.
  Future<Map> getAgentStatus() async =>
      (await _dio.get('/ai-agent/status')).data;

  // ── Pricing — public endpoints ────────────────────────────────────────────

  /// Live mandi prices. `category` is 'prawn', 'freshwater', or 'marine'.
  /// Returns rows like {species, size, low, high, trend}.
  Future<List<Map<String, dynamic>>> getPricing(String category) async {
    final resp = await _dio.get('/pricing/$category');
    return List<Map<String, dynamic>>.from(resp.data as List);
  }

  /// Weather + cyclone alert for a district. Public endpoint.
  Future<Map<String, dynamic>> getWeather(String district) async {
    final resp = await _dio.get('/advisory/weather',
        queryParameters: {'district': district});
    return Map<String, dynamic>.from(resp.data as Map);
  }

  /// Public chatbot endpoint — no auth required. Used by the in-app assistant
  /// drawer. Pass the full message history each turn (the backend is stateless
  /// for this route). Returns {"reply": "...", "mode": "claude" | "offline"}.
  Future<Map> agentPublicChat(List<Map<String, String>> messages) async {
    final resp = await _dio.post('/ai-agent/public-chat', data: {
      'messages': messages,
    });
    return resp.data as Map;
  }

  // ── Marketplace ───────────────────────────────────────────────────────────

  Future<List<Map<String, dynamic>>> getMarketplaceCategories() async {
    final resp = await _dio.get('/marketplace/categories');
    return List<Map<String, dynamic>>.from(resp.data as List);
  }

  Future<Map<String, dynamic>> checkoutCart({
    required List<Map<String, dynamic>> items,
    required String contactName,
    required String contactPhone,
    String? contactEmail,
    String? deliveryPin,
    String? deliveryAddress,
    String? notes,
  }) async {
    final resp = await _dio.post('/marketplace/cart/checkout', data: {
      'items': items,
      'contact_name': contactName,
      'contact_phone': contactPhone,
      if (contactEmail != null && contactEmail.isNotEmpty) 'contact_email': contactEmail,
      if (deliveryPin != null && deliveryPin.isNotEmpty) 'delivery_pin': deliveryPin,
      if (deliveryAddress != null && deliveryAddress.isNotEmpty) 'delivery_address': deliveryAddress,
      if (notes != null && notes.isNotEmpty) 'notes': notes,
      'source': 'mobile',
    });
    return Map<String, dynamic>.from(resp.data as Map);
  }

  // ── KYC — Aadhaar / PAN / GST / Bank ──────────────────────────────────────

  Future<Map> sendAadhaarOtp(String aadhaar) async {
    final resp = await _dio.post('/kyc/aadhaar/send-otp', data: {'aadhaar': aadhaar});
    return resp.data as Map;
  }

  Future<Map> verifyAadhaarOtp(String aadhaarLast4, String otp) async {
    final resp = await _dio.post('/kyc/aadhaar/verify-otp',
        data: {'aadhaar_last4': aadhaarLast4, 'otp': otp});
    return resp.data as Map;
  }

  Future<Map> verifyPan(String pan) async {
    final resp = await _dio.post('/kyc/pan/verify', data: {'pan': pan});
    return resp.data as Map;
  }

  Future<Map> verifyGst(String gstin) async {
    final resp = await _dio.post('/kyc/gst/verify', data: {'gstin': gstin});
    return resp.data as Map;
  }

  Future<Map> pennyDropBank(String accountNumber, String ifsc) async {
    final resp = await _dio.post('/kyc/bank/penny-drop',
        data: {'account_number': accountNumber, 'ifsc': ifsc});
    return resp.data as Map;
  }

  /// Public contact form — no auth required. Persists to contact_submissions
  /// and fires a notification email to the support inbox.
  Future<Map> submitContactForm({
    required String name,
    required String email,
    String? phone,
    required String message,
    String source = 'mobile',
  }) async {
    final resp = await _dio.post('/contact/submit', data: {
      'name': name,
      'email': email,
      if (phone != null && phone.isNotEmpty) 'phone': phone,
      'message': message,
      'source': source,
    });
    return resp.data as Map;
  }

  /// Send a message to the Claude Opus diagnostic agent.
  /// Pass [sessionId] to continue an existing conversation.
  Future<Map> agentChat(String message,
      {int? sessionId, int? farmId, int? batchId, List<String>? imagePaths}) async {
    final resp = await _dio.post('/ai-agent/chat', data: {
      'message': message,
      if (sessionId != null) 'session_id': sessionId,
      if (farmId != null) 'farm_id': farmId,
      if (batchId != null) 'batch_id': batchId,
      if (imagePaths != null && imagePaths.isNotEmpty) 'image_paths': imagePaths,
    });
    return resp.data;
  }

  /// Single-shot structured diagnosis on uploaded images.
  Future<Map> agentQuickDiagnose(List<String> imagePaths,
      {int? farmId,
      int? batchId,
      bool runDisease = true,
      bool runQuality = true,
      bool runSeedCount = false,
      String cameraMode = 'software_mono'}) async {
    final resp = await _dio.post('/ai-agent/quick-diagnose', data: {
      'image_paths': imagePaths,
      'camera_mode': cameraMode,
      'run_disease': runDisease,
      'run_quality': runQuality,
      'run_seed_count': runSeedCount,
      if (farmId != null) 'farm_id': farmId,
      if (batchId != null) 'batch_id': batchId,
    });
    return resp.data;
  }

  Future<List> getAgentSessions() async =>
      (await _dio.get('/ai-agent/sessions')).data;

  Future<Map> getAgentSession(int sessionId) async =>
      (await _dio.get('/ai-agent/sessions/$sessionId')).data;

  Future<void> deleteAgentSession(int sessionId) async =>
      await _dio.delete('/ai-agent/sessions/$sessionId');

  Future<Map> submitAgentFeedback(int sessionId,
      {int? rating, bool? helpful, String? comment}) async {
    final resp = await _dio.post('/ai-agent/sessions/$sessionId/feedback', data: {
      if (rating != null) 'rating': rating,
      if (helpful != null) 'helpful': helpful,
      if (comment != null) 'comment': comment,
    });
    return resp.data;
  }

  // ── Aqua AI unified models API (server-side inference) ────────────────────

  Future<List<Map<String, dynamic>>> listModels() async {
    final resp = await _dio.get('/models');
    return List<Map<String, dynamic>>.from(resp.data as List);
  }

  Future<Map<String, dynamic>> getModelCard(String modelId) async {
    final resp = await _dio.get('/models/$modelId');
    return Map<String, dynamic>.from(resp.data as Map);
  }

  Future<Map<String, dynamic>> inferSeedCount(File image, {double trayAreaCm2 = 400}) async {
    final form = FormData.fromMap({
      'image': await MultipartFile.fromFile(image.path, filename: 'tray.jpg'),
      'tray_area_cm2': trayAreaCm2,
    });
    final resp = await _dio.post('/models/seed-counter/infer', data: form);
    return Map<String, dynamic>.from(resp.data as Map);
  }

  Future<Map<String, dynamic>> inferDisease(File image) async {
    final form = FormData.fromMap({
      'image': await MultipartFile.fromFile(image.path, filename: 'smear.jpg'),
    });
    final resp = await _dio.post('/models/disease-detector/infer', data: form);
    return Map<String, dynamic>.from(resp.data as Map);
  }

  Future<Map<String, dynamic>> inferQuality(
    File image, {
    int? invoiceCount,
    int? counted,
  }) async {
    final form = FormData.fromMap({
      'image': await MultipartFile.fromFile(image.path, filename: 'pl.jpg'),
      if (invoiceCount != null) 'invoice_count': invoiceCount,
      if (counted != null) 'counted': counted,
    });
    final resp = await _dio.post('/models/quality-grader/infer', data: form);
    return Map<String, dynamic>.from(resp.data as Map);
  }

  Future<Map<String, dynamic>> inferPlStage(File image) async {
    final form = FormData.fromMap({
      'image': await MultipartFile.fromFile(image.path, filename: 'pl-side.jpg'),
    });
    final resp = await _dio.post('/models/pl-stage-classifier/infer', data: form);
    return Map<String, dynamic>.from(resp.data as Map);
  }

  Future<Map<String, dynamic>> inferStress({
    required double doMgL,
    required double ph,
    required double salinityPpt,
    required double tempC,
    required double nh3MgL,
    required double rain24hMm,
    required double densityPlM2,
  }) async {
    final resp = await _dio.post('/models/stress-forecaster/infer', data: {
      'do_mg_l': doMgL,
      'ph': ph,
      'salinity_ppt': salinityPpt,
      'temp_c': tempC,
      'nh3_mg_l': nh3MgL,
      'rain_24h_mm': rain24hMm,
      'density_pl_m2': densityPlM2,
    });
    return Map<String, dynamic>.from(resp.data as Map);
  }

  // ── Risk scoring API (banks + insurers) ───────────────────────────────────

  Future<List<Map<String, dynamic>>> getFarmRiskBook() async {
    final resp = await _dio.get('/risk/farms');
    return List<Map<String, dynamic>>.from(resp.data as List);
  }

  Future<Map<String, dynamic>> getFarmRiskDetail(String farmId) async {
    final resp = await _dio.get('/risk/farms/$farmId');
    return Map<String, dynamic>.from(resp.data as Map);
  }

  // Download an OTA model artifact (placeholder bytes from the backend
  // until a real .tflite is published).
  Future<List<int>> downloadModel(String modelId) async {
    final resp = await _dio.get<List<int>>(
      '/models/$modelId/download',
      options: Options(responseType: ResponseType.bytes),
    );
    return resp.data ?? const [];
  }
}

final apiService = ApiService();

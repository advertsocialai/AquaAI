import 'package:dio/dio.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../env.dart';
import '../supabase/supabase_client.dart';

/// Singleton Dio for talking to the FastAPI backend. Attaches the
/// Supabase access token to every request so backend routes can
/// `verify_jwt` against the same key as the web app.
final dioProvider = Provider<Dio>((ref) {
  final dio = Dio(BaseOptions(
    baseUrl: Env.apiBase,
    connectTimeout: const Duration(seconds: 10),
    receiveTimeout: const Duration(seconds: 30),
    headers: {'Content-Type': 'application/json'},
  ));

  dio.interceptors.add(InterceptorsWrapper(
    onRequest: (options, handler) {
      final token = sb.auth.currentSession?.accessToken;
      if (token != null) {
        options.headers['Authorization'] = 'Bearer $token';
      }
      handler.next(options);
    },
    onError: (e, handler) {
      // 401 = token expired/invalid — Supabase SDK auto-refreshes on next
      // call. Pass through; UI handles with a redirect-to-login guard.
      handler.next(e);
    },
  ));

  return dio;
});

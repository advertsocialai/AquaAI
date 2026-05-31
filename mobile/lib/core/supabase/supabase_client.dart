import 'package:flutter/foundation.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import '../env.dart';

/// Initialised in main.dart before runApp. The library exposes a
/// global `Supabase.instance.client` afterwards; we re-export as
/// `sb` for shorter call-sites (sb.auth.X, sb.from('users').select).
Future<void> initSupabase() async {
  await Supabase.initialize(
    url: Env.supabaseUrl,
    anonKey: Env.supabasePublishableKey,
    debug: kDebugMode,
  );
}

SupabaseClient get sb => Supabase.instance.client;

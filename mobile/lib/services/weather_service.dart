import 'dart:convert';
import 'package:http/http.dart' as http;

/// Lightweight Open-Meteo client. Free, keyless, accurate to a few km.
/// Mirrors the web `WeatherTimeWidget`.
class WeatherService {
  static const _base = 'https://api.open-meteo.com/v1/forecast';

  /// Indian aquaculture locations the web app surfaces. Same lat/lng table
  /// as src/components/WeatherTimeWidget.tsx — kept in sync by hand.
  static const Map<String, ({double lat, double lng, String region})> districts = {
    'Bhimavaram':       (lat: 16.5449, lng: 81.5212, region: 'West Godavari'),
    'Palakollu':        (lat: 16.5167, lng: 81.7333, region: 'West Godavari'),
    'Narsapur':         (lat: 16.4333, lng: 81.7000, region: 'West Godavari'),
    'Tanuku':           (lat: 16.7553, lng: 81.6822, region: 'West Godavari'),
    'Tadepalligudem':   (lat: 16.8167, lng: 81.5333, region: 'West Godavari'),
    'Akividu':          (lat: 16.6000, lng: 81.3833, region: 'West Godavari'),
    'Nellore':          (lat: 14.4426, lng: 79.9865, region: 'Andhra Pradesh'),
    'Vijayawada':       (lat: 16.5062, lng: 80.6480, region: 'Andhra Pradesh'),
    'Visakhapatnam':    (lat: 17.6868, lng: 83.2185, region: 'Andhra Pradesh'),
    'Kakinada':         (lat: 16.9891, lng: 82.2475, region: 'Andhra Pradesh'),
    'Chennai':          (lat: 13.0827, lng: 80.2707, region: 'Tamil Nadu'),
    'Tuticorin':        (lat:  8.7642, lng: 78.1348, region: 'Tamil Nadu'),
    'Bhubaneswar':      (lat: 20.2961, lng: 85.8245, region: 'Odisha'),
    'Paradip':          (lat: 20.3162, lng: 86.6109, region: 'Odisha'),
    'Kolkata':          (lat: 22.5726, lng: 88.3639, region: 'West Bengal'),
    'Surat':            (lat: 21.1702, lng: 72.8311, region: 'Gujarat'),
  };

  /// Current weather + 24-hour temp/humidity/precip hourly series.
  Future<WeatherSnapshot> fetch(String district) async {
    final loc = districts[district];
    if (loc == null) {
      throw ArgumentError('Unknown district: $district');
    }
    final uri = Uri.parse('$_base'
        '?latitude=${loc.lat}&longitude=${loc.lng}'
        '&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m,precipitation'
        '&hourly=temperature_2m,relative_humidity_2m,precipitation_probability,precipitation,wind_speed_10m,weather_code'
        '&forecast_days=2'
        '&timezone=Asia%2FKolkata');

    final r = await http.get(uri);
    if (r.statusCode != 200) {
      throw HttpException('Open-Meteo ${r.statusCode}: ${r.body}');
    }
    final j = jsonDecode(r.body) as Map<String, dynamic>;
    final cur = j['current'] as Map<String, dynamic>;
    final hourly = j['hourly'] as Map<String, dynamic>;

    return WeatherSnapshot(
      district: district,
      region: loc.region,
      tempC: (cur['temperature_2m'] as num).toDouble(),
      humidityPct: (cur['relative_humidity_2m'] as num).toDouble(),
      windKmh: (cur['wind_speed_10m'] as num).toDouble(),
      precipitationMm: (cur['precipitation'] as num).toDouble(),
      weatherCode: cur['weather_code'] as int,
      times: List<String>.from(hourly['time'] as List),
      temps: List<double>.from((hourly['temperature_2m'] as List).map((e) => (e as num).toDouble())),
      precip: List<double>.from((hourly['precipitation'] as List).map((e) => (e as num).toDouble())),
      humidities: List<double>.from((hourly['relative_humidity_2m'] as List).map((e) => (e as num).toDouble())),
    );
  }
}

class WeatherSnapshot {
  final String district;
  final String region;
  final double tempC;
  final double humidityPct;
  final double windKmh;
  final double precipitationMm;
  final int weatherCode;
  final List<String> times;
  final List<double> temps;
  final List<double> precip;
  final List<double> humidities;

  WeatherSnapshot({
    required this.district,
    required this.region,
    required this.tempC,
    required this.humidityPct,
    required this.windKmh,
    required this.precipitationMm,
    required this.weatherCode,
    required this.times,
    required this.temps,
    required this.precip,
    required this.humidities,
  });

  /// WMO weather-code → short condition label (matches the web widget).
  String get condition {
    if (weatherCode == 0) return 'Clear';
    if (weatherCode <= 3) return 'Cloudy';
    if (weatherCode <= 48) return 'Fog';
    if (weatherCode <= 67) return 'Rain';
    if (weatherCode <= 77) return 'Snow';
    if (weatherCode <= 82) return 'Showers';
    if (weatherCode <= 99) return 'Thunder';
    return 'Unknown';
  }
}

class HttpException implements Exception {
  final String message;
  HttpException(this.message);
  @override
  String toString() => 'HttpException: $message';
}

final weatherService = WeatherService();

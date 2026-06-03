import 'package:dio/dio.dart';
import 'package:flutter/material.dart';
import '../../../core/theme/app_colors.dart';

/// A selectable Andhra Pradesh location with its coordinates.
class _Location {
  const _Location(this.name, this.lat, this.lon);
  final String name;
  final double lat;
  final double lon;
}

const List<_Location> _locations = [
  _Location('Bhimavaram', 16.54, 81.52),
  _Location('Kakinada', 16.99, 82.25),
  _Location('Nellore', 14.44, 79.99),
  _Location('Ongole', 15.50, 80.05),
  _Location('Vijayawada', 16.51, 80.65),
  _Location('Visakhapatnam', 17.69, 83.22),
  _Location('Srikakulam', 18.30, 83.90),
];

/// Holds parsed current + daily weather for one location.
class _Weather {
  const _Weather({
    required this.temp,
    required this.humidity,
    required this.wind,
    required this.code,
    required this.high,
    required this.low,
    required this.rain,
  });

  final double temp;
  final double humidity;
  final double wind;
  final int code;
  final double high;
  final double low;
  final double rain;
}

/// Current weather card backed by Open-Meteo (no API key). Mirrors the
/// web WeatherTimeWidget at a glance: big current temp, a humidity/wind
/// row, and High / Low / Rain chips for today.
class WeatherCard extends StatefulWidget {
  const WeatherCard({super.key});

  @override
  State<WeatherCard> createState() => _WeatherCardState();
}

class _WeatherCardState extends State<WeatherCard> {
  final Dio _dio = Dio();
  _Location _selected = _locations.first;
  _Weather? _weather;
  bool _loading = true;
  bool _error = false;

  @override
  void initState() {
    super.initState();
    _fetch();
  }

  Future<void> _fetch() async {
    setState(() {
      _loading = true;
      _error = false;
    });
    try {
      final res = await _dio.get<Map<String, dynamic>>(
        'https://api.open-meteo.com/v1/forecast',
        queryParameters: {
          'latitude': _selected.lat,
          'longitude': _selected.lon,
          'current':
              'temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code',
          'daily': 'temperature_2m_max,temperature_2m_min,precipitation_sum',
          'timezone': 'Asia/Kolkata',
        },
      );
      final data = res.data!;
      final current = data['current'] as Map<String, dynamic>;
      final daily = data['daily'] as Map<String, dynamic>;

      double d(Object? v) => (v as num?)?.toDouble() ?? 0;
      double first(Object? list) {
        final l = list as List?;
        return l != null && l.isNotEmpty ? d(l.first) : 0;
      }

      if (!mounted) return;
      setState(() {
        _weather = _Weather(
          temp: d(current['temperature_2m']),
          humidity: d(current['relative_humidity_2m']),
          wind: d(current['wind_speed_10m']),
          code: (current['weather_code'] as num?)?.toInt() ?? 0,
          high: first(daily['temperature_2m_max']),
          low: first(daily['temperature_2m_min']),
          rain: first(daily['precipitation_sum']),
        );
        _loading = false;
      });
    } catch (_) {
      if (!mounted) return;
      setState(() {
        _error = true;
        _loading = false;
      });
    }
  }

  String _condition(int code) {
    if (code == 0) return 'Clear sky';
    if (code <= 3) return 'Partly cloudy';
    if (code <= 48) return 'Foggy';
    if (code <= 67) return 'Rainy';
    if (code <= 77) return 'Snow';
    if (code <= 82) return 'Rain showers';
    if (code <= 99) return 'Thunderstorm';
    return 'Cloudy';
  }

  IconData _icon(int code) {
    if (code == 0) return Icons.wb_sunny_outlined;
    if (code <= 3) return Icons.wb_cloudy_outlined;
    if (code <= 48) return Icons.foggy;
    if (code <= 82) return Icons.water_drop_outlined;
    if (code <= 99) return Icons.thunderstorm_outlined;
    return Icons.cloud_outlined;
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        color: AppColors.card,
        borderRadius: BorderRadius.circular(18),
        border: Border.all(color: AppColors.border),
      ),
      padding: const EdgeInsets.all(20),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              const Icon(Icons.location_on_outlined,
                  size: 18, color: AppColors.cyanLight),
              const SizedBox(width: 6),
              const Expanded(
                child: Text(
                  'Weather',
                  style: TextStyle(
                    fontSize: 15,
                    fontWeight: FontWeight.w700,
                    color: AppColors.foreground,
                  ),
                ),
              ),
              _LocationDropdown(
                selected: _selected,
                onChanged: (loc) {
                  setState(() => _selected = loc);
                  _fetch();
                },
              ),
            ],
          ),
          const SizedBox(height: 16),
          if (_loading)
            const Padding(
              padding: EdgeInsets.symmetric(vertical: 28),
              child: Center(
                child: SizedBox(
                  height: 28,
                  width: 28,
                  child: CircularProgressIndicator(
                      strokeWidth: 2.5, color: AppColors.cyan),
                ),
              ),
            )
          else if (_error || _weather == null)
            _ErrorBlock(onRetry: _fetch)
          else
            _WeatherBody(
              weather: _weather!,
              condition: _condition(_weather!.code),
              icon: _icon(_weather!.code),
            ),
        ],
      ),
    );
  }
}

class _WeatherBody extends StatelessWidget {
  const _WeatherBody({
    required this.weather,
    required this.condition,
    required this.icon,
  });

  final _Weather weather;
  final String condition;
  final IconData icon;

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          crossAxisAlignment: CrossAxisAlignment.center,
          children: [
            Text(
              '${weather.temp.round()}°',
              style: const TextStyle(
                fontSize: 52,
                fontWeight: FontWeight.w800,
                height: 1,
                color: AppColors.foreground,
              ),
            ),
            const SizedBox(width: 14),
            Icon(icon, size: 40, color: AppColors.cyanLight),
            const SizedBox(width: 10),
            Expanded(
              child: Text(
                condition,
                style: const TextStyle(
                  fontSize: 15,
                  color: AppColors.foregroundMuted,
                ),
              ),
            ),
          ],
        ),
        const SizedBox(height: 14),
        Row(
          children: [
            _InlineStat(
              icon: Icons.water_drop_outlined,
              label: 'Humidity',
              value: '${weather.humidity.round()}%',
            ),
            const SizedBox(width: 20),
            _InlineStat(
              icon: Icons.air,
              label: 'Wind',
              value: '${weather.wind.round()} km/h',
            ),
          ],
        ),
        const SizedBox(height: 16),
        Row(
          children: [
            Expanded(
              child: _StatChip(
                label: 'High',
                value: '${weather.high.round()}°',
                color: AppColors.warning,
              ),
            ),
            const SizedBox(width: 10),
            Expanded(
              child: _StatChip(
                label: 'Low',
                value: '${weather.low.round()}°',
                color: AppColors.cyan,
              ),
            ),
            const SizedBox(width: 10),
            Expanded(
              child: _StatChip(
                label: 'Rain',
                value: '${weather.rain.toStringAsFixed(1)} mm',
                color: AppColors.success,
              ),
            ),
          ],
        ),
      ],
    );
  }
}

class _InlineStat extends StatelessWidget {
  const _InlineStat({
    required this.icon,
    required this.label,
    required this.value,
  });

  final IconData icon;
  final String label;
  final String value;

  @override
  Widget build(BuildContext context) {
    return Row(
      mainAxisSize: MainAxisSize.min,
      children: [
        Icon(icon, size: 16, color: AppColors.foregroundFaint),
        const SizedBox(width: 6),
        Text(
          '$label  ',
          style:
              const TextStyle(fontSize: 13, color: AppColors.foregroundFaint),
        ),
        Text(
          value,
          style: const TextStyle(
            fontSize: 13,
            fontWeight: FontWeight.w600,
            color: AppColors.foreground,
          ),
        ),
      ],
    );
  }
}

class _StatChip extends StatelessWidget {
  const _StatChip({
    required this.label,
    required this.value,
    required this.color,
  });

  final String label;
  final String value;
  final Color color;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(vertical: 12),
      decoration: BoxDecoration(
        color: color.withValues(alpha: 0.10),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: color.withValues(alpha: 0.30)),
      ),
      child: Column(
        children: [
          Text(
            label,
            style: TextStyle(fontSize: 12, color: color),
          ),
          const SizedBox(height: 4),
          Text(
            value,
            style: const TextStyle(
              fontSize: 15,
              fontWeight: FontWeight.w700,
              color: AppColors.foreground,
            ),
          ),
        ],
      ),
    );
  }
}

class _LocationDropdown extends StatelessWidget {
  const _LocationDropdown({required this.selected, required this.onChanged});

  final _Location selected;
  final ValueChanged<_Location> onChanged;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10),
      decoration: BoxDecoration(
        color: AppColors.background,
        borderRadius: BorderRadius.circular(10),
        border: Border.all(color: AppColors.border),
      ),
      child: DropdownButtonHideUnderline(
        child: DropdownButton<_Location>(
          value: selected,
          isDense: true,
          dropdownColor: AppColors.card,
          icon: const Icon(Icons.expand_more,
              size: 18, color: AppColors.foregroundMuted),
          style: const TextStyle(
            fontSize: 13,
            fontWeight: FontWeight.w600,
            color: AppColors.foreground,
          ),
          items: [
            for (final loc in _locations)
              DropdownMenuItem<_Location>(
                value: loc,
                child: Text(loc.name),
              ),
          ],
          onChanged: (loc) {
            if (loc != null) onChanged(loc);
          },
        ),
      ),
    );
  }
}

class _ErrorBlock extends StatelessWidget {
  const _ErrorBlock({required this.onRetry});

  final VoidCallback onRetry;

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 16),
      child: Column(
        children: [
          const Icon(Icons.cloud_off_outlined,
              size: 32, color: AppColors.foregroundFaint),
          const SizedBox(height: 10),
          const Text(
            "Couldn't load weather.",
            style: TextStyle(color: AppColors.foregroundMuted),
          ),
          const SizedBox(height: 12),
          OutlinedButton.icon(
            onPressed: onRetry,
            icon: const Icon(Icons.refresh, size: 18),
            label: const Text('Retry'),
            style: OutlinedButton.styleFrom(
              foregroundColor: AppColors.foreground,
              side: const BorderSide(color: AppColors.border),
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(10),
              ),
            ),
          ),
        ],
      ),
    );
  }
}

import 'dart:io';
import 'package:flutter/material.dart';
import 'package:image_picker/image_picker.dart';
import '../../services/api_service.dart';
import '../../utils/constants.dart';

/// F01 — Camera scanner that counts shrimp seeds and overlays a numbered
/// bounding box on every detected post-larva.
class SeedScannerScreen extends StatefulWidget {
  const SeedScannerScreen({super.key});

  @override
  State<SeedScannerScreen> createState() => _SeedScannerScreenState();
}

class _SeedScannerScreenState extends State<SeedScannerScreen> {
  final _picker = ImagePicker();
  File? _image;
  Map? _result;
  bool _loading = false;
  String? _error;

  Future<void> _capture(ImageSource source) async {
    setState(() {
      _error = null;
    });
    try {
      final picked = await _picker.pickImage(
        source: source,
        maxWidth: 1600,
        imageQuality: 90,
      );
      if (picked == null) return;

      setState(() {
        _image = File(picked.path);
        _result = null;
        _loading = true;
      });

      final result = await apiService.scanSeeds(_image!);
      setState(() {
        _result = result;
        _loading = false;
      });
    } catch (e) {
      setState(() {
        _loading = false;
        _error = 'Scan failed. Check the backend connection and try again.';
      });
    }
  }

  void _reset() => setState(() {
        _image = null;
        _result = null;
        _error = null;
      });

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Seed Scanner'),
        actions: [
          if (_image != null)
            IconButton(
              icon: const Icon(Icons.refresh),
              tooltip: 'New scan',
              onPressed: _reset,
            ),
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            _Viewport(image: _image, result: _result, loading: _loading),
            const SizedBox(height: 16),
            if (_error != null)
              Container(
                padding: const EdgeInsets.all(12),
                margin: const EdgeInsets.only(bottom: 12),
                decoration: BoxDecoration(
                  color: const Color(AppColors.red).withOpacity(0.1),
                  borderRadius: BorderRadius.circular(8),
                ),
                child: Text(_error!,
                    style: const TextStyle(
                        color: Color(AppColors.red), fontSize: 13)),
              ),
            if (_result != null) _ResultPanel(result: _result!),
            const SizedBox(height: 12),
            Row(children: [
              Expanded(
                child: FilledButton.icon(
                  onPressed: _loading
                      ? null
                      : () => _capture(ImageSource.camera),
                  icon: const Icon(Icons.camera_alt),
                  label: const Text('Camera'),
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: OutlinedButton.icon(
                  onPressed: _loading
                      ? null
                      : () => _capture(ImageSource.gallery),
                  icon: const Icon(Icons.photo_library_outlined),
                  label: const Text('Gallery'),
                ),
              ),
            ]),
          ],
        ),
      ),
    );
  }
}

/// Image viewport with bounding-box overlay.
class _Viewport extends StatelessWidget {
  final File? image;
  final Map? result;
  final bool loading;
  const _Viewport({this.image, this.result, required this.loading});

  @override
  Widget build(BuildContext context) {
    return AspectRatio(
      aspectRatio: 4 / 3,
      child: Container(
        decoration: BoxDecoration(
          color: Colors.black,
          borderRadius: BorderRadius.circular(14),
        ),
        clipBehavior: Clip.antiAlias,
        child: Stack(
          fit: StackFit.expand,
          children: [
            if (image == null)
              const Center(
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Icon(Icons.qr_code_scanner,
                        size: 56, color: Colors.white24),
                    SizedBox(height: 8),
                    Text('Capture a counting tray to begin',
                        style: TextStyle(color: Colors.white38, fontSize: 13)),
                  ],
                ),
              )
            else
              FittedBox(
                fit: BoxFit.contain,
                child: _BoxedImage(image: image!, result: result),
              ),
            if (loading)
              Container(
                color: Colors.black54,
                child: const Center(
                  child: Column(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      CircularProgressIndicator(color: Colors.white),
                      SizedBox(height: 12),
                      Text('Counting seeds…',
                          style: TextStyle(color: Colors.white70)),
                    ],
                  ),
                ),
              ),
          ],
        ),
      ),
    );
  }
}

/// Renders the captured image at its native size with the box overlay,
/// so normalised (0-1) box coordinates map correctly. Wrapped in FittedBox.
class _BoxedImage extends StatelessWidget {
  final File image;
  final Map? result;
  const _BoxedImage({required this.image, this.result});

  @override
  Widget build(BuildContext context) {
    return FutureBuilder<Size>(
      future: _imageSize(image),
      builder: (ctx, snap) {
        final size = snap.data ?? const Size(640, 480);
        final boxes = (result?['boxes'] as List?) ?? [];
        return SizedBox(
          width: size.width,
          height: size.height,
          child: Stack(
            children: [
              Image.file(image, width: size.width, height: size.height,
                  fit: BoxFit.fill),
              if (boxes.isNotEmpty)
                CustomPaint(
                  size: size,
                  painter: _BoxPainter(boxes.cast<Map>()),
                ),
            ],
          ),
        );
      },
    );
  }

  Future<Size> _imageSize(File file) async {
    final bytes = await file.readAsBytes();
    final image = await decodeImageFromList(bytes);
    return Size(image.width.toDouble(), image.height.toDouble());
  }
}

class _BoxPainter extends CustomPainter {
  final List<Map> boxes;
  _BoxPainter(this.boxes);

  static const _colors = {
    'pl-alive': Color(AppColors.green),
    'pl-dead': Color(AppColors.red),
    'debris': Color(AppColors.yellow),
  };

  @override
  void paint(Canvas canvas, Size size) {
    for (var i = 0; i < boxes.length; i++) {
      final b = boxes[i];
      final color = _colors[b['class_name']] ?? const Color(AppColors.accent);

      final cx = (b['cx'] as num).toDouble() * size.width;
      final cy = (b['cy'] as num).toDouble() * size.height;
      final w = (b['w'] as num).toDouble() * size.width;
      final h = (b['h'] as num).toDouble() * size.height;
      final rect = Rect.fromCenter(
          center: Offset(cx, cy), width: w, height: h);

      canvas.drawRect(
        rect,
        Paint()
          ..color = color
          ..style = PaintingStyle.stroke
          ..strokeWidth = 2,
      );

      // Number label
      final tp = TextPainter(
        text: TextSpan(
          text: '${i + 1}',
          style: const TextStyle(
              color: Colors.white,
              fontSize: 11,
              fontWeight: FontWeight.bold),
        ),
        textDirection: TextDirection.ltr,
      )..layout();

      final labelRect = Rect.fromLTWH(
          rect.left, rect.top - 14, tp.width + 6, 14);
      canvas.drawRect(labelRect, Paint()..color = color);
      tp.paint(canvas, Offset(rect.left + 3, rect.top - 13));
    }
  }

  @override
  bool shouldRepaint(_BoxPainter old) => old.boxes != boxes;
}

class _ResultPanel extends StatelessWidget {
  final Map result;
  const _ResultPanel({required this.result});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.grey.shade50,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: Colors.grey.shade200),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              _Stat('Live', '${result['live_count']}', const Color(AppColors.green)),
              _Stat('Dead', '${result['dead_count']}', const Color(AppColors.red)),
              _Stat('Debris', '${result['debris_count']}', const Color(AppColors.yellow)),
              _Stat('Survival', '${result['survival_rate_pct']}%',
                  const Color(AppColors.accent)),
            ],
          ),
          const Divider(height: 20),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text('Total counted: ${result['total_count']}',
                  style: const TextStyle(fontWeight: FontWeight.bold)),
              Text(
                result['model_used']?.toString() ?? '',
                style: TextStyle(fontSize: 11, color: Colors.grey.shade500),
              ),
            ],
          ),
          if (result['mean_length_mm'] != null)
            Padding(
              padding: const EdgeInsets.only(top: 4),
              child: Text(
                'Avg length ${result['mean_length_mm']}mm · CV ${result['cv_pct']}%',
                style: TextStyle(fontSize: 12, color: Colors.grey.shade600),
              ),
            ),
        ],
      ),
    );
  }
}

class _Stat extends StatelessWidget {
  final String label, value;
  final Color color;
  const _Stat(this.label, this.value, this.color);

  @override
  Widget build(BuildContext context) {
    return Expanded(
      child: Column(
        children: [
          Text(value,
              style: TextStyle(
                  fontSize: 22, fontWeight: FontWeight.bold, color: color)),
          Text(label,
              style: TextStyle(fontSize: 10, color: Colors.grey.shade600)),
        ],
      ),
    );
  }
}

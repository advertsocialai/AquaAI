import 'package:flutter/material.dart';
import '../../services/api_service.dart';
import 'cart_screen.dart';

class MarketplaceScreen extends StatefulWidget {
  const MarketplaceScreen({super.key});

  @override
  State<MarketplaceScreen> createState() => _MarketplaceScreenState();
}

class _MarketplaceScreenState extends State<MarketplaceScreen> {
  int _catIdx = 0;
  bool _loading = true;
  String? _error;
  List<_Category> _categories = const [];

  // Cart lives on the screen (single-page lifetime). For persistence across
  // app restarts, lift this to a Riverpod provider backed by SharedPreferences.
  final List<CartLine> _cart = [];

  // Visual sugar — colors+icons keyed by backend category id; falls back to
  // a neutral palette for unknown categories.
  static const _palette = {
    'seed-feed': (Icons.eco, Color(0xFF34D399)),
    'aeration': (Icons.air, Color(0xFF38BDF8)),
    'cold-chain': (Icons.ac_unit, Color(0xFF60A5FA)),
    'diagnostic': (Icons.science, Color(0xFFA78BFA)),
    'infra': (Icons.construction, Color(0xFFFB923C)),
  };

  @override
  void initState() {
    super.initState();
    _loadCatalogue();
  }

  Future<void> _loadCatalogue() async {
    setState(() {
      _loading = true;
      _error = null;
    });
    try {
      final raw = await apiService.getMarketplaceCategories();
      if (!mounted) return;
      setState(() {
        _categories = raw.map((c) {
          final id = (c['id'] ?? '').toString();
          final palette = _palette[id] ?? (Icons.shopping_bag, const Color(0xFF94A3B8));
          final items = (c['items'] as List? ?? [])
              .map((raw) => _Item(
                    sku: (raw['sku'] ?? '').toString(),
                    name: (raw['name'] ?? '').toString(),
                    spec: (raw['spec'] ?? '').toString(),
                    low: (raw['low'] as num? ?? 0).toDouble(),
                    high: (raw['high'] as num? ?? 0).toDouble(),
                    unit: (raw['unit'] as String?) ?? '₹',
                  ))
              .toList();
          return _Category(
            id: id,
            label: (c['label'] ?? id).toString(),
            icon: palette.$1,
            color: palette.$2,
            items: items,
          );
        }).toList();
        _loading = false;
      });
    } catch (e) {
      if (!mounted) return;
      setState(() {
        _error = 'Could not load marketplace';
        _loading = false;
      });
    }
  }

  int get _cartCount => _cart.fold(0, (s, l) => s + l.qty);

  void _addToCart(_Item it) {
    // Use the midpoint of low/high as the order price. Replace with the live
    // price once a supplier-side pricing API exists; for now this matches
    // what the catalogue tile shows.
    final price = (it.low + it.high) / 2;
    setState(() {
      final existing = _cart.where((l) => l.sku == it.sku).cast<CartLine?>().firstWhere(
            (_) => true,
            orElse: () => null,
          );
      if (existing != null) {
        existing.qty++;
      } else {
        _cart.add(CartLine(
          sku: it.sku,
          name: it.name,
          spec: it.spec,
          unitPrice: price,
          qty: 1,
        ));
      }
    });
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text('${it.name} added to cart'),
        duration: const Duration(seconds: 1),
      ),
    );
  }

  Future<void> _openCart() async {
    final cleared = await Navigator.of(context).push<bool>(
      MaterialPageRoute(builder: (_) => CartScreen(cart: _cart)),
    );
    if (cleared == true && mounted) {
      setState(() => _cart.clear());
    } else {
      setState(() {}); // qty might have changed in cart screen
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Marketplace'),
        actions: [
          Stack(
            children: [
              IconButton(
                icon: const Icon(Icons.shopping_cart_outlined),
                onPressed: _openCart,
              ),
              if (_cartCount > 0)
                Positioned(
                  right: 4,
                  top: 4,
                  child: Container(
                    padding: const EdgeInsets.all(4),
                    decoration: const BoxDecoration(
                      color: Colors.red,
                      shape: BoxShape.circle,
                    ),
                    constraints: const BoxConstraints(minWidth: 18, minHeight: 18),
                    child: Text(
                      _cartCount > 99 ? '99+' : '$_cartCount',
                      style: const TextStyle(
                          color: Colors.white, fontSize: 10, fontWeight: FontWeight.bold),
                      textAlign: TextAlign.center,
                    ),
                  ),
                ),
            ],
          ),
        ],
      ),
      body: _loading
          ? const Center(child: CircularProgressIndicator())
          : _error != null
              ? _ErrorView(message: _error!, onRetry: _loadCatalogue)
              : _categories.isEmpty
                  ? const Center(child: Text('No categories available'))
                  : _buildContent(),
    );
  }

  Widget _buildContent() {
    final list = _categories[_catIdx].items;
    return Column(
      children: [
        SizedBox(
          height: 100,
          child: ListView.builder(
            scrollDirection: Axis.horizontal,
            padding: const EdgeInsets.symmetric(horizontal: 12),
            itemCount: _categories.length,
            itemBuilder: (_, i) {
              final c = _categories[i];
              final selected = i == _catIdx;
              return GestureDetector(
                onTap: () => setState(() => _catIdx = i),
                child: Container(
                  margin: const EdgeInsets.symmetric(horizontal: 4, vertical: 12),
                  padding: const EdgeInsets.all(12),
                  width: 110,
                  decoration: BoxDecoration(
                    color: selected ? c.color.withOpacity(0.15) : Colors.white,
                    borderRadius: BorderRadius.circular(12),
                    border: Border.all(
                        color: selected ? c.color : Colors.grey.shade300),
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Icon(c.icon, color: c.color, size: 20),
                      const Spacer(),
                      Text(c.label,
                          style: const TextStyle(
                              fontSize: 12, fontWeight: FontWeight.w600)),
                    ],
                  ),
                ),
              );
            },
          ),
        ),
        Expanded(
          child: RefreshIndicator(
            onRefresh: _loadCatalogue,
            child: ListView.separated(
              padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 4),
              itemCount: list.length,
              separatorBuilder: (_, __) => const SizedBox(height: 8),
              itemBuilder: (_, i) {
                final it = list[i];
                final mid = ((it.low + it.high) / 2);
                final inCart = _cart.any((l) => l.sku == it.sku);
                return Container(
                  padding: const EdgeInsets.all(14),
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(12),
                    border: Border.all(color: Colors.grey.shade200),
                  ),
                  child: Row(
                    children: [
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(it.name,
                                style: const TextStyle(
                                    fontWeight: FontWeight.w600, fontSize: 14)),
                            if (it.spec.isNotEmpty)
                              Text(it.spec,
                                  style: TextStyle(
                                      color: Colors.grey.shade600, fontSize: 12)),
                            const SizedBox(height: 6),
                            Text(
                              '${it.unit}${it.low.toStringAsFixed(0)} – ${it.high.toStringAsFixed(0)}',
                              style: const TextStyle(
                                  color: Color(0xFF0B5394),
                                  fontWeight: FontWeight.bold),
                            ),
                          ],
                        ),
                      ),
                      FilledButton.tonalIcon(
                        onPressed: () => _addToCart(it),
                        icon: Icon(inCart ? Icons.check : Icons.add_shopping_cart, size: 16),
                        label: Text(inCart ? 'Added' : '₹${mid.toStringAsFixed(0)}'),
                      ),
                    ],
                  ),
                );
              },
            ),
          ),
        ),
      ],
    );
  }
}

class _ErrorView extends StatelessWidget {
  final String message;
  final VoidCallback onRetry;
  const _ErrorView({required this.message, required this.onRetry});

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          const Icon(Icons.cloud_off, size: 48, color: Colors.grey),
          const SizedBox(height: 12),
          Text(message),
          const SizedBox(height: 12),
          FilledButton.tonal(onPressed: onRetry, child: const Text('Retry')),
        ],
      ),
    );
  }
}

class _Category {
  final String id;
  final String label;
  final IconData icon;
  final Color color;
  final List<_Item> items;
  const _Category({
    required this.id,
    required this.label,
    required this.icon,
    required this.color,
    required this.items,
  });
}

class _Item {
  final String sku;
  final String name;
  final String spec;
  final double low;
  final double high;
  final String unit;
  const _Item({
    required this.sku,
    required this.name,
    required this.spec,
    required this.low,
    required this.high,
    required this.unit,
  });
}

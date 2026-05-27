import 'package:flutter/material.dart';
import '../../services/api_service.dart';

/// Cart line item — matches the JSON shape the backend's checkout route accepts.
class CartLine {
  final String sku;
  final String name;
  final String spec;
  final double unitPrice;
  int qty;
  CartLine({
    required this.sku,
    required this.name,
    required this.spec,
    required this.unitPrice,
    this.qty = 1,
  });
  double get lineTotal => qty * unitPrice;
  Map<String, dynamic> toJson() => {
        'sku': sku,
        'name': name,
        'qty': qty,
        'unit_price': unitPrice,
      };
}

/// CartScreen renders the lines currently in the cart and a checkout form.
/// `cart` is mutated in place so the caller's badge updates when items are
/// removed; we `pop(true)` after successful checkout so the caller can clear.
class CartScreen extends StatefulWidget {
  final List<CartLine> cart;
  const CartScreen({super.key, required this.cart});

  @override
  State<CartScreen> createState() => _CartScreenState();
}

class _CartScreenState extends State<CartScreen> {
  final _form = GlobalKey<FormState>();
  final _name = TextEditingController();
  final _phone = TextEditingController();
  final _email = TextEditingController();
  final _pin = TextEditingController();
  final _address = TextEditingController();
  final _notes = TextEditingController();
  bool _busy = false;

  @override
  void dispose() {
    _name.dispose();
    _phone.dispose();
    _email.dispose();
    _pin.dispose();
    _address.dispose();
    _notes.dispose();
    super.dispose();
  }

  double get _subtotal =>
      widget.cart.fold(0.0, (s, l) => s + l.lineTotal);

  Future<void> _checkout() async {
    if (widget.cart.isEmpty) return;
    if (!(_form.currentState?.validate() ?? false)) return;
    setState(() => _busy = true);
    try {
      final res = await apiService.checkoutCart(
        items: widget.cart.map((l) => l.toJson()).toList(),
        contactName: _name.text.trim(),
        contactPhone: _phone.text.trim(),
        contactEmail: _email.text.trim(),
        deliveryPin: _pin.text.trim(),
        deliveryAddress: _address.text.trim(),
        notes: _notes.text.trim(),
      );
      if (!mounted) return;
      // Show a confirmation dialog with the order id, then pop the cart screen.
      await showDialog<void>(
        context: context,
        builder: (_) => AlertDialog(
          title: const Text('Order placed'),
          content: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Icon(Icons.check_circle, color: Colors.green, size: 48),
              const SizedBox(height: 8),
              Text('Order #${res['order_id']}',
                  style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 18)),
              const SizedBox(height: 4),
              Text('${res['item_count']} items · ₹${res['subtotal_inr']}'),
              const SizedBox(height: 12),
              const Text(
                'A team member will call you within 24 h to confirm delivery details.',
                style: TextStyle(fontSize: 12),
              ),
            ],
          ),
          actions: [
            FilledButton(
              onPressed: () => Navigator.of(context).pop(),
              child: const Text('Done'),
            ),
          ],
        ),
      );
      if (!mounted) return;
      Navigator.pop(context, true); // signal caller to clear cart
    } on Object catch (e) {
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(SnackBar(
        content: Text('Could not place order: ${e.toString().split(":").last.trim()}'),
      ));
    } finally {
      if (mounted) setState(() => _busy = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Cart')),
      body: widget.cart.isEmpty
          ? const Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Icon(Icons.shopping_cart_outlined, size: 64, color: Colors.grey),
                  SizedBox(height: 12),
                  Text('Your cart is empty', style: TextStyle(color: Colors.grey)),
                ],
              ),
            )
          : ListView(
              padding: const EdgeInsets.all(12),
              children: [
                // Cart lines
                ...widget.cart.map((l) => Card(
                      margin: const EdgeInsets.only(bottom: 8),
                      child: Padding(
                        padding: const EdgeInsets.all(12),
                        child: Row(
                          children: [
                            Expanded(
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Text(l.name,
                                      style: const TextStyle(fontWeight: FontWeight.w600)),
                                  if (l.spec.isNotEmpty)
                                    Text(l.spec,
                                        style: const TextStyle(
                                            fontSize: 11, color: Colors.grey)),
                                  const SizedBox(height: 4),
                                  Text('₹${l.unitPrice.toStringAsFixed(2)} each',
                                      style: const TextStyle(fontSize: 12)),
                                ],
                              ),
                            ),
                            Row(
                              children: [
                                IconButton(
                                  icon: const Icon(Icons.remove_circle_outline),
                                  onPressed: () {
                                    setState(() {
                                      if (l.qty > 1) {
                                        l.qty--;
                                      } else {
                                        widget.cart.remove(l);
                                      }
                                    });
                                  },
                                ),
                                Text('${l.qty}',
                                    style: const TextStyle(fontWeight: FontWeight.bold)),
                                IconButton(
                                  icon: const Icon(Icons.add_circle_outline),
                                  onPressed: () {
                                    if (l.qty < 999) {
                                      setState(() => l.qty++);
                                    }
                                  },
                                ),
                              ],
                            ),
                          ],
                        ),
                      ),
                    )),
                const Divider(height: 24),
                // Checkout form
                Form(
                  key: _form,
                  child: Column(
                    children: [
                      TextFormField(
                        controller: _name,
                        decoration: const InputDecoration(
                            labelText: 'Your name *',
                            border: OutlineInputBorder()),
                        validator: (v) =>
                            (v == null || v.trim().isEmpty) ? 'Required' : null,
                      ),
                      const SizedBox(height: 10),
                      TextFormField(
                        controller: _phone,
                        keyboardType: TextInputType.phone,
                        decoration: const InputDecoration(
                            labelText: 'Phone *',
                            border: OutlineInputBorder()),
                        validator: (v) {
                          final d = (v ?? '').replaceAll(RegExp(r'\D'), '');
                          if (d.length < 10) return '10-digit phone required';
                          return null;
                        },
                      ),
                      const SizedBox(height: 10),
                      TextFormField(
                        controller: _email,
                        keyboardType: TextInputType.emailAddress,
                        decoration: const InputDecoration(
                            labelText: 'Email (optional)',
                            border: OutlineInputBorder()),
                        validator: (v) {
                          if (v == null || v.trim().isEmpty) return null;
                          if (!RegExp(r'\S+@\S+\.\S+').hasMatch(v.trim())) {
                            return 'Invalid email';
                          }
                          return null;
                        },
                      ),
                      const SizedBox(height: 10),
                      TextFormField(
                        controller: _pin,
                        keyboardType: TextInputType.number,
                        decoration: const InputDecoration(
                            labelText: 'Delivery PIN code',
                            border: OutlineInputBorder()),
                        validator: (v) {
                          if (v == null || v.trim().isEmpty) return null;
                          if (!RegExp(r'^[0-9]{6}$').hasMatch(v.trim())) {
                            return 'PIN must be 6 digits';
                          }
                          return null;
                        },
                      ),
                      const SizedBox(height: 10),
                      TextFormField(
                        controller: _address,
                        maxLines: 2,
                        decoration: const InputDecoration(
                            labelText: 'Delivery address',
                            border: OutlineInputBorder()),
                      ),
                      const SizedBox(height: 10),
                      TextFormField(
                        controller: _notes,
                        maxLines: 2,
                        decoration: const InputDecoration(
                            labelText: 'Notes (optional)',
                            border: OutlineInputBorder()),
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 16),
                // Subtotal + checkout
                Container(
                  padding: const EdgeInsets.all(16),
                  decoration: BoxDecoration(
                    color: const Color(0xFF38BDF8).withOpacity(0.08),
                    borderRadius: BorderRadius.circular(10),
                  ),
                  child: Row(
                    children: [
                      const Text('Subtotal',
                          style: TextStyle(fontWeight: FontWeight.w600)),
                      const Spacer(),
                      Text('₹${_subtotal.toStringAsFixed(2)}',
                          style: const TextStyle(
                              fontWeight: FontWeight.bold, fontSize: 18)),
                    ],
                  ),
                ),
                const SizedBox(height: 12),
                SizedBox(
                  width: double.infinity,
                  child: FilledButton.icon(
                    onPressed: _busy ? null : _checkout,
                    icon: _busy
                        ? const SizedBox(
                            width: 16,
                            height: 16,
                            child: CircularProgressIndicator(
                                strokeWidth: 2, color: Colors.white),
                          )
                        : const Icon(Icons.check),
                    label: Text(_busy ? 'Placing order…' : 'Place order'),
                  ),
                ),
                const SizedBox(height: 8),
                const Text(
                  'No payment required now — a team member confirms by phone within 24 h.',
                  textAlign: TextAlign.center,
                  style: TextStyle(fontSize: 11, color: Colors.grey),
                ),
              ],
            ),
    );
  }
}

import 'package:flutter/material.dart';

class MarketplaceScreen extends StatefulWidget {
  const MarketplaceScreen({super.key});

  @override
  State<MarketplaceScreen> createState() => _MarketplaceScreenState();
}

class _MarketplaceScreenState extends State<MarketplaceScreen> {
  int _catIdx = 0;

  final List<_Category> _categories = const [
    _Category('Seed & Feed', Icons.eco, Color(0xFF34D399)),
    _Category('Aeration & O₂', Icons.air, Color(0xFF38BDF8)),
    _Category('Ice & Cold Chain', Icons.ac_unit, Color(0xFF60A5FA)),
    _Category('Diagnostic Kits', Icons.science, Color(0xFFA78BFA)),
    _Category('Pond Infra', Icons.construction, Color(0xFFFB923C)),
  ];

  final Map<int, List<_Item>> _items = const {
    0: [
      _Item('PL Seed (MPEDA)', 'L. vannamei · AI-QC linked', '₹0.30 – 0.55/PL'),
      _Item('Starter Feed CP', '40% protein, crumble', '₹95 – 130/kg'),
      _Item('Grower Feed', '36-38% protein, pellet', '₹80 – 110/kg'),
      _Item('Probiotic', 'water + gut blend', '₹350 – 800/kg'),
      _Item('Test Kits — full set', 'pH, DO, NH3, NO2, salinity', '₹1,200 – 3,500'),
      _Item('Quicklime (CaO)', 'EHP eradication grade', '₹8 – 14/kg'),
    ],
    1: [
      _Item('Paddle wheel 1 HP', '0.5 acre coverage', '₹18,000 – 28,000'),
      _Item('Paddle wheel 2 HP', '1 acre coverage', '₹32,000 – 45,000'),
      _Item('Aspirator aerator', 'submersible / per HP', '₹12,000 – 25,000'),
      _Item('Liquid O₂ tank 250L', '', '₹35,000 – 55,000'),
      _Item('PSA O₂ generator 10 LPM', '', '₹1.8 L – 2.8 L'),
      _Item('Emergency O₂ kit', 'transport · 1-2 hr', '₹4,500 – 8,000'),
    ],
    2: [
      _Item('Block Ice (bulk)', 'delivered', '₹3 – 6/kg'),
      _Item('Flake Ice (hatchery)', 'hatchery grade', '₹5 – 9/kg'),
      _Item('Insulated Fish Box 200L', '', '₹4,500 – 8,000'),
      _Item('Reefer 20ft rental', 'per day', '₹2,500 – 4,500'),
      _Item('Cold Storage', 'per kg / day', '₹1.5 – 4'),
    ],
    3: [
      _Item('USB Pen Microscope', '400-1000x · LED', '₹1,500 – 5,000'),
      _Item('IntensLight LED ring', '5 brightness levels', '₹500 – 1,500'),
      _Item('Counting Tray (white)', '20×20 cm acrylic', '₹200 – 500'),
      _Item('Phone Stand Clip', '20-25 cm height', '₹150 – 400'),
      _Item('Clip-on Macro Lens', '20-40× magnification', '₹500 – 1,500'),
      _Item('VLE Bundle Kit', 'complete diagnostic set', '₹3,000 – 9,150'),
    ],
    4: [
      _Item('HDPE Pond Liner', 'per sqm', '₹45 – 120'),
      _Item('Sluice Gate / Monk', 'standard pond', '₹8,000 – 25,000'),
      _Item('Bird Net', 'per acre', '₹12,000 – 30,000'),
      _Item('Genset 5-25 kVA', '', '₹35,000 – 2,50,000'),
      _Item('Solar Pump + Panel', 'off-grid pond', '₹65,000 – 2,20,000'),
      _Item('IoT Sensor Pack', 'pH/DO/Temp/Salin.', '₹12,000 – 45,000'),
    ],
  };

  @override
  Widget build(BuildContext context) {
    final list = _items[_catIdx] ?? const <_Item>[];
    return Scaffold(
      appBar: AppBar(title: const Text('Marketplace')),
      body: Column(
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
            child: ListView.separated(
              padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 4),
              itemCount: list.length,
              separatorBuilder: (_, __) => const SizedBox(height: 8),
              itemBuilder: (_, i) {
                final it = list[i];
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
                            Text(it.price,
                                style: const TextStyle(
                                    color: Color(0xFF0B5394),
                                    fontWeight: FontWeight.bold)),
                          ],
                        ),
                      ),
                      OutlinedButton(
                        onPressed: () {},
                        style: OutlinedButton.styleFrom(
                            foregroundColor: const Color(0xFF0B5394)),
                        child: const Text('Quote'),
                      ),
                    ],
                  ),
                );
              },
            ),
          ),
        ],
      ),
    );
  }
}

class _Category {
  final String label;
  final IconData icon;
  final Color color;
  const _Category(this.label, this.icon, this.color);
}

class _Item {
  final String name;
  final String spec;
  final String price;
  const _Item(this.name, this.spec, this.price);
}

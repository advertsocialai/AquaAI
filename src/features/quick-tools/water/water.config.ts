/** Safe ranges for pond water parameters (Vannamei grow-out, industry norms).
 *  `green` = optimal, `amber` = acceptable; outside `amber` = red. */
export type WaterParam = {
  key: string;
  label: string;
  unit: string;
  green: [number, number];
  amber: [number, number];
  /** which direction is the risk when out of range (for guidance) */
  fix: { low: string; high: string };
};

export const WATER_PARAMS: WaterParam[] = [
  { key: 'ph', label: 'pH', unit: '', green: [7.5, 8.3], amber: [7.0, 8.8],
    fix: { low: 'Apply lime to raise pH.', high: 'Reduce pH — partial water exchange / molasses.' } },
  { key: 'do', label: 'Dissolved O₂', unit: 'mg/L', green: [5, 9], amber: [4, 12],
    fix: { low: 'Run aerators — DO is low.', high: 'High DO from algal bloom — monitor at dawn.' } },
  { key: 'temp', label: 'Temperature', unit: '°C', green: [28, 32], amber: [25, 34],
    fix: { low: 'Water too cold — reduce feed.', high: 'Water too hot — deepen water, feed at cooler hours.' } },
  { key: 'salinity', label: 'Salinity', unit: 'ppt', green: [10, 25], amber: [5, 35],
    fix: { low: 'Salinity low — add sea/bore water.', high: 'Salinity high — add fresh water.' } },
  { key: 'ammonia', label: 'Total ammonia', unit: 'mg/L', green: [0, 0.5], amber: [0, 1.0],
    fix: { low: '', high: 'Ammonia high — exchange water, cut feed, dose probiotics.' } },
  { key: 'nitrite', label: 'Nitrite', unit: 'mg/L', green: [0, 1], amber: [0, 4],
    fix: { low: '', high: 'Nitrite high — exchange water, boost aeration.' } },
  { key: 'alkalinity', label: 'Alkalinity', unit: 'mg/L', green: [100, 150], amber: [80, 200],
    fix: { low: 'Alkalinity low — apply agricultural lime.', high: 'Alkalinity high — partial exchange.' } },
];

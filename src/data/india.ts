/** Reference data for the profile form dropdowns. */

/** Self-described user roles (profile-level, distinct from auth routing role). */
export const PROFILE_ROLES = [
  'Farmer',
  'Hatchery',
  'Supplier',
  'Technician',
  'Trader',
  'Student',
  'Others',
] as const;

/** Indian states & union territories. */
export const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chandigarh',
  'Chhattisgarh', 'Dadra and Nagar Haveli', 'Daman and Diu', 'Delhi', 'Goa',
  'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jammu and Kashmir', 'Jharkhand',
  'Karnataka', 'Kerala', 'Ladakh', 'Lakshadweep', 'Madhya Pradesh',
  'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha',
  'Puducherry', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana',
  'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
] as const;

/**
 * Districts per state. Populated for the aquaculture-heavy states; other
 * states fall back to a free-text district entry in the form.
 */
export const DISTRICTS_BY_STATE: Record<string, string[]> = {
  'Andhra Pradesh': [
    'Visakhapatnam', 'Nellore', 'East Godavari', 'Srikakulam', 'West Godavari',
    'Krishna', 'Prakasam', 'Guntur', 'Vijayanagaram', 'Chittor', 'Anantapur',
    'Kadapa', 'Kurnool',
  ],
  'Telangana': ['Hyderabad', 'Rangareddy', 'Khammam', 'Nalgonda', 'Warangal', 'Karimnagar'],
  'Tamil Nadu': ['Nagapattinam', 'Thanjavur', 'Cuddalore', 'Ramanathapuram', 'Thoothukudi', 'Chennai'],
  'Odisha': ['Balasore', 'Bhadrak', 'Kendrapara', 'Jagatsinghpur', 'Puri', 'Ganjam'],
  'West Bengal': ['South 24 Parganas', 'North 24 Parganas', 'Purba Medinipur', 'Howrah', 'Nadia'],
  'Kerala': ['Alappuzha', 'Ernakulam', 'Kollam', 'Thrissur', 'Kannur', 'Kozhikode'],
  'Gujarat': ['Surat', 'Navsari', 'Valsad', 'Bharuch', 'Kutch', 'Junagadh'],
};

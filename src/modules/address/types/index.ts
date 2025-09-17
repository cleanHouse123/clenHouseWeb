export interface Address {
  value: string;
  unrestricted_value: string;
  display: string;
  region: string | null;
  region_with_type: string | null;
  area: string | null;
  area_with_type: string | null;
  city: string | null;
  city_with_type: string | null;
  settlement: string | null;
  settlement_with_type: string | null;
  is_microdistrict: boolean;
  city_or_settlement: string | null;
  street: string | null;
  street_with_type: string | null;
  house: string | null;
  postal_code: string | null;
  geo_lat: string | null;
  geo_lon: string | null;
  fias_id: string | null;
  fias_level: string | null;
  kladr_id: string | null;
  okato: string | null;
  oktmo: string | null;
  tax_office: string | null;
}
export const handleFeedback = async (message, wp_email) => {
  // optional safety: if for some reason wp_email is missing in prod,
  // you could early-return or log it:
  // if (!wp_email) console.warn("No wp_email for feedback");

  await fetch(
    "/api/wp-json/calc/v1/ems_suspended_calculator_feedback",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message,
        wp_email, // will be siddhesh@engineeringexpress.com in dev
      }),
    }
  );
};

export function computeScrewCount(roofingStyle = '') {
  const s = String(roofingStyle).trim().toLowerCase();
  if (s === 'deck pan') return 2;
  if (s === 'foam panel') return 3;
  return 5; // default for any other
}

export const REQUIRED_FIELDS = [
  { name: "wind_speed", label: "Wind Speed" },
  { name: "exposure_category", label: "Exposure Category" },
  { name: "ground_snow_load", label: "Ground Snow Load" },
  { name: "beam_item_name", label: "Beam Item Name" },
  { name: "strut_beam_item_name", label: "Strut Beam Item Name" },
  { name: "hanger_arm_item_name", label: "Hanger Arm Item Name" },
  { name: "roof_element_direction", label: "Roof Element Direction" },
  { name: "canopy_total_x_width_projection", label: "Canopy Projection" },
  { name: "canopy_total_y_length", label: "Canopy Total Length" },
  { name: "spacing_between_hanger_arms_or_struts", label: "Spacing Between Hanger Arms / Struts" },
  { name: "perimeterBeamOverhangValue", label: "End Overhang" },
  { name: "roof_element_item_name", label: "Roof Element Item Name" },
  { name: "upper_roof_length", label: "Upper Roof Length" },
  { name: "hanger_arm_attachment_distance_from_canopy_edge", label: "Hanger Arm Attachment Distance From Edge" },
  { name: "hanger_arm_height_above_canopy", label: "Hanger Arm Height Above Canopy" },
  { name: "canopy_installation_height", label: "Canopy Installation Height" },
  { name: "mean_roof_height", label: "Mean Roof Height" },
  { name: "corner_canopy_condition", label: "Corner Canopy Condition" },
  { name: "diagonal_strut_condition", label: "Diagnol strut condition", dependsOn: "corner_canopy_condition", requiredEquals: "TRUE" },
  { name: "numof_screws_for_roof_element_to_beam", label: "Number of Screws (Roof Element → Beam)" },
  { name: "host_material", label: "Host Material" },
  { name: "client_top_wall_plate_options", label: "Mounting Plate Item Name" },
  { name: "top_wall_plate_anchor_type_dc_or_tb", label: "Top Wall Plate Anchor Type (DC or TB)" },
  { name: "top_wall_plate_anchor_dia_selection", label: "Top Wall Plate Anchor Diameter" },
  { name: "bottom_anchor_connection_dc_or_tb", label: "Bottom Anchor Connection (DC or TB)" },
  { name: "bottom_anchor_connection", label: "Bottom Anchor Connection" },
  { name: "bottom_anchor_dia_selection", label: "Bottom Anchor Diameter" },
];

export const normalize = (v) => String(v ?? "").trim().toUpperCase();

export const isFieldActuallyRequired = (field, form) => {
  if (!field.dependsOn) return true; // always required if no dependency
  const depVal = normalize(form?.[field.dependsOn]);
  const want = normalize(field.requiredEquals ?? "TRUE");
  return depVal === want;
};

export const isEmpty = (v) =>
  v == null ||
  (typeof v === "string" && v.trim() === "") ||
  (Array.isArray(v) && v.length === 0);

export const isInteger = (v) => /^\d+$/.test(v);

export const isDecimalNumber = (v) => v !== "" && !isNaN(Number(v));

// validations for windspeed
// bounds
export const MIN_WIND = 95;
export const MAX_WIND = 300;

export const inRange = (v) => {
  if (!isInteger(v)) return false;
  const n = Number(v);
  return n >= MIN_WIND && n <= MAX_WIND;
};

//Validations for ground snow load
// bounds for snow load (psf)
export const MIN_SNOW = 0;
export const MAX_SNOW = 50;
export const inRangeSnow = (v) => {
  if (!isInteger(v)) return false;
  const n = Number(v);
  return n >= MIN_SNOW && n <= MAX_SNOW;
};

//Validations for overhang
// bounds
export const MIN_OVERHANG = 0;
export const MAX_OVERHANG = 4;

export const inRangeOverhang = (v) => {
  if (!isDecimalNumber(v)) return false;
  const n = Number(v);
  return n >= MIN_OVERHANG && n <= MAX_OVERHANG;
};

// Validations for Canopy total length
export const MIN_CANOPY_LEN = 1;
export const MAX_CANOPY_LEN = 3000;

export const inRangeCanopyLen = (v) => {
  if (!isDecimalNumber(v)) return false;
  const n = Number(v);
  return n >= MIN_CANOPY_LEN && n <= MAX_CANOPY_LEN;
};

// Validations for Spacing between struts
// Bounds for strut spacing (ft)
export const MIN_STRUT_SPACING = 1;
export const MAX_STRUT_SPACING = 8;

export const inRangeStrutSpacing = (v) => {
  if (!isDecimalNumber(v)) return false;
  const n = Number(v);
  return n >= MIN_STRUT_SPACING && n <= MAX_STRUT_SPACING;
};

//Validations for Canopy Projection
// bounds for canopy projection (ft)
export const MIN_CANOPY_PROJ = 1;
export const MAX_CANOPY_PROJ = 8;
export const inRangeCanopyProj = (v) => {
  if (!isDecimalNumber(v)) return false;
  const n = Number(v);
  return n >= MIN_CANOPY_PROJ && n <= MAX_CANOPY_PROJ;
};

//Validations for Hanger Edge Distance
// bounds
export const MIN_HANGER_EDGE = 0;
export const MAX_HANGER_EDGE = 4;

export const inRangeHangerEdge = (v) => {
  if (!isDecimalNumber(v)) return false;
  const n = Number(v);
  return n >= MIN_HANGER_EDGE && n <= MAX_HANGER_EDGE;
};

// Validations for canopy install height
export const MIN_INSTALL = 1;
export const MAX_INSTALL = 30;

export const inRangeInstall = (v) => {
  if (!isDecimalNumber(v)) return false;
  const n = Number(v);
  return n >= MIN_INSTALL && n <= MAX_INSTALL;
};

// Validations for hanger arm height
export const MIN_HANGER_HEIGHT = 1;
export const MAX_HANGER_HEIGHT = 8;

export const inRangeHangerHeight = (v) => {
  if (v === "" || isNaN(Number(v))) return false;
  const n = Number(v);
  return n >= MIN_HANGER_HEIGHT && n <= MAX_HANGER_HEIGHT;
};

// Validations for mean roof height
// Bounds
export const MIN_MEAN_ROOF = 1;
export const MAX_MEAN_ROOF = 100;

export const inRangeMeanRoof = (v) => {
  if (v === "" || isNaN(Number(v))) return false;
  const n = Number(v);
  return n >= MIN_MEAN_ROOF && n <= MAX_MEAN_ROOF;
};

//Validations for Deck pan overhang input
export const MIN_DECKPAN_OVERHANG = 0;
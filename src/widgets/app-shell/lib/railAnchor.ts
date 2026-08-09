const RAIL_WIDTH_PX = 60;
const RAIL_ANCHOR_GAP_PX = 8;

const railSideOffset = (controlSizePx: number): number =>
  (RAIL_WIDTH_PX - controlSizePx) / 2 + RAIL_ANCHOR_GAP_PX;

export const RAIL_NAV_ANCHOR_OFFSET = railSideOffset(38);
export const RAIL_UTILITY_ANCHOR_OFFSET = railSideOffset(30);

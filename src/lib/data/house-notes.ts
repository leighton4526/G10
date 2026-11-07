/**
 * Houses on this currency. Last four weeks. A call has to name the currency
 * and a direction. This stamp did not re-open the house pages.
 * Saturday’s notes are not carried. A level that was not checked against
 * Friday’s close is not left on the tile.
 *
 * Last opened Sunday 4 Oct 2026. This stamp did not re-open the house pages.
 * The empty line names that date. It is not this stamp.
 */
import { assertHouses } from "./desk-hard-copy";

export type HouseCall = {
  house: string;
  asOf: string;
  direction: string;
  said: string;
  valid: string;
};

export const HOUSE_BY_CURRENCY: Record<string, HouseCall[]> = {
  usd: [],
  eur: [],
  gbp: [],
  jpy: [],
  chf: [],
  aud: [],
  cad: [],
  nzd: [],
};

export const HOUSE_EMPTY =
  "Last opened Sunday 4 Oct 2026. No house call is filled in. A note from Saturday is not carried.";

assertHouses(HOUSE_BY_CURRENCY);

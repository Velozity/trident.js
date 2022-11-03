import Trident from "./index.js";
import * as Oceanic from "oceanic.js";

export default function (tridentOptions) {
  return new Trident.TridentClient(tridentOptions);
}

export const {
  TridentClient,
  Constants,
  Embed,
  Command,
  Event,
  VERSION,
  OceanicTypes,
  Oceanic,
} = Trident;

export interface BankBranch {
  id: string;
  nameKey: string;
  addressKey: string;
  latitude: number;
  longitude: number;
  foreignSupport: boolean;
  distanceKm: number;
  successfulExperiences: number;
  verifiedAt: string;
}

/** FN-3101~FN-3105. Server branch data will replace this demonstration seed. */
export const BANK_BRANCHES: BankBranch[] = [
  {
    id: "hana-dunsan",
    nameKey: "flow.branch1",
    addressKey: "flow.branch1Address",
    latitude: 36.35149,
    longitude: 127.38664,
    foreignSupport: true,
    distanceKm: 3.2,
    successfulExperiences: 12,
    verifiedAt: "2026-08-01",
  },
  {
    id: "kb-junggu",
    nameKey: "flow.branch2",
    addressKey: "flow.branch2Address",
    latitude: 36.32189,
    longitude: 127.42128,
    foreignSupport: false,
    distanceKm: 5.8,
    successfulExperiences: 7,
    verifiedAt: "2026-07-28",
  },
  {
    id: "shinhan-wonsin",
    nameKey: "flow.branch3",
    addressKey: "flow.branch3Address",
    latitude: 36.34662,
    longitude: 127.44148,
    foreignSupport: false,
    distanceKm: 7.1,
    successfulExperiences: 0,
    verifiedAt: "2026-07-21",
  },
];

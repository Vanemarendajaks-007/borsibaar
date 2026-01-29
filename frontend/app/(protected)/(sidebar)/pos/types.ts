import type { components } from "@/generated/api"

export type CurrentUser = components["schemas"]["CurrentUser"] & { id: string | number }
export type BarStation = components["schemas"]["BarStationResponseDto"];
export type User = components["schemas"]["UserSummaryResponseDto"];


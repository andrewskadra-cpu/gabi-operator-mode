import type { OperatorState } from "./operator-state.ts";

export interface ExportAccount {
  readonly id: string;
  readonly email: string;
  readonly displayName: string;
}

export interface ExecutiveDataExport {
  readonly format: "skadra-g-ops-backup";
  readonly formatVersion: 2;
  readonly exportedAt: string;
  readonly account: ExportAccount & {
    readonly executiveRole: OperatorState["profile"]["executiveRole"];
  };
  readonly operatorState: OperatorState;
}

export function createExecutiveDataExport(
  account: ExportAccount,
  state: OperatorState,
  exportedAt = new Date().toISOString(),
): ExecutiveDataExport {
  return {
    format: "skadra-g-ops-backup",
    formatVersion: 2,
    exportedAt,
    account: {
      ...account,
      executiveRole: state.profile.executiveRole,
    },
    operatorState: state,
  };
}


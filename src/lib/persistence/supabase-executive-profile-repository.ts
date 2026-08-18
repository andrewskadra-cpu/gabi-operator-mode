import type { SupabaseClient } from "@supabase/supabase-js";
import type { ExecutiveRole } from "../domain/executive-role.ts";
import { isExecutiveRole } from "../domain/executive-role.ts";
import type { Database } from "../supabase/database.types.ts";

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

export interface ExecutiveRoleAssignment {
  readonly role: ExecutiveRole;
  readonly selectedAt: string;
}

export class SupabaseExecutiveProfileRepository {
  private readonly client: SupabaseClient<Database>;

  constructor(client: SupabaseClient<Database>) {
    this.client = client;
  }

  async assignRole(role: ExecutiveRole): Promise<ExecutiveRoleAssignment> {
    const { data, error } = await this.client.rpc("assign_executive_role", {
      p_role: role,
    });

    if (error) {
      throw new Error(`Unable to assign the executive role: ${error.message}`);
    }

    if (
      !isRecord(data) ||
      !isExecutiveRole(data.role) ||
      typeof data.selectedAt !== "string"
    ) {
      throw new Error("Supabase did not confirm the executive role assignment.");
    }

    return { role: data.role, selectedAt: data.selectedAt };
  }
}

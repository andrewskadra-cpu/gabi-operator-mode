export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: Record<string, never>;
    Views: Record<string, never>;
    Functions: {
      assign_executive_role: {
        Args: { p_role: string };
        Returns: Json;
      };
      load_executive_state: {
        Args: Record<PropertyKey, never>;
        Returns: Json;
      };
      load_operator_state: {
        Args: Record<PropertyKey, never>;
        Returns: Json;
      };
      save_operator_state: {
        Args: {
          p_expected_revision: number;
          p_request_id: string;
          p_state: Json;
        };
        Returns: Json;
      };
      save_executive_state: {
        Args: {
          p_expected_revision: number;
          p_request_id: string;
          p_state: Json;
        };
        Returns: Json;
      };
    };
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};

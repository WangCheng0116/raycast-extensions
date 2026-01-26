import { exec } from "child_process";
import { promisify } from "util";
import * as os from "os";
import * as path from "path";
import { Profile, ClaudeCodeConfig } from "../types";

const execAsync = promisify(exec);

const CC_SWITCH_DB_PATH = path.join(os.homedir(), ".cc-switch", "cc-switch.db");

/**
 * Check if CC Switch database exists
 */
export async function ccSwitchDatabaseExists(): Promise<boolean> {
  try {
    const { stdout } = await execAsync(`test -f "${CC_SWITCH_DB_PATH}" && echo "exists"`);
    return stdout.trim() === "exists";
  } catch {
    return false;
  }
}

/**
 * Get all Claude Code providers from CC Switch database
 */
export async function getCCSwitchProfiles(): Promise<CCProviderData[]> {
  const exists = await ccSwitchDatabaseExists();
  if (!exists) {
    throw new Error(`CC Switch database not found at ${CC_SWITCH_DB_PATH}`);
  }

  try {
    const query = `SELECT id, name, settings_config, is_current, notes, created_at FROM providers WHERE app_type='claude' ORDER BY sort_index, name`;
    const { stdout } = await execAsync(`sqlite3 -json "${CC_SWITCH_DB_PATH}" "${query}"`);

    if (!stdout.trim()) {
      return [];
    }

    const rawData = JSON.parse(stdout) as RawCCProviderRow[];
    return rawData.map((row: RawCCProviderRow) => ({
      id: row.id,
      name: row.name,
      settings_config: JSON.parse(row.settings_config),
      is_current: row.is_current === 1,
      notes: row.notes || undefined,
      created_at: row.created_at,
    }));
  } catch (error) {
    throw new Error(`Failed to read CC Switch database: ${(error as Error).message}`);
  }
}

/**
 * Convert CC Switch provider to Raycast profile format
 */
export function convertCCSwitchToProfile(
  provider: CCProviderData
): Omit<Profile, "id" | "createdAt" | "updatedAt"> {
  const config: ClaudeCodeConfig = {
    ...provider.settings_config,
  };

  return {
    name: provider.name,
    description:
      provider.notes || `Imported from CC Switch${provider.is_current ? " (was active)" : ""}`,
    config,
  };
}

/**
 * Get the currently active profile from CC Switch
 */
export async function getCCSwitchActiveProfile(): Promise<CCProviderData | null> {
  const profiles = await getCCSwitchProfiles();
  return profiles.find((p) => p.is_current) || null;
}

/**
 * Import all profiles from CC Switch
 */
export async function importAllFromCCSwitch(): Promise<
  Array<Omit<Profile, "id" | "createdAt" | "updatedAt">>
> {
  const providers = await getCCSwitchProfiles();

  // Filter out the default provider if it has no custom config
  const filtered = providers.filter((p) => {
    if (p.name === "default") {
      const config = p.settings_config;
      // Check if it's just the basic default config
      const keys = Object.keys(config);
      if (keys.length <= 2 && keys.includes("model") && keys.includes("includeCoAuthoredBy")) {
        return false;
      }
    }
    return true;
  });

  return filtered.map(convertCCSwitchToProfile);
}

// Types
export interface CCProviderData {
  id: string;
  name: string;
  settings_config: ClaudeCodeConfig;
  is_current: boolean;
  notes?: string;
  created_at?: number;
}

interface RawCCProviderRow {
  id: string;
  name: string;
  settings_config: string;
  is_current: number;
  notes?: string;
  created_at?: number;
}

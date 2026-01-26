import { exec } from "child_process";
import { promisify } from "util";
import * as os from "os";
import * as path from "path";
import { Profile } from "../types";

const execAsync = promisify(exec);

const CC_SWITCH_DB_PATH = path.join(os.homedir(), ".cc-switch", "cc-switch.db");
const APP_TYPE = "claude";

/**
 * Execute SQLite query
 */
async function executeSqlite(query: string, outputJson = true): Promise<string> {
  const jsonFlag = outputJson ? "-json" : "";
  try {
    const { stdout } = await execAsync(`sqlite3 ${jsonFlag} "${CC_SWITCH_DB_PATH}" "${query}"`);
    return stdout;
  } catch (error) {
    throw new Error(`SQLite query failed: ${(error as Error).message}`);
  }
}

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
 * Get all profiles from CC Switch
 */
export async function getProfiles(): Promise<Profile[]> {
  const exists = await ccSwitchDatabaseExists();
  if (!exists) {
    return [];
  }

  try {
    const query = `SELECT id, name, settings_config, is_current, notes, created_at, sort_index FROM providers WHERE app_type='${APP_TYPE}' ORDER BY sort_index, name`;
    const result = await executeSqlite(query);

    if (!result.trim()) {
      return [];
    }

    const rows = JSON.parse(result) as CCProviderRow[];

    return rows
      .filter((row: CCProviderRow) => {
        // Filter out default profile if it's empty
        if (row.name === "default") {
          try {
            const config = JSON.parse(row.settings_config);
            const keys = Object.keys(config);
            if (
              keys.length <= 2 &&
              keys.includes("model") &&
              keys.includes("includeCoAuthoredBy")
            ) {
              return false;
            }
          } catch {
            return false;
          }
        }
        return true;
      })
      .map((row: CCProviderRow) => {
        const config = JSON.parse(row.settings_config);
        const createdAt = row.created_at
          ? new Date(row.created_at).toISOString()
          : new Date().toISOString();

        return {
          id: row.id,
          name: row.name,
          description: row.notes || undefined,
          config,
          createdAt,
          updatedAt: createdAt,
          isActive: row.is_current === 1,
        };
      });
  } catch (error) {
    throw new Error(`Failed to read profiles: ${(error as Error).message}`);
  }
}

/**
 * Get a specific profile by ID
 */
export async function getProfile(id: string): Promise<Profile | null> {
  const profiles = await getProfiles();
  return profiles.find((p) => p.id === id) || null;
}

/**
 * Get the active profile
 */
export async function getActiveProfile(): Promise<Profile | null> {
  const profiles = await getProfiles();
  return profiles.find((p) => p.isActive) || null;
}

/**
 * Get active profile ID
 */
export async function getActiveProfileId(): Promise<string | undefined> {
  const active = await getActiveProfile();
  return active?.id;
}

/**
 * Create a new profile in CC Switch database
 */
export async function createProfile(
  profileData: Omit<Profile, "id" | "createdAt" | "updatedAt">
): Promise<Profile> {
  const exists = await ccSwitchDatabaseExists();
  if (!exists) {
    throw new Error("CC Switch database not found. Please install and run CC Switch first.");
  }

  const id = generateId();
  const now = Date.now();
  const settingsConfig = JSON.stringify(profileData.config);
  const notes = profileData.description || "";

  // Escape single quotes for SQL
  const escapedName = profileData.name.replace(/'/g, "''");
  const escapedNotes = notes.replace(/'/g, "''");
  const escapedConfig = settingsConfig.replace(/'/g, "''");

  const query = `INSERT INTO providers (id, app_type, name, settings_config, notes, created_at, sort_index, is_current, in_failover_queue, meta) VALUES ('${id}', '${APP_TYPE}', '${escapedName}', '${escapedConfig}', '${escapedNotes}', ${now}, 999, 0, 0, '{}')`;

  try {
    await executeSqlite(query, false);

    return {
      id,
      name: profileData.name,
      description: profileData.description,
      config: profileData.config,
      createdAt: new Date(now).toISOString(),
      updatedAt: new Date(now).toISOString(),
      isActive: false,
    };
  } catch (error) {
    throw new Error(`Failed to create profile: ${(error as Error).message}`);
  }
}

/**
 * Update an existing profile
 */
export async function updateProfile(
  id: string,
  updates: Partial<Omit<Profile, "id" | "createdAt">>
): Promise<Profile> {
  const exists = await ccSwitchDatabaseExists();
  if (!exists) {
    throw new Error("CC Switch database not found");
  }

  const current = await getProfile(id);
  if (!current) {
    throw new Error(`Profile not found: ${id}`);
  }

  const updated = {
    ...current,
    ...updates,
    config: { ...current.config, ...updates.config },
  };

  const settingsConfig = JSON.stringify(updated.config);
  const escapedName = updated.name.replace(/'/g, "''");
  const escapedNotes = (updated.description || "").replace(/'/g, "''");
  const escapedConfig = settingsConfig.replace(/'/g, "''");

  const query = `UPDATE providers SET name='${escapedName}', settings_config='${escapedConfig}', notes='${escapedNotes}' WHERE id='${id}' AND app_type='${APP_TYPE}'`;

  try {
    await executeSqlite(query, false);
    return updated;
  } catch (error) {
    throw new Error(`Failed to update profile: ${(error as Error).message}`);
  }
}

/**
 * Delete a profile
 */
export async function deleteProfile(id: string): Promise<void> {
  const exists = await ccSwitchDatabaseExists();
  if (!exists) {
    throw new Error("CC Switch database not found");
  }

  const query = `DELETE FROM providers WHERE id='${id}' AND app_type='${APP_TYPE}'`;

  try {
    await executeSqlite(query, false);
  } catch (error) {
    throw new Error(`Failed to delete profile: ${(error as Error).message}`);
  }
}

/**
 * Set a profile as active (and deactivate others)
 */
export async function setActiveProfileId(id: string | undefined): Promise<void> {
  const exists = await ccSwitchDatabaseExists();
  if (!exists) {
    throw new Error("CC Switch database not found");
  }

  try {
    // First, deactivate all profiles
    await executeSqlite(`UPDATE providers SET is_current=0 WHERE app_type='${APP_TYPE}'`, false);

    // Then activate the selected one
    if (id) {
      await executeSqlite(
        `UPDATE providers SET is_current=1 WHERE id='${id}' AND app_type='${APP_TYPE}'`,
        false
      );
    }
  } catch (error) {
    throw new Error(`Failed to set active profile: ${(error as Error).message}`);
  }
}

/**
 * Generate a unique ID (UUID v4 format)
 */
function generateId(): string {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * Export all profiles (for backup)
 */
export async function exportProfiles(): Promise<Profile[]> {
  return getProfiles();
}

interface CCProviderRow {
  id: string;
  name: string;
  settings_config: string;
  is_current: number;
  notes?: string;
  created_at?: string;
}

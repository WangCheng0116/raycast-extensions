import { LocalStorage } from "@raycast/api";
import { Profile, ProfileStorage } from "../types";

const STORAGE_KEY = "claude-code-profiles";
const ACTIVE_PROFILE_KEY = "active-profile-id";

/**
 * Get all profiles from storage
 */
export async function getProfiles(): Promise<Profile[]> {
  try {
    const data = await LocalStorage.getItem<string>(STORAGE_KEY);
    if (!data) {
      return [];
    }

    const storage: ProfileStorage = JSON.parse(data);
    return storage.profiles || [];
  } catch (error) {
    console.error("Failed to get profiles:", error);
    return [];
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
 * Save all profiles to storage
 */
async function saveProfiles(profiles: Profile[]): Promise<void> {
  const storage: ProfileStorage = { profiles };
  await LocalStorage.setItem(STORAGE_KEY, JSON.stringify(storage));
}

/**
 * Create a new profile
 */
export async function createProfile(profile: Omit<Profile, "id" | "createdAt" | "updatedAt">): Promise<Profile> {
  const profiles = await getProfiles();

  const newProfile: Profile = {
    ...profile,
    id: generateId(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  profiles.push(newProfile);
  await saveProfiles(profiles);

  return newProfile;
}

/**
 * Update an existing profile
 */
export async function updateProfile(id: string, updates: Partial<Omit<Profile, "id" | "createdAt">>): Promise<Profile> {
  const profiles = await getProfiles();
  const index = profiles.findIndex((p) => p.id === id);

  if (index === -1) {
    throw new Error(`Profile not found: ${id}`);
  }

  profiles[index] = {
    ...profiles[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  await saveProfiles(profiles);
  return profiles[index];
}

/**
 * Delete a profile
 */
export async function deleteProfile(id: string): Promise<void> {
  const profiles = await getProfiles();
  const filtered = profiles.filter((p) => p.id !== id);

  if (filtered.length === profiles.length) {
    throw new Error(`Profile not found: ${id}`);
  }

  await saveProfiles(filtered);

  // If deleted profile was active, clear active profile
  const activeId = await getActiveProfileId();
  if (activeId === id) {
    await setActiveProfileId(undefined);
  }
}

/**
 * Get active profile ID
 */
export async function getActiveProfileId(): Promise<string | undefined> {
  try {
    const id = await LocalStorage.getItem<string>(ACTIVE_PROFILE_KEY);
    return id || undefined;
  } catch {
    return undefined;
  }
}

/**
 * Set active profile ID
 */
export async function setActiveProfileId(id: string | undefined): Promise<void> {
  if (id === undefined) {
    await LocalStorage.removeItem(ACTIVE_PROFILE_KEY);
  } else {
    await LocalStorage.setItem(ACTIVE_PROFILE_KEY, id);
  }
}

/**
 * Get the currently active profile
 */
export async function getActiveProfile(): Promise<Profile | null> {
  const activeId = await getActiveProfileId();
  if (!activeId) {
    return null;
  }
  return getProfile(activeId);
}

/**
 * Generate a unique ID
 */
function generateId(): string {
  return `profile-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Import profiles (for backup/restore)
 */
export async function importProfiles(profiles: Profile[]): Promise<void> {
  await saveProfiles(profiles);
}

/**
 * Export all profiles
 */
export async function exportProfiles(): Promise<Profile[]> {
  return getProfiles();
}

/**
 * Clear all profiles (dangerous!)
 */
export async function clearAllProfiles(): Promise<void> {
  await LocalStorage.removeItem(STORAGE_KEY);
  await LocalStorage.removeItem(ACTIVE_PROFILE_KEY);
}

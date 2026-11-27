"use client";

import { useCallback, useState } from "react";
import { getRun } from "@/features/runs/services/run.service";
import { useResource } from "@/shared/lib/useResource";
import { PROFILES, type ProfileId } from "../data/comparison";

export function useResults(id: string) {
  const load = useCallback(() => getRun(id), [id]);
  const resource = useResource(load);
  const [profileId, setProfileId] = useState<ProfileId>("balanced");

  return { ...resource, run: resource.data, profileId, setProfileId, profile: PROFILES[profileId] };
}

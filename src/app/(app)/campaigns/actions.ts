"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getAccessToken } from "@/lib/session";
import { setCampaignStatus } from "@/lib/meta";

export async function toggleCampaignStatus(formData: FormData) {
  const token = await getAccessToken();
  if (!token) redirect("/login");

  const campaignId = String(formData.get("campaignId") ?? "");
  const current = String(formData.get("currentStatus") ?? "");
  if (!campaignId) return;

  const next = current === "ACTIVE" ? "PAUSED" : "ACTIVE";
  await setCampaignStatus(token, campaignId, next);
  revalidatePath("/campaigns");
}

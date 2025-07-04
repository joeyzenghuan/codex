import type { AppConfig } from "./config.js";

import {
  getBaseUrl,
  getApiKey,
  AZURE_OPENAI_API_VERSION,
  OPENAI_TIMEOUT_MS,
  OPENAI_ORGANIZATION,
  OPENAI_PROJECT,
} from "./config.js";
import OpenAI, { AzureOpenAI } from "openai";

type OpenAIClientConfig = {
  provider: string;
};

/**
 * Creates an OpenAI client instance based on the provided configuration.
 * Handles both standard OpenAI and Azure OpenAI configurations.
 *
 * @param config The configuration containing provider information
 * @returns An instance of either OpenAI or AzureOpenAI client
 */
export function createOpenAIClient(
  config: OpenAIClientConfig | AppConfig,
): OpenAI | AzureOpenAI {
  const headers: Record<string, string> = {};
  if (OPENAI_ORGANIZATION) {
    headers["OpenAI-Organization"] = OPENAI_ORGANIZATION;
  }
  if (OPENAI_PROJECT) {
    headers["OpenAI-Project"] = OPENAI_PROJECT;
  }

  if (config.provider?.toLowerCase() === "azure") {
    // Debug info for Azure client creation
    console.log("[DEBUG] Creating AzureOpenAI client with:");
    console.log("  apiKey:", getApiKey(config.provider));
    console.log("  baseURL:", getBaseUrl(config.provider));
    console.log("  apiVersion:", AZURE_OPENAI_API_VERSION);
    console.log("  timeout:", OPENAI_TIMEOUT_MS);
    console.log("  defaultHeaders:", headers);

    return new AzureOpenAI({
      apiKey: getApiKey(config.provider),
      baseURL: getBaseUrl(config.provider),
      apiVersion: AZURE_OPENAI_API_VERSION,
      timeout: OPENAI_TIMEOUT_MS,
      defaultHeaders: headers,
    });
  }

  // Debug info for OpenAI client creation
  console.log("[DEBUG] Creating OpenAI client with:");
  console.log("  apiKey:", getApiKey(config.provider));
  console.log("  baseURL:", getBaseUrl(config.provider));
  console.log("  timeout:", OPENAI_TIMEOUT_MS);
  console.log("  defaultHeaders:", headers);

  return new OpenAI({
    apiKey: getApiKey(config.provider),
    baseURL: getBaseUrl(config.provider),
    timeout: OPENAI_TIMEOUT_MS,
    defaultHeaders: headers,
  });
}

#!/usr/bin/env node
import { existsSync, readFileSync, statSync } from "node:fs";
import { resolve } from "node:path";

const root = process.cwd();
const manifestPath = "content/work/rive-puppet-approval-manifest.json";

const fail = (message) => {
  console.error(`Rive puppet gate failed: ${message}`);
  process.exitCode = 1;
};

const readText = (path) => readFileSync(resolve(root, path), "utf8");
const exists = (path) => existsSync(resolve(root, path));

if (!exists(manifestPath)) {
  fail(`missing ${manifestPath}`);
  process.exit();
}

const manifest = JSON.parse(readText(manifestPath));
const validStatuses = new Set(["pending", "approved"]);

if (manifest.project !== "hammer-rive-puppet") {
  fail("manifest project must be hammer-rive-puppet");
}

if (!validStatuses.has(manifest.approvalStatus)) {
  fail("approvalStatus must be pending or approved");
}

if (manifest.recommendedCandidate !== "candidate-02") {
  fail("recommendedCandidate must remain candidate-02 unless the approval board changes");
}

if (!Array.isArray(manifest.candidates) || manifest.candidates.length !== 2) {
  fail("manifest must contain exactly two approval candidates");
}

const candidateIds = new Set(manifest.candidates.map((candidate) => candidate.id));
for (const expectedId of ["candidate-01", "candidate-02"]) {
  if (!candidateIds.has(expectedId)) {
    fail(`missing ${expectedId}`);
  }
}

const requiredPaths = [
  manifest.approvalBoard,
  manifest.approvalBoardSnapshot,
  manifest.postApprovalBuildPacket,
  manifest.postApprovalAgentPrompt,
  ...manifest.candidates.flatMap((candidate) => [
    candidate.image,
    candidate.approvalNotes,
    candidate.vectorExtractionMap,
  ]),
];

for (const path of requiredPaths) {
  if (!path || !exists(path)) {
    fail(`referenced path is missing: ${path}`);
  }
}

if (statSync(resolve(root, manifest.approvalBoardSnapshot)).size < 100000) {
  fail("approval board snapshot is unexpectedly small");
}

const board = readText(manifest.approvalBoard);
for (const phrase of manifest.approvalPhrases ?? []) {
  if (!board.includes(phrase)) {
    fail(`approval board is missing phrase: ${phrase}`);
  }
}

if (!board.includes("recommended")) {
  fail("approval board must visibly mark the recommended candidate");
}

if (!board.includes("Recommendation: candidate 02")) {
  fail("approval board must explain candidate 02 as the recommendation");
}

const currentGate = readText("content/work/rive-puppet-current-gate.md");
const completionAudit = readText("content/work/rive-puppet-completion-audit.md");
const buildPacket = readText(manifest.postApprovalBuildPacket);
const postApprovalPrompt = readText(manifest.postApprovalAgentPrompt);
for (const doc of [currentGate, completionAudit]) {
  if (!doc.includes(manifestPath)) {
    fail(`${manifestPath} is not referenced by current gate/audit docs`);
  }
}

if (!buildPacket.includes("Candidate 02 is")) {
  fail("post-approval build packet must preserve the candidate 02 recommendation");
}

if (!buildPacket.includes("Premium concept candidate 02, recommended")) {
  fail("post-approval build packet must label candidate 02 as recommended");
}

for (const candidate of manifest.candidates) {
  if (!buildPacket.includes(candidate.image)) {
    fail(`post-approval build packet is missing candidate image: ${candidate.image}`);
  }
}

if (!postApprovalPrompt.includes("Candidate 02 is the recommended direction.")) {
  fail("post-approval agent prompt must preserve the candidate 02 recommendation");
}

const candidate02PromptIndex = postApprovalPrompt.indexOf("## If Jeff approves candidate 02");
const candidate01PromptIndex = postApprovalPrompt.indexOf("## If Jeff approves candidate 01");

if (candidate02PromptIndex === -1 || candidate01PromptIndex === -1) {
  fail("post-approval agent prompt must include candidate 01 and candidate 02 sections");
}

if (candidate02PromptIndex > candidate01PromptIndex) {
  fail("post-approval agent prompt must present candidate 02 before candidate 01");
}

const riveExport = manifest.expectedExports?.riveRuntime;
const posterExport = manifest.expectedExports?.poster;

if (manifest.approvalStatus === "pending") {
  if (manifest.approvedCandidate !== null) {
    fail("approvedCandidate must be null while approvalStatus is pending");
  }

  for (const blockedStep of [
    "rive-native-vector-rebuild",
    "rive-rigging",
    "rive-animation",
    "site-runtime-integration",
  ]) {
    if (!manifest.approvalRequiredBefore?.includes(blockedStep)) {
      fail(`approvalRequiredBefore is missing ${blockedStep}`);
    }
  }

  if (riveExport && exists(riveExport)) {
    fail(`${riveExport} exists while approvalStatus is pending`);
  }

  if (posterExport && exists(posterExport)) {
    fail(`${posterExport} exists while approvalStatus is pending`);
  }
}

if (manifest.approvalStatus === "approved") {
  if (!candidateIds.has(manifest.approvedCandidate)) {
    fail("approvedCandidate must match one candidate id when approved");
  }
}

if (
  manifest.runtimeContract?.artboard !== "HammerPuppet" ||
  manifest.runtimeContract?.viewModel !== "HammerPuppetVM" ||
  manifest.runtimeContract?.stateMachine !== "HammerPuppet"
) {
  fail("runtimeContract must preserve HammerPuppet/HammerPuppetVM names");
}

if (process.exitCode) {
  process.exit();
}

console.log(
  `Rive puppet gate ok: ${manifest.approvalStatus}; recommended=${manifest.recommendedCandidate}`,
);

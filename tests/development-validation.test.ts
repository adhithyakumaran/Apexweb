import { test } from "node:test";
import assert from "node:assert/strict";
import {
  recordSchemas,
  validateAttachment,
  MAX_FILE_SIZE,
} from "../src/lib/development/validation";
test("weekly reporting periods reject inverted and invalid dates", () => {
  assert.equal(
    recordSchemas.weekly_updates.safeParse({
      week_start: "2026-10-21",
      week_end: "2026-10-20",
      summary: "Update",
      published: true,
    }).success,
    false,
  );
  assert.equal(
    recordSchemas.weekly_updates.safeParse({
      week_start: "2026-02-30",
      week_end: "2026-03-02",
      summary: "Update",
      published: true,
    }).success,
    false,
  );
  assert.equal(
    recordSchemas.weekly_updates.safeParse({
      week_start: "2026-10-19",
      week_end: "2026-10-25",
      summary: "Update",
      published: false,
    }).success,
    true,
  );
});
test("tester reports reject invalid release identifiers and require a name", () => {
  assert.equal(
    recordSchemas.testing_reports.safeParse({ build_id: "", findings: "Issue" })
      .success,
    false,
  );
  assert.equal(
    recordSchemas.testing_reports.safeParse({
      build_id: "10000000-0000-4000-8000-000000000001",
      findings: "   ",
    }).success,
    false,
  );
});
test("attachment rules reject unsafe extensions, oversized files, and document bundles", () => {
  assert.throws(() =>
    validateAttachment({ name: "report.html", size: 10 }, false),
  );
  assert.throws(() =>
    validateAttachment({ name: "report.pdf", size: MAX_FILE_SIZE + 1 }, false),
  );
  assert.throws(() =>
    validateAttachment({ name: "build.zip", size: 100 }, false),
  );
  assert.equal(
    validateAttachment({ name: "report.PDF", size: 10 }, false),
    "pdf",
  );
  assert.equal(
    validateAttachment({ name: "build.apk", size: 100 }, true),
    "apk",
  );
});
test("task schema restricts the workflow and priority", () => {
  const task = {
    title: "Fix crash",
    description: "",
    owner_name: "",
    report_id: null,
    priority: "High",
    status: "Retest",
  };
  assert.equal(recordSchemas.tasks.safeParse(task).success, true);
  assert.equal(
    recordSchemas.tasks.safeParse({ ...task, status: "Unknown" }).success,
    false,
  );
});

test("URL-access reports require a self-reported tester name", () => {
  const report = {
    build_id: "10000000-0000-4000-8000-000000000001",
    findings: "Reproducible issue",
  };
  assert.equal(recordSchemas.testing_reports.safeParse(report).success, false);
  assert.equal(
    recordSchemas.testing_reports.safeParse({ ...report, tester_name: "Sam" })
      .success,
    true,
  );
});

test("direct-upload metadata binds the path to its identifier and sanitised filename", async () => {
  const { stagedFileSchema, attachmentMime } =
    await import("../src/lib/development/validation");
  const id = "10000000-0000-4000-8000-000000000001";
  const file = {
    id,
    name: "build release.zip",
    size: 6 * 1024 * 1024,
    path: `shared/${id}/build_release.zip`,
  };
  assert.equal(stagedFileSchema.safeParse(file).success, true);
  assert.equal(
    stagedFileSchema.safeParse({ ...file, path: "../other-bucket/build.zip" })
      .success,
    false,
  );
  assert.equal(
    stagedFileSchema.safeParse({
      ...file,
      path: "shared/someone-else/build.zip",
    }).success,
    false,
  );
  assert.equal(
    stagedFileSchema.safeParse({ ...file, size: MAX_FILE_SIZE + 1 }).success,
    false,
  );
  assert.equal(attachmentMime("report.pdf"), "application/pdf");
  assert.equal(attachmentMime("screenshot.png"), "image/png");
});

test("releases accept EXE installers and separate guides/checksums; reports need only a name", () => {
  for (const name of [
    "TestBuddy-0.1.0-beta.1-x64-Setup.exe",
    "README-Installation.md",
    "Acceptance-Testing-Guide.md",
    "Known-Issues.md",
    "SHA256.txt",
  ]) {
    assert.doesNotThrow(() => validateAttachment({ name, size: 100 }, true));
  }
  assert.doesNotThrow(() =>
    validateAttachment({ name: "setup.EXE", size: 120 * 1024 * 1024 }, true),
  );
  assert.equal(
    recordSchemas.builds.safeParse({
      version: "Release beta 1",
      published: true,
    }).success,
    true,
  );
  assert.equal(
    recordSchemas.testing_reports.safeParse({ tester_name: "Sam" }).success,
    true,
  );
  assert.throws(() =>
    validateAttachment({ name: "report.png", size: 100 }, false),
  );
});

test("large EXE uploads use R2 while non-EXE files retain the 50 MB limit", async () => {
  const { stagedFileSchema } =
    await import("../src/lib/development/validation");
  const id = "10000000-0000-4000-8000-000000000001";
  const exe = {
    id,
    name: "Setup.EXE",
    path: `shared/${id}/Setup.EXE`,
    size: 120 * 1024 * 1024,
    original_size: 120 * 1024 * 1024,
    compression: "none",
    storage_provider: "r2",
  };
  assert.equal(stagedFileSchema.safeParse(exe).success, true);
  assert.equal(
    stagedFileSchema.safeParse({ ...exe, compression: "gzip", size: 100 })
      .success,
    false,
  );
  assert.equal(
    stagedFileSchema.safeParse({
      ...exe,
      name: "report.pdf",
      path: `shared/${id}/report.pdf`,
    }).success,
    false,
  );
  assert.throws(
    () =>
      validateAttachment({ name: "build.zip", size: 120 * 1024 * 1024 }, true),
    /50 MB/,
  );
  assert.throws(
    () =>
      validateAttachment({ name: "setup.exe", size: 251 * 1024 * 1024 }, true),
    /250 MB/,
  );
});

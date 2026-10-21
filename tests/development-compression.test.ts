import { test } from "node:test";
import assert from "node:assert/strict";
import { randomBytes } from "node:crypto";
import {
  compressUpload,
  restoreUpload,
} from "../src/lib/development/compression";
test("lossless compression restores identical bytes and preserves file quality", async () => {
  for (const name of [
    "report.md",
    "manual.pdf",
    "screenshot.png",
    "installer.exe",
  ]) {
    const bytes = new TextEncoder().encode(
      "A repeatable byte sequence for a fidelity check.\n".repeat(5000),
    );
    const prepared = await compressUpload(new File([bytes], name));
    assert.equal(prepared.compression, "gzip");
    assert.ok(prepared.blob.size < bytes.length / 5);
    const restored = await restoreUpload(
      prepared.blob,
      prepared.compression,
      prepared.originalSize,
    );
    assert.deepEqual(new Uint8Array(await restored.arrayBuffer()), bytes);
  }
});
test("already compressed, small, and opted-out files remain byte-identical", async () => {
  for (const [bytes, enabled] of [
    [new Uint8Array(randomBytes(8192)), true],
    [new TextEncoder().encode("small"), true],
    [new TextEncoder().encode("repeated".repeat(3000)), false],
  ] as const) {
    const file = new File([bytes], "bundle.zip");
    const prepared = await compressUpload(file, enabled);
    assert.equal(prepared.compression, "none");
    assert.equal(prepared.blob, file);
  }
});
test("restoration rejects corrupted streams and oversized or mismatched expansion", async () => {
  const prepared = await compressUpload(
    new File(["text".repeat(10000)], "report.md"),
  );
  await assert.rejects(restoreUpload(prepared.blob, "gzip", 100));
  await assert.rejects(restoreUpload(new Blob(["not gzip"]), "gzip", 100));
  await assert.rejects(restoreUpload(new Blob(["small"]), "none", 100));
});

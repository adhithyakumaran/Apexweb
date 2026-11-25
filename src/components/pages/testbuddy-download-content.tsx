"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Check, CheckCheck, Copy, Folder, MessageSquare, Monitor, ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import styles from "./testbuddy-download-content.module.css";

const releaseVersion = "0.1.0-beta.2";
const downloadBase = "https://pub-eb8fe17e2a6e43499c346bf81143ae9e.r2.dev/Apexwebbucket";
const downloads = {
  windows: `${downloadBase}/TestBuddy-Studio-${releaseVersion}-x64-Setup.exe`,
  macArm: `${downloadBase}/TestBuddy-Studio-${releaseVersion}-arm64.dmg`,
  macIntel: `${downloadBase}/TestBuddy-Studio-${releaseVersion}-x64.dmg`,
  linuxDeb: `${downloadBase}/TestBuddy-Studio-${releaseVersion}-amd64.deb`,
  linuxAppImage: `${downloadBase}/TestBuddy-Studio-${releaseVersion}-x86_64.AppImage`,
};
const checksumCommand = `Get-FileHash .\\TestBuddy-Studio-${releaseVersion}-x64-Setup.exe -Algorithm SHA256`;

function WindowsMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M4 9 22 6.5V23H4V9Zm21-3L44 3v20H25V6ZM4 26h18v16.5L4 40V26Zm21 0h19v20l-19-3V26Z" />
    </svg>
  );
}

export function TestBuddyDownloadContent() {
  const [copyStatus, setCopyStatus] = useState<"idle" | "copied" | "error">("idle");
  const resetTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => {
    if (resetTimer.current) clearTimeout(resetTimer.current);
  }, []);

  async function copyCommand() {
    try {
      await navigator.clipboard.writeText(checksumCommand);
      setCopyStatus("copied");
    } catch {
      setCopyStatus("error");
    }
    if (resetTimer.current) clearTimeout(resetTimer.current);
    resetTimer.current = setTimeout(() => setCopyStatus("idle"), 5000);
  }

  return (
    <main className="min-w-0 bg-background text-center text-foreground md:text-left">
      <section className={`${styles.hero} bg-sky-100 dark:bg-sky-900`} aria-labelledby="testbuddy-heading">
        <div className="relative mx-auto max-w-5xl px-4 sm:px-6">
          <Link href="/agents" className="text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline">All agents</Link>
          <h1 id="testbuddy-heading" className="mx-auto mt-9 max-w-3xl text-center text-4xl font-semibold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
            Your testing workspace.<br /><span className="text-muted-foreground">Right on your desktop.</span>
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-center text-base leading-relaxed text-muted-foreground sm:text-lg">
            Build browser tests visually, organise reusable objects, and review execution reports. TestBuddy brings your Playwright-powered workflow into one desktop studio.
          </p>
          <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
            <Button asChild size="lg" className={`${styles.downloadButton} h-auto min-h-12 max-w-full gap-2 whitespace-normal py-3 text-center`}><a href={downloads.windows} download><WindowsMark className="size-4" />Download for Windows</a></Button>
            <Button asChild variant="outline" size="lg" className={styles.downloadButton}><a href="#downloads">All platforms</a></Button>
          </div>
          <p className="mt-3 text-center text-sm text-muted-foreground">Version {releaseVersion} · Windows, macOS & Linux</p>
        </div>
      </section>

      <div className="mx-auto max-w-5xl border-x border-border/60">
        <section id="downloads" className="scroll-mt-24" aria-labelledby="downloads-heading">
          <div className={styles.sectionHeading}><span aria-hidden="true" /><h2 id="downloads-heading">Downloads</h2><p>Choose your platform.</p></div>
          <div className={`${styles.platformGrid} border-y border-border/60`}>
            <article className={`${styles.platformCard} border-b border-border/60 md:border-r md:border-b-0`}>
              <WindowsMark className="size-14" />
              <h3 className="text-lg font-medium">Windows</h3>
              <div className={styles.platformDescription}>
                <p>Windows x64 · Setup installer<br />Version {releaseVersion}</p>
                <p>No Node.js or npm required.</p>
              </div>
              <div className={styles.platformActions}>
                <Button asChild className={styles.downloadButton}><a href={downloads.windows} download>Windows x64 (.exe)</a></Button>
              </div>
            </article>
            <article className={`${styles.platformCard} border-b border-border/60 md:border-r md:border-b-0`}>
              <Image src="/images/platforms/apple.svg" alt="Apple logo" width={56} height={56} className="size-14 dark:invert" />
              <h3 className="text-lg font-medium">macOS</h3>
              <div className={styles.platformDescription}>
                <p>Choose the build for your Mac processor.</p>
                <p>Apple Silicon (M-series) or Intel (x64).</p>
              </div>
              <div className={styles.platformActions}>
                <Button asChild className={styles.downloadButton}><a href={downloads.macArm} download>Apple Silicon (.dmg)</a></Button>
                <Button asChild className={styles.downloadButton}><a href={downloads.macIntel} download>Intel x64 (.dmg)</a></Button>
              </div>
            </article>
            <article className={styles.platformCard}>
              <Image src="/images/platforms/linux.svg" alt="Linux penguin logo" width={56} height={56} className="size-14 dark:invert" />
              <h3 className="text-lg font-medium">Linux</h3>
              <div className={styles.platformDescription}>
                <p>Linux x64 (amd64 / x86_64).</p>
                <p>Choose .deb for Debian/Ubuntu, or AppImage for compatible Linux distributions.</p>
              </div>
              <div className={styles.platformActions}>
                <Button asChild className={styles.downloadButton}><a href={downloads.linuxDeb} download>Debian / Ubuntu (.deb)</a></Button>
                <Button asChild className={styles.downloadButton}><a href={downloads.linuxAppImage} download>Linux x64 (.AppImage)</a></Button>
              </div>
            </article>
          </div>
          <p className="px-7 py-4 text-sm leading-relaxed text-muted-foreground sm:px-9">All downloads are TestBuddy Studio {releaseVersion}. Select the installer matching your operating system and processor.</p>
        </section>

        <section className="border-t border-border/60 pb-10" aria-labelledby="installation-heading">
          <div className={styles.sectionHeading}><span aria-hidden="true" /><h2 id="installation-heading">Install. Open. Start testing.</h2><p>A desktop app, without the development setup.</p></div>
          <ol className="grid gap-7 px-7 pb-9 sm:px-9 md:grid-cols-3">
            <li><Monitor className="mx-auto mb-3 size-5 text-sky-700 md:mx-0 dark:text-sky-300" aria-hidden="true" /><h3 className="font-medium">Install for your platform</h3><p className="mt-2 text-sm leading-relaxed text-muted-foreground">Windows: run the .exe. macOS: open the .dmg and install the app. Linux: install the .deb, or make the AppImage executable and launch it.</p></li>
            <li><Folder className="mx-auto mb-3 size-5 text-sky-700 md:mx-0 dark:text-sky-300" aria-hidden="true" /><h3 className="font-medium">Create your project</h3><p className="mt-2 text-sm leading-relaxed text-muted-foreground">Launch TestBuddy Studio from your applications. Create a project or open one from your computer.</p></li>
            <li><CheckCheck className="mx-auto mb-3 size-5 text-sky-700 md:mx-0 dark:text-sky-300" aria-hidden="true" /><h3 className="font-medium">Set up your browser</h3><p className="mt-2 text-sm leading-relaxed text-muted-foreground">Use installed Chrome or Edge, or download Chromium, Firefox, or WebKit through browser setup.</p></li>
          </ol>
          <div className="mx-7 rounded-xl border border-border/70 bg-muted/30 p-5 sm:mx-9 sm:p-6">
            <div className="flex items-center justify-center gap-2 md:justify-start"><ShieldCheck className="size-4 text-sky-700 dark:text-sky-300" aria-hidden="true" /><h3 className="font-medium">Verify your installer</h3></div>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">For the Windows installer, run this in PowerShell from your download folder to calculate its SHA-256 hash. Compare it with a trusted publisher checksum when one is provided.</p>
            <div className="mt-4 flex min-w-0 items-start gap-2 text-left rounded-lg border border-border/70 bg-background p-3">
              <code className="min-w-0 flex-1 overflow-x-auto whitespace-pre py-1 font-mono text-sm">{checksumCommand}</code>
              <button type="button" onClick={copyCommand} aria-label={copyStatus === "copied" ? "Command copied" : "Copy checksum command"} className="shrink-0 rounded-md p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring">
                {copyStatus === "copied" ? <Check className="size-4" aria-hidden="true" /> : <Copy className="size-4" aria-hidden="true" />}
              </button>
            </div>
            <p role="status" className="mt-2 min-h-5 text-sm text-muted-foreground">{copyStatus === "copied" ? "Command copied." : copyStatus === "error" ? "Could not copy. Select the command above and copy it manually." : "PowerShell · SHA-256 checksum"}</p>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">Download the installer for your platform above. There is no terminal installer at this stage.</p>
          </div>
        </section>

        <section className="relative overflow-hidden border-t border-border/60 bg-sky-50 px-7 py-10 dark:bg-sky-950/40 sm:px-9 sm:py-12" aria-labelledby="beta-heading">
          <div className="relative flex flex-col items-center justify-between gap-6 md:flex-row">
            <div><p className="text-sm font-medium text-sky-700 dark:text-sky-300">Built with your feedback</p><h2 id="beta-heading" className="mt-2 text-2xl font-medium tracking-tight">A better testing studio starts here.</h2><p className="mt-3 max-w-lg text-sm leading-relaxed text-muted-foreground">TestBuddy Studio {releaseVersion} is a beta release. Tell us what your testing workflow needs, or share feedback with the team.</p></div>
            <Button asChild className={`${styles.downloadButton} gap-2`}><Link href="/contact"><MessageSquare className="size-4" aria-hidden="true" />Share feedback</Link></Button>
          </div>
        </section>
      </div>
    </main>
  );
}

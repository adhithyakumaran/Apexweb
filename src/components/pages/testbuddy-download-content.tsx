"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Bug, Check, CheckCheck, Copy, Folder, MessageSquare, Monitor, ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import styles from "./testbuddy-download-content.module.css";

const checksumCommand = 'Get-FileHash .\\TestBuddy-0.1.0-beta.1-x64-Setup.exe -Algorithm SHA256';

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
    <main className="bg-background text-foreground">
      <section className={`${styles.hero} bg-sky-100 dark:bg-sky-900`} aria-labelledby="testbuddy-heading">
        <div className="relative mx-auto max-w-5xl px-4 sm:px-6">
          <Link href="/agents" className="text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline">All agents</Link>
          <div className="mt-9 flex items-center justify-center gap-2 text-sm font-medium text-sky-700 dark:text-sky-300">
            <Bug className="size-4" aria-hidden="true" /><span>TestBuddy Omni</span>
            <span className="ml-1 rounded-full border border-sky-300 bg-sky-200/50 dark:border-sky-600 dark:bg-sky-800 px-2.5 py-1 text-xs">Desktop beta</span>
          </div>
          <h1 id="testbuddy-heading" className="mx-auto mt-5 max-w-3xl text-center text-4xl font-semibold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
            Your testing workspace.<br /><span className="text-muted-foreground">Right on your desktop.</span>
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-center text-base leading-relaxed text-muted-foreground sm:text-lg">
            Build browser tests visually, organise reusable objects, and review execution reports. TestBuddy brings your Playwright-powered workflow into one desktop studio.
          </p>
          <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
            <Button size="lg" disabled className={`${styles.downloadButton} h-auto min-h-12 max-w-full gap-2 whitespace-normal py-3 text-center`}><WindowsMark className="size-4" />Windows download coming soon</Button>
            <Button asChild variant="outline" size="lg" className={styles.downloadButton}><a href="#downloads">All platforms</a></Button>
          </div>
          <p className="mt-3 text-center text-sm text-muted-foreground">Windows x64 internal beta · Public download links coming soon</p>
        </div>
      </section>

      <div className="mx-auto max-w-5xl border-x border-border/60">
        <section id="downloads" className="scroll-mt-24" aria-labelledby="downloads-heading">
          <div className={styles.sectionHeading}><span aria-hidden="true" /><h2 id="downloads-heading">Downloads</h2><p>Choose your platform.</p></div>
          <div className="grid border-y border-border/60 md:grid-cols-3">
            <article className="flex flex-col items-start border-b border-border/60 p-7 sm:p-9 md:border-r md:border-b-0">
              <WindowsMark className="mb-8 size-14" />
              <div className="flex flex-wrap items-center gap-2"><h3 className="text-lg font-medium">Windows</h3><span className="rounded-full bg-sky-100 dark:bg-sky-900 px-2 py-1 text-xs font-medium text-sky-700 dark:text-sky-300">Internal beta</span></div>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">Windows x64 · Setup installer<br />Version 0.1.0-beta.1</p>
              <p className="mt-4 text-sm text-muted-foreground">No Node.js or npm required.</p>
              <Button disabled variant="outline" className={`${styles.downloadButton} mt-6 h-auto min-h-10 w-full whitespace-normal px-3 py-2 text-center`}>Download .exe · Coming soon</Button>
            </article>
            <article className="flex flex-col items-start border-b border-border/60 p-7 sm:p-9 md:border-r md:border-b-0">
              <Image src="/images/platforms/apple.svg" alt="Apple logo" width={56} height={56} className="mb-8 size-14 dark:invert" />
              <h3 className="text-lg font-medium">macOS</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">A macOS build is not available yet.</p>
              <p className="mt-4 text-sm text-muted-foreground">Supported versions and architectures will be listed with the release.</p>
              <Button disabled variant="outline" className={`${styles.downloadButton} mt-6 md:mt-auto`}>Not yet available</Button>
            </article>
            <article className="flex flex-col items-start p-7 sm:p-9">
              <Image src="/images/platforms/linux.svg" alt="Linux penguin logo" width={56} height={56} className="mb-8 size-14 dark:invert" />
              <h3 className="text-lg font-medium">Linux</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">A Linux build is not available yet.</p>
              <p className="mt-4 text-sm text-muted-foreground">Package formats and distribution requirements will follow with the release.</p>
              <Button disabled variant="outline" className={`${styles.downloadButton} mt-6 md:mt-auto`}>Not yet available</Button>
            </article>
          </div>
          <p className="px-7 py-4 text-sm leading-relaxed text-muted-foreground sm:px-9">Installer buttons are placeholders. Public downloads will be linked here when they are ready.</p>
        </section>

        <section className="border-t border-border/60 pb-10" aria-labelledby="installation-heading">
          <div className={styles.sectionHeading}><span aria-hidden="true" /><h2 id="installation-heading">Install. Open. Start testing.</h2><p>A desktop app, without the development setup.</p></div>
          <ol className="grid gap-7 px-7 pb-9 sm:px-9 md:grid-cols-3">
            <li><Monitor className="mb-3 size-5 text-sky-700 dark:text-sky-300" aria-hidden="true" /><h3 className="font-medium">Run the Windows installer</h3><p className="mt-2 text-sm leading-relaxed text-muted-foreground">Once you have beta access, run the .exe and choose your installation folder.</p></li>
            <li><Folder className="mb-3 size-5 text-sky-700 dark:text-sky-300" aria-hidden="true" /><h3 className="font-medium">Create your project</h3><p className="mt-2 text-sm leading-relaxed text-muted-foreground">Launch TestBuddy from the Start menu. Create a project or open one from your computer.</p></li>
            <li><CheckCheck className="mb-3 size-5 text-sky-700 dark:text-sky-300" aria-hidden="true" /><h3 className="font-medium">Set up your browser</h3><p className="mt-2 text-sm leading-relaxed text-muted-foreground">Use installed Chrome or Edge, or download Chromium, Firefox, or WebKit through browser setup.</p></li>
          </ol>
          <div className="mx-7 rounded-xl border border-border/70 bg-muted/30 p-5 sm:mx-9 sm:p-6">
            <div className="flex items-center gap-2"><ShieldCheck className="size-4 text-sky-700 dark:text-sky-300" aria-hidden="true" /><h3 className="font-medium">Verify your installer</h3></div>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">When a build is available, run this in PowerShell from its download folder. Compare the result with the SHA256.txt supplied with that build.</p>
            <div className="mt-4 flex min-w-0 items-start gap-2 rounded-lg border border-border/70 bg-background p-3">
              <code className="min-w-0 flex-1 overflow-x-auto whitespace-pre py-1 font-mono text-sm">{checksumCommand}</code>
              <button type="button" onClick={copyCommand} aria-label={copyStatus === "copied" ? "Command copied" : "Copy checksum command"} className="shrink-0 rounded-md p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring">
                {copyStatus === "copied" ? <Check className="size-4" aria-hidden="true" /> : <Copy className="size-4" aria-hidden="true" />}
              </button>
            </div>
            <p role="status" className="mt-2 min-h-5 text-sm text-muted-foreground">{copyStatus === "copied" ? "Command copied." : copyStatus === "error" ? "Could not copy. Select the command above and copy it manually." : "PowerShell · SHA-256 checksum"}</p>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">The current internal beta is unsigned. Windows may show a publisher warning; follow your organisation’s approval process. There is no terminal installer at this stage.</p>
          </div>
        </section>

        <section className="relative overflow-hidden border-t border-border/60 bg-sky-50 px-7 py-10 dark:bg-sky-950/40 sm:px-9 sm:py-12" aria-labelledby="beta-heading">
          <div className="relative flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
            <div><p className="text-sm font-medium text-sky-700 dark:text-sky-300">Built with your feedback</p><h2 id="beta-heading" className="mt-2 text-2xl font-medium tracking-tight">A better testing studio starts here.</h2><p className="mt-3 max-w-lg text-sm leading-relaxed text-muted-foreground">TestBuddy desktop is in internal beta. Tell us what your testing workflow needs, or share feedback with the team.</p></div>
            <Button asChild className={`${styles.downloadButton} gap-2`}><Link href="/contact"><MessageSquare className="size-4" aria-hidden="true" />Share feedback</Link></Button>
          </div>
        </section>
      </div>
    </main>
  );
}

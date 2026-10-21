"use client";
import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Image from "next/image";
import { loadOriginalFile, FileDownload } from "./file-download";
export function FilePreview({
  id,
  name,
  mime,
}: {
  id: string;
  name: string;
  mime: string;
}) {
  const [state, setState] = useState<{
    url?: string;
    text?: string;
    error?: string;
  }>({});
  useEffect(() => {
    const controller = new AbortController();
    let url: string | undefined;
    loadOriginalFile(id, controller.signal)
      .then(async ({ blob }) => {
        if (controller.signal.aborted) return;
        if (mime === "text/markdown" || mime === "text/plain") {
          const text = await blob.text();
          if (!controller.signal.aborted) setState({ text });
        } else {
          url = URL.createObjectURL(blob);
          setState({ url });
        }
      })
      .catch((error) => {
        if (!controller.signal.aborted)
          setState({ error: error.message || "Preview unavailable." });
      });
    return () => {
      controller.abort();
      if (url) URL.revokeObjectURL(url);
    };
  }, [id, mime]);
  return (
    <>
      <FileDownload id={id} name={name} />
      <div className="hub-preview-content">
        {state.error ? (
          <p role="alert" className="hub-message">
            {state.error}
          </p>
        ) : state.text !== undefined ? (
          mime === "text/plain" ? (
            <pre className="hub-plain-preview">{state.text}</pre>
          ) : (
            <div className="hub-markdown">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                skipHtml
                components={{
                  img: ({ alt }) => <span>[Image: {alt || "attachment"}]</span>,
                }}
              >
                {state.text}
              </ReactMarkdown>
            </div>
          )
        ) : state.url ? (
          mime === "application/pdf" ? (
            <>
              <iframe
                title={name}
                src={state.url}
                className="hub-pdf-preview"
              />
              <p className="hub-preview-notice">
                PDF not displaying?{" "}
                <a
                  className="hub-text-link"
                  href={state.url}
                  target="_blank"
                  rel="noreferrer"
                >
                  Open PDF in a new tab
                </a>{" "}
                or use Download above.
              </p>
            </>
          ) : (
            <Image
              src={state.url}
              alt={name}
              width={1600}
              height={1200}
              unoptimized
              className="hub-preview-image"
            />
          )
        ) : (
          <p role="status" className="hub-muted">
            Preparing original-quality preview…
          </p>
        )}
      </div>
    </>
  );
}

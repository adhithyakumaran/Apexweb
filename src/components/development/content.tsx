import { formatFileSize } from "@/lib/development/validation";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import {
  Package,
  ArrowUpRight,
  ArrowLeft,
  Plus,
  FileText,
  MessageSquareText,
  FileClock,
} from "lucide-react";
import { ActionForm, Input, Textarea, Upload } from "./forms";
import { FileDownload } from "./file-download";
import { addReleaseFiles, saveFileComment } from "@/lib/development/actions";
import {
  formatDate,
  type HubData,
  type HubFile,
  type Build,
} from "@/lib/development/data";
export function Markdown({ children }: { children: string }) {
  return (
    <div className="hub-markdown">
      <ReactMarkdown
        skipHtml
        components={{
          img: ({ alt }) => <span>[Image: {alt || "attachment"}]</span>,
        }}
      >
        {children}
      </ReactMarkdown>
    </div>
  );
}
function Empty({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="hub-empty">
      <span className="hub-empty-icon">
        <FileText size={22} aria-hidden="true" />
      </span>
      <h3>{title}</h3>
      <p>{children}</p>
    </div>
  );
}
function Heading({
  title,
  description,
  icon: Icon,
}: {
  title: string;
  description: string;
  icon: typeof Package;
}) {
  return (
    <div className="hub-page-heading">
      <span className="hub-eyebrow">
        <Icon size={14} aria-hidden="true" /> TESTBUDDY HUB
      </span>
      <h1>{title}</h1>
      <p className="hub-lead">{description}</p>
    </div>
  );
}
function Composer({
  title,
  children,
  open = false,
}: {
  title: string;
  children: React.ReactNode;
  open?: boolean;
}) {
  return (
    <details className="hub-card hub-composer" open={open}>
      <summary>
        <Plus size={18} aria-hidden="true" />
        {title}
      </summary>
      <div className="hub-composer-body">{children}</div>
    </details>
  );
}
export function Files({
  files,
  kind,
  id,
  comments = false,
}: {
  files: HubFile[];
  kind: string;
  id: string;
  comments?: boolean;
}) {
  const items = files.filter(
    (file) => file.parent_type === kind && file.parent_id === id,
  );
  return (
    <ul className="hub-file-list">
      {items.map((file) => (
        <li className="hub-file-card" key={file.id}>
          <div className="hub-file-row">
            <span className="hub-file-icon">
              <FileText size={19} aria-hidden="true" />
            </span>
            <div className="hub-file-name">
              <strong>{file.name}</strong>
              <small>
                {formatFileSize(file.original_size ?? file.size)}
                {file.compression === "gzip" && file.original_size
                  ? ` · ${((1 - file.size / file.original_size) * 100).toFixed(1)}% space saved`
                  : ""}
              </small>
            </div>
          </div>
          {file.comment && <p className="hub-file-comment">{file.comment}</p>}
          <div className="hub-file-actions">
            {/pdf|markdown|image\//.test(file.mime_type) && (
              <Link
                className="hub-text-link"
                href={`/development/files/${file.id}/view`}
              >
                View <ArrowUpRight size={14} aria-hidden="true" />
              </Link>
            )}
            <FileDownload id={file.id} name={file.name} />
            {comments && (
              <details className="hub-comment-editor">
                <summary>
                  {file.comment ? "Edit comment" : "Add comment"}
                </summary>
                <ActionForm
                  action={saveFileComment}
                  label="Save comment"
                  reset={false}
                >
                  <input type="hidden" name="id" value={file.id} />
                  <Textarea
                    name="comment"
                    label={`Comment for ${file.name}`}
                    defaultValue={file.comment}
                    required={false}
                  />
                </ActionForm>
              </details>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
}
export function ReleasesContent({ data }: { data: HubData }) {
  return (
    <>
      <Heading
        title="Build releases"
        description="Everything for a release, together in one place."
        icon={Package}
      />
      <Composer title="New release" open={!data.builds.length}>
        <ActionForm label="Create release">
          <input type="hidden" name="kind" value="builds" />
          <Input
            name="version"
            label="Release name"
            placeholder="e.g. Release beta 1"
          />
        </ActionForm>
      </Composer>
      <div className="hub-list-heading">
        <h2>Releases</h2>
        <span>
          {data.builds.length}{" "}
          {data.builds.length === 1 ? "package" : "packages"}
        </span>
      </div>
      {data.builds.length ? (
        <div className="hub-release-list">
          {data.builds.map((release) => {
            const count = data.files.filter(
              (f) => f.parent_type === "builds" && f.parent_id === release.id,
            ).length;
            return (
              <Link
                key={release.id}
                className="hub-release-card"
                href={`/development/releases/${release.id}`}
              >
                <span className="hub-release-icon">
                  <Package size={24} aria-hidden="true" />
                </span>
                <div>
                  <h2>{release.version}</h2>
                  <p>
                    {count} {count === 1 ? "file" : "files"}
                    <span>·</span>
                    {formatDate(release.created_at)}
                  </p>
                </div>
                <ArrowUpRight size={20} aria-hidden="true" />
              </Link>
            );
          })}
        </div>
      ) : (
        <Empty title="Your first release starts here">
          Create a release, then add the installer, guides, notes, and
          checksums. Add more files whenever you need.
        </Empty>
      )}
    </>
  );
}
export function ReleaseDetail({
  release,
  data,
}: {
  release: Build;
  data: HubData;
}) {
  const files = data.files.filter(
    (f) => f.parent_type === "builds" && f.parent_id === release.id,
  );
  return (
    <>
      <Link href="/development" className="hub-back">
        <ArrowLeft size={16} aria-hidden="true" /> All releases
      </Link>
      <Heading
        title={release.version}
        description={`${formatDate(release.created_at)} · ${files.length} ${files.length === 1 ? "file" : "files"}`}
        icon={Package}
      />
      <Composer title="Add files to this release" open={!files.length}>
        <p className="hub-muted">
          Choose one or many files. You can return and add more at any time.
        </p>
        <ActionForm action={addReleaseFiles} label="Upload files">
          <input type="hidden" name="kind" value="builds" />
          <input type="hidden" name="release_id" value={release.id} />
          <Upload build required />
        </ActionForm>
      </Composer>
      {files.length ? (
        <Files files={data.files} kind="builds" id={release.id} comments />
      ) : (
        <Empty title="This release is ready for files">
          Add your .exe installer, README, testing guide, known issues, and
          SHA256.txt separately.
        </Empty>
      )}
    </>
  );
}
export function ReportsContent({ data }: { data: HubData }) {
  return (
    <>
      <Heading
        title="Tester reports"
        description="Your name, your report. That’s all we need."
        icon={MessageSquareText}
      />
      <Composer title="Upload a tester report" open={!data.reports.length}>
        <ActionForm label="Upload report">
          <input type="hidden" name="kind" value="testing_reports" />
          <Input name="tester_name" label="Your name" placeholder="e.g. Alex" />
          <Upload required multiple={false} />
        </ActionForm>
      </Composer>
      <div className="hub-stack">
        {data.reports.length ? (
          data.reports.map((report) => (
            <article className="hub-card" key={report.id}>
              <div className="hub-entry-heading">
                <h2>{report.tester_name}</h2>
                <time>{formatDate(report.created_at)}</time>
              </div>
              {report.findings && <Markdown>{report.findings}</Markdown>}
              <Files files={data.files} kind="testing_reports" id={report.id} />
            </article>
          ))
        ) : (
          <Empty title="Ready for feedback">
            Upload a Markdown or PDF testing report with your name. No account
            or release selection required.
          </Empty>
        )}
      </div>
    </>
  );
}
export function ProgressContent({ data }: { data: HubData }) {
  return (
    <>
      <Heading
        title="Progress"
        description="A simple place for project updates."
        icon={FileClock}
      />
      <Composer title="Upload progress" open={!data.updates.length}>
        <ActionForm label="Upload progress">
          <input type="hidden" name="kind" value="weekly_updates" />
          <Input
            name="title"
            label="Update name"
            placeholder="e.g. Beta 1 progress update"
          />
          <Upload required multiple={false} />
        </ActionForm>
      </Composer>
      <div className="hub-stack">
        {data.updates.length ? (
          data.updates.map((update) => (
            <article className="hub-card" key={update.id}>
              <div className="hub-entry-heading">
                <h2>{update.title || update.summary || "Progress update"}</h2>
                <time>{formatDate(update.created_at)}</time>
              </div>
              <Files files={data.files} kind="weekly_updates" id={update.id} />
            </article>
          ))
        ) : (
          <Empty title="Keep everyone up to date">
            Give your update a name and upload a PDF or Markdown file.
          </Empty>
        )}
      </div>
    </>
  );
}

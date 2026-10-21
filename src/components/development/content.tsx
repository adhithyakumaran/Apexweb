import {
  Package,
  FileText,
  FileCode2,
  MessageSquareText,
  FileClock,
  Layers3,
} from "lucide-react";
import { formatFileSize } from "@/lib/development/validation";
import { formatDate, type HubData, type HubFile } from "@/lib/development/data";
import { addReleaseFiles } from "@/lib/development/actions";
import { ActionForm, Input, Upload } from "./forms";
import { ActionPanel } from "./action-panel";
import { FileActions } from "./file-actions";
function Empty({ children }: { children: React.ReactNode }) {
  return <p className="hub-empty">{children}</p>;
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
  return (
    <ul className="hub-file-list">
      {files
        .filter((file) => file.parent_type === kind && file.parent_id === id)
        .map((file) => {
          const extension = file.name.split(".").pop()?.toUpperCase() || "FILE";
          const installer = [
            "EXE",
            "MSI",
            "DMG",
            "APK",
            "AAB",
            "IPA",
            "APPIMAGE",
          ].includes(extension);
          const Icon = installer ? FileCode2 : FileText;
          return (
            <li className="hub-file-card" key={file.id}>
              <div className="hub-file-row">
                <span
                  className={`hub-file-icon ${installer ? "installer" : ""}`}
                >
                  <Icon size={19} aria-hidden="true" />
                </span>
                <div className="hub-file-name">
                  <strong>{file.name}</strong>
                  <small>
                    <span className="hub-file-type">{extension}</span>
                    {formatFileSize(file.original_size ?? file.size)}
                    {file.compression === "gzip" && file.original_size ? (
                      <span className="hub-compression">
                        {" "}
                        ·{" "}
                        {((1 - file.size / file.original_size) * 100).toFixed(
                          0,
                        )}
                        % smaller
                      </span>
                    ) : null}
                  </small>
                  {file.comment && (
                    <p className="hub-file-comment">{file.comment}</p>
                  )}
                </div>
              </div>
              <FileActions
                id={file.id}
                name={file.name}
                preview={/pdf|markdown|image\/|text\/plain/.test(
                  file.mime_type,
                )}
                comment={file.comment}
                comments={comments}
              />
            </li>
          );
        })}
    </ul>
  );
}
export function WorkspaceContent({ data }: { data: HubData }) {
  return (
    <>
      <div className="hub-intro">
        <div>
          <span className="hub-eyebrow">
            <span className="hub-live-dot" /> YOUR DEVELOPMENT SPACE
          </span>
          <h1>Good builds. Better feedback.</h1>
          <p>Releases, reports, and progress. All in one place.</p>
        </div>
        <span className="hub-workspace-mark">
          <Layers3 size={16} aria-hidden="true" /> TestBuddy workspace
        </span>
      </div>
      <div className="hub-dashboard">
        <section id="releases" className="hub-section hub-releases">
          <div className="hub-section-heading">
            <div className="hub-section-title">
              <Package size={19} aria-hidden="true" />
              <h2>Build releases</h2>
              <span className="hub-count">{data.builds.length}</span>
            </div>
            <ActionPanel title="New release" initialOpen={!data.builds.length}>
              <div className="hub-new-release">
                <ActionForm label="Create release">
                  <input type="hidden" name="kind" value="builds" />
                  <Input
                    name="version"
                    label="Release name"
                    placeholder="e.g. Release beta 1"
                  />
                </ActionForm>
              </div>
            </ActionPanel>
          </div>
          <div className="hub-release-list">
            {data.builds.length ? (
              data.builds.map((release) => {
                const files = data.files.filter(
                  (file) =>
                    file.parent_type === "builds" &&
                    file.parent_id === release.id,
                );
                return (
                  <article
                    className="hub-release-card"
                    id={`release-${release.id}`}
                    key={release.id}
                  >
                    <div className="hub-release-heading">
                      <span className="hub-release-icon">
                        <Package size={21} aria-hidden="true" />
                      </span>
                      <div className="hub-release-name">
                        <h3>{release.version}</h3>
                        <p>
                          {formatDate(release.created_at)}
                          <span>·</span>
                          {files.length} {files.length === 1 ? "file" : "files"}
                        </p>
                      </div>
                      <ActionPanel
                        title="Add files"
                        subtle
                        initialOpen={!files.length}
                      >
                        <ActionForm
                          action={addReleaseFiles}
                          label="Upload files"
                        >
                          <input type="hidden" name="kind" value="builds" />
                          <input
                            type="hidden"
                            name="release_id"
                            value={release.id}
                          />
                          <Upload build required />
                        </ActionForm>
                      </ActionPanel>
                    </div>
                    {files.length ? (
                      <Files
                        files={data.files}
                        kind="builds"
                        id={release.id}
                        comments
                      />
                    ) : (
                      <Empty>
                        Add your installer, README, guides, or checksums to this
                        release.
                      </Empty>
                    )}
                  </article>
                );
              })
            ) : (
              <div className="hub-card">
                <Empty>
                  No releases yet. Give your first release a name, then add its
                  files.
                </Empty>
              </div>
            )}
          </div>
        </section>
        <div className="hub-side-column">
          <section id="reports" className="hub-section">
            <div className="hub-section-heading">
              <div className="hub-section-title">
                <MessageSquareText size={18} aria-hidden="true" />
                <h2>Tester reports</h2>
                <span className="hub-count">{data.reports.length}</span>
              </div>
              <ActionPanel title="Upload report" subtle>
                <ActionForm label="Upload report">
                  <input type="hidden" name="kind" value="testing_reports" />
                  <Input
                    name="tester_name"
                    label="Your name"
                    placeholder="e.g. Alex"
                  />
                  <Upload required multiple={false} />
                </ActionForm>
              </ActionPanel>
            </div>
            <div className="hub-entry-list">
              {data.reports.length ? (
                data.reports.map((report) => (
                  <article className="hub-card hub-entry" key={report.id}>
                    <div className="hub-entry-heading">
                      <span className="hub-avatar">
                        {report.tester_name.slice(0, 1).toUpperCase()}
                      </span>
                      <div>
                        <h3>{report.tester_name}</h3>
                        <time>{formatDate(report.created_at)}</time>
                      </div>
                      <span className="hub-entry-tag">Report</span>
                    </div>
                    <Files
                      files={data.files}
                      kind="testing_reports"
                      id={report.id}
                    />
                  </article>
                ))
              ) : (
                <div className="hub-card">
                  <Empty>
                    Tested a build? Upload your PDF or Markdown report with your
                    name.
                  </Empty>
                </div>
              )}
            </div>
          </section>
          <section id="progress" className="hub-section">
            <div className="hub-section-heading">
              <div className="hub-section-title">
                <FileClock size={18} aria-hidden="true" />
                <h2>Progress</h2>
                <span className="hub-count">{data.updates.length}</span>
              </div>
              <ActionPanel title="Add update" subtle>
                <ActionForm label="Upload progress">
                  <input type="hidden" name="kind" value="weekly_updates" />
                  <Input
                    name="title"
                    label="Update name"
                    placeholder="e.g. Beta 1 progress"
                  />
                  <Upload required multiple={false} />
                </ActionForm>
              </ActionPanel>
            </div>
            <div className="hub-entry-list">
              {data.updates.length ? (
                data.updates.map((update) => (
                  <article className="hub-card hub-entry" key={update.id}>
                    <div className="hub-entry-heading">
                      <span className="hub-progress-icon">
                        <FileClock size={17} aria-hidden="true" />
                      </span>
                      <div>
                        <h3>
                          {update.title || update.summary || "Progress update"}
                        </h3>
                        <time>{formatDate(update.created_at)}</time>
                      </div>
                    </div>
                    <Files
                      files={data.files}
                      kind="weekly_updates"
                      id={update.id}
                    />
                  </article>
                ))
              ) : (
                <div className="hub-card">
                  <Empty>
                    A name and a file. Keep everyone up to date with your latest
                    progress.
                  </Empty>
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </>
  );
}

import { FileDownload } from "./file-download";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import {
  ArrowUpRight,
  FileText,
  Package,
  Circle,
  CircleCheck,
  Clock3,
  RotateCcw,
  CalendarDays,
  Plus,
} from "lucide-react";
import { updateTask } from "@/lib/development/actions";
import {
  ActionForm,
  Input,
  Textarea,
  Upload,
  PublishCheckbox,
  PublishButton,
  StatusForm,
} from "./forms";
import {
  formatDate,
  today,
  type HubData,
  type Build,
  type WeeklyUpdate,
  type HubFile,
  type Task,
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
export function Empty({
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
export function Status({ value }: { value: string }) {
  const Icon =
    value === "Done" || value === "Published"
      ? CircleCheck
      : value === "In progress"
        ? Clock3
        : value === "Retest"
          ? RotateCcw
          : Circle;
  return (
    <span className="hub-status">
      <Icon size={13} aria-hidden="true" />
      {value}
    </span>
  );
}
export function Files({
  files,
  kind,
  id,
}: {
  files: HubFile[];
  kind: string;
  id: string;
}) {
  const items = files.filter(
    (f) => f.parent_id === id && f.parent_type === kind,
  );
  return (
    <div className="hub-files">
      {items.map((file) => (
        <div key={file.id}>
          <FileText size={16} aria-hidden="true" />
          <span>
            {file.name}
            <small>
              {(file.size / (1024 * 1024)).toFixed(2)} MB stored
              {file.compression === "gzip" && file.original_size
                ? ` · ${((1 - file.size / file.original_size) * 100).toFixed(1)}% saved · lossless`
                : ""}
            </small>
          </span>
          {/pdf|markdown|image\//.test(file.mime_type) && (
            <Link
              href={`/development/files/${file.id}?view=1`}
              className="hub-text-link"
            >
              View
            </Link>
          )}
          <FileDownload id={file.id} name={file.name} />
        </div>
      ))}
    </div>
  );
}
export function BuildCard({
  build,
  data,
  latest = false,
}: {
  build: Build;
  data: HubData;
  latest?: boolean;
}) {
  return (
    <article className="hub-card" id={`build-${build.id}`}>
      <div className="hub-card-heading">
        <span className="hub-eyebrow">
          <Package size={15} aria-hidden="true" />
          {latest ? "LATEST BUILD" : "BUILD RELEASE"}
        </span>
        <Status value={build.published ? "Published" : "Draft"} />
      </div>
      <h2>{build.version}</h2>
      <p className="hub-meta">Released {formatDate(build.created_at)}</p>
      <Markdown>{build.release_notes}</Markdown>
      <Files files={data.files} kind="builds" id={build.id} />
      <details className="hub-details">
        <summary>Installation instructions</summary>
        <Markdown>{build.instructions}</Markdown>
      </details>
      <details className="hub-details">
        <summary>Known issues</summary>
        <Markdown>
          {build.known_issues || "No known issues reported for this build."}
        </Markdown>
      </details>
      {!build.published && data.canManage && (
        <PublishButton kind="builds" id={build.id} />
      )}
    </article>
  );
}
export function UpdateCard({
  update,
  data,
}: {
  update: WeeklyUpdate;
  data: HubData;
}) {
  return (
    <article className="hub-card">
      <div className="hub-card-heading">
        <span className="hub-eyebrow">
          <FileText size={15} aria-hidden="true" />
          WEEKLY UPDATE
        </span>
        <Status value={update.published ? "Published" : "Draft"} />
      </div>
      <h2>
        {formatDate(update.week_start)} – {formatDate(update.week_end)}
      </h2>
      <Markdown>{update.summary}</Markdown>
      <Files files={data.files} kind="weekly_updates" id={update.id} />
      {!update.published && data.canManage && (
        <PublishButton kind="weekly_updates" id={update.id} />
      )}
    </article>
  );
}
export function Upcoming({ data }: { data: HubData }) {
  const events = data.events.filter((e) => e.event_date >= today());
  return (
    <section className="hub-card">
      <div className="hub-section-heading">
        <h2>Upcoming</h2>
        <CalendarDays size={18} aria-hidden="true" />
      </div>
      {events.length ? (
        <ul className="hub-simple-list">
          {events.slice(0, 8).map((e) => (
            <li key={e.id}>
              <span>{e.title}</span>
              <time dateTime={e.event_date}>{formatDate(e.event_date)}</time>
            </li>
          ))}
        </ul>
      ) : (
        <p className="hub-muted">
          No upcoming dates. The next shared milestone will appear here.
        </p>
      )}
      {data.canManage && (
        <details className="hub-composer">
          <summary>
            <Plus size={16} aria-hidden="true" /> Add a date
          </summary>
          <ActionForm label="Add date">
            <input type="hidden" name="kind" value="events" />
            <Input name="title" label="Milestone or event" />
            <Input name="event_date" label="Date" type="date" />
          </ActionForm>
        </details>
      )}
    </section>
  );
}
export function HomeContent({ data }: { data: HubData }) {
  const build = data.builds.find((b) => b.published);
  const update = data.updates.find((u) => u.published);
  const openTasks = data.tasks.filter((t) => t.status !== "Done");
  return (
    <>
      <div className="hub-intro">
        <span className="hub-eyebrow">YOUR DEVELOPMENT WORKSPACE</span>
        <h1>Build. Test. Improve.</h1>
        <p className="hub-lead">
          Latest releases, shared progress, and feedback that moves work
          forward.
        </p>
      </div>
      <div className="hub-home-grid">
        <div className="hub-stack">
          {build ? (
            <BuildCard build={build} data={data} latest />
          ) : (
            <section className="hub-card">
              <span className="hub-eyebrow">LATEST BUILD</span>
              <Empty title="Your first build starts here">
                {data.canManage
                  ? "Publish a build with installation instructions so your team can start testing."
                  : "A published build will appear here when it’s ready to test."}
              </Empty>
              <Link className="hub-button secondary" href="/development/builds">
                Go to builds <ArrowUpRight size={16} aria-hidden="true" />
              </Link>
            </section>
          )}
          {update ? (
            <UpdateCard update={update} data={data} />
          ) : (
            <section className="hub-card">
              <span className="hub-eyebrow">LATEST WEEKLY UPDATE</span>
              <Empty title="A little context goes a long way">
                Weekly progress reports will keep everyone up to date.
              </Empty>
              <Link className="hub-text-link" href="/development/progress">
                View progress <ArrowUpRight size={14} aria-hidden="true" />
              </Link>
            </section>
          )}
        </div>
        <div className="hub-stack">
          <section className="hub-card hub-testing-callout">
            <span className="hub-eyebrow">TESTING</span>
            <h2>
              Found something?
              <br />
              Let’s make it better.
            </h2>
            <p>
              Choose the build you tested and share your findings with the team.
            </p>
            <Link
              href="/development/testing#submit-report"
              className="hub-button"
            >
              Submit testing report{" "}
              <ArrowUpRight size={16} aria-hidden="true" />
            </Link>
          </section>
          <section className="hub-card">
            <div className="hub-section-heading">
              <h2>
                Open tasks <span className="hub-count">{openTasks.length}</span>
              </h2>
              <Link href="/development/tasks" className="hub-text-link">
                View all
              </Link>
            </div>
            {openTasks.length ? (
              <ul className="hub-task-preview">
                {openTasks.slice(0, 4).map((t) => (
                  <li key={t.id}>
                    <Link href={`/development/tasks#task-${t.id}`}>
                      {t.title}
                    </Link>
                    <Status value={t.status} />
                  </li>
                ))}
              </ul>
            ) : (
              <p className="hub-muted">
                All clear. Actionable findings will become tasks here.
              </p>
            )}
          </section>
          <Upcoming data={data} />
        </div>
      </div>
    </>
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
export function BuildList({ data }: { data: HubData }) {
  return (
    <>
      {data.canManage && (
        <Composer title="Publish a build">
          <ActionForm label="Save build">
            <input type="hidden" name="kind" value="builds" />
            <Input
              name="version"
              label="Version"
              placeholder="e.g. 1.0.0-beta.1"
            />
            <Textarea name="release_notes" label="Release notes" />
            <Textarea name="instructions" label="Installation instructions" />
            <Textarea
              name="known_issues"
              label="Known issues"
              required={false}
            />
            <Upload build required />
            <PublishCheckbox />
          </ActionForm>
        </Composer>
      )}
      {data.builds.length ? (
        <div className="hub-stack">
          {[...data.builds]
            .sort((a, b) => Number(b.published) - Number(a.published))
            .map((build, i) => (
              <BuildCard
                key={build.id}
                build={build}
                data={data}
                latest={i === 0 && build.published}
              />
            ))}
        </div>
      ) : (
        <Empty title="No builds yet">
          Published releases and older versions will be available here.
        </Empty>
      )}
    </>
  );
}
export function DocumentList({ data }: { data: HubData }) {
  return (
    <>
      {data.canManage && (
        <Composer title="Add a document">
          <ActionForm label="Save document">
            <input type="hidden" name="kind" value="documents" />
            <Input name="title" label="Title" />
            <label className="hub-field">
              Category
              <select name="category">
                {["Architecture", "Standards", "Setup", "Manual"].map((v) => (
                  <option key={v}>{v}</option>
                ))}
              </select>
            </label>
            <Textarea name="body" label="Markdown content" required={false} />
            <Upload documents />
            <PublishCheckbox />
          </ActionForm>
        </Composer>
      )}
      <div className="hub-stack">
        {data.documents.length ? (
          data.documents.map((doc) => (
            <article key={doc.id} className="hub-card">
              <div className="hub-card-heading">
                <span className="hub-eyebrow">{doc.category}</span>
                <Status value={doc.published ? "Published" : "Draft"} />
              </div>
              <h2>{doc.title}</h2>
              <p className="hub-meta">{formatDate(doc.created_at)}</p>
              {doc.body && (
                <details className="hub-details">
                  <summary>Read document</summary>
                  <Markdown>{doc.body}</Markdown>
                </details>
              )}
              <Files files={data.files} kind="documents" id={doc.id} />
              {!doc.published && data.canManage && (
                <PublishButton kind="documents" id={doc.id} />
              )}
            </article>
          ))
        ) : (
          <Empty title="A home for the details">
            Architecture, development standards, setup instructions, and manuals
            will appear here.
          </Empty>
        )}
      </div>
    </>
  );
}
export function ProgressList({ data }: { data: HubData }) {
  return (
    <>
      {data.canManage && (
        <Composer title="Publish a weekly update">
          <ActionForm label="Save weekly update">
            <input type="hidden" name="kind" value="weekly_updates" />
            <div className="hub-field-grid">
              <Input
                name="week_start"
                label="Reporting period starts"
                type="date"
              />
              <Input
                name="week_end"
                label="Reporting period ends"
                type="date"
              />
            </div>
            <Textarea name="summary" label="Short summary" />
            <Upload required documents />
            <PublishCheckbox />
          </ActionForm>
        </Composer>
      )}
      <div className="hub-stack">
        {data.updates.length ? (
          data.updates.map((u) => (
            <UpdateCard key={u.id} update={u} data={data} />
          ))
        ) : (
          <Empty title="Progress, one week at a time">
            Published weekly summaries and downloadable reports will appear
            here.
          </Empty>
        )}
      </div>
    </>
  );
}
export function TestingList({ data }: { data: HubData }) {
  const builds = data.builds.filter((b) => b.published);
  return (
    <>
      <section id="submit-report" className="hub-card">
        <span className="hub-eyebrow">SHARE YOUR FINDINGS</span>
        <h2>Submit a testing report</h2>
        <p className="hub-muted">
          Include your name, steps to reproduce, expected behaviour, and what
          happened.
        </p>
        {builds.length ? (
          <ActionForm label="Submit testing report">
            <input type="hidden" name="kind" value="testing_reports" />
            <label className="hub-field">
              Build tested
              <select name="build_id" required>
                <option value="">Choose a build</option>
                {builds.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.version}
                  </option>
                ))}
              </select>
            </label>
            <Input name="tester_name" label="Your name" />
            <Textarea name="findings" label="Findings" />
            <Upload />
          </ActionForm>
        ) : (
          <p className="hub-message">
            A published build is needed before you can submit a report.
          </p>
        )}
      </section>
      <h2 className="hub-list-heading">
        Tester submissions{" "}
        <span className="hub-count">{data.reports.length}</span>
      </h2>
      <div className="hub-stack">
        {data.reports.length ? (
          data.reports.map((r) => (
            <article className="hub-card" id={`report-${r.id}`} key={r.id}>
              <span className="hub-eyebrow">
                BUILD{" "}
                {data.builds.find((b) => b.id === r.build_id)?.version ||
                  "Unavailable"}
              </span>
              <h2>Report by {r.tester_name || "Tester"}</h2>
              <p className="hub-meta">{formatDate(r.created_at)}</p>
              <Markdown>{r.findings}</Markdown>
              <Files files={data.files} kind="testing_reports" id={r.id} />
              {data.canManage && (
                <Composer title="Convert finding to task">
                  <TaskComposer
                    data={data}
                    reportId={r.id}
                    description={r.findings}
                  />
                </Composer>
              )}
              {data.tasks
                .filter((t) => t.report_id === r.id)
                .map((t) => (
                  <p key={t.id}>
                    <Link
                      className="hub-text-link"
                      href={`/development/tasks#task-${t.id}`}
                    >
                      Related task: {t.title} →
                    </Link>
                  </p>
                ))}
            </article>
          ))
        ) : (
          <Empty title="Fresh eyes make better software">
            Submitted findings and their attachments will appear here.
          </Empty>
        )}
      </div>
    </>
  );
}
function TaskComposer({
  data,
  reportId = "",
  description = "",
  task,
}: {
  data: HubData;
  reportId?: string;
  description?: string;
  task?: Task;
}) {
  return (
    <ActionForm
      action={task ? updateTask : undefined}
      label={task ? "Save task" : "Create task"}
    >
      <input type="hidden" name="kind" value="tasks" />
      {task && <input type="hidden" name="id" value={task.id} />}
      <Input name="title" label="Task title" defaultValue={task?.title} />
      <Textarea
        name="description"
        label="Details"
        defaultValue={task?.description || description}
        required={false}
      />
      <Input
        name="owner_name"
        label="Owner name"
        required={false}
        defaultValue={task?.owner_name}
      />
      <div className="hub-field-grid">
        <label className="hub-field">
          Priority
          <select name="priority" defaultValue={task?.priority || "Medium"}>
            {["Low", "Medium", "High"].map((p) => (
              <option key={p}>{p}</option>
            ))}
          </select>
        </label>
        <label className="hub-field">
          Status
          <select name="status" defaultValue={task?.status || "Open"}>
            <option>Open</option>
            <option>In progress</option>
            <option>Retest</option>
            <option>Done</option>
          </select>
        </label>
      </div>
      <label className="hub-field">
        Related testing report
        <select name="report_id" defaultValue={task?.report_id || reportId}>
          <option value="">No related report</option>
          {data.reports.map((r) => (
            <option key={r.id} value={r.id}>
              {data.builds.find((b) => b.id === r.build_id)?.version} ·{" "}
              {r.tester_name} · {formatDate(r.created_at)} ·{" "}
              {r.findings.slice(0, 45)}
            </option>
          ))}
        </select>
      </label>
    </ActionForm>
  );
}
export function TaskList({ data, filter }: { data: HubData; filter: string }) {
  const tasks = data.tasks.filter((t) =>
    filter === "active" ? t.status !== "Done" : true,
  );
  return (
    <>
      {data.canManage && (
        <Composer title="Create a task">
          <TaskComposer data={data} />
        </Composer>
      )}
      <div className="hub-filters" aria-label="Filter tasks">
        {[
          ["all", "All tasks"],
          ["active", "Open work"],
        ].map(([value, label]) => (
          <Link
            href={`/development/tasks?filter=${value}`}
            aria-current={filter === value ? "page" : undefined}
            key={value}
          >
            {label}
          </Link>
        ))}
      </div>
      <div className="hub-workflow">
        Open <span>→</span> In progress <span>→</span> Retest <span>→</span>{" "}
        Done
      </div>
      <div className="hub-stack">
        {tasks.length ? (
          tasks.map((t) => (
            <article className="hub-card" id={`task-${t.id}`} key={t.id}>
              <div className="hub-card-heading">
                <Status value={t.status} />
                <span className="hub-meta">{t.priority} priority</span>
              </div>
              <h2>{t.title}</h2>
              <p className="hub-meta">Owner: {t.owner_name || "Unassigned"}</p>
              {t.description && <Markdown>{t.description}</Markdown>}
              {t.report_id && (
                <Link
                  className="hub-text-link"
                  href={`/development/testing#report-${t.report_id}`}
                >
                  View related testing report{" "}
                  <ArrowUpRight size={14} aria-hidden="true" />
                </Link>
              )}
              {data.canManage && <StatusForm id={t.id} status={t.status} />}
              {data.canManage && (
                <Composer title="Edit task details">
                  <TaskComposer data={data} task={t} />
                </Composer>
              )}
            </article>
          ))
        ) : (
          <Empty title="No tasks in this view">
            Create work from a tester’s findings, or check another filter.
          </Empty>
        )}
      </div>
    </>
  );
}

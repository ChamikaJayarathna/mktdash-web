export interface ModulePlaceholderPageProps {
  readonly module: string;
  readonly screen: string;
  readonly description: string;
}

const ModulePlaceholderPage = ({
  module,
  screen,
  description,
}: ModulePlaceholderPageProps) => {
  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-y-auto">
      <header className="flex flex-none flex-wrap items-baseline gap-x-2.5 gap-y-1 border-b border-border-1 px-gutter py-panel">
        <h1 className="type-h1 text-heading">{screen}</h1>
        <p className="type-eyebrow text-eyebrow">{module}</p>
      </header>

      <div className="flex flex-1 items-center justify-center px-gutter py-10">
        <div className="max-w-[34em] animate-fa-in text-center">
          <p className="type-h2 text-heading">This screen is not built yet</p>
          <p className="mt-2 text-base leading-relaxed text-body">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ModulePlaceholderPage;

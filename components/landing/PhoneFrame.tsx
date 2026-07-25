export default function PhoneFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative mx-auto w-[260px] sm:w-[280px]">
      <div className="relative rounded-[2.5rem] border-[6px] border-ink-700 bg-ink-950 shadow-card overflow-hidden aspect-[9/19]">
        <div className="absolute top-0 inset-x-0 h-6 flex justify-center z-20">
          <div className="w-24 h-5 bg-ink-700 rounded-b-2xl" />
        </div>
        <div className="absolute inset-0 pt-8 pb-4 px-3 overflow-hidden">{children}</div>
      </div>
    </div>
  );
}

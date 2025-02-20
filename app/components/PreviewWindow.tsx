type PreviewWindowProps = {
  emailHtmlPreview: string;
};

export default function PreviewWindow({
  emailHtmlPreview,
}: PreviewWindowProps) {
  return (
    <div
      className="lg:w-[30vw] max-h-screen w-screen
      lg:fixed lg:right-0 lg:top-16 lg:bottom-0
      bg-base-100 rounded-lg p-3 m-1 min-h-[80vh]"
    >
      <iframe
        className="w-full h-full bg-white rounded-lg border"
        onClick={(e) => e.stopPropagation()}
        srcDoc={emailHtmlPreview ?? ""}
      />
    </div>
  );
}

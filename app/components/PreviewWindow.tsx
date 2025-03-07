type PreviewWindowProps = {
  emailHtmlPreview: string;
};

export default function PreviewWindow({
  emailHtmlPreview,
}: PreviewWindowProps) {
  return (
    <div
      className="lg:w-[30vw] max-h-screen w-[97dvw]
      lg:fixed lg:right-0 lg:top-20 lg:bottom-0
      bg-base-100 min-h-[80vh]
      mockup-phone m-2"
    >
      <div className="mockup-phone-camera"></div>
      <iframe
        className="mockup-phone-display w-full h-full"
        onClick={(e) => e.stopPropagation()}
        srcDoc={emailHtmlPreview ?? ""}
      />
    </div>
  );
}

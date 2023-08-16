export const MediaPreview = ({ mediaPreview }) => {
    if (mediaPreview) {
      return (
        <div>
          <img
            src={mediaPreview}
            alt="Media Preview"
            className="mt-2"
            style={{ maxWidth: "200px" }}
          />
        </div>
      );
    }
    return null;
  };
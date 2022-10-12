export const validateFile = (imageFileType) => {
  console.log(imageFileType);
  switch (imageFileType) {
    case "image/jpeg":
    case "image/jpg":
    case "image/png":
      return true;
    default:
      return false;
  }
};

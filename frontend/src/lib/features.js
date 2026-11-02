const fileFormat = (url="") => {
  const fileExt = url.split(".").pop();
  if(fileExt === 'mp4' || fileExt === 'webm' || fileExt === 'ogg'){
    return "video"
  }

  if(fileExt === 'mp3' || fileExt === 'wav') {
    return "audio"
  }

  if(fileExt === 'png' || fileExt === 'jpg' || fileExt === 'gif' || fileExt === 'jpeg'){
    return "image"
  }

  return "file";
}

const transformImage = (url = "", width = 200, height = 150) => {
  if (!url.includes("res.cloudinary.com")) {
    return url;
  }

  const [prefix, suffix] = url.split("/upload/");
  const transformation = `w_${width},h_${height},c_fill`;

  return `${prefix}/upload/${transformation}/${suffix}`;
}
export {fileFormat, transformImage}






















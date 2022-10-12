import React, { useEffect, useState } from "react";
import { upladedImageService } from "../../services/imageService";
import AlertMessage from "../Messages/AlertMessage";
import SuccessMessage from "../Messages/SuccessMessage";
import { validateFile } from '../../services/utils';

const InkyFileUpload = () => {
  const [userFile, setUserFile] = useState({
    file: [],
  });
  const [upladedImage, setUploadedImage] = useState([]);
  const [selectedImage, setSelectedImage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isAlertShow, setIsAlertShow] = useState(false);
  const [isLoaded , setIsLoaded] = useState(false);
  useEffect(() => {
    //get images from storage account if previusly uploaded... better solution use the API endpoint to get list of iamges from DB.
    let storedImages = JSON.parse(localStorage.getItem("imageDB"));
    if (storedImages != null) {
      setUploadedImage(storedImages);
    }
  }, []);

  const handleFileChange = (e) => {
   
    if (validateFile(e.target.files[0].type)) {
      setSelectedImage(e.target.files[0].type);
      setUserFile({
        ...userFile,
        file: e.target.files[0],
      });
    } else {
      setIsAlertShow(true);
      document.getElementById("upload-image-input").value = "";
    }
  };

  const submitImage = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("inkyImage", userFile.file);
    setIsLoading(true);
    setUploadedImage([]);

    await upladedImageService(formData)
      .then((res) => {
        let tempArr = [...upladedImage];
        tempArr.push(res.data.filename);
        setSelectedImage("");
        setUploadedImage(tempArr);
        localStorage.setItem("imageDB", JSON.stringify(tempArr));
        document.getElementById("upload-image-input").value = "";
        setIsLoaded(true);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <div className="pt-8">
      {isAlertShow && (
        <AlertMessage handleClose={() => setIsAlertShow(false)} />
      )}
      {isLoaded && (
        <SuccessMessage handleClose={() => setIsLoaded(false)} />
      )}
      <h3 className="text-slate-500 font-bold text-2xl py-4">
        {" "}
        Inky Image Upload and Preview{" "}
      </h3>

      <div className=" mt-5">
        <div>
          <label className="pr-4 font-bold">Select Image: </label>
          <input
            id="upload-image-input"
            type="file"
            className="form-control"
            name="inky-file-upload"
            onChange={handleFileChange}
          />
        </div>
        <div className="">
          <button
            type="submit"
            className={`bg-pink-500 m-4 px-4 py-2 border-pink-500 rounded-md text-white 
              drop-shadow-md hover:bg-pink-600 ${selectedImage === "" ? "disabled:opacity-25" : ""}`}
            disabled={selectedImage === "" ? "disabled" : "" }
            onClick={submitImage}
          >
            Upload
          </button>
        </div>
      </div>

      {!isLoading && upladedImage.length > 0 && (
        <div className="py-12 border-2">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6">
            {upladedImage.map((img, i) => (
              <div
                className="py-2 my-4 mx-4 bg-slate-500 gap-2 drop-shadow-md rounded-md"
                key={i}
              >
                <img
                  className="m-auto items-center justify-center text-center w-48 h-auto"
                  src={`./uploads/${img}`}
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default InkyFileUpload;
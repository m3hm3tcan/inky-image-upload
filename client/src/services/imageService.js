import axios from "axios";

export const upladedImageService = async (formData) => {
    return await axios
      .post("http://localhost:3001/upload-image", formData, {
        headers: { 
          "Content-Type": "multopart/form-data",
          "Access-Control-Allow-Origin" : "*"
       },
      })
}

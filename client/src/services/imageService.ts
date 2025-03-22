import apiClient from "./apiClient";


export const uploadImg = (file: File) => {
    return new Promise<string | null>((resolve, reject) => {
      console.log("uploadImg");
      console.log(file);
  
      const formData = new FormData();
      if (file) {
        formData.append("file", file);
        apiClient.post('/file', formData, {
          headers: {
            'Content-Type': 'image/jpeg',
          },
        })
          .then((res) => {
            console.log(res);
            const url = res.data.url;
            resolve(url); 
          })
          .catch((err) => {
            console.log(err);
            reject(null);  
          });
      } else {
        reject(null);
      }
    });
  };
  

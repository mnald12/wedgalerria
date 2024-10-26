import "../css/upload.css";
import shortid from "https://cdn.skypack.dev/shortid@2.2.16";
import { useState } from "react";
import { db, storage } from "../db/conifg";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { addDoc, collection } from "firebase/firestore";
import { v4 } from "uuid";
import { Oval } from "react-loader-spinner";

const Uploadeer = () => {
  const [selectedfile, SetSelectedFile] = useState([]);
  const [loaded, setLoaded] = useState(0);
  const [isUpLoading, setIsUpLoading] = useState(false);
  const [isGoodToUpload, setIsGoodToUpload] = useState(false);

  const filesizes = (bytes, decimals = 2) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
  };

  // const InputChange = (e) => {
  //   // --For Multiple File Input
  //   let images = [];
  //   for (let i = 0; i < e.target.files.length; i++) {
  //     images.push(e.target.files[i]);
  //     let reader = new FileReader();
  //     let file = e.target.files[i];
  //     reader.onloadend = () => {
  //       SetSelectedFile((preValue) => {
  //         return [
  //           ...preValue,
  //           {
  //             id: shortid.generate(),
  //             image: e.target.files[i],
  //             filename: e.target.files[i].name,
  //             filetype: e.target.files[i].type,
  //             fileimage: reader.result,
  //             datetime:
  //               e.target.files[i].lastModifiedDate.toLocaleString("en-IN"),
  //             filesize: filesizes(e.target.files[i].size),
  //           },
  //         ];
  //       });
  //     };
  //     if (e.target.files[i]) {
  //       reader.readAsDataURL(file);
  //     }
  //     if (i === e.target.files.length - 1) {
  //       setIsGoodToUpload(true);
  //     }
  //   }
  // };

  const InputChange = (e) => {
    let images = [];
    let totalFiles = e.target.files.length;
    let loadedFiles = 0; // Counter to track loaded files

    for (let i = 0; i < totalFiles; i++) {
      let file = e.target.files[i];
      images.push(file);

      let reader = new FileReader();

      // eslint-disable-next-line no-loop-func
      reader.onloadend = () => {
        SetSelectedFile((preValue) => {
          return [
            ...preValue,
            {
              id: shortid.generate(),
              image: file,
              filename: file.name,
              filetype: file.type,
              fileimage: reader.result,
              datetime: file.lastModifiedDate.toLocaleString("en-IN"),
              filesize: filesizes(file.size),
            },
          ];
        });

        loadedFiles++; // Increment the loaded file count

        // Check if all files have been processed
        if (loadedFiles === totalFiles) {
          setIsGoodToUpload(true); // Set true when all files are loaded
        }
      };

      if (file) {
        reader.readAsDataURL(file);
      }
    }
  };

  const DeleteSelectFile = (id) => {
    const result = selectedfile.filter((data) => data.id !== id);
    SetSelectedFile(result);
  };

  const FileUploadSubmit = async (e) => {
    e.preventDefault();
    e.target.reset();

    if (selectedfile.length > 0) {
      setIsUpLoading(true); // Start uploading state
      let uploadPromises = [];

      for (let i of selectedfile) {
        const imageRef = ref(storage, `images/${v4()}`);
        const imagesRef = collection(db, "pictures");

        // Upload file and get URL
        const uploadPromise = uploadBytes(imageRef, i.image)
          .then((snapshot) => getDownloadURL(snapshot.ref))
          .then(async (url) => {
            await addDoc(imagesRef, { pic: url });
          });

        uploadPromises.push(uploadPromise);
      }

      // Update progress during upload
      let index = 1;
      uploadPromises.forEach((promise) => {
        promise.finally(() => {
          let summed = (index / selectedfile.length) * 100;
          setLoaded(summed.toFixed(2));
          index++;
        });
      });

      // Wait for all uploads to finish
      await Promise.all(uploadPromises);

      setIsUpLoading(false); // End uploading state
      SetSelectedFile([]); // Clear the selected files
    }
  };

  return (
    <div className="fileupload-view">
      <div className="row justify-content-center m-0">
        <div className="col-md-12">
          <div className="card mt-2">
            <div className="card-body scrollable">
              {isUpLoading ? (
                <div className="project-list">
                  <div className="project-container">
                    Uploading...
                    <div className="progress-bar-container">
                      <div
                        className="progress-bar"
                        aria-valuenow={0}
                        aria-valuemin={0}
                        aria-valuemax={100}
                        style={{ width: loaded > 0 ? `${loaded}%` : "0" }}
                      >
                        {loaded}%
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="kb-data-box">
                  <div className="kb-modal-data-title">
                    <div className="kb-data-title">
                      <h6>Upload your photos here</h6>
                    </div>
                  </div>
                  <form onSubmit={FileUploadSubmit}>
                    <div className="kb-file-upload">
                      <div className="file-upload-box">
                        <input
                          type="file"
                          id="fileupload"
                          className="file-upload-input"
                          onChange={InputChange}
                          multiple
                        />
                        <span>
                          Drag and drop or{" "}
                          <span className="file-link">Choose your files</span>
                        </span>
                      </div>
                    </div>
                    <div className="kb-attach-box mb-3">
                      {selectedfile.map((data) => {
                        return (
                          <div className="file-atc-box" key={data.id}>
                            {data.filename.match(
                              /.(jpg|jpeg|png|gif|svg)$/i
                            ) ? (
                              <div className="file-image">
                                {" "}
                                <img src={data.fileimage} alt="" />
                              </div>
                            ) : (
                              <div className="file-image">
                                <i className="far fa-file-alt"></i>
                              </div>
                            )}
                            <div className="file-detail">
                              <h6>{data.filename}</h6>
                              <p
                                style={{
                                  padding: 0,
                                  margin: 0,
                                  paddingBottom: "6px",
                                }}
                              >
                                <span>Size : {data.filesize}</span>
                                <br></br>
                                <span>Modified Time : {data.datetime}</span>
                              </p>
                              <div className="file-actions">
                                <button
                                  type="button"
                                  className="file-action-btn"
                                  onClick={() => DeleteSelectFile(data.id)}
                                >
                                  Remove
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    {selectedfile.length > 0 ? (
                      <div
                        className="kb-buttons-box"
                        style={{ textAlign: "right" }}
                      >
                        {isGoodToUpload ? (
                          <button
                            type="submit"
                            className="btn btn-primary form-submit"
                          >
                            Upload
                          </button>
                        ) : (
                          <button
                            type="button"
                            className="btn btn-primary form-submit"
                          >
                            <Oval
                              visible={true}
                              height="20"
                              width="20"
                              color="aliceblue"
                              ariaLabel="oval-loading"
                            />
                          </button>
                        )}
                      </div>
                    ) : (
                      <></>
                    )}
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Uploadeer;

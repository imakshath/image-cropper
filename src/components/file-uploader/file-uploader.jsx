import React from 'react';
import axios from 'axios';
import ImagePreview from '../image-preview/image-preview';
import Button from '../button/button';
import { _URL } from '../../utility';
import Snackbar from '../snackbar/snackbar';

import './file-uploader.scss';

export default function FileUploader({ onUploadSuccess }) {
    const [convertedFiles, setConvertedFiles] = React.useState([]);
    const [fileNotSpported, setFileNotSupprted] = React.useState();
    const [isUploading, setIsUploading] = React.useState(false);
    const [message, setMessage] = React.useState();

    const fileUploadeHandler = async (e) => {
        const file = e.target.files[0];
        try {
            // Validate file type, only allow image type.
            const allowedExtensions = /(\.jpg|\.jpeg|\.png)$/i;
            if (allowedExtensions.exec(file.value)) {
                setFileNotSupprted(true);
                return;
            }
            // get the image width and height for validation.
            const { height, width } = await getImageHeightAndWidth(file);
            if (height !== 1024 || width !== 1024) {
                setFileNotSupprted(true);
                return;
            }
            setFileNotSupprted(false);
            await convertImages(file);
        } catch (err) {
            setFileNotSupprted(true);
        }
    };

    const getImageHeightAndWidth = (file) => {
        return new Promise((resolve, reject) => {
            if (!file) reject('File not found!');
            const img = new Image();
            img.onload = function () {
                resolve({
                    width: this.width,
                    height: this.height,
                });
            };
            img.onerror = function () {
                reject('not a valid file: ' + file.type);
            };
            img.src = _URL.createObjectURL(file);
        });
    };

    function cropImage(file, outputHeight, outputWidth) {
        // we return a Promise that gets resolved with our canvas element
        return new Promise((resolve) => {
            const url = _URL.createObjectURL(file);
            // this image will hold our source image data
            const inputImage = new Image();
            // we want to wait for our image to load
            inputImage.onload = () => {
                // let's store the width and height of our image
                const inputWidth = inputImage.naturalWidth;
                const inputHeight = inputImage.naturalHeight;

                // calculate the position to draw the image at
                const outputX = (outputWidth - inputWidth) * 0.5;
                const outputY = (outputHeight - inputHeight) * 0.5;

                // create a canvas that will present the output image
                const outputImage = document.createElement('canvas');

                // set it to the same size as the image
                outputImage.width = outputWidth;
                outputImage.height = outputHeight;

                // draw our image at position 0, 0 on the canvas
                const ctx = outputImage.getContext('2d');
                ctx.drawImage(inputImage, outputX, outputY);
                ctx.canvas.toBlob(
                    (blob) => {
                        const file = new File(
                            [blob],
                            `${outputWidth}-${outputHeight}.png`,
                            {
                                type: 'image/png',
                                lastModified: Date.now(),
                            }
                        );
                        resolve(file);
                    },
                    'image/jpeg',
                    1
                );
            };

            // start loading our image
            inputImage.src = url;
        });
    }

    const convertImages = async (selectedFile) => {
        try {
            const firstImage = await cropImage(selectedFile, 755, 450);
            const secondImage = await cropImage(selectedFile, 365, 450);
            const thirdImage = await cropImage(selectedFile, 380, 380);
            const fourthImage = await cropImage(selectedFile, 365, 212);

            setConvertedFiles([
                firstImage,
                secondImage,
                thirdImage,
                fourthImage,
            ]);
        } catch (error) {
            // Handle error.
            console.log(error);
        }
    };

    const handleUpload = async () => {
        try {
            setIsUploading(true);
            // prepare formdata object for upload.
            const formData = new FormData();
            for (let file of convertedFiles) {
                formData.append('files', file);
            }
            // upload files to the server.
            const { data } = await axios.post(
                `${process.env.REACT_APP_SERVER_URL}/upload`,
                formData,
                {}
            );
            setIsUploading(false);
            setMessage('Uploaded Successfully.');
            const urls = data.map(e => `${process.env.PUBLIC_URL}/images/${e.filename}`);
            setTimeout(() => {
                onUploadSuccess(urls);
            }, 3000);
        } catch (error) {
            setIsUploading(false);
            setMessage('Something went wrong!');
        }
    };

    const handleCancelUpload = () => {
        setConvertedFiles([]);
        setMessage('');
    };

    return (
        <>
            <div className="file-upload-wrapper">
                <div className="item input-file-wrapper">
                    <label htmlFor="file-input">Upload 1024*1024 image.</label>
                    <input
                        name="file-input"
                        type="file"
                        onChange={fileUploadeHandler}
                    />
                    {fileNotSpported && (
                        <small className="error-message">
                            File Not supported!.
                        </small>
                    )}
                </div>
            </div>
            {/* Snackbar message to show the notification. */}
            <Snackbar show={!!message}>{message}</Snackbar>
            {!!convertedFiles.length && (
                <>
                    <h3>Image preview</h3>
                    <div className="image-preview-container">
                        <ImagePreview imageList={convertedFiles} shouldConvertToUrlType />
                        <div>
                            <div className="button-wrapper">
                                <Button disabled={isUploading} onClick={handleUpload}>
                                    { isUploading ? <>Uploading...</> :  <>Upload</> }
                                </Button>
                            </div>
                            <div className="button-wrapper">
                                <Button disabled={isUploading} onClick={handleCancelUpload}>
                                    Cancel
                                </Button>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </>
    );
}

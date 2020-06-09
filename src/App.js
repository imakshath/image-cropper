import React from 'react';
import { navigate, Router } from "@reach/router"
import FileUploader from "./components/file-uploader/file-uploader";
import ErrorBoundary from "./components/error-boundary/error-boundary";
import ImagePreview from './components/image-preview/image-preview';

import './App.scss';

function App() {
    const [urls, setUrls] = React.useState([]);
    const handleUploadSuccess = (uploadedUrls) => {
        setUrls(uploadedUrls);
        navigate('/preview');
    };
    return (
        <div className="App">
            <ErrorBoundary>
                <Router>
                    <FileUploader onUploadSuccess={handleUploadSuccess} path="/" />
                    <ImagePreview imageList={urls} path="preview" />
                </Router>
            </ErrorBoundary>
        </div>
    );
}

export default App;

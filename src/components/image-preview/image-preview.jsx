import React from 'react';
import { _URL } from '../../utility';
import './image-preview.scss';

function ImagePreview({ imageList, shouldConvertToUrlType = false }) {
    const [imageUrls, setImageUrls] = React.useState([]);
    React.useEffect(() => {
        if (shouldConvertToUrlType) {
            const urls = imageList.map(e => _URL.createObjectURL(e));
            setImageUrls(urls);
        } else {
            setImageUrls(imageList);
        }
    }, [imageList, shouldConvertToUrlType]);
    return (
        <div className="image-preview-wrapper">
            {imageUrls.map((e, index) => (
                <div className="img"><img key={`image-${index}`} src={e} alt={e.name} /></div>
            ))}
        </div>
    )
}

export default React.memo(ImagePreview);

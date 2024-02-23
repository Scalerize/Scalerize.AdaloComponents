import React, {useState, useRef, useEffect} from 'react';

const iframeStyle = {
    width: '100%', 
    height: '100%', 
    border: '0', 
};
const Iframe = (props) => {
    const {startUrl, endUrl, action} = props;
    const [iframeSrc] = useState(startUrl);
    const iframeRef = useRef(null);

    const handleIframeLoad = () => {
        if (!iframeRef.current) {
            return;
        }
        
        // Not allowed due to content security policy
        const iframeUrl = iframeRef.current.contentWindow.location.href;
        if(!!iframeUrl && !!endUrl && !!action && iframeUrl.startsWith(endUrl)){
            action(iframeUrl);
        }
    };

    useEffect(() => {
        if (iframeRef.current) {
            iframeRef.current.addEventListener('load', handleIframeLoad);
        }
        return () => {
            if (iframeRef.current) {
                iframeRef.current.removeEventListener('load', handleIframeLoad);
            }
        };
    }, []);

    return <iframe
        ref={iframeRef}
        src={iframeSrc}
        style={iframeStyle}></iframe>

};

export default Iframe;

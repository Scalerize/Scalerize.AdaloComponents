import {log, report} from "../../../../Shared/utils";
import Slider from '@mui/material/Slider'
import Stack from '@mui/material/Stack'

const Table = (props) => {
    log(props);
    /*
    
    {
        "minValue": {value: 5, initial: 5, onChange: ƒ},
        "maxValue": {value: 5, initial: 5, onChange: ƒ},
        "Rail": {
            "color": "#e6e6e6",
            "thickness": 0
        },
        "Track": {
            "color": "#000000",
            "thickness": 0
        },
        "Thumb": {
            "color": "#000000",
            "hasRing": false,
            "ringColor": "#00000000",
            "ringThickness": 0,
            "hasGrip": false
        },
        "Value Label": {
            "color": "#000000",
            "textColor": "#ffffff"
        }
    }
    
     */
    const style = {
        wrapper: {
            width: '100%',
            height: `${props._height}px`,
            display: 'flex',
            'flex-direction': 'column'
        },
        sparkline: {
            height: '100%',
            flex: 1,
            display: 'flex',
            flexDirection: 'row',
            gap: '2px'
        },
        bar: {
            backgroundColor: `${props.Track.color}`,
            height: '100%',
            flex: 1,

        },
        slider: {
            width: '100%',
            marginTop: '-15px'
        }
    }
    return <div style={style.wrapper}>
        <div style={style.sparkline}>
            {[...Array(props.Sparkline.subdivisions).keys()]
                .map(x => <div style={style.bar}></div>)}
        </div>
        <Slider sx={style.slider}></Slider>
    </div>
};

export default Table;

import {log} from "../../../../Shared/utils";
import Slider, {SliderThumb} from '@mui/material/Slider'
import min from 'lodash/min';
import max from 'lodash/max';
import zip from 'lodash/zip';

const defaultRandomBarChartCollection = [...Array(100).keys()].map(() => 100);

const thumb = (hasGrip, color) => (props) => {
    const {children, ...other} = props;
    const style = {
        div: {
            display: 'flex',
            flexDirection: 'row',
            gap: 2
        },
        gripItem: {
            height: 9,
            width: 1.5,
            backgroundColor: color
        }
    };
    return (
        <SliderThumb {...other}>
            {children}
            {hasGrip
                ? <div style={style.div}>
                    <div style={style.gripItem}/>
                    <div style={style.gripItem}/>
                    <div style={style.gripItem}/>
                </div>
                : <></>}
        </SliderThumb>
    );
};

const SparklineSlider = (props) => {
    let collection = props.barChartCollection?.map(x => x?.barChartValueSelector);

    let [minValue, maxValue] = [
        min([min(collection), props.rangeStart.initial]),
        max([max(collection), props.rangeEnd.initial])
    ];
    const computeDimensionAndColor = (props) => {
        let initial = [...Array(props.Sparkline.subdivisions).keys()];

        const distance = (maxValue - minValue) / props.Sparkline.subdivisions;

        if (!collection || !collection.some(x => x !== undefined)) {
            return defaultRandomBarChartCollection.slice(0, props.Sparkline.subdivisions);
        }

        const filteredCollection = collection.filter(x => x >= minValue && x <= maxValue);

        let colorArray = initial
            .map(x => x * distance - minValue)
            .map(x => x >= props.rangeStart.value && x <= props.rangeEnd.value
                ? props.Track.color
                : props.Rail.color);

        let heightArray = initial
            .map(y => y - minValue)
            .map(x => filteredCollection.filter(y =>
                (y >= x * distance && y < (x + 1) * distance && x < props.Sparkline.subdivisions - 1 ||
                    y >= x * distance && x === props.Sparkline.subdivisions - 1)
            ).length);

        const maxHeight = max(heightArray);
        if (maxHeight !== 0) {
            heightArray = heightArray.map(x => `${x / maxHeight * 100}%`);
        }

        return [colorArray, heightArray];
    }

    const onChange = (e) => {
        props.rangeStart.onChange(e.target.value[0]);
        props.rangeEnd.onChange(e.target.value[1]);
    }

    const style = {
        wrapper: {
            width: '100%',
            height: `${props._height}px`,
            display: 'flex',
            'flex-direction': 'column',
            paddingBottom: props.valueLabel.enabled ? '45px' : 0
        },
        sparkline: {
            height: '100%',
            flex: 1,
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'end',
            gap: '1px'
        },
        bar: {
            height: '100%',
            flex: 1,
        },
        slider: {
            width: '100%',
            marginTop: '-15px',
            '& .MuiSlider-thumb': {
                height: `${props.Thumb.diameter}px`,
                width: `${props.Thumb.diameter}px`,
                backgroundColor: `${props.Thumb.color}`,
                outlineColor: `${props.Thumb.color}`,
                color: `${props.Thumb.color}`,
                border: `${(props.Thumb.hasRing ? props.Thumb.ringThickness : 0)}px solid ${props.Thumb.ringColor}`,
                '&:focus, &:hover, &.Mui-active, &.Mui-focusVisible': {
                    boxShadow: `0px 0px 0px 8px ${props.Thumb.color}28`
                },
                '&::before': {
                    boxShadow: `${props.Thumb.shadow}px ${props.Thumb.shadow}px ${props.Thumb.shadow}px rgba(0,0,0,0.2)`
                }
            },
            '& .MuiSlider-track': {
                border: 'none',
                backgroundColor: props.Track.color,
                height: `${props.Track.thickness}px`,
            },
            '& .MuiSlider-rail': {
                opacity: 1,
                backgroundColor: props.Rail.color,
                height: `${props.Rail.thickness}px`,
            },

            '& .MuiSlider-valueLabel': {
                lineHeight: 1.2,
                fontSize: 12,
                background: 'unset',
                padding: 0,
                top: 0,
                width: 32,
                height: 32,
                borderRadius: '50% 50% 50% 0',
                backgroundColor: props.valueLabel.color,
                color: props.valueLabel.textColor,
                transformOrigin: 'bottom left',
                transform: 'translate(50%, 0%) rotate(135deg) scale(1)',
                '&::before': {
                    display: 'none'
                },
                '&.MuiSlider-valueLabelOpen': {
                    transform: 'translate(50%, 20%) rotate(135deg) scale(1)',
                },
                '& > *': {
                    transform: 'rotate(-135deg)',
                },
            },
        }
    }
    return <div style={style.wrapper}>
        <div style={style.sparkline}>
            {
                zip(...computeDimensionAndColor(props)).map(([backgroundColor, height]) => { 
                    return <div style={{...style.bar, backgroundColor, height}}></div>
                })
            }
        </div>
        <Slider sx={style.slider} onChange={onChange}
                valueLabelDisplay={props.valueLabel.enabled ? 'on' : 'off'}
                key={`${props.rangeStart.initial}-${props.rangeStart.initial}`}
                defaultValue={[props.rangeStart.initial, props.rangeEnd.initial]}
                slots={{thumb: thumb(props.Thumb.hasGrip, props.Thumb.ringColor)}}
                min={minValue} max={maxValue} disableSwap></Slider>
    </div>
};

export default SparklineSlider;

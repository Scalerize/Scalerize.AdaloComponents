import {log, report} from "../../../../Shared/utils";
import Slider, {SliderThumb} from '@mui/material/Slider'
import Stack from '@mui/material/Stack'
import {useState} from "react";
import min from 'lodash/min';
import max from 'lodash/max';
import zip from 'lodash/zip';
import {Tooltip} from "@mui/material";

const thumb = (hasGrip, color) => (props) => {
    const {children, ...other} = props;
    const style = {
        height: 9,
        width: 1,
        backgroundColor: color,
        marginLeft: 1,
        marginRight: 1,
    };
    return (
        <SliderThumb {...other}>
            {children}
            {hasGrip
                ? <>
                    <span style={style}/>
                    <span style={style}/>
                    <span style={style}/>
                </>
                : <></>}
        </SliderThumb>
    );
};

const SparklineSlider = (props) => {
    const computeHeightArray = (props) => {
        let initial = [...Array(props.Sparkline.subdivisions).keys()];
        if (!props.barChartCollection) {
            return initial.map(x => 0);
        }
        const barChartValueSelectorArray = props.barChartCollection
            .map(x => x.barChartValueSelector);
        const [minValue, maxValue] = [min(barChartValueSelectorArray), max(barChartValueSelectorArray)];

        const distance = (maxValue - minValue) / props.Sparkline.subdivisions
        let heightArray = initial
            .map(x => barChartValueSelectorArray.filter(y =>
                (y >= x * distance && y < (x + 1) * distance && x < props.Sparkline.subdivisions ||
                    y >= x * distance && x === props.Sparkline.subdivisions - 1)
            ).length);
        const maxHeight = max(heightArray);
        if (maxHeight !== 0) {
            heightArray = heightArray.map(x => `${x / maxHeight * 100}%`);
        }
        return heightArray;
    }

    let getBar = ([idx, height]) => {
        const width = props._width / props.Sparkline.subdivisions;
        const offset = idx * width;
        const minOffset = props.minValue.value / 100 * props._width;
        const maxOffset = props.maxValue.value / 100 * props._width;
        const backgroundColor = offset >= minOffset && width + offset <= maxOffset
            ? props.Track.color
            : props.Rail.color;
        return <div style={{...style.bar, backgroundColor, height}}></div>
    };

    const onChange = (e) => {
        props.minValue.onChange(e.target.value[0]);
        props.maxValue.onChange(e.target.value[1]);
    }

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
            alignItems: 'end',
            gap: '2px'
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
                    boxShadow: `1px 1px ${props.Thumb.shadow}px rgba(0,0,0,0.2)`
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
                width: 32,
                height: 32,
                borderRadius: '50% 50% 50% 0',
                backgroundColor: props['Value Label'].color,
                color: props['Value Label'].textColor,
                transformOrigin: 'bottom left',
                transform: 'translate(50%, 20%) rotate(135deg) scale(1)',
                '&::before': {display: 'none'},
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
            {zip([...Array(props.Sparkline.subdivisions).keys()], computeHeightArray(props)).map(getBar)}
        </div>
        <Slider sx={style.slider} onChange={onChange}
                valueLabelDisplay={props['Value Label'].showLabel ? 'on': 'off'}
                defaultValue={[props.minValue.initial, props.maxValue.initial]}
                slots={{
                    thumb: thumb(props.Thumb.hasGrip, props.Thumb.ringColor)
                }}
                disableSwap></Slider>
    </div>
};

export default SparklineSlider;

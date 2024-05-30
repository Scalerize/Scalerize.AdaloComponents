import {useCallback, useState} from 'react';
import min from 'lodash/min';
import max from 'lodash/max';
import zip from 'lodash/zip';
import {StyleSheet, View} from 'react-native';
import {Thumb} from "./thumb";
import {report} from "../../../../Shared/utils";

const defaultRandomBarChartCollection = [...Array(100).keys()].map(() => Math.round(Math.random() * 100));
const componentId = 1;

const SparklineSlider = (props) => {
    let isEditor = !!props.editor;

    let collection = isEditor
        ? defaultRandomBarChartCollection
        : props.barChartCollection?.map(x => x?.barChartValueSelector);

    let [minValue, maxValue] = [
        min([min(collection), props.rangeStart.initial]),
        max([max(collection), props.rangeEnd.initial])
    ];

    const [value, setValue] = useState({
        rangeStart: props.rangeStart.initial,
        rangeEnd: props.rangeEnd.initial
    })
    const [railWidth, setRailWidth] = useState(0);

    const onLayout = useCallback(({nativeEvent: {layout}}) => {
        if (!!layout?.width)
            setRailWidth(layout.width);
    }, [railWidth, setRailWidth]);

    const computeDimensionAndColor = (props) => {
        try {
            let initial = [...Array(props.Sparkline.subdivisions).keys()];

            const distance = (maxValue - minValue) / props.Sparkline.subdivisions;

            if (!collection || !collection.some(x => x !== undefined)) {
                return defaultRandomBarChartCollection.slice(0, props.Sparkline.subdivisions);
            }

            const filteredCollection = collection.filter(x => x >= minValue && x <= maxValue);

            let colorArray = initial
                .map(x => x * distance + minValue)
                .map(x => x >= props.rangeStart.value && x <= props.rangeEnd.value
                    ? props.Track.color
                    : props.Rail.color);

            let heightArray = initial
                .map(x => filteredCollection.filter(y =>
                    (y >= minValue + x * distance && y < minValue + (x + 1) * distance && x < props.Sparkline.subdivisions - 1 ||
                        y >= minValue + x * distance && x === props.Sparkline.subdivisions - 1)
                ).length);

            const maxHeight = max(heightArray);
            if (maxHeight !== 0) {
                heightArray = heightArray.map(x => `${x / maxHeight * 100}%`);
            }

            return [colorArray, heightArray];
        } catch (e) {
            report({
                componentId,
                message: e.message
            })
            return [[], []]
        }
    }

    const onStartChange = (e) => {
        props.rangeStart.onChange(e);
        setValue(s => ({...s, rangeStart: e}))
    }

    const onEndChange = (e) => {
        props.rangeEnd.onChange(e);
        setValue(s => ({...s, rangeEnd: e}))
    }


    let maxSliderHeight = max([props.Track.thickness, props.Rail.thickness, props.Thumb.diameter]);
    const style = StyleSheet.create({
        wrapper: {
            width: '100%',
            height: `${props._height}px`,
            display: 'flex',
            'flex-direction': 'column',
            paddingBottom: props.valueLabel.enabled ? 45 : 0
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
            marginTop: -maxSliderHeight / 2,
            position: 'relative'
        },
        railWrapper: {
            position: 'relative',
            height: maxSliderHeight
        },
        rail: {
            position: 'absolute',
            top: Math.max((maxSliderHeight - props.Rail.thickness) / 2, 0),
            width: '100%',
            backgroundColor: props.Rail.color,
            height: `${props.Rail.thickness}px`,
        },
        track: {
            position: 'absolute',
            top: Math.max((maxSliderHeight - props.Track.thickness) / 2, 0),
            backgroundColor: props.Track.color,
            height: `${props.Track.thickness}px`,
            left: `${value.rangeStart / maxValue * 100}%`,
            right: `${(maxValue - value.rangeEnd) / maxValue * 100}%`,
        },
        thumb: {
            position: "absolute",
            marginTop: maxSliderHeight / 2,
            height: `${props.Thumb.diameter}px`,
            width: `${props.Thumb.diameter}px`,
            backgroundColor: `${props.Thumb.color}`,
            outlineColor: `${props.Thumb.color}`,
            color: `${props.Thumb.color}`,
            border: `${(props.Thumb.hasRing ? props.Thumb.ringThickness : 0)}px solid ${props.Thumb.ringColor}`,
            boxShadow: `${props.Thumb.shadow}px ${props.Thumb.shadow}px ${props.Thumb.shadow}px rgba(0,0,0,0.2)`,
            borderRadius: '50%',
            cursor: 'pointer'
        }
    });

    const thumbBaseProperties = {
        hasGrip: props.Thumb.hasGrip,
        gripColor: props.Thumb.gripColor,
        diameter: props.Thumb.diameter,
        style: style.thumb,
        ...value,
        minValue,
        maxValue,
        parentWidth: railWidth,
        showLabel: props.valueLabel.enabled,
        labelColor: props.valueLabel.color,
        labelTextColor: props.valueLabel.textColor
    };

    return <View style={style.wrapper}>
        <View style={style.sparkline}>
            {
                zip(...computeDimensionAndColor(props)).map(([backgroundColor, height]) => {
                    return <View style={{...style.bar, backgroundColor, height}}></View>
                })
            }
        </View>
        <View style={style.slider}>
            <View style={style.railWrapper}
                  onLayout={onLayout}>
                <View style={style.rail}></View>
                <View style={style.track}></View>
                {railWidth > 0 && railWidth != null
                    ? <>
                        <Thumb {...thumbBaseProperties} thumbType="min" onValueChange={onStartChange}></Thumb>
                        <Thumb {...thumbBaseProperties} thumbType="max" onValueChange={onEndChange}></Thumb>
                    </>
                    : <></>}
            </View>
        </View>
    </View>
};

export default SparklineSlider;

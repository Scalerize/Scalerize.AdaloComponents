import {useState, useRef, useEffect} from 'react';
import Slider, {SliderThumb} from '@mui/material/Slider'
import min from 'lodash/min';
import max from 'lodash/max';
import zip from 'lodash/zip';
import {Animated, PanResponder, StyleSheet, View} from 'react-native';
import {log} from "../../../../Shared/utils";

const defaultRandomBarChartCollection = [...Array(100).keys()].map(() => 100);

class Thumb extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            rangeStart: this.props.rangeStart,
            rangeEnd: this.props.rangeEnd,
            offset: 0
        };
    }
    
    componentDidMount() {
        let {offsetRangeStart, offsetRangeEnd, isMin} = this.getOffsets();
        let initialX = isMin ? offsetRangeStart : offsetRangeEnd;
        this.pan = new Animated.ValueXY({
            x: initialX,
            y: 0
        });
        this.setState(s => ({...s, offset: initialX}))

        this.panResponder = PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onPanResponderMove: Animated.event([null, {dx: this.pan.x}],
                {
                    useNativeDriver: true,
                    listener: (event, gesture) => {
                        let pixelNewValue = this.pan.x['_offset'] + gesture.dx;
                        let range = this.getRange(this.props.parentWidth)
                        let clampedPixelValue = this.clamp(pixelNewValue, range);
                        log({pixelNewValue, range, clampedPixelValue})
                        this.setState(s => ({...s, offset: clampedPixelValue}))
                        let newValue = this.mapDimensionToValue(clampedPixelValue);
                        this.props.onValueChange(newValue);
                    }
                }),
            onPanResponderRelease: () => {
                this.pan.extractOffset();
            }
        });
    }

    getOffsets() {
        let isMin = this.props.thumbType === 'min';
        let offsetRangeStart = this.mapValueToDimention(this.state.rangeStart);
        let offsetRangeEnd = this.mapValueToDimention(this.state.rangeEnd);
        return {offsetRangeStart, offsetRangeEnd, isMin};
    }

    mapValueToDimention(value) {
        return this.props.parentWidth * value / this.props.maxValue;
    }

    mapDimensionToValue(value) {
        return value / this.props.parentWidth * this.props.maxValue;
    }

    getRange(parentWidth) {
        const {offsetRangeStart, offsetRangeEnd, isMin} = this.getOffsets();
        return isMin
            ? [0, parentWidth]
            : [offsetRangeStart, parentWidth];
    }

    clamp(val, [min, max]) {
        return Math.max(min, Math.min(val, max));
    }

    render() {
        const innerStyle = StyleSheet.create({
            wrapper: {
                transform: [
                    {translateX: -this.props.diameter / 2},
                    {translateY: -this.props.diameter / 2}
                ]
            },
            thumb: {
                transform: [
                    {translateX: this.state.offset}
                ]

            },
            div: {
                display: 'flex',
                flexDirection: 'row',
                gap: 2
            },
            gripItem: {
                height: 9,
                width: 1.5,
                backgroundColor: this.props.gripColor
            }
        });

        return (<View style={innerStyle.wrapper}>
                {this.panResponder && this.props.parentWidth > 0
                    ? <Animated.View style={[this.props.style, innerStyle.thumb]}
                                     {...this.panResponder.panHandlers}>
                        {this.props.children}
                        {this.props.hasGrip
                            ? <View style={innerStyle.div}>
                                <View style={innerStyle.gripItem}/>
                                <View style={innerStyle.gripItem}/>
                                <View style={innerStyle.gripItem}/>
                            </View>
                            : <></>}
                    </Animated.View>
                    : <></>}
            </View>
        );
    }
}

const SparklineSlider = (props) => {
    let collection = props.barChartCollection?.map(x => x?.barChartValueSelector);

    let [minValue, maxValue] = [
        min([min(collection), props.rangeStart.initial]),
        max([max(collection), props.rangeEnd.initial])
    ];

    const [value, setValue] = useState({
        rangeStart: props.rangeStart.initial,
        rangeEnd: props.rangeEnd.initial
    })
    const [railWidth, setRailWidth] = useState(0);
    const computeDimensionAndColor = (props) => {
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
    }

    const onStartChange = (e) => {
        props.rangeStart.onChange(e);
        setValue(s => ({...s, rangeStart: e}))
    }

    const onEndChange = (e) => {
        props.rangeEnd.onChange(e);
        setValue(s => ({...s, rangeEnd: e}))
    }

    const onLayout = (event) => {
        const {width} = event.nativeEvent.layout;
        setRailWidth(width);
    }
    const styles2 = StyleSheet.create({
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
            marginTop: -15,
            position: 'relative',
            paddingTop: 13,
            paddingBottom: 13,
            paddingLeft: 0,
            paddingRight: 0
        },
        railWrapper: {
            position: 'relative'
        },
        rail: {
            position: 'absolute',
            width: '100%',
            backgroundColor: props.Rail.color,
            height: `${props.Rail.thickness}px`,
        },
        track: {
            position: 'absolute',
            backgroundColor: props.Track.color,
            height: `${props.Track.thickness}px`,
            left: `${value.rangeStart / maxValue * 100}%`,
            right: `${(maxValue - value.rangeEnd) / maxValue * 100}%`,
        },
        thumb: {
            position: "absolute",
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
        gripColor: props.Thumb.ringColor,
        diameter: props.Thumb.diameter,
        style: styles2.thumb,
        ...value,
        minValue,
        maxValue,
        parentWidth: railWidth
    };

    return <View style={styles2.wrapper}>
        <View style={styles2.sparkline}>
            {
                zip(...computeDimensionAndColor(props)).map(([backgroundColor, height]) => {
                    return <View style={{...styles2.bar, backgroundColor, height}}></View>
                })
            }
        </View>
        <View style={styles2.slider}>
            <View style={styles2.railWrapper}
                  onLayout={onLayout}>
                <View style={styles2.rail}></View>
                <View style={styles2.track}></View>
                {railWidth
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

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
            parentWidth: 0
        };
    }

    componentDidMount() {
        const initialTranslate = -this.props.diameter / 2;
        const initialValue = this.props.thumbType === 'min' ? this.props.rangeStart : this.props.rangeEnd;
        let translateX = initialValue / this.props.maxValue * this.state.parentWidth;

        this.pan = new Animated.ValueXY({
            x: translateX + initialTranslate,
            y: initialTranslate
        });


        this.panResponder = PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onPanResponderMove: Animated.event([null, {dx: this.pan.x}],
                {
                    useNativeDriver: true,
                    listener: (event, gesture) => {
                        this.props.onValueChange((this.pan.x._offset + gesture.dx) / this.state.parentWidth * this.props.maxValue);
                    }
                }),
            onPanResponderRelease: () => {
                this.pan.extractOffset();
            }
        });
    }

    onLayout(event) {
        const {width} = event.nativeEvent.layout;
        this.setState({parentWidth: width});
    }

    render() {
        const initialTranslate = -this.props.diameter / 2;
        const initialValue = this.props.thumbType === 'min' ? this.props.rangeStart : this.props.rangeEnd;
        let translateX = initialValue / this.props.maxValue * this.state.parentWidth;
        let range = [initialTranslate - translateX, this.state.parentWidth + initialTranslate - translateX];
        const innerStyle = StyleSheet.create({
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

        return (<View
                onLayout={this.onLayout.bind(this)}>
                {this.pan && this.panResponder && this.state.parentWidth > 0
                    ? <Animated.View style={[this.props.style, {
                        transform: [{
                            translateX: this.pan.x.interpolate({
                                inputRange: range,
                                outputRange: range,
                                extrapolate: 'clamp'
                            })
                        },
                            {
                                translateY: this.pan.y
                            }]
                    }]}
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
    }

    const onEndChange = (e) => {
        props.rangeEnd.onChange(e);
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

    const styles2 = StyleSheet.create({
        container: {
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
            cursor: 'pointer',
            transform: [
                {translateX: -props.Thumb.diameter / 2},
                {translateY: -props.Thumb.diameter / 2},
            ],
        },
        thumbLeft: {
            left: `${value.rangeStart / maxValue * 100}%`,
        },
        thumbRight: {
            left: `${value.rangeEnd / maxValue * 100}%`,
        }
    });

    const thumbBaseProperties = {
        hasGrip: props.Thumb.hasGrip,
        gripColor: props.Thumb.ringColor,
        diameter: props.Thumb.diameter,
        ...value,
        minValue,
        maxValue
    };

    return <View style={style.wrapper}>
        <View style={style.sparkline}>
            {
                zip(...computeDimensionAndColor(props)).map(([backgroundColor, height]) => {
                    return <View style={{...style.bar, backgroundColor, height}}></View>
                })
            }
        </View>
        <View style={styles2.container}>
            <View style={styles2.railWrapper}>
                <View style={styles2.rail}></View>
                <View style={styles2.track}></View>
                <Thumb {...thumbBaseProperties} thumbType="min" onValueChange={onStartChange}
                       style={{...styles2.thumb, ...styles2.thumbLeft}}></Thumb>
                <Thumb {...thumbBaseProperties} thumbType="max" onValueChange={onEndChange}
                       style={{...styles2.thumb, ...styles2.thumbRight}}></Thumb>
            </View>
        </View>
    </View>
};

export default SparklineSlider;

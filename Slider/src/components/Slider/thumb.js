import {Animated, PanResponder, StyleSheet, View} from "react-native";

export class Thumb extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            ...this.getRange(),
            offset: 0,
            previousOffset: 0
        };
        this.updateOffset();
        this.updateMinAndMaxValue();
    }

    getRange() {
        return {
            minValue: this.isMinimumThumb() ?
                0
                : this.mapValueToDimention(this.props.rangeStart),
            maxValue: this.isMinimumThumb()
                ? this.mapValueToDimention(this.props.rangeEnd)
                : this.props.parentWidth,
        };
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.rangeStart !== this.props.rangeStart && this.isMinimumThumb() ||
            prevProps.rangeEnd !== this.props.rangeEnd && !this.isMinimumThumb() ||
            prevProps.maxValue !== this.props.maxValue ||
            prevProps.parentWidth !== this.props.parentWidth) {
            this.updateOffset();
        }

        if (prevProps.rangeStart !== this.props.rangeStart && !this.isMinimumThumb() ||
            prevProps.rangeEnd !== this.props.rangeEnd && this.isMinimumThumb() ||
            prevProps.maxValue !== this.props.maxValue ||
            prevProps.parentWidth !== this.props.parentWidth) {
            this.updateMinAndMaxValue();
        }
    }

    updateMinAndMaxValue() {
        this.setState(s => ({...s, ...this.getRange()}))
    }

    updateOffset() {
        this.setState(s => ({...s, offset: this.getOffset()}))
    }

    getOffset() {
        let newValue = this.isMinimumThumb() ? this.props.rangeStart : this.props.rangeEnd;
        return this.mapValueToDimention(newValue);
    }

    componentDidMount() {
        this.panResponder = PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onPanResponderMove: Animated.event([null, {}],
                {
                    useNativeDriver: true,
                    listener: (event, gesture) => {
                        let pixelNewValue = this.state.offset + gesture.dx - this.state.previousOffset;
                        let clampedPixelValue = this.clamp(pixelNewValue, [this.state.minValue, this.state.maxValue]);
                        this.setState(s => ({...s, offset: clampedPixelValue, previousOffset: gesture.dx}))
                        let newValue = this.mapDimensionToValue(clampedPixelValue);
                        this.props.onValueChange(newValue);
                    }
                }),
            onPanResponderRelease: () => {
                this.setState(s => ({...s, previousOffset: 0}));
            }
        });
    }

    isMinimumThumb() {
        return this.props.thumbType === 'min';
    }

    mapValueToDimention(value) {
        return this.props.parentWidth * value / this.props.maxValue;
    }

    mapDimensionToValue(value) {
        return value / this.props.parentWidth * this.props.maxValue;
    }

    clamp(val, [min, max]) {
        return Math.max(min, Math.min(val, max));
    }

    render() {
        let valueLabelDiameter = 35;
        let offset = this.state.offset;
        if(offset === 0 && this.props.thumbType === "max"){
            offset = this.getOffset();
        }
        const innerStyle = StyleSheet.create({
            wrapper: {
                transform: [
                    {translateX: -this.props.diameter / 2},
                    {translateY: -this.props.diameter / 2}
                ],
                position: "relative"
            },
            thumb: {
                transform: [
                    {translateX: offset}
                ],
                display: 'flex',
                justifyContent: 'center',
                alignItems: "center",
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
            },
            valueLabelWrapper: {
                color: this.props.labelTextColor,
                pointerEvents: 'none',
                position: "absolute",
                width: valueLabelDiameter,
                height: valueLabelDiameter,
                backgroundColor: this.props.labelColor,
                textAlign: 'center',
                transformOrigin: 'top left',
                transform: [
                    {translateX: offset + this.props.diameter / 2},
                    {translateY: this.props.diameter * 1.5 + 10},
                    {rotateZ: '45deg'}
                ],
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                overflow: "hidden",
                borderTopLeftRadius: '0',
                borderBottomRightRadius: '50%',
                borderTopRightRadius: '50%',
                borderBottomLeftRadius: '50%'
            },
            valueLabel: {
                fontSize: valueLabelDiameter / 2,
                transform: [
                    {rotateZ: '-45deg'}
                ]
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
                {this.props.showLabel
                    ? <View style={innerStyle.valueLabelWrapper}>
                        <View style={innerStyle.valueLabel}>
                            {Math.round(this.isMinimumThumb() ? this.props.rangeStart : this.props.rangeEnd)}
                        </View>
                    </View>
                    : <></>}
            </View>
        );
    }
}

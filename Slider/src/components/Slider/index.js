import {useState, useEffect} from 'react';
import {log, report} from "../../../../Shared/utils";
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import Slider from '@mui/material/Slider'
import dayjs from 'dayjs'
import {environment, environments} from "../../../../Shared/constants";

const Table = (props) => { 
    const sliderStyle = {
        width: '100%'
    }
    return <Slider sx={sliderStyle}></Slider>
};

export default Table;

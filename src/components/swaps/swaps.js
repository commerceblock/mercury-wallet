import icon1 from "../../images/table-icon.png";
import icon2 from "../../images/table-icon-grey.png";
import medium from "../../images/table-icon-medium.png";
import utx from "../../images/UTX.png";
import time from "../../images/time-grey.png";
import calendar from "../../images/calendar.png";
import privacy from "../../images/privacy.png";
import swapNumber from "../../images/swap-number.png";
import walleticon from "../../images/walletIcon.png";
import close from "../../images/close-grey.png";
import txidIcon from "../../images/txid-icon.png";
import timeIcon from "../../images/time.png";
import check from "../../images/check-grey.png";
import question from "../../images/question-mark.png";
import coin from "../../images/table-icon1.png";
import user from "../../images/table-icon-user.png";

import React, {useState, useEffect} from 'react';
import ProgressBar from 'react-bootstrap/ProgressBar'
import {Button, Modal} from 'react-bootstrap';
import {useSelector, useDispatch} from 'react-redux'

import {fromSatoshi} from '../../wallet/util'

import {callGetOngoingSwaps, callGetSwapGroupInfo, callUpdateSwapGroupInfo} from '../../features/WalletDataSlice'

import './swaps.css';
import '../index.css';
import { SwapGroup } from "../../wallet/types";

const DEFAULT_SWAP_DETAILS = {show: false, swap: {value: 0, participants: 0, capacity: 0, status: "none"}}


const Swaps = (props) => {
    const dispatch = useDispatch();

    const [showSwapDetails, setShowSwapDetails] = useState(DEFAULT_SWAP_DETAILS);  // Display details of swap in Modal
    const handleOpenSwapDetails = (shared_key_id) => {
        let swap = all_swaps_data.find((swap) => {
            return swap.shared_key_id === shared_key_id
        })
        setShowSwapDetails({show: true, swap: swap});
    }
    const handleCloseSwapDetails = () => {
        props.setSelectedSwap(null);
        setShowSwapDetails(DEFAULT_SWAP_DETAILS);
    }

    // Set selected swap
    const selectSwap = (shared_key_id) => {
        shared_key_id === props.selectedSwap ? props.setSelectedSwap(null) : props.setSelectedSwap(shared_key_id);
        if (props.displayDetailsOnClick) {
            handleOpenSwapDetails(shared_key_id)
        }
    }

    // Check if swap is selected. If so return CSS.
    const isSelectedStyle = (shared_key_id) => {
        return props.selectedSwap === shared_key_id ? {backgroundColor: "#e6e6e6"} : {}
    }

    // Convert expiry_data to string displaying months or days left
    const expiry_time_to_string = (expiry_data) => {
        return expiry_data.months > 0 ? expiry_data.months + " months" : expiry_data.days + " days"
    }

    const [swaps_data] = callGetOngoingSwaps(); //TODO
    // Update total_balance in Redux state
    //dispatch(updateBalanceInfo({total_balance: total_balance, num_swaps: swaps_data.length}));

    dispatch(callUpdateSwapGroupInfo());

    const swap_groups  = callGetSwapGroupInfo();

    //let unconfired_swaps_data = callGetUnconfirmedStateSwapsDisplayData();
    let all_swaps_data = swaps_data;//.concat(unconfired_swaps_data)


    let all_swap_groups_data = swap_groups;//.concat(unconfired_swaps_data)
    let all_swap_groups_array = swap_groups ? Array.from(all_swap_groups_data.entries()) :
    new Array();

     // Re-fetch swaps every 10 seconds
    useEffect(() => {
          const interval = setInterval(() => {
            const [swaps_data] = callGetOngoingSwaps();
            all_swaps_data=swaps_data;// check for change in length of unconfirmed coins list and total number
          }, 10000);
          return () => clearInterval(interval);
        }, 
      []);

    // Re-fetch swaps every 10 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            dispatch(callUpdateSwapGroupInfo());    
            const swap_groups = callGetSwapGroupInfo();            
            all_swap_groups_data=swap_groups; // check for change in length of unconfirmed coins list and total number
            all_swap_groups_array = swap_groups ? Array.from(all_swap_groups_data.entries()) :
    new Array();
        }, 5000);
        return () => clearInterval(interval);
      },
      []);
    const swapData = all_swap_groups_array.map(([key,value]) => (
        
        <div key={key} value={value}>
        <div>
        <div className="SwapPanel">
            <div className="SwapAmount-block">
                <img src={coin} alt="coin"/>
                <span className="sub">
                    <b className="SwapAmount">  {key.amount/1e8} BTC</b>
                </span>
            </div>

            <b className="SwapParticipants">
                <img src={user} alt="user"/>
                <span className="sub">
                    <b className="SwapParticipants">  {value}/{key.size} </b>
                </span>
            </b>

            <b className="SwapStatus">
                <span className="sub">
                    {value < key.size && false && 
                        <b className="SwapStatus"> Waiting for participants... </b>
                    }
                    {value >= key.size && false &&
                        <b className="SwapStatus"> Swap in progress... </b>
                    }
                </span>
            </b>
            </div>
        </div>
        </div>
        
    ));

    return (
        <div>
            {swapData}
        </div>
    );
}

export default Swaps;

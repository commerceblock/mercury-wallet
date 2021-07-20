import anon_icon_none from "../../images/table-icon-grey.png";
import anon_icon_low from "../../images/table-icon-medium.png";
import anon_icon_high from "../../images/table-icon.png";
import anon_icon2_none from "../../images/close-grey.png";
import anon_icon2_low from "../../images/question-mark.png";
import anon_icon2_high from "../../images/check-grey.png";
import utx from "../../images/utxo_id.png";
import time from "../../images/time_left.png";
import calendar from "../../images/calendar.png";
import swapNumber from "../../images/swap-number.png";
import walleticon from "../../images/walletIcon.png";
import txidIcon from "../../images/txid-icon.png";
import timeIcon from "../../images/time.png";
import copy_img from "../../images/icon2.png";
import descripIcon from "../../images/description.png"


import React, {useState, useEffect } from 'react';
import ProgressBar from 'react-bootstrap/ProgressBar';
import {Button, Modal} from 'react-bootstrap';
import {useDispatch, useSelector} from 'react-redux';
import Moment from 'react-moment';

import {MINIMUM_DEPOSIT_SATOSHI, fromSatoshi} from '../../wallet/util'
import {callGetUnspentStatecoins, callGetBlockHeight, updateBalanceInfo, callGetUnconfirmedStatecoinsDisplayData,callGetUnconfirmedAndUnmindeCoinsFundingTxData, setError,callAddDescription,callGetStateCoin} from '../../features/WalletDataSlice'
import SortBy from './SortBy/SortBy'
import FilterBy from './FilterBy/FilterBy'
import { STATECOIN_STATUS } from '../../wallet/statecoin'
import { CoinStatus } from '../../components'
import EmptyCoinDisplay from './EmptyCoinDisplay/EmptyCoinDisplay'
import CopiedButton from "../CopiedButton";
import QRCodeGenerator from "../QRCodeGenerator/QRCodeGenerator";
import SwapStatus from "./SwapStatus/SwapStatus";

import './coins.css';
import '../index.css';
import CoinDescription from "../inputs/CoinDescription/CoinDescription";

const TESTING_MODE = require("../../settings.json").testing_mode;

const DEFAULT_STATE_COIN_DETAILS = {show: false, coin: {value: 0, expiry_data: {blocks: "", months: "", days: ""}, privacy_data: {score_desc: ""}}}
// privacy score considered "low"
const LOW_PRIVACY = 3
// style time left timer as red after this many days
const DAYS_WARNING = 5

const INITIAL_COINS = {
    unspentCoins: [],
    unConfirmedCoins: []
}

const INITIAL_SORT_BY = {
	direction: 0,
	by: 'value'
};

const SWAP_STATUS_INFO = {
  Phase0: "Phase 0: registration",
  Phase1: "Phase 1: awaiting swap commitments",
  Phase2: "Phase 2: awaiting blind token",
  Phase3: "Phase 3: awaiting transfers",
  Phase4: "Phase 4: completing swap",
}

const Coins = (props) => {
    const {selectedCoins} = props;
    const dispatch = useDispatch();
    const { filterBy } = useSelector(state => state.walletData);
  	const [sortCoin, setSortCoin] = useState(INITIAL_SORT_BY);
    const [coins, setCoins] = useState(INITIAL_COINS);
    const [initCoins, setInitCoins] = useState({})
    const [showCoinDetails, setShowCoinDetails] = useState(DEFAULT_STATE_COIN_DETAILS);  // Display details of Coin in Modal
    const [refreshCoins, setRefreshCoins] = useState(false);
    
    const [description,setDescription] = useState("")
    const [dscpnConfirm,setDscrpnConfirm] = useState(false)

    const [swapStatus,setSwapStatus] = useState("")

    let all_coins_data = [...coins.unspentCoins, ...coins.unConfirmedCoins];


    const handleOpenCoinDetails = (shared_key_id) => {
        let coin = all_coins_data.find((coin) => {
            return coin.shared_key_id === shared_key_id
        })
        coin.privacy_data = getPrivacyScoreDesc(coin.swap_rounds);
        setShowCoinDetails({show: true, coin: coin});
    }

    const handleSetCoinDetails = (shared_key_id) => {
        let coin = all_coins_data.find((coin) => {
            return coin.shared_key_id === shared_key_id
        })
        coin.privacy_data = getPrivacyScoreDesc(coin.swap_rounds);
        props.setCoinDetails(coin)
    }

    const handleCloseCoinDetails = () => {
      if(!(selectedCoins.length > 0)){
        // do not reset the selected coins if we already have selected coins
        props.setSelectedCoins([]);
      }
      setShowCoinDetails(DEFAULT_STATE_COIN_DETAILS);
    }

    const filterCoinsByStatus = (coins = [], status) => {
      return coins.filter(coin => coin.status === status);
    }

    // Set selected coin
    const selectCoin = (shared_key_id) => {
      props.setSelectedCoin(shared_key_id);  
      setRefreshCoins((prevState) => !prevState);
      if (props.displayDetailsOnClick) {
          handleOpenCoinDetails(shared_key_id)
      }
      if (props.setCoinDetails) {
          handleSetCoinDetails(shared_key_id)
      }
    }

    const isSelected = (shared_key_id) => {
        let selected = false;
        if(props.selectedCoins == undefined) {
          selected = (props.selectedCoin == shared_key_id)
        } else {
            props.selectedCoins.forEach(
              (selectedCoin) =>  {
                if (selectedCoin === shared_key_id) {
                  selected = true;
                } 
              }
            );
        }
        return selected;
    }

    const displayExpiryTime = (expiry_data, show_days=false) => {
      if(validExpiryTime(expiry_data)){
        if(show_days && (expiry_data.days % 30) > 0){
          return expiry_time_to_string(expiry_data) + " and " + getRemainingDays(expiry_data.days);
        }else{
          return expiry_time_to_string(expiry_data);
        }
      }
      return  '--';
    }

    const getRemainingDays = (numberOfDays) => {
      let days = Math.floor(numberOfDays % 365 % 30);
      let daysDisplay = days > 0 ? days + (days == 1 ? " day" : " days") : "";
      return daysDisplay; 
    }

    //Button to handle copying p address to keyboard
    const copyAddressToClipboard = (event,address) => {
      event.stopPropagation()
      navigator.clipboard.writeText(address);
    }

    const getAddress = (shared_key_id) => {
      return initCoins.filter(coin => coin.shared_key_id === shared_key_id)[0].p_addr
    } 

    const validExpiryTime = (expiry_data) => {
      if(callGetBlockHeight() === 0){
        // set its actual block to 0 so next time we can return  '--' until an actual block is received
        expiry_data.blocks = 0;
        return false;
      }

      if(expiry_data === undefined){
        return false;
      }

      if(expiry_data.blocks == 0){
        return false;
      }
      
      return true;
    }

    // Convert expiry_data to string displaying months or days left
    const expiry_time_to_string = (expiry_data) => {  
      return expiry_data.months > 1 ? expiry_data.months + " months" : expiry_data.days + " days";
    }

    const validCoinData = (coins_data) => {
      // do not delete coins
      if(coins_data === undefined || coins_data === null || coins_data.length === 0){
        return false;
      }
      return true;
    }

    //Load coins once component done render
    useEffect(() => {
      const [coins_data, total_balance] = callGetUnspentStatecoins();
      //Load all coins that aren't unconfirmed

      let unconfirmed_coins_data = callGetUnconfirmedStatecoinsDisplayData();
      //Load unconfirmed coins

      let undeposited_coins_data = dispatch(callGetUnconfirmedAndUnmindeCoinsFundingTxData)
      //Load coins that haven't yet been sent BTC


      if(validCoinData(coins_data)){
        setCoins({
          unspentCoins: coins_data,
          unConfirmedCoins: unconfirmed_coins_data
        })
      }

      setInitCoins(undeposited_coins_data)

      // Update total_balance in Redux state
      if(filterBy !== 'default') {
        const coinsByStatus = filterCoinsByStatus([...coins_data, ...unconfirmed_coins_data], filterBy);
        const total = coinsByStatus.reduce((sum, currentItem) => sum + currentItem.value , 0);
        dispatch(updateBalanceInfo({total_balance: total, num_coins: coinsByStatus.length}));
      } else {
        const coinsNotWithdraw = coins_data.filter(coin => (coin.status !== STATECOIN_STATUS.WITHDRAWN && coin.status !== STATECOIN_STATUS.IN_TRANSFER));
        const total = coinsNotWithdraw.reduce((sum, currentItem) => sum + currentItem.value , 0);
        dispatch(updateBalanceInfo({total_balance: total, num_coins: coinsNotWithdraw.length}));
      }
    }, [props.refresh, filterBy, showCoinDetails]);

    // Re-fetch every 10 seconds and update state to refresh render
    // IF any coins are marked UNCONFIRMED
    useEffect(() => {

      if (coins.unConfirmedCoins.length) {
        const interval = setInterval(() => {
          let new_unconfirmed_coins_data = callGetUnconfirmedStatecoinsDisplayData();
          // check for change in length of unconfirmed coins list and total number
          // of confirmations in unconfirmed coins list
          // check for change in the amount of blocks per item (where the main expiry date is set

          let [new_confirmed_coins_data,total] = callGetUnspentStatecoins();
          //Get all updated confirmed coins & coin statuses
          
          if (
            coins.unConfirmedCoins.length !== new_unconfirmed_coins_data.length
              ||
            coins.unConfirmedCoins.reduce((acc, item) => acc+item.expiry_data.confirmations,0)
              !==
            new_unconfirmed_coins_data.reduce((acc, item) => acc+item.expiry_data.confirmations,0)
              ||
            coins.unConfirmedCoins.reduce((acc, item) => acc+item.expiry_data.blocks,0)
              !==
            new_unconfirmed_coins_data.reduce((acc, item) => acc+item.expiry_data.blocks,0)
          ) {
            if(validCoinData(new_confirmed_coins_data)){
              setCoins({
                unspentCoins: new_confirmed_coins_data,
                unConfirmedCoins: new_unconfirmed_coins_data
              })
            }
          }
        }, 10000);
        return () => clearInterval(interval);
      }
    }, [coins.unConfirmedCoins]);

    //Initialised Coin description for coin modal
    useEffect(() => {
      //Get Statecoin to check for description
      let statecoin = callGetStateCoin(showCoinDetails.coin.shared_key_id)
      if(statecoin && statecoin.description !== ""){
        //If there is a description setState
        setDscrpnConfirm(true)
        setDescription(statecoin.description)
      }
      else{
        //If no description initialise setState
        setDescription("")
        setDscrpnConfirm(false)
      }
    //function called every time coin info modal shows up
    },[showCoinDetails.coin])

    // data to display in privacy related sections
    const getPrivacyScoreDesc = (swap_rounds) => {
      if (!swap_rounds) {
        return {
          icon1: anon_icon_none,
          icon2: anon_icon2_none,
          score_desc: "No Privacy Score",
          msg: "Withdrawn BTC will have no privacy"
        }
      }
      if (swap_rounds < LOW_PRIVACY) {
        return {
          icon1: anon_icon_low,
          icon2: anon_icon2_low,
          score_desc: "Low Privacy Score",
          msg: "Withdrawn BTC will have low privacy"
        }
      }
      return {
        icon1: anon_icon_high,
        icon2: anon_icon2_high,
        score_desc: "High Privacy Score",
        msg: "Withdrawn BTC will be private"
      }
    }

    // Filter coins by status
    if(filterBy === 'default') {
      all_coins_data = all_coins_data.filter(coin => (coin.status !== STATECOIN_STATUS.WITHDRAWN && coin.status !== STATECOIN_STATUS.IN_TRANSFER))
    } else {
      if(filterBy === STATECOIN_STATUS.WITHDRAWN) {
        all_coins_data = filterCoinsByStatus(all_coins_data, STATECOIN_STATUS.WITHDRAWN);
      }
      if(filterBy === STATECOIN_STATUS.IN_TRANSFER) {
        all_coins_data = filterCoinsByStatus(all_coins_data, STATECOIN_STATUS.IN_TRANSFER);
      }
    }

  	all_coins_data.sort((a, b) => {
  		let compareProp = sortCoin.by;
  		if(compareProp === 'expiry_data') {
  			a = (parseInt(a[compareProp]['months']) * 30) + parseInt(a[compareProp]['days']);
  			b = (parseInt(b[compareProp]['months']) * 30) + parseInt(b[compareProp]['days']);
  		} else {
  			a = a[compareProp];
  			b = b[compareProp];
  		}
  		if(a > b) {
  			return sortCoin.direction ? 1 : -1;
  		} else if (a < b) {
  			return sortCoin.direction ? -1 : 1;
  		}
  		return 0;
  	});


    const statecoinData = all_coins_data.map(item => {
      item.privacy_data = getPrivacyScoreDesc(item.swap_rounds);
      return (
          <div key={item.shared_key_id}>
            <div
              className={`coin-item ${(props.swap||props.send||props.withdraw) ? item.status : ''} ${isSelected(item.shared_key_id) ? 'selected' : ''}`}
              onClick={() => {
                if((item.status === STATECOIN_STATUS.SWAPLIMIT) && (props.swap||props.send)) {
                  dispatch(setError({ msg: 'Locktime below limit for swap participation'}))
                  return false;
                }
                if((item.status === STATECOIN_STATUS.SWAPLIMIT || item.status === STATECOIN_STATUS.EXPIRED) && (props.swap||props.send||props.withdraw)) {
                  dispatch(setError({ msg: 'Expired coins are unavailable for transfer, swap and withdrawal'}))
                  return false;
                }
                
                if((item.status === STATECOIN_STATUS.IN_MEMPOOL || item.status === STATECOIN_STATUS.UNCONFIRMED ) && (props.swap||props.send || props.withdraw) && !TESTING_MODE){
                  dispatch(setError({ msg: 'Coin unavailable for swap - awaiting confirmations' }))
                }
                if(item.status === STATECOIN_STATUS.INITIALISED && (props.swap || props.send|| props.withdraw)){
                  dispatch(setError({msg: `Coin uninitialised: send BTC to address displayed`}))
                }
                if(item.status === (STATECOIN_STATUS.IN_SWAP || STATECOIN_STATUS.AWAITING_SWAP) && (props.send || props.withdraw)){
                  dispatch(setError({msg: `Unavailable while coin in swap group`}))
                }
                else{
                selectCoin(item.shared_key_id)
                }
              }}
            >
                <div className="CoinPanel">
                  <div className="CoinAmount-block">
                      <img src={item.privacy_data.icon1} alt="icon"/>
                      <span className="sub">
                          <b className={item.value < MINIMUM_DEPOSIT_SATOSHI ?  "CoinAmountError" :  "CoinAmount"}>  {fromSatoshi(item.value)} BTC</b>
                          <div className="scoreAmount">
                              <img src={item.privacy_data.icon2} alt="icon"/>
                              {item.privacy_data.score_desc}
                              <span className="tooltip">
                                  <b>{item.privacy_data.score_desc}:</b>
                                    {item.privacy_data.msg}
                              </span>
                          </div>
                      </span>
                  </div>
                  {filterBy !== STATECOIN_STATUS.WITHDRAWN ? (
                    item.status === STATECOIN_STATUS.INITIALISED ?
                    <div>                 
                      <div className ="deposit-scan-main-item">
                        <CopiedButton handleCopy={(event) => copyAddressToClipboard(event,getAddress(item.shared_key_id))}>
                          <img type="button" src={copy_img} alt="icon" />
                        </CopiedButton>
                        <span className="long"><b>{getAddress(item.shared_key_id)}</b></span>
                      </div>
                    </div>
                    :(
                    <div className="progress_bar" id={item.expiry_data.days < DAYS_WARNING ? 'danger' : 'success'}>
                        <div className ="coin-description">
                          <p>{item.description}</p>
                        </div>
                        {item.value < MINIMUM_DEPOSIT_SATOSHI && <div class='CoinAmountError'>Coin in error state: below minimum deposit value</div>} 
                        <div className="sub">
                            <ProgressBar>
                                <ProgressBar striped variant={item.expiry_data.days < DAYS_WARNING ? 'danger' : 'success'}
                                  now={item.expiry_data.days * 100 / 90}
                                  key={1}/>
                            </ProgressBar>
                        </div>
                        <div className="CoinTimeLeft">
                            <img src={timeIcon} alt="icon" />
                            <span>
                                Time Until Expiry: <span className='expiry-time-left'>{displayExpiryTime(item.expiry_data)}</span>
                            </span>
                        </div>
                    </div>
                  )) : (
                    <div className="widthdrawn-status">
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M8 0.5C3.875 0.5 0.5 3.875 0.5 8C0.5 12.125 3.875 15.5 8 15.5C12.125 15.5 15.5 12.125 15.5 8C15.5 3.875 12.125 0.5 8 0.5ZM12.875 9.125H3.125V6.875H12.875V9.125Z" fill="#BDBDBD"/>
                      </svg>
                      <span>
                        Withdrawn <span className="widthdrawn-status-time">| {<Moment format="MM.DD.YYYY HH:mm">{item.timestamp}</Moment>}</span>
                      </span>
                    </div>
                  )}

                  {props.showCoinStatus ? (
                    <div className="coin-status-or-txid">
                      {(item.status === STATECOIN_STATUS.AVAILABLE || item.status === STATECOIN_STATUS.WITHDRAWN) ?
                      (
                        <b className="CoinFundingTxid">
                            <img src={txidIcon} alt="icon"/>
                            {item.funding_txid}
                        </b>
                      )
                      : (
                      <div>
                        <CoinStatus data={item}/>
                        {item.swap_status !== null ? (<SwapStatus swapStatus={SWAP_STATUS_INFO[item.swap_status]} />):(null)}
                      </div>)}
                    </div>
                  ) : (
                    <div className="coin-status-or-txid">
                      <b className="CoinFundingTxid">
                        <img src={txidIcon} alt="icon"/>
                        {item.funding_txid}
                      </b>
                    </div>
                  )}
                </div>
            </div>
          </div>
      )})

    if(!all_coins_data.length ) {//&& filterBy !== STATECOIN_STATUS.WITHDRAWN && filterBy !== STATECOIN_STATUS.IN_TRANSFER

      let displayMessage = "Your wallet is empty";

      if(filterBy === STATECOIN_STATUS.WITHDRAWN){
        displayMessage = "No coins withdrawn."
      }

      if(filterBy === STATECOIN_STATUS.IN_TRANSFER){
        displayMessage = "No coins transferred."
      }

      // filterBy === STATECOIN_STATUS.WITHDRAWN ? (displayMessage = "No coins withdrawn.") : ('')
      // filterBy === STATECOIN_STATUS.IN_TRANSFER ? (displayMessage = "No coins transferred.") : ('')

      return (
        <EmptyCoinDisplay message={displayMessage}/>
      );
    }


    //Track change to description
    const handleChange = e => {
      e.preventDefault()
      if(e.target.value.length < 20){
        setDescription(e.target.value)
      }
    }
  
    //Confirm description, submit redux state to change Statecoin
    function confirmDescription() {
      if(dscpnConfirm === false) {
        callAddDescription(showCoinDetails.coin.shared_key_id,description)

      }
      setDscrpnConfirm(!dscpnConfirm)
    }

    // called when clicking on TXid link in modal window
    const onClickTXID = txId => {
      const NETWORK = require("../../settings.json").network;
      let finalUrl = '';
      switch(NETWORK){
        case 'mainnet':
          finalUrl = 'https://blockstream.info/tx/'  + txId;
          break;
        case 'testnet':
          finalUrl = 'https://blockstream.info/testnet/tx/'  + txId;
          break;
        // do nothing for regtest and anything else then exit method
        case 'regtest':
        default:
          return null;
      }
      // open the browser for both mainnet and testnet
      window.require("electron").shell.openExternal(finalUrl);
    }

    return (
        <div 
          className={`main-coin-wrap ${!all_coins_data.length ? 'no-coin': ''} ${filterBy} ${!props.largeScreen ? 'small-screen': ''}`}>
          <div className="sort-filter">
            <FilterBy />
            {(all_coins_data.length && filterBy !== STATECOIN_STATUS.WITHDRAWN) ? <SortBy sortCoin={sortCoin} setSortCoin={setSortCoin} /> : null }
          </div>
        {statecoinData}

        <Modal
          show={showCoinDetails.show}
          onHide={handleCloseCoinDetails}
          className="modal coin-details-modal"
        >
          <Modal.Body>
            <div>
              <div className="item">
                <img src={walleticon} alt="icon" />
                <div className="block">
                  <span>Statecoin Value</span>
                  <span>
                    <b>{fromSatoshi(showCoinDetails.coin.value)} BTC</b>
                  </span>
                </div>
              </div>
            
              {showCoinDetails?.coin?.status &&
                showCoinDetails.coin.status !== STATECOIN_STATUS.AVAILABLE && (
                  <div className="item swap-status-container">
                    <CoinStatus data={showCoinDetails.coin} isDetails={true} />
                    {showCoinDetails.coin.swap_status !== null ? (<SwapStatus swapStatus={SWAP_STATUS_INFO[showCoinDetails.coin.swap_status]} />):(null)}
                  </div>
                )}

              {showCoinDetails.coin.status === STATECOIN_STATUS.INITIALISED ? (
                <div className="item qr-container">
                  <div className="block qrcode">
                      <QRCodeGenerator address = {getAddress(showCoinDetails.coin.shared_key_id)} amount={fromSatoshi(showCoinDetails.coin.amount)}/>
                  </div>
                </div>
              )
              :
              (
                <div>
                  <div className="item">
                    <img src={utx} alt="icon" />
                    <div className="block">
                      <span>UTXO ID:</span>
                      <span><a href={'javascript:;'} onClick={() => onClickTXID(showCoinDetails.coin.funding_txid)}>{showCoinDetails.coin.funding_txid}</a>:{showCoinDetails.coin.funding_vout}</span>
                    </div>
                  </div>

                  <div className="item expiry-time">
                    <div className="expiry-time-wrap">
                      <img src={time} alt="icon" />
                      <div className="block">
                        <span>
                          Time Left Until Expiry
                        </span>
                        <span className="expiry-time-left">
                          {displayExpiryTime(
                            showCoinDetails.coin.expiry_data, true
                          )}
                        </span>
                      </div>
                    </div>
                    <div
                      className="progress_bar"
                      id={
                        showCoinDetails.coin.expiry_data.days < DAYS_WARNING
                          ? "danger"
                          : "success"
                      }
                    >

                      <div className="sub">
                        <ProgressBar>
                          <ProgressBar
                            striped
                            variant={
                              showCoinDetails.coin.expiry_data.days <
                              DAYS_WARNING
                                ? "danger"
                                : "success"
                            }
                            now={
                              (showCoinDetails.coin.expiry_data.days * 100) / 90
                            }
                            key={1}
                          />
                        </ProgressBar>
                      </div>
                    </div>
                  </div>

                  <div className="item">
                    <img src={calendar} alt="icon" />
                    <div className="block">
                      <span>Date Created</span>
                      <Moment format="MM.DD.YYYY">
                        {showCoinDetails.coin.timestamp}
                      </Moment>
                      <Moment format="h:mm a">
                        {showCoinDetails.coin.timestamp}
                      </Moment>
                    </div>
                  </div>

                  <div className="item">
                    <img src={showCoinDetails.coin.privacy_data.icon1} alt="icon" />

                    <div className="block">
                      <span>Privacy Score</span>
                      <span>{showCoinDetails.coin.privacy_data.score_desc}</span>
                      <span className="privacy-score-help">
                        <svg
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M18.9996 3H4.99963C3.89978 3 2.99963 3.90002 2.99963 5V19C2.99963 20.1 3.89978 21 4.99963 21H18.9996C20.0997 21 20.9996 20.1 20.9996 19V5C20.9996 3.90002 20.0997 3 18.9996 3ZM12.0096 18C11.3097 18 10.7496 17.44 10.7496 16.74C10.7496 16.03 11.3097 15.49 12.0096 15.49C12.7199 15.49 13.2596 16.03 13.2596 16.74C13.2496 17.43 12.7199 18 12.0096 18ZM15.0197 10.6C14.2596 11.71 13.5397 12.06 13.1498 12.77C12.9896 13.06 12.9298 13.25 12.9298 14.18H11.1097C11.1097 13.69 11.0297 12.89 11.4198 12.2C11.9098 11.33 12.8397 10.81 13.3798 10.04C13.9498 9.22997 13.6298 7.71001 12.0096 7.71001C10.9498 7.71001 10.4298 8.51 10.2098 9.18999L8.55969 8.48998C9.00964 7.15001 10.2199 5.99999 11.9896 5.99999C13.4698 5.99999 14.4796 6.66997 14.9996 7.52001C15.4398 8.23998 15.6998 9.59002 15.0197 10.6Z"
                            fill="#666666"
                          />
                        </svg>
                      </span>
                    </div>
                  </div>
                  <div className="item">
                    <img src={swapNumber} alt="icon" />
                    <div className="block">
                      <span>Number of Swaps Rounds</span>
                      <span>
                        Swaps: {showCoinDetails.coin.swap_rounds}
                        {/*
                                        <br/>
                                        Number of Participants: 0
                                      */}
                      </span>
                    </div>
                  </div>
                </div>)}
              <div className="item">
                <img src={descripIcon} alt="description-icon"/>
                <div className="block">
                  <span>Description</span>
                  <CoinDescription
                    dscrpnConfirm = {dscpnConfirm}
                    description = {description}
                    setDscrpnConfirm = {confirmDescription}
                    handleChange={handleChange}
                    />
                </div>
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button
              className="primary-btn ghost"
              onClick={handleCloseCoinDetails}
            >
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
}

export default Coins;

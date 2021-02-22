import React from 'react';
import { withRouter } from "react-router-dom";
import {useSelector, useDispatch} from 'react-redux'

import { walletLoad, callGetUnspentStatecoins, updateBalanceInfo, updateFeeInfo, callGetFeeInfo, callGenSeAddr } from '../../features/WalletDataSlice'
import { PanelControl, PanelConnectivity, PanelCoinsActivity } from '../../components'

// Home page is the main page from which a user can view and use their Wallet.
// Provided with props Home is used to initiliase a Wallet into the Redux state.
const HomePage = (props) => {
  const dispatch = useDispatch();

  // Initiliase wallet data in Redux state
  const initWalletInRedux = () => {
    // Get coins info
    const [coins_data, total_balance] = callGetUnspentStatecoins();
    dispatch(updateBalanceInfo({total_balance: total_balance, num_coins: coins_data.length}));
    // Get fee info
    const fee_info = callGetFeeInfo().then((fee_info) => {
      dispatch(updateFeeInfo(fee_info));
    })
    // Gen se address
    dispatch(callGenSeAddr());
  }

  if (props.load) {
    console.log("load == true")
    // load wallet into Redux
    walletLoad();
    initWalletInRedux()
  }


  return (
    <div className="container home-page">
      <PanelControl />
      <PanelConnectivity />
      <PanelCoinsActivity />
    </div>
  )
}

export default withRouter(HomePage);

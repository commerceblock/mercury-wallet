import React from 'react';
import { withRouter, useParams } from "react-router-dom";
import {useSelector, useDispatch} from 'react-redux'

import { walletLoad, walletFromMnemonic, callGetUnspentStatecoins, updateBalanceInfo, updateFeeInfo, callGetFeeInfo, callGenSeAddr } from '../../features/WalletDataSlice'
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

  const { mnemonic } = useParams(); // get mnemonic from url
  if (props.loadWallet && !props.walletLoaded) {
    // load wallet into Redux
    walletLoad();
    props.setWalletLoaded(true);
  } else if (props.createWallet && !props.walletLoaded){
    // Create new wallet form mnemonic
    walletFromMnemonic("name", mnemonic);
    props.setWalletLoaded(true);
  }
  initWalletInRedux()

  return (
    <div className="container home-page">
      <PanelControl />
      <PanelConnectivity />
      <PanelCoinsActivity />
    </div>
  )
}

export default withRouter(HomePage);

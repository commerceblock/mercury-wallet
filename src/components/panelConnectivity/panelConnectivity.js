import React, {useState} from "react";
import {useSelector} from 'react-redux'

import { callGetBlockHeight, callGetConfig } from '../../features/WalletDataSlice'
import { defaultWalletConfig } from '../../containers/Settings/Settings'

import arrow from '../../images/arrow-accordion.png';
import './panelConnectivity.css';
import '../index.css';


const PanelConnectivity = (props) => {
  // Arrow down state
  const [state, setState] = useState({isToggleOn: false});
  const toggleContent = (event) => {
      setState({isToggleOn: !state.isToggleOn})
  }

  let current_config;
  try {
    current_config = callGetConfig();
  } catch {
    current_config = defaultWalletConfig()
  }

  const fee_info = useSelector(state => state.walletData).fee_info;
  const swap_info = useSelector(state => state.walletData).swap_info;
  const block_height = callGetBlockHeight();

  return (
      <div className="Body small accordion connection-wrap">
          <div className="Collapse">
              <div className="connection-title ConnectionStateChain">
                  <label>
                      <input
                          readOnly
                          type="radio"
                          value="StateChain"
                          checked={fee_info.deposit !== "NA"}
                      />
                      Connected to Server
                      <span className="checkmark"></span>
                  </label>
              </div>
              <div className="connection-title ConnectionSwaps">
                  <label>
                      <input
                        readOnly
                        type="radio"
                        value="Swaps"
                        checked={false}
                      />
                      Connected to Swaps
                      <span className="checkmark"></span>
                  </label>
              </div>
              <div className="connection-title ConnectionElectrum">
                  <label>
                      <input
                          readOnly
                          type="radio"
                          value="Swaps"
                          checked={swap_info !== null}
                      />
                      Connected to Electrum
                      <span className="checkmark"></span>
                  </label>
              </div>
              <div onClick={toggleContent} className={state.isToggleOn ? "image rotate" : ' image '}>
                  <img src={arrow} alt="arrowIcon"/>
              </div>
          </div>

        <div className={state.isToggleOn ? "show" : ' hide'}>
            <div className="collapse-content">
                <div className="collapse-content-item">
                    <span className="host">Host: {current_config.electrum_config.host}</span>
                    <span>Deposit Fee: <b>{fee_info.deposit /10000}%</b></span>
                    <span>Withdraw Fee: <b>{fee_info.withdraw/10000}%</b></span>
                    <span>{fee_info.endpoint}</span>
                </div>
                <div className="collapse-content-item">
                    <span className="host">Host: xxx.xxx.x.xx</span>
                    <span>Pending Swaps: <b>NA</b></span>
                    <span>Participants: <b>NA</b></span>
                    <span>Total pooled BTC: <b>NA</b></span>
                </div>
                <div className="collapse-content-item">
                    <span>Block height: {block_height}</span>
                    <span className="host">Host: {current_config.electrum_config.host}</span>
                    <span>Port: {current_config.electrum_config.port}</span>
                    <span>Protocol: {current_config.electrum_config.protocol}</span>
                </div>
              </div>
          </div>
      </div>
  );
}

export default PanelConnectivity;

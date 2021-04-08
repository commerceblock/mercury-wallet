import {Link, withRouter, Redirect} from "react-router-dom";
import React, {useState} from 'react';
import {useDispatch} from 'react-redux'

import {isWalletLoaded, setError, callGetCoinBackupTxData, callCreateBackupTxCPFP} from '../../features/WalletDataSlice'
import {Coins, StdButton, AddressInput, CopiedButton} from "../../components";

import settings from "../../images/settings.png";
import icon2 from "../../images/icon2.png";
import './BackupTx.css';

const DEFAULT_TX_DATA = {tx_backup_hex:"",priv_key_hex:"",key_wif:"",expiry_data:{blocks:"",days:"",months:""}};

const BackupTxPage = () => {
  const dispatch = useDispatch();

  const [selectedCoin, setSelectedCoin] = useState(null); // store selected coins shared_key_id
  const [selectedCoinTxData, setSelectedCoinTxData] = useState(DEFAULT_TX_DATA); // store selected coins shared_key_id
  const [cpfpAddr, setInputAddr] = useState("");
  const [txFee, setTxFee] = useState("");

  // Check if wallet is loaded. Avoids crash when Electrorn real-time updates
  // in developer mode.
  if (!isWalletLoaded()) {
    dispatch(setError({msg: "No Wallet loaded."}))
    return <Redirect to="/" />;
  }

  const setSelectedCoinWrapper = (id) => {
    setSelectedCoin(id);
    if (id==null) {
      setSelectedCoinTxData(DEFAULT_TX_DATA)
    } else {
      try {
        const txData = callGetCoinBackupTxData(id);
        setSelectedCoinTxData(txData)
      } catch(error) {
        console.warn('Something wrong with get coin backup tx data', error);
      }
    }
  }

  const onAddrChange = (event) => {
    setInputAddr(event.target.value);
  };

  const onFeeChange = (event) => {
    setTxFee(event.target.value);
  };

  const copyBackupTxHexToClipboard = () => {
    navigator.clipboard.writeText(selectedCoinTxData.tx_backup_hex);
  }
  const copyPrivKeyToClipboard = () => {
    navigator.clipboard.writeText(selectedCoinTxData.priv_key_hex);
  }
  const copyKeyWIFToClipboard = () => {
    navigator.clipboard.writeText(selectedCoinTxData.key_wif);
  }

  const addCPFP = () => {
    // check statechain is chosen
    if (!selectedCoin) {
      dispatch(setError({msg: "Please choose a StateCoin."}))
      return
    }
    if (!cpfpAddr) {
      dispatch(setError({msg: "Please enter a pay to address."}))
      return
    }
    if (!txFee) {
      dispatch(setError({msg: "Please enter a fee rate."}))
      return
    }    

    let sucess = callCreateBackupTxCPFP({selected_coin: selectedCoin, cpfp_addr: cpfpAddr, fee_rate: txFee});

    if (!sucess) {
      dispatch(setError({msg: "CPFP build error: please check address is correct"}))
      return      
    }

   }

  return (
    <div className="container ">
        <div className="Body backupTx">
            <div className="swap-header">
                <h2 className="WalletAmount">
                    <img src={settings} alt="question"/>
                    Backup Transactions
                </h2>
                <div>
                    <Link className="nav-link" to="/settings">
                        <StdButton
                            label="Back"
                            className="Body-button transparent"/>
                    </Link>
                </div>
            </div>
            <h3 className="subtitle">Select StateCoin to view its backup transaction and associated private key</h3>
        </div>

        <div className="backupTx content">
            <div className="Body left ">
                <div>
                    <span className="sub">Click to select UTXO’s below</span>
                    <Coins
                      displayDetailsOnClick={false}
                      selectedCoin={selectedCoin}
                      setSelectedCoin={setSelectedCoinWrapper}/>
                </div>

            </div>
            <div className="Body right">
                <div className="header">
                    <span className="sub">Backup Transactions Details</span>
                </div>

                <div className="item">
                  <span className="sub">Blocks left:</span>
                    <div className="">
                        <span>
                          {selectedCoinTxData.expiry_data.blocks}
                        </span>
                    </div>
                </div>

                <div className="item">
                    <span className="sub">Days left:</span>
                    <div className="">
                        <span>
                          {selectedCoinTxData.expiry_data.days}
                        </span>
                    </div>
                </div>

                <div className="item">
                    <span className="sub">Months left:</span>
                    <div className="">
                        <span>
                          {selectedCoinTxData.expiry_data.months}
                        </span>
                    </div>
                </div>

                <div className="item">
                    <span className="sub">Hex:</span>
                    <div className="">
                        {selectedCoinTxData.tx_backup_hex.length > 0 ?
                          <CopiedButton handleCopy={copyBackupTxHexToClipboard}>
                            <img type="button" src={icon2} alt="icon"/>
                          </CopiedButton>
                          : null
                        }
                        <span>
                          {selectedCoinTxData.tx_backup_hex}
                        </span>
                    </div>
                </div>

                <div className="item">
                    <span className="sub">Private key hex:</span>
                    <div className="">
                        {selectedCoinTxData.priv_key_hex.length > 0 ?
                          <CopiedButton handleCopy={copyPrivKeyToClipboard}>
                            <img type="button" src={icon2} alt="icon"/>
                          </CopiedButton>
                          : null
                        }
                        <span>
                          {selectedCoinTxData.priv_key_hex}
                        </span>
                    </div>
                </div>

                <div className="item">
                    <span className="sub">Private Key WIF:</span>
                    <div className="">
                      {selectedCoinTxData.key_wif.length > 0 ?
                        <CopiedButton handleCopy={copyKeyWIFToClipboard}>
                          <img type="button" src={icon2} alt="icon" />
                        </CopiedButton>
                        : null
                      }
                        <span>
                          {selectedCoinTxData.key_wif}
                        </span>
                    </div>
                </div>

                <div className="item">
                    <span className="sub">Status:</span>
                    <div className="">
                        <span>
                          {selectedCoinTxData.backup_status}
                        </span>
                    </div>
                </div>

                <div className="item">
                    <span className="sub">CPFP:</span>
                    <div className="">
                        <span>
                          {selectedCoinTxData.cpfp_status}
                        </span>
                    </div>
                </div>

                <div className="item">                
                    <span className="sub">Pay to:</span>
                    <div className="inputs-item">
                     <AddressInput
                       inputAddr={cpfpAddr}
                       onChange={onAddrChange}
                       placeholder='Send to destination address'
                       smallTxtMsg='Bitcoin Address'/>
                     </div>      
                </div>

                <div className="item">                
                    <span className="sub">Fee (sat/b):</span>
                    <div className="inputs-item">
                     <AddressInput
                       inputAddr={txFee}
                       onChange={onFeeChange}
                       placeholder='Fee rate'
                       smallTxtMsg='CPFP Tx Fee'/>
                    </div>       
                </div> 

                <div className="item">
                    <button type="button" className="std-button" onClick={addCPFP}>
                        Create CPFP
                    </button>
                </div>

            </div>
        </div>
    </div>
  )
}


export default withRouter(BackupTxPage);

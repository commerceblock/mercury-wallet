import React, {useState} from 'react';
import './Swap.css';

import {Link, withRouter} from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux'
import swapIcon from '../../images/swap_icon-blue.png';

import { Coins, Swaps, StdButton} from "../../components";
import {callDoSwap, setError, callGetOngoingSwaps} from '../../features/WalletDataSlice'


const SwapPage = () => {

  let disabled = false;

  const [selectedCoin, setSelectedCoin] = useState(null); // store selected coins shared_key_id
  const [selectedSwap, setSelectedSwap] = useState(null); // store selected swap_id
  const [inputAddr, setInputAddr] = useState("");

  const dispatch = useDispatch();
  const swapButtonAction = async () => {
    // check statechain is chosen
    if (!selectedCoin) {
      dispatch(setError({msg: "Please choose a StateCoin to swap."}))
      return
    }

 
      dispatch(callDoSwap({"shared_key_id": selectedCoin}))
      .then(res => {
        if (res.error===undefined) {
        }
      })
    }
 



  return (
      <div className="container ">
      {disabled===true ?
          <p> Swapping is currenlty not available. </p>
          :

          <div className="Body swap">
              <div className="swap-header">
                  <h2 className="WalletAmount">
                      <img src={swapIcon} alt="swapIcon"/>
                      Swap Statecoins
                  </h2>
                  <div>
                      <Link className="nav-link" to="/home">
                          <StdButton
                              label="Back"
                              className="Body-button transparent"/>
                      </Link>
                  </div>
              </div>
        
          <div className="swap content">
              <div className="Body left ">
                  <div>
                      <h3 className="subtitle">Swap Statecoins to increase their Privacy Score</h3>
                      <span className="sub">Click to select UTXO’s below</span>
                      <Coins
                        displayDetailsOnClick={false}
                        selectedCoin={selectedCoin}
                        setSelectedCoin={setSelectedCoin}/>
                  </div>

              </div>
              <div className="Body right">
                  <div>
                      <Swaps
                      displayDetailsOnClick={false}
                      selectedSwap={selectedSwap}
                      setSelectedSwap={setSelectedSwap}
                      />
                  </div>
                  <button type="button" className="btn" onClick={swapButtonAction}>
                          SWAP STATECOIN UTXO
                  </button>
              </div>
          </div>
        </div>
      }
      </div>
  )
}
  
export default withRouter(SwapPage);

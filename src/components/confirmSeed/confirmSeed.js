import React, { useState } from 'react';
import { withRouter } from "react-router-dom";
import {useDispatch} from 'react-redux'
import {setError, walletFromMnemonic, callGetVersion, callGetUnspentStatecoins} from '../../features/WalletDataSlice'

import './confirmSeed.css'

const ConfirmSeed = (props) => {
  const dispatch = useDispatch();

  const generateUniqueSeedArr = () => {
    var arr = []
    while (arr.length < 3) {
      var r = Math.floor(Math.random() * 11);
      if (arr.indexOf(r) === -1) arr.push(r);
    }
    return arr;
  }

  const [rands] = useState(() => !require("../../settings.json").testing_mode ?
    generateUniqueSeedArr() : []
  );

  let words = props.wizardState.mnemonic.split(" ");
  const [missingwords, setMissingWords] = useState(() => rands.map((rand) => ({pos:rand, word:""})));

  const inputMissingWord = (event) => {
    let map = missingwords.map((item) => {
      if (item.pos===parseInt(event.target.id)) {item.word=event.target.value} return item})
    setMissingWords(map)
  }

  const handleKeyDown = e => {
    let ASCIIchar = e.key.charCodeAt(0)

    if(( ASCIIchar < 97 || ASCIIchar > 122) && ASCIIchar !== 66 && ASCIIchar !== 84){
      e.preventDefault();
    }
  }

  // Display other words and create input boxes
  let words_without_missing = words.map((item, index) => (rands.includes(index) ? "" : item))
  const inputs = words_without_missing.map((item, index) => (
      <input key={index}
        id={index}
        type="text"
        placeholder={index + 1 + ". " + item}
        value={item === '' ? missingwords.find((item) => {if (item.pos===index) {return item} return null}).word : ""}
        disabled={item === '' ? "" : "disabled"}
        onKeyDown={handleKeyDown}
        onChange={inputMissingWord}/>
  ))

  // Confirm words are correct
  const onConfirmClick = (event) => {
    // Verify mnemonic confirmation
    for (let i=0;i<missingwords.length; i++) {
      if (missingwords[i].word!==words[missingwords[i].pos]) {
        event.preventDefault();
        dispatch(setError({msg: "Seed confirmation failed."}))
        return
      }
    }

    // Quick check for expiring coins.
    // If so display error dialogue
    const checkForCoinsHealth = () => {
      let unspent_coins_data = callGetUnspentStatecoins();
      let coins_data = unspent_coins_data[0];
      for (let i=0; i<coins_data.length; i++) {
        if (coins_data[i].wallet_version !== callGetVersion()) {
          dispatch(setError({msg: "Warning: Coin in wallet was created in previous wallet version. Due to rapid development some backward incompatible changes may break old coins. We recommend withdrawing testnet coins and creating a fresh wallet."}))
          break;
        };
      }
    }

    // Create wallet and load into Redux state
    try {
      walletFromMnemonic(props.wizardState.wallet_name, props.wizardState.wallet_password, props.wizardState.mnemonic)
      props.history.push('/home')
    } catch (e) {
      event.preventDefault();
      dispatch(setError({msg: e.message}))
    }
    checkForCoinsHealth();
    props.setWalletLoaded(true);
  }

  return (
      <div className="wizard-form-confirm wizard-form inputs">
          <p>Click below or type in the missing words to confirm your seed key.</p>

          <form>
              {inputs}
          </form>
          <div className="footer-step-btns">
            <button onClick={props.onPrevStep} className="primary-btn-link back">Go back</button>
            <button className="primary-btn blue" onClick={onConfirmClick} >
                Confirm
            </button>
          </div>
      </div>
  )
}

export default withRouter(ConfirmSeed);

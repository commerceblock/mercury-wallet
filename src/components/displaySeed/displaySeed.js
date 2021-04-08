import React from 'react';
import { CopiedButton } from '../../components'

import copy from '../../images/copy-image.png';
import '../displaySeed/displaySeed.css'


const DisplaySeed = (props) => {
    let mnemonic = props.wizardState.mnemonic;
    const {onPrevStep, onNextStep} = props
    let words = mnemonic.split(" ");

    const inputs = words.map((item, index) => (
        <input key={index} type="text" placeholder={index + 1 + ". " + item} disabled/>
    ))

    const copyMnemonicToClipboard = () => {
      navigator.clipboard.writeText(words.join(" "));
    }

    return (
        <div className="wizard-form inputs">
            <p>
                The list of 12 words below is the recovery seed key for the wallet you are creating.
                <b> Carefully write down and store your seed somewhere safe, as it provides access to your wallet.</b>
            </p>
            <p>
                For best practice, never store it online or on the same computer as the wallet. The seed key is the only
                way to
                recover your wallet if your computer is lost, stolen or stops working. There is no way to recover the
                seed if lost.
            </p>

            <form>
                {inputs}


                <div className="mt-3">
                    <button onClick={onPrevStep} className="btn btn-primary">Prev</button>
                    <button onClick={onNextStep} className="btn btn-primary">Next</button>
                </div>
            </form>
            <div className="copy">
                <CopiedButton 
                    handleCopy={copyMnemonicToClipboard} 
                    style={{left: -65, color: '#000', textTransform: 'capitalize'}}
                >
                    <div>
                        <img src={copy} alt="copy-icon"/>
                        <span> Copy Seed to Clipboard</span>
                    </div>
                </CopiedButton>
            </div>

        </div>
    )
}

export default DisplaySeed;

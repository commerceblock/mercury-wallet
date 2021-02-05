import settings from "../../images/settings.png";

import React, {useState} from 'react';
import {Link, withRouter} from "react-router-dom";

import { StdButton, Quantity } from "../../components";
import { callGetConfig } from '../../features/WalletDataSlice'


import './Settings.css';

const SettingsPage = () => {
  // let [state, setState] = useState({checked: false})

  let config = callGetConfig();

  return (
    <div className="container">
      <p> Settings page is under construction. </p>
      <div className="Body settings">
          <div className="swap-header">
              <h2 className="WalletAmount">
                  <img src={settings} alt="question"/>
                  Settings
              </h2>
              <div >
                  <Link className="nav-link" to="/">
                      <StdButton
                          label="Back"
                          className="Body-button transparent"/>
                  </Link>
              </div>

          </div>
          <div className="buttons">
              <Link className="nav-link" to="/">
                  <StdButton
                      label="Create wallet backup"
                      className="Body-button blue"/>
              </Link>
              <Link className="nav-link" to="/">
                  <StdButton
                      label="Export activity log"
                      className="Body-button bg-transparent"/>
              </Link>


          </div>
      </div>
        <div className="Body settings">

           <div className="content">
               <div className="inputs">
                   <h2>Connectivity Settings</h2>
                   <form>

                    <div>
                        <input type="text" name="Electrumx Address" placeholder={config.electrum_config.host} />
                    </div>
                    <div>
                        <input type="text" name="Tor Proxy" placeholder={config.tor_proxy}/>
                    </div>
                    <div>
                        <input type="text" name="StateChain Entity Address" placeholder={config.state_entity_endpoint}/>
                    </div>
                     <div>
                         <input type="text" name="Swap Conductor Address" placeholder={config.swap_conductor_endpoint}/>
                     </div>
                   </form>
                   <Quantity label="Minimum Anonymity Set Size" />
                   <StdButton label="Publish back-out transaction"
                              className="Body-button blue"/>
               </div>
               <div className="inputs">
                   <h2>Date/Time Format</h2>
                   <select name="1" id="1">
                       <option value="1">mm/dd/yyyy HH:mm:ss</option>
                   </select>
                  <div className="btns">

                      <div className="btns-radios">
                          <label htmlFor="s1">Notifications</label>
                          <input id="s1" type="checkbox" className="switch" />
                      </div>
                      <span>Description of the kind of notifications</span>
                  </div>
                   <div className="btns">
                       <div className="btns-radios">
                           <label htmlFor="s1">Tutorials</label>
                           <input id="s1" type="checkbox" className="switch" />
                       </div>
                       <span>Description of the kind of notifications</span>
                   </div>
               </div>
           </div>
            <div className="action-btns">
                <StdButton
                    label="Cancel"
                    className="Body-button bg-transparent"/>
                <StdButton
                    label="Save"
                    className="Body-button blue"/>
            </div>

        </div>
    </div>
  )
}


export default withRouter(SettingsPage);

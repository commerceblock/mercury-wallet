import {createSlice, createAsyncThunk} from '@reduxjs/toolkit'

import {Wallet, ACTION} from '../wallet'
import {getFeeInfo, getCoinsInfo} from '../wallet/mercury/info_api'
import {pingServer, swapDeregisterUtxo} from '../wallet/swap/info_api'
import {decodeMessage} from '../wallet/util'

import {v4 as uuidv4} from 'uuid';
import * as bitcoin from 'bitcoinjs-lib';
import {mutex} from '../wallet/electrum';

const CLOSED = require('websocket').w3cwebsocket.CLOSED;
const OPEN = require('websocket').w3cwebsocket.OPEN;

const log = window.require('electron-log');
const network = bitcoin.networks[require("../settings.json").network];

let wallet;
let testing_mode = require("../settings.json").testing_mode;

const initialState = {
  notification_dialogue: [],
  error_dialogue: { seen: true, msg: "" },
  balance_info: {total_balance: null, num_coins: null},
  fee_info: {deposit: "NA", withdraw: "NA"},
  ping_swap: null,
  filterBy: 'default',
  depositLoading: false
}

// Check if a wallet is loaded in memory
export const isWalletLoaded = () => {
  if (wallet===undefined) {
    return false
  }
  return true
}
export const unloadWallet = () => {
  wallet = undefined;
}
export const reloadWallet = () => {
  let name = wallet.name;
  let password = wallet.password;
  unloadWallet()
  walletLoad(name,password);
}

//Restart the electrum server if ping fails
async function pingElectrumRestart() {
  if(wallet){
    //If client already started
  if (pingElectrum() == false) {
      log.info(`Failed to ping electum server. Restarting client`);
        wallet.electrum_client.close().catch( (err) => {
        log.info(`Failed to close electrum client: ${err}`)
      });
  } 
  if (wallet.electrum_client.isClosed()){
    log.info(`Electrum connection closed - attempting to reopen`);
    mutex.runExclusive(async () => {
          wallet.electrum_client = wallet.newElectrumClient();
          try{
            wallet.initElectrumClient(setBlockHeightCallBack);
          } catch(err){
              log.info(`Failed to initialize electrum client: ${err}`);
          }
    });
    }
  }
}

async function pingElectrum() {
  if(wallet){
    //If client already started
    if (wallet.electrum_client.isOpen()){
      wallet.electrum_client.serverPing().catch((err) => {
      return false;
     });
     return true;
    }
  }
  return false;
}

// Keep electrum server connection alive.

export async function callPingElectrum(){
  return wallet.electrum_client.latestBlockHeader()
}

setInterval(async function() {
  //Restart server if connection lost
  await pingElectrumRestart().catch((err) => {
    log.info(`Failed to restart electum server: ${err}`);
  });
}, 30000);


// update backuptx status and broadcast if necessary
setInterval(async function() {
    if (wallet) {
      //Exit the loop if the server cannot be pinged
      if (pingElectrum() == false) {
        log.info(`Failed to ping electum server`);
        return;
      }
       wallet.updateBackupTxStatus();
    }
  }, 60000);

// Call back fn updates wallet block_height upon electrum block height subscribe message event.
// This fn must be in scope of the wallet being acted upon
function setBlockHeightCallBack(item) {
  wallet.setBlockHeight(item);
}

// Load wallet from store
export const walletLoad = (name, password) => {
  wallet = Wallet.load(name, password, testing_mode);
  log.info("Wallet "+name+" loaded from memory. ");
  if (testing_mode) log.info("Testing mode set.");
  mutex.runExclusive(async () => {
    await wallet.set_tor_endpoints();
    wallet.initElectrumClient(setBlockHeightCallBack);
    wallet.updateSwapStatus();
    wallet.updateSwapGroupInfo();
  });
}

// Create wallet from nmemonic and load wallet. Try restore wallet if set.
export const walletFromMnemonic = (name, password, mnemonic, try_restore) => {
  wallet = Wallet.fromMnemonic(name, password, mnemonic, network, testing_mode);
  log.info("Wallet "+name+" created.");
  console.log(try_restore)
  if (testing_mode) log.info("Testing mode set.");
  mutex.runExclusive(async () => {
    await wallet.set_tor_endpoints();
    wallet.initElectrumClient(setBlockHeightCallBack);
    if (try_restore) {
      wallet.recoverCoinsFromServer();
    }
    callNewSeAddr();
    wallet.save();
  });
}
// Try to decrypt wallet. Throw if invalid password
export const checkWalletPassword = (password) => {
  Wallet.load(wallet.name, password);
}

// Create wallet from backup file
export const walletFromJson = (wallet_json, password) => {
  return Promise.resolve().then(() => {
    wallet = Wallet.loadFromBackup(wallet_json, password, testing_mode);
    log.info("Wallet " + wallet.name + " loaded from backup.");
    if (testing_mode) log.info("Testing mode set.");
    return mutex.runExclusive(async () => {
      await wallet.set_tor_endpoints();
      wallet.initElectrumClient(setBlockHeightCallBack);
      callNewSeAddr();
      wallet.save()
      return wallet;
    }).catch(error => {
        console.error('Can not load wallet from json!', error);
    });
  });
}

// Wallet data gets
export const callGetConfig = () => {
  return wallet.config.getConfig()
}
export const callGetVersion = () => {
  return wallet.version
}
export const callGetBlockHeight = () => {
  return wallet.getBlockHeight()
}
export const callGetUnspentStatecoins = () => {
  return wallet.getUnspentStatecoins()
}
export const callGetSwapGroupInfo = () => {
  return wallet.getSwapGroupInfo()
}

export const callGetUnconfirmedAndUnmindeCoinsFundingTxData= () => {
  return wallet.getUnconfirmedAndUnmindeCoinsFundingTxData()
}
export const callGetUnconfirmedStatecoinsDisplayData = () => {
  return wallet.getUnconfirmedStatecoinsDisplayData()
}
export const callGetActivityLog = () => {
  return wallet.getActivityLog(10)
}
export const callGetFeeInfo = () => {
  return getFeeInfo(wallet.http_client)
}
export const callGetCoinsInfo = () => {
  return getCoinsInfo(wallet.http_client)
}
export const callPingSwap = () => {
  try {
    pingServer(wallet.http_client)
  } catch (error){
    return false;
  }
  return true;
}
export const callGetCoinBackupTxData = (shared_key_id) => {
  return wallet.getCoinBackupTxData(shared_key_id)
}
export const callGetSeAddr = (addr_index) => {
  return wallet.getSEAddress(addr_index)
}
// Gen new SE Address
export const callNewSeAddr = (state) => {
  return wallet.newSEAddress()
}
export const callGetNumSeAddr = () => {
  return wallet.getNumSEAddress()
}
// Remove coin from coins list
export const callRemoveCoin = (shared_key_id) => {
  log.info("Removing coin "+shared_key_id+" from wallet.");
  wallet.removeStatecoin(shared_key_id);
}

export const callGetStateCoin = (shared_key_id) => {
  return wallet.getStatecoin(shared_key_id);
}

export const callAddDescription = (shared_key_id,description) => {
  wallet.addDescription(shared_key_id,description)
}

// Update config with JSON of field to change
export const callUpdateConfig = (config_changes) => {
  wallet.config.update(config_changes)
  wallet.save();
  reloadWallet();
}

// Create CPFP transaction and add to coin
export const callCreateBackupTxCPFP = (cpfp_data) => {
     let sucess = wallet.createBackupTxCPFP(cpfp_data);
     return sucess
}

export const callGetWalletJsonToBackup = () => {
  return wallet.storage.getWallet(wallet.name);
}

// Redux 'thunks' allow async access to Wallet. Errors thrown are recorded in
// state.error_dialogue, which can then be displayed in GUI or handled elsewhere.
export const callDepositInit = createAsyncThunk(
  'depositInit',
  async (value, thunkAPI) => {
    return wallet.depositInit(value)
  }
)
export const callDepositConfirm = createAsyncThunk(
  'depositConfirm',
  async (action, thunkAPI) => {
    return wallet.depositConfirm(action.shared_key_id)
  }
)
export const callWithdraw = createAsyncThunk(
  'depositWithdraw',
  async (action, thunkAPI) => {
    return wallet.withdraw(action.shared_key_ids, action.rec_addr, action.fee_per_kb)
  }
)
export const callTransferSender = createAsyncThunk(
  'TransferSender',
  async (action, thunkAPI) => {
    return wallet.transfer_sender(action.shared_key_id, action.rec_addr)
  }
)
export const callTransferReceiver = createAsyncThunk(
  'TransferReceiver',
  async (action, thunkAPI) => {
    return wallet.transfer_receiver(decodeMessage(action, network))
  }
)
export const callGetTransfers = createAsyncThunk(
  'GetTransfers',
  async (action, thunkAPI) => {
    return wallet.get_transfers(action)
  }
)
export const callDoSwap = createAsyncThunk(
  'DoSwap',
  async (action, thunkAPI) => {
    return wallet.do_swap(action.shared_key_id)
  }
)
export const callUpdateSwapGroupInfo = createAsyncThunk(
  'UpdateSwapGroupInfo',
  async (action, thunkAPI) => {
    wallet.updateSwapGroupInfo();
  }
)
export const callUpdateSwapStatus = createAsyncThunk(
  'UpdateSwapStatus',
  async (action, thunkAPI) => {
    wallet.updateSwapStatus();
  }
)
export const callSwapDeregisterUtxo = createAsyncThunk(
  'SwapDeregisterUtxo',
  async (action, thunkAPI) => {
    let statechain_id = wallet.statecoins.getCoin(action.shared_key_id).statechain_id
    await swapDeregisterUtxo(wallet.http_client, {id: statechain_id});
    wallet.statecoins.removeCoinFromSwap(action.shared_key_id);
  }
)

export const callGetFeeEstimation = createAsyncThunk(
  'GetFeeEstimation',
  async (action, thunkAPI) => {
    return await wallet.electrum_client.getFeeHistogram(wallet.config.electrum_fee_estimation_blocks);
  }
)

const WalletSlice = createSlice({
  name: 'walletData',
  initialState,
  reducers: {
    // Update total_balance
    updateBalanceInfo(state, action) {
      if (state.balance_info.total_balance !== action.payload.total_balance) {
        return {
          ...state,
          balance_info: action.payload
        }
      }
    },
    // Update fee_info
    updateFeeInfo(state, action) {
      return {
        ...state,
        fee_info: action.payload
      }
    },
    // Update ping_swap
    updatePingSwap(state, action) {
        return {
          ...state,
          ping_swap: action.payload
        }
    },
    updateFilter(state, action) {
      return {
        ...state,
        filterBy: action.payload
      }
    },
    // Deposit
    dummyDeposit() {
      let proof_key = "02c69dad87250b032fe4052240eaf5b8a5dc160b1a144ecbcd55e39cf4b9b49bfd"
      let funding_txid = "64ec6bc7f794343a0c3651c0578f25df5134322b959ece99795dccfffe8a87e9"
      let funding_vout = 0
      wallet.addStatecoinFromValues(uuidv4(), dummy_master_key, 10000, funding_txid, funding_vout, proof_key, ACTION.DEPOSIT)
    },
    setErrorSeen(state) {
      state.error_dialogue.seen = true
    },
    setError(state, action) {
      log.error(action.payload.msg)
      return {
        ...state,
        error_dialogue: {seen: false, msg: action.payload.msg}
      }
    },
    setNotificationSeen(state, action) {
      return {
        ...state,
        notification_dialogue:
          state.notification_dialogue.filter((item) => {
            return item.msg !== action.payload.msg
        })
      }
    },
    setNotification(state, action) {
      log.info(action.payload.msg);
      return {
        ...state,
        notification_dialogue: [
          ...state.notification_dialogue,
          {msg: action.payload.msg}
        ]
      }
    },
    callClearSave(state) {
      wallet.clearSave()
      return {
        ...state
      }
    }
  },
  extraReducers: {
    // Pass rejects through to error_dialogue for display to user.
    [walletLoad.rejected]: (state, action) => {
      state.error_dialogue = { seen: false, msg: action.error.name+": "+action.error.message }
    },
    [callDepositInit.pending]: (state) => {
      state.depositLoading = true;
    },
    [callDepositInit.rejected]: (state, action) => {
      state.error_dialogue = { seen: false, msg: action.error.name+": "+action.error.message }
    },
    [callDepositInit.fulfilled]: (state) => {
      state.depositLoading = false;
    },
    [callDepositConfirm.rejected]: (state, action) => {
      state.error_dialogue = { seen: false, msg: action.error.name+": "+action.error.message }
    },
    [callGetUnspentStatecoins.rejected]: (state, action) => {
      state.error_dialogue = { seen: false, msg: action.error.name+": "+action.error.message }
    },
    [callWithdraw.rejected]: (state, action) => {
      state.error_dialogue = { seen: false, msg: action.error.name+": "+action.error.message }
    },
    [callTransferSender.rejected]: (state, action) => {
      state.error_dialogue = { seen: false, msg: action.error.name+": "+action.error.message }
    },
    [callTransferReceiver.rejected]: (state, action) => {
      state.error_dialogue = { seen: false, msg: action.error.name+": " + action.error.message }
    },
    [callGetTransfers.rejected]: (state, action) => {
      state.error_dialogue = { seen: false, msg: action.error.name+": "+ action.error.message }
    },
    [callDoSwap.rejected]: (state, action) => {
      state.error_dialogue = { seen: false, msg: action.error.name+": "+action.error.message }
    },
    [callUpdateSwapGroupInfo.rejected]: (state, action) => {
      state.error_dialogue = { seen: false, msg: action.error.name+": "+action.error.message }
    },
    [callUpdateSwapStatus.rejected]: (state, action) => {
      state.error_dialogue = { seen: false, msg: action.error.name+": "+action.error.message }
    },
    [callSwapDeregisterUtxo.rejected]: (state, action) => {
      state.error_dialogue = { seen: false, msg: action.error.name+": "+action.error.message }
    },
    [callGetFeeEstimation.rejected]: (state, action) => {
      state.error_dialogue = { seen: false, msg: action.error.name+": "+action.error.message }
    },
    [callCreateBackupTxCPFP.rejected]: (state, action) => {
      state.error_dialogue = { seen: false, msg: action.error.name+": "+action.error.message }
    }
}
})

export const { callGenSeAddr, refreshCoinData, setErrorSeen, setError, updateFeeInfo, updatePingSwap,
  setNotification, setNotificationSeen, callPingServer, updateBalanceInfo, callClearSave, updateFilter,
  updateTxFeeEstimate } = WalletSlice.actions
  export default WalletSlice.reducer


const dummy_master_key = {public:{q:{x:"47dc67d37acf9952b2a39f84639fc698d98c3c6c9fb90fdc8b100087df75bf32",y:"374935604c8496b2eb5ff3b4f1b6833de019f9653be293f5b6e70f6758fe1eb6"},p2:{x:"5220bc6ebcc83d0a1e4482ab1f2194cb69648100e8be78acde47ca56b996bd9e",y:"8dfbb36ef76f2197598738329ffab7d3b3a06d80467db8e739c6b165abc20231"},p1:{x:"bada7f0efb10f35b920ff92f9c609f5715f2703e2c67bd0e362227290c8f1be9",y:"46ce24197d468c50001e6c2aa6de8d9374bb37322d1daf0120215fb0c97a455a"},paillier_pub:{n:"17945609950524790912898455372365672530127324710681445199839926830591356778719067270420287946423159715031144719332460119432440626547108597346324742121422771391048313578132842769475549255962811836466188142112842892181394110210275612137463998279698990558525870802338582395718737206590148296218224470557801430185913136432965780247483964177331993320926193963209106016417593344434547509486359823213494287461975253216400052041379785732818522252026238822226613139610817120254150810552690978166222643873509971549146120614258860562230109277986562141851289117781348025934400257491855067454202293309100635821977638589797710978933"},c_key:"36d7dde4b796a7034fc6cfd75d341b223012720b52a35a37cd8229839fe9ed1f1f1fe7cbcdbc0fa59adbb757bd60a5b7e3067bc49c1395a24f70228cc327d7346b639d4e81bd3cfd39698c58e900f99c3110d6a3d769f75c8f59e7f5ad57009eadb8c6e6c4830c1082ddd84e28a70a83645354056c90ab709325fc6246d505134d4006ef6fec80645493483413d309cb84d5b5f34e28ab6af3316e517e556df963134c09810f754c58b85cf079e0131498f004108733a5f6e6a242c549284cf2df4aede022d03b854c6601210b450bdb1f73591b3f880852f0e9a3a943e1d1fdb8d5c5b839d0906de255316569b703aca913114067736dae93ea721ddd0b26e33cf5b0af67cee46d6a3281d17082a08ab53688734667c641d71e8f69b25ca1e6e0ebf59aa46c0e0a3266d6d1fba8e9f25837a28a40ae553c59fe39072723daa2e8078e889fd342ef656295d8615531159b393367b760590a1325a547dc1eff118bc3655912ac0b3c589e9d7fbc6d244d5860dfb8a5a136bf7b665711bf4e75fe42eb28a168d1ddd5ecf77165a3d4db72fda355c0dc748b0c6c2eada407dba5c1a6c797385e23c050622418be8f3cd393e6acd8a7ea5bd3306aafae75f4def94386f62564fce7a66dc5d99c197d161c7c0d3eea898ca3c5e9fbd7ceb1e3f7f2cb375181cf98f7608d08ed96ef1f98af3d5e2d769ae4211e7d20415677eddd1051"},private:{x2:"34c0b428488ddc6b28e05cee37e7c4533007f0861e06a2b77e71d3f133ddb81b"},chain_code:"0"}

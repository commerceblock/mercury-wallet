/// API for GUI with dummy return values.
export { deposit, despoitInit } from "./deposit"
export { GET_ROUTE, POST_ROUTE, post, get } from "./request";

// StateEntity fee info.
export const GetSEFeeInfo = () => {
  return {
    addr: "bcrt1qjjwk2rk7nuxt6c79tsxthf5rpnky0sdhjr493x",
    deposit_fee: 300,
    withdraw_fee: 300,
    interval: 100,
    init_lock: 10000
  }
}

// Generate Bitcoin address
export const GetBtcAddr = () => {
  return {
    btc_addr: "bcrtc1qj7p5r79nu9tnjkxt6j2rsxty0sdh3xwkkr4hf",
  }
}

// Generate StateEntity address
export const GetSEAddr = () => {
  return {
    se_addr: "026ff25fd651cd921fc490a6691f0dd1dcbf725510f1fbd80d7bf7abdfef7fea0ebcrt1qq0znj64a5zukv7yew52zjzmdndch3r0vxu8668",
  }
}

// Perform deposit
export const Deposit = (amount) => {
  return {
    shared_key_id: "73935730-d35c-438c-87dc-d06054277a5d",
    state_chain_id: "56ee06ea-88b4-415d-b1e9-62b308889d29",
    funding_txid: "f62c9b74e276843a5d0fe0d3d0f3d73c06e118b822772c024aac3d840fbad3ce",
    backuptx: "3c06e118b822772c024aac3d840fbad3cef62c9f62c9b74e276843a5d0fe0d3d0f3d7b74e276843a5d0fe0d3d0f3d73c06e118b822772c024aac3d840fbad3cef62c9b74e276843a5d0fe0d3d0f3d73c06e118b822772c024aac3d840fbad3cef62c9b74e276843a5d0fe0d3d0f3d73c06e118b822772c024aac3d840fbad3cef62c9b74e276843a5d0fe0d3d0f3d73c06e118b822772c024aac3d840fbad3cef62c9b74e276843a5d0fe0d3d0f3d73c06e118b822772c024aac3d840fbad3ce",
    proof_key: "441874303fd1524b9660afb44a7edfee49cd9b243db99ea400e876aa15c2983ee7dcf5dc7aec2ae27260ef40378168bfd6d0d1358d611195f4dbd89015f9b785",
    anon_score: 0,
    time_left: "12"
  }
}

// Perform transfer_sender
// Args: state_chain_id of coin to send and receivers se_addr.
// Return: transfer_message String to be sent to receiver.
export const TransferSender = (state_chain_id, receiver_se_addr) => {
  return {
    transfer_message: "441874303fd1524b9660afb44a7edfee49cd9b243db99ea400e876aa15c2983ee7dcf5dc7aec2ae27260ef40378168bfd6d0d1358d611195f4dbd89015f9b785",
  }
}

// Perform transfer_receiver
// Args: transfer_messager retuned from sender's TransferSender
// Return: New wallet coin data
export const TransferReceiver = (transfer_message) => {
  return {
    amount: 0.1,
    shared_key_id: "57307393-d35c-438c-87dc-d06054277a5d",
    state_chain_id: "6e56ee0a-88b4-415d-b1e9-62b308889d29",
    funding_txid: "74e2e118b822772c024aac3d840fbad3cf76843a5d0fe0d3d0f3d73c0662c9be",
    backuptx: "22772c024aac3d840fbad3cef62c93c06e118b8f62c9b74e276843a5d0fe0d3d0f3d7b74e276843a5d0fe0d3d0f3d73c06e118b822772c024aac3d840fbad3cef62c9b74e276843a5d0fe0d3d0f3d73c06e118b822772c024aac3d840fbad3cef62c9b74e276843a5d0fe0d3d0f3d73c06e118b822772c024aac3d840fbad3cef62c9b74e276843a5d0fe0d3d0f3d73c06e118b822772c024aac3d840fbad3cef62c9b74e276843a5d0fe0d3d0f3d73c06e118b822772c024aac3d840fbad3ce",
    proof_key: "fd1524b9660afb44a7edfee49cd9b243db99ea404418743030e876aa15c2983ee7dcf5dc7aec2ae27260ef40378168bfd6d0d1358d611195f4dbd89015f9b785",
    anon_score: 0,
    time_left: "11"
  }
}

// Perform withdraw
// Args: state_chain_id of coin to withdraw
// Return: Txid of withdraw and onchain amount (To be displayed to user)
export const Withdraw = (state_chain_id) => {
  return {
    withdraw_txid: "fbad3cf76843a5d0fe0d3d0f3d73c066274e2e118b822772c024aac3d840c9be",
    withdraw_onchain_amount: 0.0999700,
  }
}


// Perform swap
// Args: state_chain_id of coin to swap and swap size parameter. Also provide current coin anon_score for GUI demos.
// Return: New wallet coin data
export const Swap = (state_chain_id, swap_size, anon_score) => {
  return {
    amount: 0.1,
    shared_key_id: "h46w1ueui-438c-87dc-d06054277a5d",
    state_chain_id: "hf773kapa-88b4-415d-b1e9-62b308889d29",
    funding_txid: "4aac3d840fbad3cf76843a5d74e2e118b822772c020fe0d3d0f3d73c0662c9be",
    backuptx: "40fbad3cef62c93c06e118b8f62c9b74e276843a5d0f22772c024aac3d8e0d3d0f3d7b74e276843a5d0fe0d3d0f3d73c06e118b822772c024aac3d840fbad3cef62c9b74e276843a5d0fe0d3d0f3d73c06e118b822772c024aac3d840fbad3cef62c9b74e276843a5d0fe0d3d0f3d73c06e118b822772c024aac3d840fbad3cef62c9b74e276843a5d0fe0d3d0f3d73c06e118b822772c024aac3d840fbad3cef62c9b74e276843a5d0fe0d3d0f3d73c06e118b822772c024aac3d840fbad3ce",
    proof_key: "43030ed1524b9660afb44a7ed876aa15c2983ee7dcf5dc7aec2aeffee49cd9b243db99ea404418727260ef40378168bfd6d0d1358d611195f4dbd89015f9b785",
    anon_score: anon_score + 10,
    time_left: "10"
  }
}

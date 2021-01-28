import { HttpClient, MockHttpClient, GET_ROUTE, POST_ROUTE } from "..";

let types = require("../types")
let typeforce = require('typeforce');

export const pingServer = async (
  http_client: HttpClient | MockHttpClient,
) => {
  return await http_client.get(GET_ROUTE.PING, {})
}

export const getFeeInfo = async (
  http_client: HttpClient | MockHttpClient,
) => {
  let fee_info = await http_client.get(GET_ROUTE.FEES, {});
  typeforce(types.FeeInfo, fee_info);
  return fee_info
}

export const getStateChain = async (
  http_client: HttpClient | MockHttpClient,
  statechain_id: string
) => {
  let statechain = await http_client.get(GET_ROUTE.STATECHAIN, statechain_id);
  typeforce(types.StateChainDataAPI, statechain);
  return statechain
}

export const getRoot = async (
  http_client: HttpClient | MockHttpClient
) => {
  let root = await http_client.get(GET_ROUTE.ROOT, {});
  typeforce(typeforce.oneOf(types.Root, typeforce.Null), root);
  return root
}

export const getSmtProof = async (
  http_client: HttpClient | MockHttpClient,
  root: Root | null,
  funding_txid: string
) => {
  typeforce(typeforce.oneOf(types.Root, typeforce.Null), root);
  let smt_proof_msg_api = {
    root: root,
    funding_txid: funding_txid
  };
  let proof = await http_client.post(POST_ROUTE.SMT_PROOF, smt_proof_msg_api);
  typeforce(types.Array, proof);
  return proof
}

export const getTransferBatchStatus = async (
  http_client: HttpClient | MockHttpClient,
  batch_id: string
) => {
  return await http_client.get(GET_ROUTE.TRANSFER_BATCH, batch_id);
}


export interface StateChainDataAPI {
    utxo: any,
    amount: number,
    chain: any[],
    locktime: number,
}

export interface Root {
  id: number,
  value: number[],
  commitment_info: any
}

export interface FeeInfo {
  address: string,
  deposit: number,
  withdraw: number,
  interval: number,
  initlock: number
}

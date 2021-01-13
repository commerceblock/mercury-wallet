export const KEYGEN_SIGN_DATA
 = {
  shared_key_id: "861d2223-7d84-44f1-ba3e-4cd7dd418560",
  protocol: "Deposit",
  shared_key:  {"public":{"q":{"x":"4698df57e7cee6725cd108e8d84c970fece881bc7ddc83c215766bbc7c0468fe","y":"d8ba0d588c023a431b78c38fd6932eac07b21ae67a889c1b12ce1562502f90fb"},"p2":{"x":"e963ffdfe34e63b68aeb42a5826e08af087660e0dac1c3e79f7625ca4e6ae482","y":"2a78e81b57d80c4c65c94692fa281d1a1a8875f9874c197e71a52c11d9d44c40"},"p1":{"x":"126b2fc9a9f0305d6dd07d33ac93a485690f184128447873b0723e8c08f5bfd8","y":"7bdf613daa4fe408a6f9b05e8d563e2fc0b49bb0a373f02fc03668e8a4319b11"},"paillier_pub":{"n":"9589234529977732033915956795726858212623674242595205480720352392635586533239459142933873934127259795951307650330333203728932676734018943102298426795769397096959778729429218426434783707559096190762593241666844097805013846997715479012818811482144381502595493123738315649617220279169663190558353117479383834901156749130658642244214361400589627348071191513371040348954516355646271274086929063846753472198875295788129966614111696123182279614629489637979553720067719047976096188187866405787874290754661449435444233963291453836263110455829775366260295684444884226694602172719047771348817017022310792904793780039196883695817"},"c_key":[1,[1361022059,1025283163,4026668578,1594810272,1184589741,3676706131,3837088359,3865999728,4237849986,1793380173,2006359838,1846406328,3317669715,527766024,1241318588,347923064,3901925116,3387328897,3180809457,460891672,3290579170,3091739194,871481428,3249511156,3508970924,1468372995,922717682,3487457396,3885615416,1448859766,2614295308,1237103074,3722595477,347364258,4261580778,121054704,542371432,451245360,3563880584,2711064028,2263013484,2719863633,1822718483,2802109280,688512437,468779906,3177934810,1786257779,22609415,3833749991,3739987223,1602401442,30583797,2180815088,2546415716,2922751324,1912448363,3353092978,2351081712,2910234376,3377929858,415942120,573901988,2439392233,1542785922,520417201,1839531326,155580178,4071968310,666676646,805105353,3079432063,3235903591,3635667124,3512756219,1115846963,2464626171,2947889504,1636744941,1066638490,443973347,625239465,2180816446,4258113191,3522768524,4130118777,2112173836,2033076804,1317997890,2779339030,3327090967,3363916524,1660330782,3108797134,2262848384,3351158430,2906045967,1970399375,6455396,2476954659,811711725,2649978781,86081822,1111229689,3178216626,1177127451,3143213116,298039078,938887189,4195377616,3466427490,3695139034,582433249,3191152731,897162210,485919723,81834390,182981145,2822061996,668227445,452837791,1089416643,2938416823,4193245831,1825622966,2863483531,964829149,54643400]]},"private":{"x2":"34c0b428488ddc6b28e05cee37e7c4533007f0861e06a2b77e71d3f133ddb81b"},"chain_code":[0,[]]},
  signature_hash: "43ea4228569c8e9ad9b6889502c2c6a6d4be7ac7f108549f8ca398bf4de9b247"
}


export const FUNDING_TXID = "f62c9b74e276843a5d0fe0d3d0f3d73c06e118b822772c024aac3d840fbad3ce";

export const STATECHAIN_ID = "56ee06ea-88b4-415d-b1e9-62b308889d29";

export const BTC_ADDR = "bc1qdxx0p56wjmu3va7c4cq8dydfcx0vm7ak67klk8";



// sigs generated from Mercury server StateChainSig.
export const SIGNSTATECHAIN_DATA =
  [
    {purpose: "TRANSFER", data: "03b971d624567214a2e9a53995ee7d4858d6355eb4e3863d9ac540085c8b2d12b3", sig: "304402205bb830138dc807cad3c34a674e9c5804eb1a6d9a75dc4043d35c72b704b587420220299b6d09455e438d871e4c35b9a369f3ab3ec2c7196da8179db1a5b43d0c2fdc"},
    {purpose: "WITHDRAW", data: "somedata", sig: "3045022100ba1e538a64d0c8754db93b539d622bdd9f0128e5fe9a54c64946f6db154e033f022043f68ab073cb247c807c90d33d22fc2e22470a6b1358d328fa3c4537181f834e"},
    {purpose: "DEPOSIT", data: "somedata222", sig: "30440220524821f37eac1a6d7bd3fda54d01c0db309301aeaa5d499007191e8889b5c42a02200f5e538154c1b39ba4733eb28124fade124c21f7a7def080aabd2afab418a09c"}
  ]


export const TRANSFER_MSG3 = '{"shared_key_id":"861d2223-7d84-44f1-ba3e-4cd7dd418560","t1":{"secret_bytes":{"type":"Buffer","data":"base64:BPUE5nCWrgMUIlZsUcwySs3BvbSPGvNpPDr0EvTkDYrZvof8w16iiNFBcceozZ9Cxl9oczl1xZZWcZksdb2asxE96WHu3tUBka3N3N12mjMRaazmZPdnH+M/TTxJdYnybobTuzUQAbeUOKo1h27DDCPBT6NMcY0el67Mm46YcWC2SyEtZcm88dyzpYrUf6+dJj8s+RoNAiha69ljxoCDhR+O+A=="}},"statechain_sig":{"purpose":"TRANSFER","data":"028a9b66d0d2c6ef7ff44a103d44d4e9222b1fa2fd34cd5de29a54875c552abd41","sig":"304402203a3a8f62d89ab95975201065e257b6d0b28b45eefa5b695c90e0540d2d33c29b02206c531a8785a7d9626d952ac2b8352f17798f52056a9c57c8c5107705422b4f11"},"statechain_id":"21d28236-d874-f0f4-ba3e-d4184cd7d560","tx_backup_psm":{"shared_key_id":"861d2223-7d84-44f1-ba3e-4cd7dd418560","protocol":"TRANSFER","tx_hex":"02000000000101d03085921c1e291ac7d9caeb2e93861afcf365cd3945b5cae546045fc59300ae0000000000ffffffff01e425000000000000160014d19cb7bef37606bff26c988fc7986b6999412cde011331323334357369676e6174757265353433323184030000","input_addrs":[],"input_amounts":[],"proof_key":"028a9b66d0d2c6ef7ff44a103d44d4e9222b1fa2fd34cd5de29a54875c552abd41"},"rec_se_addr":{"tx_backup_addr":"bc1q6xwt00hnwcrtlunvnz8u0xrtdxv5ztx7t5wxrj","proof_key":"028a9b66d0d2c6ef7ff44a103d44d4e9222b1fa2fd34cd5de29a54875c552abd41"}}'


export const FINALIZE_DATA = '{"new_shared_key_id":"07387798-ae2b-4d40-b3cd-e2c56e06b821","o2":"0ca756f401478fb1a166d27945501d8af59ada1cb552c598509dfcb494f475b8","s2_pub":{"x":"ccde29a6592798b5e66bb9ffdd4de1256d3b823be465b371011afe78a4e271b3","y":"68bc529d833c9b13ab24271ec664b164db47673006303ef89902e92cfa7f7138"},"theta":"cc7bef84aa30100c4d4e82fb4ca67f503dd42e2fce4501d307295ef140e9c81","state_chain_data":{"utxo":{"txid":"0158f2978e5c2cf407970d7213f2b4289993b2fe3ef6aca531316cdcf347cc41","vout":1},"amount":100,"chain":[{"data":"028a9b66d0d2c6ef7ff44a103d44d4e9222b1fa2fd34cd5de29a54875c552abd41","next_state":null}],"locktime":1000},"proof_key":"028a9b66d0d2c6ef7ff44a103d44d4e9222b1fa2fd34cd5de29a54875c552abd41","statechain_id":"21d28236-d874-f0f4-ba3e-d4184cd7d560","tx_backup_psm":{"shared_key_id":"07387798-ae2b-4d40-b3cd-e2c56e06b821","protocol":"TRANSFER","tx_hex":"02000000000101d03085921c1e291ac7d9caeb2e93861afcf365cd3945b5cae546045fc59300ae0000000000ffffffff01e425000000000000160014d19cb7bef37606bff26c988fc7986b6999412cde011331323334357369676e6174757265353433323184030000","input_addrs":[],"input_amounts":[],"proof_key":"028a9b66d0d2c6ef7ff44a103d44d4e9222b1fa2fd34cd5de29a54875c552abd41"}}'
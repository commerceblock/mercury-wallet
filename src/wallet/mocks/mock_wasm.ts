// Mocks out client side calls to cryptographic protocols.
// Mock Classes are followed by mock data for full protocol runs.

import { COMMITMENT_DATA } from "../test/test_data"


export class MockWasm {
  KeyGen: KeyGen
  Sign: Sign
  Commitment: Commitment

  constructor() {
    this.KeyGen = new KeyGen()
    this.Sign = new Sign()
    this.Commitment = new Commitment()
  }
  init() {}
  verify_statechain_smt() {
    return true
  }
  curv_ge_to_bitcoin_public_key(_input: string) {
    return "0226a18285602f45cbb9a2b6c45b87971c9280daa6a342185a59afa9eb6e226bea"
  }
}


export class KeyGen {
  first_message(_secret_key: string) {
    return KEYGEN_FIRST
  }
  second_message(_kg_party_one_first_message: string, _kg_party_one_second_message: string) {
    return KEYGEN_SECOND
  }
  set_master_key(_kg_ec_key_pair_party2: string, _public_share: string, _party_two_paillier: string) {
    return KEYGEN_SET_MASTER_KEY
  }
}

export class Commitment {
  make_commitment(_data: string){
    return JSON.stringify(
      COMMITMENT_DATA[0].batch_data
    )
  }
}


export class Sign {
    first_message() {
      return SIGN_FIRST
    }
    second_message(
        _master_key: string,
        _eph_ec_key_pair_party2: string,
        _eph_comm_witness: string,
        _eph_party1_first_message: string,
        _message: string) {
      return SIGN_SECOND
    }
}


// MOCK DATA

// Protocol run 1
export const KEYGEN_FIRST = JSON.stringify( {"kg_ec_key_pair_party2":{"public_share":{"x":"e963ffdfe34e63b68aeb42a5826e08af087660e0dac1c3e79f7625ca4e6ae482","y":"2a78e81b57d80c4c65c94692fa281d1a1a8875f9874c197e71a52c11d9d44c40"},"secret_share":"34c0b428488ddc6b28e05cee37e7c4533007f0861e06a2b77e71d3f133ddb81b"},"kg_party_two_first_message":{"d_log_proof":{"challenge_response":"650c256869f4b7d4e7898fad6f9ee292c7380e6e0e1433bd5ddd99e064fb1e7","pk":{"x":"e963ffdfe34e63b68aeb42a5826e08af087660e0dac1c3e79f7625ca4e6ae482","y":"2a78e81b57d80c4c65c94692fa281d1a1a8875f9874c197e71a52c11d9d44c40"},"pk_t_rand_commitment":{"x":"83c43d0ec5d7383d192c45b0e935a292e1815d8e086b144ce462dd9960b749d9","y":"5f4846d2fa055ea3a7dc06f26eefba7e7e3265a6131592f97d90c4596d25684f"}},"public_share":{"x":"e963ffdfe34e63b68aeb42a5826e08af087660e0dac1c3e79f7625ca4e6ae482","y":"2a78e81b57d80c4c65c94692fa281d1a1a8875f9874c197e71a52c11d9d44c40"}}});
export const KEYGEN_SECOND = JSON.stringify( {"party_two_paillier":{"ek":{"n":"9589234529977732033915956795726858212623674242595205480720352392635586533239459142933873934127259795951307650330333203728932676734018943102298426795769397096959778729429218426434783707559096190762593241666844097805013846997715479012818811482144381502595493123738315649617220279169663190558353117479383834901156749130658642244214361400589627348071191513371040348954516355646271274086929063846753472198875295788129966614111696123182279614629489637979553720067719047976096188187866405787874290754661449435444233963291453836263110455829775366260295684444884226694602172719047771348817017022310792904793780039196883695817"},"encrypted_secret_share":[1,[1361022059,1025283163,4026668578,1594810272,1184589741,3676706131,3837088359,3865999728,4237849986,1793380173,2006359838,1846406328,3317669715,527766024,1241318588,347923064,3901925116,3387328897,3180809457,460891672,3290579170,3091739194,871481428,3249511156,3508970924,1468372995,922717682,3487457396,3885615416,1448859766,2614295308,1237103074,3722595477,347364258,4261580778,121054704,542371432,451245360,3563880584,2711064028,2263013484,2719863633,1822718483,2802109280,688512437,468779906,3177934810,1786257779,22609415,3833749991,3739987223,1602401442,30583797,2180815088,2546415716,2922751324,1912448363,3353092978,2351081712,2910234376,3377929858,415942120,573901988,2439392233,1542785922,520417201,1839531326,155580178,4071968310,666676646,805105353,3079432063,3235903591,3635667124,3512756219,1115846963,2464626171,2947889504,1636744941,1066638490,443973347,625239465,2180816446,4258113191,3522768524,4130118777,2112173836,2033076804,1317997890,2779339030,3327090967,3363916524,1660330782,3108797134,2262848384,3351158430,2906045967,1970399375,6455396,2476954659,811711725,2649978781,86081822,1111229689,3178216626,1177127451,3143213116,298039078,938887189,4195377616,3466427490,3695139034,582433249,3191152731,897162210,485919723,81834390,182981145,2822061996,668227445,452837791,1089416643,2938416823,4193245831,1825622966,2863483531,964829149,54643400]]},"party_two_second_message":{"key_gen_second_message":{},"pdl_first_message":{"c_tag":[1,[1889027494,2306336846,1695057671,231036229,2424439511,4262384904,3129603639,101698619,232497851,699106592,2355257489,2484675823,3554134493,2261119429,56114337,290980659,4014904035,2688026357,739053541,1006425081,530116866,2410789340,1040552330,268942729,3980380963,2614110628,3298901543,384068936,707073268,2302934473,2179487281,4166731732,3755881970,1242361061,3754315348,1965612972,2142452391,1666786456,3992378912,2186937494,3686192982,3868676931,1357066153,1893321681,3070169573,785416107,155433312,2588073273,904928962,1431161939,2749691998,3319438685,3108854823,1233605225,3655284831,2347178516,887231983,3882374177,2516526914,2665119185,2905793305,1228504549,3675337847,3123419461,1950538407,596763493,3412646534,2725967020,2091237842,3178919121,102006403,3945043011,55777795,1762128325,453217105,263339027,2792804911,4194413577,3999340796,403812890,3859222616,2255051888,2486349536,1704284284,4000478903,4083630168,1363983622,1454174634,1850968395,3758887117,2617596382,2896363791,3846553200,980476691,919324096,3866731903,2370740219,2588238763,4033634546,4156699966,192831364,893515169,1706334500,335078371,2260524070,3001420985,4104849204,2453956924,78881482,1298793209,3168444769,577811392,3622702983,2685595809,2163675376,1836501488,2469877349,3476696511,1661422415,3349019895,2767750223,1710694192,1664891503,397247663,2456297919,3135972058,3412078271,250804313]],"c_tag_tag":[1,[253664711,693415116,3732571395,1634575015,2257793021,1153071686,3854263197,971675746]]}}})
export const KEYGEN_SET_MASTER_KEY = JSON.stringify( {"public":{"q":{"x":"4698df57e7cee6725cd108e8d84c970fece881bc7ddc83c215766bbc7c0468fe","y":"d8ba0d588c023a431b78c38fd6932eac07b21ae67a889c1b12ce1562502f90fb"},"p2":{"x":"e963ffdfe34e63b68aeb42a5826e08af087660e0dac1c3e79f7625ca4e6ae482","y":"2a78e81b57d80c4c65c94692fa281d1a1a8875f9874c197e71a52c11d9d44c40"},"p1":{"x":"126b2fc9a9f0305d6dd07d33ac93a485690f184128447873b0723e8c08f5bfd8","y":"7bdf613daa4fe408a6f9b05e8d563e2fc0b49bb0a373f02fc03668e8a4319b11"},"paillier_pub":{"n":"9589234529977732033915956795726858212623674242595205480720352392635586533239459142933873934127259795951307650330333203728932676734018943102298426795769397096959778729429218426434783707559096190762593241666844097805013846997715479012818811482144381502595493123738315649617220279169663190558353117479383834901156749130658642244214361400589627348071191513371040348954516355646271274086929063846753472198875295788129966614111696123182279614629489637979553720067719047976096188187866405787874290754661449435444233963291453836263110455829775366260295684444884226694602172719047771348817017022310792904793780039196883695817"},"c_key":[1,[1361022059,1025283163,4026668578,1594810272,1184589741,3676706131,3837088359,3865999728,4237849986,1793380173,2006359838,1846406328,3317669715,527766024,1241318588,347923064,3901925116,3387328897,3180809457,460891672,3290579170,3091739194,871481428,3249511156,3508970924,1468372995,922717682,3487457396,3885615416,1448859766,2614295308,1237103074,3722595477,347364258,4261580778,121054704,542371432,451245360,3563880584,2711064028,2263013484,2719863633,1822718483,2802109280,688512437,468779906,3177934810,1786257779,22609415,3833749991,3739987223,1602401442,30583797,2180815088,2546415716,2922751324,1912448363,3353092978,2351081712,2910234376,3377929858,415942120,573901988,2439392233,1542785922,520417201,1839531326,155580178,4071968310,666676646,805105353,3079432063,3235903591,3635667124,3512756219,1115846963,2464626171,2947889504,1636744941,1066638490,443973347,625239465,2180816446,4258113191,3522768524,4130118777,2112173836,2033076804,1317997890,2779339030,3327090967,3363916524,1660330782,3108797134,2262848384,3351158430,2906045967,1970399375,6455396,2476954659,811711725,2649978781,86081822,1111229689,3178216626,1177127451,3143213116,298039078,938887189,4195377616,3466427490,3695139034,582433249,3191152731,897162210,485919723,81834390,182981145,2822061996,668227445,452837791,1089416643,2938416823,4193245831,1825622966,2863483531,964829149,54643400]]},"private":{"x2":"34c0b428488ddc6b28e05cee37e7c4533007f0861e06a2b77e71d3f133ddb81b"},"chain_code":[0,[]]})
export const SIGN_FIRST = JSON.stringify( {"eph_comm_witness":{"c":{"x":"a41ca2d194e43efd50ec2805a00e02d24e61728d2473d53f304edd5fab893ebc","y":"e3723742e634000363d712b55e13d5142db1e6c006b6a42f75ed77cff3fb94c0"},"d_log_proof":{"a1":{"x":"e547c5faa3880b154301951120408acd5286f7ed8b98f94d3a60d968711d7146","y":"94c71882ca7cfb9e910661db77d8ded7ec6870b506cf8cc90d647f15138507ec"},"a2":{"x":"d9157bc4fa2d094c17670eb62bd78d32f41436293c646900c68ea47ed1dc8471","y":"c5e8f845f9e4cf472cf7d64e1df7a0ba87205bf66d2d4836dac4ac7d09344a4"},"z":"602e5023e1a30eb9aece3815549170cb783c823fdbde98f1b2b15fbdaece88a4"},"pk_commitment_blind_factor":[1,[3629164652,4121029787,1586496967,1902448024,2611484210,1671969920,3209110009,729654070]],"public_share":{"x":"e1598492170dc56ec82237baf6ab2044cce8015a25ddf43c34b59882b999717","y":"2bc5e4a818d34f76d42a7f1876e6f8dc7af482daa4579b87ffe1e1a363e4d1a9"},"zk_pok_blind_factor":[1,[3960617543,3952594492,375358651,2353055699,3947172362,3777403011,188221361,436370178]]},"eph_ec_key_pair_party2":{"public_share":{"x":"e1598492170dc56ec82237baf6ab2044cce8015a25ddf43c34b59882b999717","y":"2bc5e4a818d34f76d42a7f1876e6f8dc7af482daa4579b87ffe1e1a363e4d1a9"},"secret_share":"4a228fe623c13f95e22fbebe88eb91f900ad0f2de287fa792efd6869eeab28bf"},"eph_key_gen_first_message_party_two":{"pk_commitment":"c10e00e3c8d12c40e59f8c88db7e9f3c9598f879484e9926e648b773e62b5097","zk_pok_commitment":"2ae39f5094b1d4e6a8514599878a9f2262b2c9f0436bf18de51bf7a0ee70e477"}});
export const SIGN_SECOND = JSON.stringify( {"partial_sig":{"c3":"5b312c5b3838353532313530332c323137313431393833382c313634393833373537332c323639373837353734392c3330343238393332362c333738373433363732372c3235383236353230372c313931383137343032342c323638393339363132362c323437373939343838362c343135363736393433322c333034303531363132302c333731323933363735372c333233313937333739332c323734353337353639312c333835363431323233342c333732333732343937312c323236363337393138332c3432323237383230372c3339353838333138342c323238353432313530362c313336323038363034382c3133303530323938342c3433373433353334312c3931353238343937302c323032393937373233362c323632333336333736332c313736373431383234382c3332323236353833372c3337393238343339352c3931353438383738372c3430333732333337382c32353935383832332c3839343430363438352c34343137383830322c3136363731383936362c343039353936393035322c3630333538333330322c323139363439323632352c323137303131393330392c313331343938353530302c3631333932353035372c3635313836303737312c333839323439303637302c323435343032313638322c3735333734303235322c343238383336313634382c343136303138303635322c323836363332323130332c313833333230373132322c323231323631313736352c313432323737303433382c323337323631333032312c3338343537393635342c3432333736393831312c323438353139373032382c313530363030363233302c343135333134343438312c323531343639353931322c343136363738363833352c313632383435383436332c323230333238363030382c313038303531373034392c3135313134343936312c323333353133383937302c33343938313336352c3530333632333231302c323638373339373538322c313432313930393235302c333734373136313037372c343238333836333532312c3431383130303439352c343131393035303631302c3934323833323136382c3930323137313535322c313338353338373031372c313832343531393230302c3634363535353830362c333835373936323130322c323830323332363935342c333430393133393537332c3431313036343230302c333133323335353239302c323436343039373334352c313139323134303138362c343239323134363531322c333531373238353333322c33373832383933322c37323132363838392c313230303835303033372c3233363834333539372c3430393830353735332c333235303935353639302c313532393139343234362c3330393639303038382c333739313939353632332c313934313035333337362c343237363339313033352c333830363038393730372c333533373730383230392c323735393633323936322c323137313930363135382c323439303838383930332c323238323432343338382c313132303931383237322c333139313235363037332c323234333432393932352c323730353532373133312c323635343235313733302c343132353932383930342c333732313633363738392c323136393933353637302c323238383430373234312c323739343333353134342c323739393137343137352c313638343037383234372c313436393630353939342c323738363135323438362c313737313633323633312c333537393038383539332c323138333839383835302c323334343239323934372c313630353833303436372c313234343830313236392c313138343332363531302c313133343739383339392c333030363432373733312c3136383739353030325d5d"},"second_message":{"comm_witness":{"c":{"x":"176a19067220bb179ff489f99c911b6fef1831612edd5e6cb7dfd7cb76b854d2","y":"b887e2ac6bfc9a216a9ce705fd1515e907cd5469b5a74cd3af1ea81274513bf6"},"d_log_proof":{"a1":{"x":"c28df9404bca0d36ea33bf75f5ff6d244172b45ae51ce28dae7de7de11d07299","y":"9ca1d1609520a1b64410fc6683eb4217424a07bbac3e05f809beaa7b8517a821"},"a2":{"x":"a622d8839d4772068a2fd15be0bc0621d578ccce24438249e2858e9827f48f1c","y":"6254558b80f5d2293aa31ee2682d8877b2d65bc12a8110ee3d3b835b83de381e"},"z":"508305643a98913766b9088b227a2036b6af799274188b078f913ab7161fcceb"},"pk_commitment_blind_factor":"5b312c5b3238323534393338352c3339333733393437372c323833323233373932362c313031323833363237382c313838343932333939302c333530343534343238362c343239323732383237332c313131353136383736335d5d","public_share":{"x":"50d5c3240e240335424225d51a808a6af1c4d134f751783104ba610c712cb289","y":"bcfc353bccab138b7818fdc305d10505f933cc6113176733ba9e4c373a2c24f7"},"zk_pok_blind_factor":"5b312c5b333239353938313939392c313337353034373638362c333137383632323234392c38363331333138392c333731393130313239322c3333303434333735392c323536393535303532312c333632393337393132375d5d"}}});

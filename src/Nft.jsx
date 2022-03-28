import React, { useState } from "react";
import { Connection, PublicKey, clusterApiUrl } from "@solana/web3.js";
import { Metadata } from "@metaplex-foundation/mpl-token-metadata";
import toast, { Toaster } from "react-hot-toast";

const Nft = () => {
  const [walletAddress, setWalletAddress] = useState(null);
  const network = clusterApiUrl("mainnet-beta");
  const [validNFT, setValidNFT] = useState(false);

  const checkIfWalletIsConnected = async () => {
    try {
      const { solana } = window;

      if (solana) {
        if (solana.isPhantom) {
          console.log("Phantom wallet found!");

          const response = await solana.connect({ onlyIfTrusted: true });
          console.log(
            "Connected with Public Key:",
            response.publicKey.toString()
          );
          setWalletAddress(response.publicKey.toString());
        }
      } else {
        alert("Solana object not found! Get a Phantom Wallet 👻");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const getAllNFTs = async (tempAddress) => {
    checkIfWalletIsConnected();
    console.log(tempAddress);
    const connection = new Connection(network);
    const ownerPublickey = new PublicKey(tempAddress);
    const nftsmetadata = await Metadata.findDataByOwner(
      connection,
      ownerPublickey
    );
    console.log(nftsmetadata)
    verifyNFT(nftsmetadata);
  };

  const connectWallet = async () => {
    const { solana } = window;

    if (solana) {
      const response = await solana.connect();
      console.log("Connected with Public Key:", response.publicKey.toString());
      setWalletAddress(response.publicKey.toString());
      getAllNFTs(response.publicKey.toString());
    }
  };

  //verify NFT from wallet

  const symbols = [" "];
  const nftProjectCreators = ["H5hcFVZc37PHsQQuMQnZfEtExARNMhCKcy5p9oAySLfq"]

  const symbolCheck = (symbol) => {
    for (var count = 0; symbols >= count; count++) {
      if (symbols[count] === symbol) {
        return true;
      } else {
        return false;
      }
    }
  };

  const creatorCheck = (creator) =>{
  
    for(var countofCreator = 0; creator.length>=countofCreator;countofCreator++){
      console.log(creator[countofCreator].address);
      for(var creatorCount = 0; nftProjectCreators.length>=creatorCount;creatorCount++){
        if(nftProjectCreators[creatorCount] === creator[countofCreator].address){
          return true;
        }else{
          continue;
        }
      }
    }
    }
    

    const verifyNFT = async (nftMetaData) =>{

      for(var i=0; nftMetaData.length > i; i++ ){
    
        const symbolValid =  symbolCheck(nftMetaData[i].data.symbol)
        const creatorValid =  creatorCheck(nftMetaData[i].data.creators)
    
        if(symbolValid === true && creatorValid ===true){
          setValidNFT(true)
          break;
        }
      }
      //console.log(nftMetaData[0].data.symbol)
      //console.log(nftMetaData[0].data.creators)
    }

  return (
    <>
      {walletAddress === null && (
        <button onClick={connectWallet}>Connect Wallet</button>
      )}

      {walletAddress !== null && validNFT === true && (
        <div>
          <p>Congratulations, you have a valid NFT to buy this product !!</p>
        </div>
      )}

      {walletAddress !== null && validNFT === false && (
        <div>
          <p>Sorry :/ , you do not have a valid NFT to buy this product</p>
        </div>
      )}
      <Toaster />
    </>
  );
};

export default Nft;

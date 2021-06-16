import { ethers } from "ethers";
export const countUpDuration = 1;
export const getNeworkData = async () => {
  let data = fetch("/chains.json", {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  })
    .then(function (response) {
      return response.json();
    })
    .then(function (response) {
      //console.log(response);
      return response;
    });
  return data;
};

export const getChainName = async (chainId) => {
  let chainName = undefined;
  let ethNetworksData = await getNeworkData();
  ethNetworksData.forEach((networkData) => {
    if (networkData.chainId === parseInt(chainId)) {
      // console.log(networkData.chainId, chainId);
      chainName = networkData.name;
      //setAddressScanUrl(addressScanUrl);
    }
  });
  console.log(chainName);
  return chainName;
};
export const getAddressScanUrl = async (chainId) => {
  let ethNetworksData = await getNeworkData();
  let addressScanUrl = "/";
  console.log("Fetching address url for net Id:", chainId);
  ethNetworksData.forEach((networkData) => {
    if (networkData.chainId === parseInt(chainId)) {
      addressScanUrl =
        networkData.explorers.length > 0
          ? networkData.explorers[0].url + "/address/"
          : "www.etherscan.com/";
    }
  });
  console.log("addressScanUrl", addressScanUrl);
  return addressScanUrl;
};

export const getBalanceValue = (bal) => {
  return Number(ethers.utils.formatEther(bal));
};

export const getNumberOfDecimals = (num) => {
  if (num !== undefined) {
    if (num.toString().indexOf(".") > -1) {
      let n = Number(num.toString().split(".")[1].length);
      // console.log('getNumberOfDecimals for :', num, n);
      return n;
    }
  }
  return 0;
};

export const getShortAddress = (add) => {
  if (add !== undefined && add !== '' && add !== null ) {
    if (add.length > 30) {
      return (
        add.substring(0, 10) +
        "..." +
        add.substring(add.length - 4, add.length)
      );
    } else {
      return add;
    }
  }
  return add;
};

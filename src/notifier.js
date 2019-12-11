import notify from 'bnc-notify';

export default (network = 1) => {
  return notify({
    dappId: '3049aef8-aac4-4afa-8558-7d0ce37e9c07', // generated via BlockRocket's account
    networkId: network,
    darkMode: true,
    desktopPosition: "bottomRight",
  });
};

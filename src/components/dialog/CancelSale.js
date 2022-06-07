import React, { useState } from 'react';
import Web3 from 'web3';
import * as math from 'mathjs';
import { useSnackbar } from 'notistack';
import { Dialog, DialogTitle, DialogContent, IconButton, Typography, Button, Box } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { PASAR_CONTRACT_ABI } from '../../abi/pasarABI';
import { stickerContract as CONTRACT_ADDRESS, marketContract as MARKET_CONTRACT_ADDRESS, v1marketContract as V1_MARKET_CONTRACT_ADDRESS } from '../../config';
import TransLoadingButton from '../TransLoadingButton';
import { essentialsConnector } from '../signin-dlg/EssentialConnectivity';
import { isInAppBrowser, getFilteredGasPrice } from '../../utils/common';
import useAuctionDlg from '../../hooks/useAuctionDlg';

export default function CancelSale(props) {
  const { isOpen, setOpen, name, orderId, OrderId, updateCount, handleUpdate, v1State=false } = props;
  const { updateCount: updateCount2, setUpdateCount } = useAuctionDlg()
  const { enqueueSnackbar } = useSnackbar();
  const [onProgress, setOnProgress] = React.useState(false);
  const handleClose = () => {
    setOpen(false);
  };

  const callCancelOrder = async (_orderId) => {
    const walletConnectProvider = isInAppBrowser() ? window.elastos.getWeb3Provider() : essentialsConnector.getWalletConnectProvider();
    const walletConnectWeb3 = new Web3(walletConnectProvider);
    const accounts = await walletConnectWeb3.eth.getAccounts();

    const contractAbi = PASAR_CONTRACT_ABI;
    const contractAddress = !v1State ? MARKET_CONTRACT_ADDRESS: V1_MARKET_CONTRACT_ADDRESS;
    const pasarContract = new walletConnectWeb3.eth.Contract(contractAbi, contractAddress);

    const _gasPrice = await walletConnectWeb3.eth.getGasPrice();
    const gasPrice = getFilteredGasPrice(_gasPrice)

    console.log('Sending transaction with account address:', accounts[0]);
    const transactionParams = {
      'from': accounts[0],
      'gasPrice': gasPrice,
      'gas': 5000000,
      'value': 0
    };

    pasarContract.methods
      .cancelOrder(_orderId)
      .send(transactionParams)
      .on('transactionHash', (hash) => {
        console.log('transactionHash', hash);
      })
      .on('receipt', (receipt) => {
        console.log('receipt', receipt);
        if(handleUpdate)
          setTimeout(()=>{handleUpdate(updateCount+1)}, 3000)
        else
          setTimeout(()=>{
            setUpdateCount(updateCount2+1)
          }, 1000)
        enqueueSnackbar('Cancel sale Success!', { variant: 'success' });
        setOpen(false);
      })
      .on('confirmation', (confirmationNumber, receipt) => {
        console.log('confirmation', confirmationNumber, receipt);
      })
      .on('error', (error, receipt) => {
        console.error('error', error);
        enqueueSnackbar('Cancel sale Error!', { variant: 'error' });
        setOnProgress(false);
      });
  };

  const cancelSale = async () => {
    setOnProgress(true);
    const _orderId = orderId!==undefined?orderId:OrderId
    console.log('orderId:', _orderId);
    await callCancelOrder(_orderId);
  };
  return (
    <Dialog open={isOpen} onClose={handleClose}>
      <DialogTitle>
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500]
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Typography variant="h3" component="div" sx={{ color: 'text.primary' }} align="center">
          Unlist Item
        </Typography>
        <Typography variant="h5" component="div" sx={{ color: 'text.secondary' }} align="center">
          You are about to remove{' '}
          <Typography variant="h5" sx={{ display: 'inline', color: 'text.primary' }}>
            {name}
          </Typography><br/>
          from the marketplace
        </Typography>
        <Box component="div" sx={{ width: 'fit-content', m: 'auto', py: 2 }}>
          <TransLoadingButton loading={onProgress} onClick={cancelSale}>
            Remove Listing
          </TransLoadingButton>
        </Box>
        <Typography variant="caption" display="block" sx={{ color: 'text.secondary' }} gutterBottom align="center">
          We do not own your private keys and cannot access your funds
          <br />
          without your confirmation.
        </Typography>
      </DialogContent>
    </Dialog>
  );
}

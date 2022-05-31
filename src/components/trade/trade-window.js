import * as React from 'react';
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { createTheme, Tab, Tabs, ThemeProvider } from '@mui/material';
import Buy from './buy';
import Sell from './sell';
import { CryptoState } from '../../crypto-context';

const styles = {
    style: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
        color: "white",
        border: '2px solid #000',
        boxShadow: 24,
        p: 4,
    }, 
    tabs: {
        bgcolor: 'background.paper',
        // width: "400px",
        borderRadius: "10px"
    },
    tab: {
        width: "50%"
    },
  
};

const button = {
  padding: "10px 15px",
  backgroundColor: "#EEBC1D"
      
}

const darkTheme = createTheme({
    palette: {
      primary: {
        main: "#fff",
      },
      mode:"dark"
    },
  })

const TradeWindow = ({coin}) => {



  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [value, setValue] = React.useState(0)

  const handleChange = (event, newValue) => {
    setValue(newValue)
  }

  return (
    <div>
        <ThemeProvider theme={darkTheme}>
            
      <Button sx={button} variant='contained' onClick={handleOpen}>Add Transaction</Button>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={open}>
          <Box sx={styles.style}>
            <Tabs sx={styles.tabs} value={value} onChange={handleChange} aria-label="basic tabs example">
              <Tab sx={styles.tab} label="Buy"  />
              <Tab sx={styles.tab} label="Sels"  />
            </Tabs>
            {value == 0 && <Buy coin = {coin} handleClose = {handleClose}/>}
            {value == 1 && <Sell />}

          </Box>
        </Fade>
      </Modal>

      </ThemeProvider>
    </div>
  );
}

export default TradeWindow
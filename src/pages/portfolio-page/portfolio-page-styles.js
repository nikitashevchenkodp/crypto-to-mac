export const classes = {
  container: {
    textAlign: "center"
  },
  title: {
    fontWeight: 700,
    paddingBottom: "40px",
    paddingTop: "20px",
    textAlign: "center",
    fontFamily: "Montserrat",
    paddingLeft: "50px"
  },
  loader: {
    backgroundColor: "gold"
  },
  tableHead: {
    backgroundColor: "#EEBC1D"
  },
  tableCell: {
    color: "black",
    fontWeight: "700",
    fontFamily: "Montserrat"
  },
  row: {
    backgroundColor: "#16171a",
    cursor: "pointer",
    "&:hover": {
      backgroundColor: "#131111",
    },
    fontFamily: "Montserrat",
  },
  tableBodyCell: {
    display: "flex",
    gap: "15px"
  },
  cryptoCell: {
    display: "flex",
    flexDirection: "column",
  },
  cryptoSymbol: {
    textTransform: "uppercase",
    fontSize: 22
  },
  cryptoName: {
    color: "darkgrey"
  },
  mainBox: {
    marginBottom: "30px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "20px",
    width: "40%",
    backgroundColor: 'transparent',
    borderRadius: "19px",
    boxShadow: "rgba(0, 0, 0, 0.25) 0px 54px 55px, rgba(0, 0, 0, 0.12) 0px -12px 30px, rgba(0, 0, 0, 0.12) 0px 4px 6px, rgba(0, 0, 0, 0.17) 0px 12px 13px, rgba(0, 0, 0, 0.09) 0px -3px 5px;"
  },
  currentBalance: { 
    color: "darkgrey",
    marginBottom: "8px",
    fontSize: "18px" 
  },
  windowDiv: { 
    display: "flex",
    flexDirection: "column" 
  },
  totalSum: { 
    marginBottom: "5px",
    fontSize: "20px" 
  },
  img: { 
    marginBottom: 10,
    height: "50px"
  },
  currentPrice: { 
    display: "flex", 
    flexDirection: "column" 
  }
}
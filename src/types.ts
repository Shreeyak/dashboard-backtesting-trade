export interface Trade {
  tradeId: number;
  positionType: "Long" | "Short";
  entry: {
    type: "Entry";
    date: string;
    time: string;
    signal: string;
    price: number;
  };
  exit: {
    type: "Exit";
    date: string;
    time: string;
    signal: string;
    price: number;
  };
  positionSize: number;
  pnlAmount: number;
  pnlPercentage: number;
  cumulativePnlAmount: number;
  cumulativePnlPercentage: number;
}

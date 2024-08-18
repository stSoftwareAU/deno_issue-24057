interface Earnings {
  fiscalDateEnding: string;
  reportedDate: string;
  reportedEPS: number;
  estimatedEPS: number | null;
}
interface marketInterface {
  volume: (number | null)[];
  open: (number | null)[];
  close: (number | null)[];
  high: (number | null)[];
  low: (number | null)[];
  dividend: (number | null)[];
}

interface CashFlow {
  fiscalDateEnding: string;
  operatingCashflow: number;
  dividendPayout: number;
  capitalExpenditures: number;
  depreciationDepletionAndAmortization: number;
}

interface BalanceSheet {
  fiscalDateEnding: string;
  totalAssets: number;
  totalCurrentAssets: number;
  inventory: number;
  totalLiabilities: number;
  totalCurrentLiabilities: number;
  totalShareholderEquity: number;
  commonStockSharesOutstanding: number;
  cashAndCashEquivalentsAtCarryingValue: number;
  cashAndShortTermInvestments: number;
  shortTermDebt: number;
  longTermDebt: number;
  shortLongTermDebtTotal: number;
  otherCurrentLiabilities: number;
  otherCurrentAssets: number;
}

interface IncomeStatement {
  fiscalDateEnding: string;
  totalRevenue: number;
  costofGoodsAndServicesSold: number;
  operatingIncome: number;
  netIncome: number;
  researchAndDevelopment: number;
  incomeTaxExpense: number;
  incomeBeforeTax: number;
  ebitda: number;
  interestExpense: number;
}

interface HistoricalInterface {
  overview: {
    Industry: string;
    Country: string;
    isCommonStock: boolean;
    isPreferredStock: boolean;
    MarketCapitalization: number;
    ipoDate: string;
    delistingDate: string | undefined;
    LatestQuarter: string;
    FiscalYearEnd: string;
    Sector: string;
    Exchange: string;
    SharesOutstanding: number;
    Address: string;
  };

  earnings: {
    [key: string]: Earnings[];
  };

  balanceSheet: {
    [key: string]: BalanceSheet[];
  };

  cashFlow: {
    [key: string]: CashFlow[];
  };

  incomeStatement: {
    [key: string]: IncomeStatement[];
  };
}

export class History {
  constructor() {}

  private initialized = false;

  private readonly VERSION = 25;

  async loadHistory() {
    const cacheDir = `.data`;
    const tmpHistory = new Map<string, HistoricalInterface>();

    for await (const entry of Deno.readDir(cacheDir)) {
      if (
        entry.isFile &&
        entry.name.endsWith(".json")
      ) {
        const cacheContent = await Deno.readTextFile(
          `${cacheDir}/${entry.name}`,
        );
        const chunkHistory = new Map<string, HistoricalInterface>(
          Object.entries(JSON.parse(cacheContent)),
        );
        chunkHistory.forEach((value, key) => tmpHistory.set(key, value));
      }
    }
  }

  async init() {
    if (this.initialized) return;

    await this.loadHistory();

    this.initialized = true;
  }
}

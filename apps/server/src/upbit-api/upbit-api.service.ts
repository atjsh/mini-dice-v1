import type { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { lastValueFrom } from 'rxjs';
import type {
  UPBIT_TICKER_COUNTRY_CURRENCY,
  UPBIT_TICKER_CRYPTO_CURRENCY,
} from './constants';
import type { UpbitTickerInterface } from './interface/ticker.interface';

const cacheKey = 'upbit:ticker:';

@Injectable()
export class UpbitApiService {
  constructor(private httpService: HttpService) {}
  private async getTicker(
    market: `${(typeof UPBIT_TICKER_COUNTRY_CURRENCY)[number]}-${(typeof UPBIT_TICKER_CRYPTO_CURRENCY)[number]}`,
  ): Promise<UpbitTickerInterface> {
    const { data } = await lastValueFrom(
      this.httpService.get<UpbitTickerInterface[]>(
        'https://api.upbit.com/v1/ticker',
        {
          params: {
            markets: market,
          },
        },
      ),
    );

    return data[0];
  }

  public async getCryptoCurrencyPrice(
    countryCurrency: (typeof UPBIT_TICKER_COUNTRY_CURRENCY)[number],
    cryptoCurrency: (typeof UPBIT_TICKER_CRYPTO_CURRENCY)[number],
  ): Promise<UpbitTickerInterface['trade_price']> {
    const market = `${countryCurrency}-${cryptoCurrency}` as const;

    const { trade_price: tickerPrice } = await this.getTicker(market);

    return tickerPrice;
  }
}

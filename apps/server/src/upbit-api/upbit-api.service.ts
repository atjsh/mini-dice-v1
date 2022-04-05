import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { lastValueFrom } from 'rxjs';
import {
  UPBIT_TICKER_COUNTRY_CURRENCY,
  UPBIT_TICKER_CRYPTO_CURRENCY,
} from './constants';
import { UpbitTickerInterface } from './interface/ticker.interface';

@Injectable()
export class UpbitApiService {
  constructor(private httpService: HttpService) {}
  private async getTicker(
    market: `${typeof UPBIT_TICKER_COUNTRY_CURRENCY[number]}-${typeof UPBIT_TICKER_CRYPTO_CURRENCY[number]}`,
  ) {
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
    countryCurrency: typeof UPBIT_TICKER_COUNTRY_CURRENCY[number],
    cryptoCurrency: typeof UPBIT_TICKER_CRYPTO_CURRENCY[number],
  ) {
    const market = `${countryCurrency}-${cryptoCurrency}` as const;
    const ticker = await this.getTicker(market);

    return ticker.trade_price;
  }
}

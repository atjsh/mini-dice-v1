import { HttpService } from '@nestjs/axios';
import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { lastValueFrom } from 'rxjs';
import { Cache } from 'cache-manager';
import {
  UPBIT_TICKER_COUNTRY_CURRENCY,
  UPBIT_TICKER_CRYPTO_CURRENCY,
} from './constants';
import { UpbitTickerInterface } from './interface/ticker.interface';

const cacheKey = 'upbit:ticker:';

@Injectable()
export class UpbitApiService {
  constructor(
    private httpService: HttpService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}
  private async getTicker(
    market: `${typeof UPBIT_TICKER_COUNTRY_CURRENCY[number]}-${typeof UPBIT_TICKER_CRYPTO_CURRENCY[number]}`,
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
    countryCurrency: typeof UPBIT_TICKER_COUNTRY_CURRENCY[number],
    cryptoCurrency: typeof UPBIT_TICKER_CRYPTO_CURRENCY[number],
  ): Promise<UpbitTickerInterface['trade_price']> {
    const market = `${countryCurrency}-${cryptoCurrency}` as const;
    const cachedTickerPrice = await this.cacheManager.get<
      UpbitTickerInterface['trade_price']
    >(`${cacheKey}${market}`);

    if (cachedTickerPrice) {
      return cachedTickerPrice;
    }

    const { trade_price: tickerPrice } = await this.getTicker(market);

    await this.cacheManager.set(`${cacheKey}${market}`, tickerPrice);
    return tickerPrice;
  }
}

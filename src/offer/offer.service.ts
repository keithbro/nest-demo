import { Injectable } from '@nestjs/common';

type OfferType = 'bedbank_hotel' | 'tour';

@Injectable()
export class OfferService {
  findAll(occupancy: string | undefined, offerType: OfferType) {
    console.log({ occupancy, offerType });
    return Promise.resolve([1]);
  }
}

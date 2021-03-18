import { Controller, Get, Query, Res } from '@nestjs/common';
import { Response } from 'express';
import { OfferService } from './offer.service';

@Controller('offer')
export class OfferController {
  constructor(private offerService: OfferService) {}

  @Get()
  async findAll(
    @Query('occupancy') occupancy: string | undefined,
    @Query('offerType') offerType: string,
    @Res() res: Response,
  ) {
    if (offerType !== 'bedbank_hotel') {
      res.status(400).json({
        status: 400,
        message: `Invalid offerType (${offerType})`,
      });
      return;
    }

    const offers = await this.offerService.findAll(occupancy, offerType);

    if (occupancy) {
      res.header('Cache-Control', 'none');
    }

    res.json({ status: 200, message: 'OK', result: offers });
  }
}

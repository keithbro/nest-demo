import { Test, TestingModule } from '@nestjs/testing';
import { getMockRes } from '@jest-mock/express';

import { OfferController } from './offer.controller';
import { OfferService } from './offer.service';

const mockOfferService = () => ({
  findAll: jest.fn().mockResolvedValue(['x']),
});

describe('OfferController', () => {
  let controller: OfferController;
  let service: OfferService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OfferController],
      providers: [{ provide: OfferService, useFactory: mockOfferService }],
    }).compile();

    controller = module.get<OfferController>(OfferController);
    service = module.get<OfferService>(OfferService);
  });

  it('returns an error for non-bedbank', async () => {
    const { res } = getMockRes();

    await controller.findAll('2-0', 'tour', res);

    expect(service.findAll).not.toHaveBeenCalled();
    expect(res.set).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Invalid offerType (tour)',
      status: 400,
    });
  });

  it('calls the service for bedbank', async () => {
    const { res } = getMockRes();

    await controller.findAll('2-0', 'bedbank_hotel', res);

    expect(service.findAll).toHaveBeenCalledWith('2-0', 'bedbank_hotel');
    expect(res.json).toHaveBeenCalledWith({
      message: 'OK',
      status: 200,
      result: ['x'],
    });
    expect(res.header).toHaveBeenCalledWith('Cache-Control', 'none');
  });

  it('defaults the value of occupancy', async () => {
    const { res } = getMockRes();

    await controller.findAll(undefined, 'bedbank_hotel', res);

    expect(service.findAll).toHaveBeenCalledWith(undefined, 'bedbank_hotel');
    expect(res.json).toHaveBeenCalledWith({
      message: 'OK',
      status: 200,
      result: ['x'],
    });
    expect(res.header).not.toHaveBeenCalled();
  });

  it('handles an invalid offerType', async () => {
    const { res } = getMockRes();

    await controller.findAll(undefined, 'xyz' as any, res);

    expect(service.findAll).not.toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith({
      message: 'Invalid offerType (xyz)',
      status: 400,
    });
  });
});
